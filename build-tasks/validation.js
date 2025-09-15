import fs from 'fs/promises';
import path from 'path';
import { parse } from 'acorn';

/**
 * @typedef {Object} ValidationError
 * @description 定义一个校验错误对象的结构，用于在不同模块间传递错误信息。
 * @property {string} file - 发生错误的文件的路径。
 * @property {number} line - 错误发生的行号。
 * @property {number} column - 错误发生的列号。
 * @property {number} pos - 错误发生的字符索引。
 * @property {string} lineContent - 错误所在行的具体代码内容。
 * @property {string} message - 描述错误的具体信息。
 * @property {string} type - 错误的类型，例如 'duplicate' (重复), 'structure' (结构错误), 'multi-duplicate' (聚合的重复错误)。
 * @property {object} node - 错误相关的AST（抽象语法树）节点。
 * @property {Array<object>} [occurrences] - 对于'multi-duplicate'类型的错误，此属性包含所有出现的位置信息。
 */

async function findTranslationFiles() {
  const translationsDir = path.resolve('src/translations');
  try {
    const allFiles = await fs.readdir(translationsDir);
    const translationFiles = allFiles
      .filter(file => file.endsWith('.js') && file !== 'index.js')
      .map(file => path.join(translationsDir, file));
    return translationFiles;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('⚠️ 未找到 `src/translations` 目录，已跳过校验步骤。');
      return [];
    }
    throw error;
  }
}

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

function unpackMemberExpression(node) {
    const nodes = [];
    let currentNode = node;
    while (currentNode && currentNode.type === 'MemberExpression') {
        nodes.unshift(currentNode.property);
        currentNode = currentNode.object;
    }
    if (currentNode) {
        nodes.unshift(currentNode);
    }
    return nodes;
}

function validateFileContent(file, content, options) {
  const errors = [];
  let ast;
  try {
    ast = parse(content, { ecmaVersion: 'latest', sourceType: 'module', locations: true, ranges: true });
  } catch (e) {
    errors.push({ file, line: e.loc.line, column: e.loc.column, pos: e.pos, lineContent: content.split('\n')[e.loc.line - 1] || '', message: `文件无法解析: ${e.message.replace(/ \(\d+:\d+\)$/, '')}`, type: 'syntax', node: null });
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
  if (!translationArrayNode) return errors;
  const lines = content.split('\n');
  const seenOriginals = new Map();
  for (const elementNode of translationArrayNode.elements) {
    if (!elementNode) continue;
    if (elementNode.type === 'MemberExpression') {
      if (options.checkMissingComma) {
        const chainedNodes = unpackMemberExpression(elementNode);
        for (let i = 0; i < chainedNodes.length - 1; i++) {
          const currentNode = chainedNodes[i];
          if (options.ignoredPositions && options.ignoredPositions.has(currentNode.end)) {
            continue;
          }
          errors.push({ file, line: currentNode.loc.end.line, column: currentNode.loc.end.column, pos: currentNode.end, lineContent: lines[currentNode.loc.end.line - 1].trim(), message: '在此行末尾可能遗漏了逗号。', type: 'missing-comma', node: currentNode });
        }
      }
      continue;
    }
    if (elementNode.type !== 'ArrayExpression' || elementNode.elements.length !== 2) {
      const isSpecificCheck = options.checkEmpty || options.checkDuplicates || options.checkMissingComma || options.checkIdentical;
      if (!isSpecificCheck) {
        errors.push({ file, line: elementNode.loc.start.line, lineContent: lines[elementNode.loc.start.line - 1].trim(), message: '翻译条目必须是 `[原文, 译文]` 的数组格式。', type: 'structure', node: elementNode });
      }
      continue;
    }
    const originalNode = elementNode.elements[0];
    const translationNode = elementNode.elements[1];
    if (options.checkEmpty) {
      const translationValue = getLiteralValue(translationNode);
      if (translationValue === '') {
        errors.push({ file, line: elementNode.loc.start.line, lineContent: lines[elementNode.loc.start.line - 1].trim(), message: '译文不能为空字符串。', type: 'empty-translation', node: elementNode });
      }
    }
    if (options.checkDuplicates) {
      const originalValue = getLiteralValue(originalNode);
      if (originalValue !== null) {
        if (!seenOriginals.has(originalValue)) {
          seenOriginals.set(originalValue, []);
        }
        seenOriginals.get(originalValue).push({ line: elementNode.loc.start.line, lineContent: lines[elementNode.loc.start.line - 1].trim(), node: elementNode });
      }
    }
    if (options.checkIdentical) {
        const originalValue = getLiteralValue(originalNode);
        const translationValue = getLiteralValue(translationNode);
        if (originalValue !== null && originalValue === translationValue) {
            errors.push({ file, line: elementNode.loc.start.line, lineContent: lines[elementNode.loc.start.line - 1].trim(), message: '原文和译文完全相同。', type: 'identical-translation', node: elementNode });
        }
    }
  }
  if (options.checkDuplicates) {
    for (const [originalValue, occurrences] of seenOriginals.entries()) {
      if (occurrences.length > 1) {
        errors.push({ file, line: occurrences[0].line, lineContent: '', message: `原文 "${originalValue}" 被多次定义。`, type: 'multi-duplicate', occurrences: occurrences, node: occurrences[0].node });
      }
    }
  }
  return errors;
}

export async function validateTranslationFiles(options = {}) {
  const { checkEmpty = false, checkDuplicates = false, checkMissingComma = false, checkIdentical = false, ignoredPositions = new Set() } = options;
  const files = await findTranslationFiles();
  let allErrors = [];
  for (const file of files) {
    try {
        const content = await fs.readFile(file, 'utf-8');
        const errorsInFile = validateFileContent(file, content, { checkEmpty, checkDuplicates, checkMissingComma, checkIdentical, ignoredPositions });
        if (errorsInFile.length > 0) {
            const isOnlySpecificCheck = checkEmpty || checkDuplicates || checkMissingComma || checkIdentical;
            if (isOnlySpecificCheck && errorsInFile.every(e => e.type !== 'missing-comma' && e.type !== 'empty-translation' && e.type !== 'multi-duplicate' && e.type !== 'identical-translation')) {
                // 如果是特定检查，但没有发现该类错误，则不打印文件标题
            } else if (checkMissingComma && errorsInFile.every(e => e.type !== 'missing-comma')) {
                // 如果是逗号检查，但没有发现逗号错误，则不打印
            }
            else {
                console.log(`\n❌ 文件: ${path.basename(file)} (发现 ${errorsInFile.length} 个问题)`);
                console.log('--------------------------------------------------');
                errorsInFile.forEach((e, index) => {
                    const errorTypeMap = { 'multi-duplicate': '重复的原文', 'structure': '结构错误', 'syntax': '语法错误', 'empty-translation': '空翻译', 'missing-comma': '可能的遗漏逗号', 'identical-translation': '原文与译文相同' };
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
            if (checkEmpty || checkDuplicates || checkMissingComma || checkIdentical) {
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
