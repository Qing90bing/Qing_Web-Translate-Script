import fs from 'fs/promises';
import path from 'path';
import { parse } from 'acorn';

/**
 * @typedef {Object} ValidationError
 * @description 定义一个校验错误对象的结构，用于在不同模块间传递错误信息。
 * @property {string} file - 发生错误的文件的路径。
 * @property {number} line - 错误发生的行号。
 * @property {string} lineContent - 错误所在行的具体代码内容。
 * @property {string} message - 描述错误的具体信息。
 * @property {string} type - 错误的类型，例如 'duplicate' (重复), 'structure' (结构错误), 'multi-duplicate' (聚合的重复错误)。
 * @property {object} node - 错误相关的AST（抽象语法树）节点。
 * @property {Array<object>} [occurrences] - 对于'multi-duplicate'类型的错误，此属性包含所有出现的位置信息。
 */

/**
 * 在 `src/translations` 目录下查找所有翻译文件。
 * @returns {Promise<string[]>} 返回一个包含所有翻译文件完整路径的数组。
 */
async function findTranslationFiles() {
  const translationsDir = path.resolve('src/translations');
  try {
    const allFiles = await fs.readdir(translationsDir);
    // 我们只关心 .js 文件，并排除作为主入口的 index.js 文件。
    const translationFiles = allFiles
      .filter(file => file.endsWith('.js') && file !== 'index.js')
      .map(file => path.join(translationsDir, file));
    return translationFiles;
  } catch (error) {
    // 如果目录不存在，给出警告并返回空数组，而不是让程序崩溃。
    if (error.code === 'ENOENT') {
      console.warn('⚠️  未找到 `src/translations` 目录，已跳过校验步骤。');
      return [];
    }
    throw error;
  }
}

/**
 * 从AST节点中提取字符串字面量的值。
 * 支持 'Literal' (普通字符串) 和 'TemplateLiteral' (模板字符串)。
 * @param {object} node - The AST node.
 * @returns {string|null} 返回提取的字符串值，如果节点类型不支持则返回null。
 */
export function getLiteralValue(node) {
  if (!node) return null;
  if (node.type === 'Literal') {
    return node.value;
  }
  if (node.type === 'TemplateLiteral' && node.quasis.length === 1) {
    return node.quasis[0].value.cooked;
  }
  return null;
}

/**
 * 校验单个翻译文件的内容。
 * @param {string} file - 翻译文件的路径。
 * @param {string} content - 文件的文本内容。
 * @param {object} options - 校验选项。
 * @param {boolean} options.checkEmpty - 是否检查空翻译。
 * @param {boolean} options.checkDuplicates - 是否检查重复原文。
 * @returns {ValidationError[]} 返回在该文件中找到的错误对象数组。
 */
function validateFileContent(file, content, options) {
  const errors = [];
  let ast;

  try {
    // 使用acorn将文件内容解析为AST
    ast = parse(content, {
      ecmaVersion: 'latest', // 支持最新的ECMAScript标准
      sourceType: 'module', // 支持ES模块语法
      locations: true, // 包含节点的位置信息（行号/列号）
      ranges: true, // 包含节点的字符索引范围
    });
  } catch (e) {
    // 捕获acorn解析阶段的语法错误
    errors.push({
      file,
      line: e.loc.line,
      lineContent: content.split('\n')[e.loc.line - 1] || '',
      message: `JavaScript 语法错误: ${e.message.replace(/ \(\d+:\d+\)$/, '')}`,
      type: 'syntax',
      node: null,
    });
    return errors;
  }

  let translationArrayNode = null;

  // 在AST中查找导出的翻译数组
  for (const node of ast.body) {
    if (node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ArrayExpression') {
      translationArrayNode = node.declaration;
      break;
    }
     if (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.declarations) {
        for(const declarator of node.declaration.declarations) {
            if(declarator.init && declarator.init.type === 'ArrayExpression') {
                translationArrayNode = declarator.init;
                break;
            }
        }
    }
  }

  // 如果文件没有导出数组，则认为它不是一个标准的翻译文件，直接跳过。
  if (!translationArrayNode) {
    return errors;
  }

  const lines = content.split('\n');
  const seenOriginals = new Map(); // 用于记录所有原文及其出现的位置

  for (const elementNode of translationArrayNode.elements) {
    if (!elementNode) continue; // 跳过数组中的空元素，例如 [a, , b]

    const line = elementNode.loc.start.line;
    const lineContent = lines[line - 1].trim();

    // 规则 1: 结构检查
    if (elementNode.type !== 'ArrayExpression' || elementNode.elements.length !== 2) {
      errors.push({
        file,
        line,
        lineContent,
        message: '翻译条目必须是 `[原文, 译文]` 的数组格式。',
        type: 'structure',
        node: elementNode,
      });
      continue; // 如果结构错误，则不进行后续的重复检查
    }

    const originalNode = elementNode.elements[0];
    const translationNode = elementNode.elements[1];

    // 规则 2: 空翻译检查 (如果启用)
    if (options.checkEmpty) {
        const translationValue = getLiteralValue(translationNode);
        if (translationValue === '') {
          errors.push({
            file,
            line,
            lineContent,
            message: '译文不能为空字符串。',
            type: 'empty-translation',
            node: elementNode,
          });
        }
    }
    
    // 规则 3: 唯一性检查 (如果启用)
    if (options.checkDuplicates) {
        const originalValue = getLiteralValue(originalNode);
        if (originalValue !== null) {
            if (!seenOriginals.has(originalValue)) {
                seenOriginals.set(originalValue, []);
            }
            seenOriginals.get(originalValue).push({
                line,
                lineContent,
                node: elementNode
            });
        }
    }
  }
  
  // 在检查完所有条目后，统一处理重复项 (如果启用)
  if (options.checkDuplicates) {
    for (const [originalValue, occurrences] of seenOriginals.entries()) {
        if (occurrences.length > 1) {
          errors.push({
            file,
            line: occurrences[0].line,
            lineContent: '',
            message: `原文 "${originalValue}" 被多次定义。`,
            type: 'multi-duplicate',
            occurrences: occurrences,
            node: occurrences[0].node,
          });
        }
    }
  }

  return errors;
}


/**
 * 校验所有翻译文件。
 * @param {object} options - 校验选项。
 * @param {boolean} [options.checkEmpty=true] - 是否检查空翻译。
 * @param {boolean} [options.checkDuplicates=true] - 是否检查重复原文。
 * @returns {Promise<ValidationError[]>} 返回一个包含所有文件中所有错误的数组。
 */
export async function validateTranslationFiles(options = {}) {
  const { checkEmpty = true, checkDuplicates = true } = options;
  const files = await findTranslationFiles();
  let allErrors = [];

  for (const file of files) {
    try {
        const content = await fs.readFile(file, 'utf-8');
        const errorsInFile = validateFileContent(file, content, { checkEmpty, checkDuplicates });
        if (errorsInFile.length > 0) {
            console.log(`\n❌ 文件: ${path.basename(file)} (发现 ${errorsInFile.length} 个问题)`);
            console.log('--------------------------------------------------');
            
            errorsInFile.forEach((e, index) => {
                const errorTypeMap = {
                    'multi-duplicate': '重复的原文',
                    'structure': '结构错误',
                    'syntax': '语法错误',
                    'empty-translation': '空翻译',
                };
                const errorName = errorTypeMap[e.type] || '未知错误';

                console.log(`  问题 ${index + 1}: ${errorName} - ${e.message}`);
                if (e.type === 'multi-duplicate') {
                    e.occurrences.forEach((occ, i) => {
                        const label = i === 0 ? '首次定义' : '重复出现';
                        console.log(`    - ${label.padEnd(5, ' ')}: 第 ${String(occ.line).padEnd(4)}行 -> ${occ.lineContent}`);
                    });
                } else {
                    console.log(`    - 行号:   ${e.line}`);
                    console.log(`    - 内容:   ${e.lineContent}`);
                }
                console.log('--------------------------------------------------');
            });
        } else {
            console.log(`✅ 文件 ${path.basename(file)} 通过检查。`);
        }
        allErrors = allErrors.concat(errorsInFile);
    } catch(e) {
        console.error(`❌ 处理文件 ${file} 时发生错误:`, e);
    }
  }

  return allErrors;
}
