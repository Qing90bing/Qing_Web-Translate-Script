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
 * 递归地解包一个深度嵌套的 MemberExpression AST 节点。
 * @param {object} node - MemberExpression 类型的 AST 节点。
 * @returns {object[]} 返回一个由构成该表达式的基本节点组成的扁平化数组。
 */
function unpackMemberExpression(node) {
    const nodes = [];
    let currentNode = node;
    // 当一个表达式如 a[b][c] 被解析时，它形成一个嵌套结构 ((a[b])[c])。
    // 我们从外到内遍历这个结构。
    while (currentNode && currentNode.type === 'MemberExpression') {
        // .property 总是最右边的部分，所以我们把它添加到结果数组的前面。
        nodes.unshift(currentNode.property);
        // .object 是剩余的部分，我们继续处理它。
        currentNode = currentNode.object;
    }
    // 最后的 currentNode 是最里面的 .object，即表达式的第一个基本部分。
    if (currentNode) {
        nodes.unshift(currentNode);
    }
    return nodes;
}

/**
 * 校验单个翻译文件的内容。
 * @param {string} file - 翻译文件的路径。
 * @param {string} content - 文件的文本内容。
 * @param {object} options - 校验选项。
 * @param {boolean} options.checkEmpty - 是否检查空翻译。
 * @param {boolean} options.checkDuplicates - 是否检查重复原文。
 * @param {boolean} options.checkMissingComma - 是否检查遗漏的逗号。
 * @returns {ValidationError[]} 返回在该文件中找到的错误对象数组。
 */
function validateFileContent(file, content, options) {
  const errors = [];
  let ast;

  try {
    ast = parse(content, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      locations: true,
      ranges: true,
    });
  } catch (e) {
    // A real syntax error that prevents parsing at all.
    errors.push({
      file,
      line: e.loc.line,
      column: e.loc.column,
      pos: e.pos,
      lineContent: content.split('\n')[e.loc.line - 1] || '',
      message: `文件无法解析: ${e.message.replace(/ \(\d+:\d+\)$/, '')}`,
      type: 'syntax',
      node: null,
    });
    return errors;
  }

  let translationArrayNode = null;

  for (const node of ast.body) {
    if (node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ArrayExpression') {
      translationArrayNode = node.declaration;
      break;
    }
    if (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.declarations) {
      for (const declarator of node.declaration.declarations) {
        if (declarator.init && declarator.init.type === 'ArrayExpression') {
          translationArrayNode = declarator.init;
          break;
        }
      }
    }
  }

  if (!translationArrayNode) {
    return errors;
  }

  const lines = content.split('\n');
  const seenOriginals = new Map();

  for (const elementNode of translationArrayNode.elements) {
    if (!elementNode) continue;

    // ** NEW, RECURSIVE LOGIC **
    if (options.checkMissingComma && elementNode.type === 'MemberExpression') {
      const chainedNodes = unpackMemberExpression(elementNode);
      // For a chain A[B][C], the missing commas are between A-B and B-C.
      for (let i = 0; i < chainedNodes.length - 1; i++) {
        const currentNode = chainedNodes[i];
        // Respect the set of ignored positions from the main loop
        if (options.ignoredPositions && options.ignoredPositions.has(currentNode.end)) {
            continue;
        }
        errors.push({
          file,
          line: currentNode.loc.end.line,
          column: currentNode.loc.end.column,
          pos: currentNode.end,
          lineContent: lines[currentNode.loc.end.line - 1].trim(),
          message: '在此行末尾可能遗漏了逗号。',
          type: 'missing-comma',
          node: currentNode,
        });
      }
      continue;
    }

    // Rule 1: Structure Check
    if (elementNode.type !== 'ArrayExpression' || elementNode.elements.length !== 2) {
      if (!options.checkMissingComma) {
        errors.push({
          file,
          line: elementNode.loc.start.line,
          lineContent: lines[elementNode.loc.start.line - 1].trim(),
          message: '翻译条目必须是 `[原文, 译文]` 的数组格式。',
          type: 'structure',
          node: elementNode,
        });
      }
      continue;
    }

    const originalNode = elementNode.elements[0];
    const translationNode = elementNode.elements[1];

    // Rule 2: Empty Translation Check
    if (options.checkEmpty) {
      const translationValue = getLiteralValue(translationNode);
      if (translationValue === '') {
        errors.push({
          file,
          line: elementNode.loc.start.line,
          lineContent: lines[elementNode.loc.start.line - 1].trim(),
          message: '译文不能为空字符串。',
          type: 'empty-translation',
          node: elementNode,
        });
      }
    }

    // Rule 3: Duplicates Check
    if (options.checkDuplicates) {
      const originalValue = getLiteralValue(originalNode);
      if (originalValue !== null) {
        if (!seenOriginals.has(originalValue)) {
          seenOriginals.set(originalValue, []);
        }
        seenOriginals.get(originalValue).push({
          line: elementNode.loc.start.line,
          lineContent: lines[elementNode.loc.start.line - 1].trim(),
          node: elementNode
        });
      }
    }
  }

  // Post-loop processing for duplicates
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
 * @param {boolean} [options.checkMissingComma=false] - 是否检查遗漏的逗号。
 * @returns {Promise<ValidationError[]>} 返回一个包含所有文件中所有错误的数组。
 */
export async function validateTranslationFiles(options = {}) {
  const { checkEmpty = true, checkDuplicates = true, checkMissingComma = false, ignoredPositions = new Set() } = options;
  const files = await findTranslationFiles();
  let allErrors = [];

  for (const file of files) {
    try {
        const content = await fs.readFile(file, 'utf-8');
        const errorsInFile = validateFileContent(file, content, { checkEmpty, checkDuplicates, checkMissingComma, ignoredPositions });
        if (errorsInFile.length > 0) {
            // 在 "仅检查逗号" 模式下，即使没有错误，也不打印通过信息，以保持终端清晰。
            if (checkMissingComma && errorsInFile.every(e => e.type !== 'missing-comma')) {
                // 如果在这种模式下没有发现逗号错误，则不打印任何内容
            } else {
                console.log(`\n❌ 文件: ${path.basename(file)} (发现 ${errorsInFile.length} 个问题)`);
                console.log('--------------------------------------------------');
                
                errorsInFile.forEach((e, index) => {
                    const errorTypeMap = {
                        'multi-duplicate': '重复的原文',
                        'structure': '结构错误',
                        'syntax': '语法错误',
                        'empty-translation': '空翻译',
                        'missing-comma': '可能的遗漏逗号'
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
            }
        } else {
            // 在 "仅检查逗号" 模式下，不打印通过信息
            if (!checkMissingComma) {
                console.log(`✅ 文件 ${path.basename(file)} 通过检查。`);
            }
        }
        allErrors = allErrors.concat(errorsInFile);
    } catch(e) {
        console.error(`❌ 处理文件 ${file} 时发生错误:`, e);
    }
  }

  return allErrors;
}
