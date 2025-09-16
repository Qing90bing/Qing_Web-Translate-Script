/**
 * @file build-tasks/lib/validation.js
 * @description
 * 该文件是项目的核心校验引擎。它负责：
 * 1. 查找所有需要被校验的翻译文件。
 * 2. 使用 `acorn` 库将文件内容解析成抽象语法树（AST）。
 * 3. 遍历 AST，根据指定的校验选项（如检查重复、空值等）来发现问题。
 * 4. 收集并返回一个包含所有错误信息的数组。
 * 它是所有检查功能的基础。
 *
 * **核心方法**: 此校验器采用基于 AST 的方法，而不是简单的正则表达式匹配。
 * 这使得校验更精确、更健壮，能够准确处理代码结构，并为后续的自动修复提供精确的位置信息（range）。
 */

import fs from 'fs/promises';
import path from 'path';
import { parse } from 'acorn';

/**
 * @typedef {Object} ValidationError
 * @description 定义一个校验错误对象的标准结构，用于在不同模块间传递错误信息。
 * @property {string} file - 发生错误的文件的完整路径。
 * @property {number} line - 错误发生的行号。
 * @property {number} column - 错误发生的列号。
 * @property {number} pos - 错误在文件中的起始字符索引（从0开始）。
 * @property {string} lineContent - 错误所在行的具体代码内容。
 * @property {string} message - 描述错误的具体信息，供用户阅读。
 * @property {string} type - 错误的类型标识符，例如 'multi-duplicate', 'syntax', 'empty-translation' 等。
 * @property {object} node - 与错误相关的 AST（抽象语法树）节点，用于后续的精确修复。
 * @property {Array<object>} [occurrences] - 仅用于 'multi-duplicate' 类型的错误，此属性包含所有重复出现的位置信息。
 */

/**
 * @function findTranslationFiles
 * @description 在 `src/translations` 目录下查找所有需要被处理的翻译文件。
 * 它会读取目录内容，并过滤出所有 `.js` 文件，同时排除 `index.js`（该文件通常用于导出模块，而非包含翻译数据）。
 * @returns {Promise<string[]>} 返回一个包含所有翻译文件绝对路径的数组。
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
    // 如果目录不存在，这是一个可预见的场景，仅打印警告而不抛出错误。
    if (error.code === 'ENOENT') {
      console.warn('⚠️ 未找到 `src/translations` 目录，已跳过校验步骤。');
      return [];
    }
    // 对于其他类型的错误，则重新抛出。
    throw error;
  }
}

/**
 * @function getLiteralValue
 * @description 从 AST 节点中安全地提取其字面量值。
 * 翻译文件中的原文和译文通常是字符串字面量（`'...'` 或 `"`...`"）或简单的模板字符串（`` `...` ``）。
 * 此函数处理这两种情况，返回其纯文本值。
 * @param {object} node - AST 节点。
 * @returns {string|null} 如果提取成功，返回字符串；否则返回 `null`。
 */
export function getLiteralValue(node) {
  if (!node) return null;
  // 处理 'hello' 或 "hello"
  if (node.type === 'Literal') {
    return node.value;
  }
  // 处理 `hello` (无变量)
  if (node.type === 'TemplateLiteral' && node.quasis.length === 1) {
    return node.quasis[0].value.cooked;
  }
  return null;
}

/**
 * @function unpackMemberExpression
 * @description 将一个链式成员表达式（如 `a.b.c`）拆解成一个节点数组（`[a, b, c]`）。
 * 这个函数主要用于检测“遗漏逗号”的场景。当 Acorn 解析器遇到 `['a'], ['b']` 中间缺少逗号时，
 * 它不会直接报错，而是会将其错误地解析为一个成员表达式（MemberExpression），
 * 其结构等价于 `(['a'])['b']`。
 * 此函数的作用就是将这个错误的 MemberExpression 拆开，暴露出原始的 `['a']` 和 `['b']` 节点，
 * 从而让我们能够定位到第一个 `]` 的位置，并报告可能遗漏的逗号。
 * @param {object} node - 一个类型为 'MemberExpression' 的 AST 节点。
 * @returns {object[]} 返回一个包含所有成员的节点数组。
 */
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

/**
 * @function validateFileContent
 * @description 对单个文件的内容执行所有指定的校验逻辑。
 * 这是核心的校验函数，它会解析文件内容为 AST，然后遍历 AST 来查找问题。
 * @param {string} file - 正在校验的文件的路径。
 * @param {string} content - 文件的文本内容。
 * @param {object} options - 包含要执行哪些检查的选项对象。
 * @returns {ValidationError[]} 返回在该文件中发现的所有错误的数组。
 */
function validateFileContent(file, content, options) {
  const errors = [];
  let ast;

  // 1. 尝试用 Acorn 解析文件内容。如果解析失败，说明存在语法错误。
  try {
    ast = parse(content, { ecmaVersion: 'latest', sourceType: 'module', locations: true, ranges: true });
  } catch (e) {
    // 捕获语法错误
    errors.push({ file, line: e.loc.line, column: e.loc.column, pos: e.pos, lineContent: content.split('\n')[e.loc.line - 1] || '', message: `文件无法解析: ${e.message.replace(/ \(\d+:\d+\)$/, '')}`, type: 'syntax', node: null });
    return errors;
  }

  // 2. 在 AST 中找到导出的翻译对象
  let translationObjectNode = null;
  for (const node of ast.body) {
    if (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.declarations) {
      for (const declarator of node.declaration.declarations) {
        if (declarator.init && declarator.init.type === 'ObjectExpression') {
          translationObjectNode = declarator.init;
          break;
        }
      }
    }
    if (translationObjectNode) break;
  }

  // 如果找不到翻译对象，则无需继续检查。
  if (!translationObjectNode) return errors;

  // 提取 `regexRules` 和 `textRules` 数组节点
  const regexRulesNode = translationObjectNode.properties.find(p => p.key.name === 'regexRules')?.value;
  const textRulesNode = translationObjectNode.properties.find(p => p.key.name === 'textRules')?.value;

  const allRuleNodes = [];
  if (regexRulesNode && regexRulesNode.type === 'ArrayExpression') {
    allRuleNodes.push(...regexRulesNode.elements);
  }
  if (textRulesNode && textRulesNode.type === 'ArrayExpression') {
    allRuleNodes.push(...textRulesNode.elements);
  }

  const lines = content.split('\n');
  const seenOriginals = new Map(); // 用于跟踪已见过的原文，以检查重复。

  // 3. 遍历所有规则数组中的每一个元素。
  for (const elementNode of allRuleNodes) {
    if (!elementNode) continue; // 忽略数组中的空位, e.g. `[a,,b]`

    // 3a. 处理“遗漏逗号”的情况。
    if (elementNode.type === 'MemberExpression') {
      if (options.checkMissingComma) {
        const chainedNodes = unpackMemberExpression(elementNode);
        for (let i = 0; i < chainedNodes.length - 1; i++) {
          const currentNode = chainedNodes[i];
          if (options.ignoredPositions && options.ignoredPositions.has(currentNode.end)) continue;
          errors.push({ file, line: currentNode.loc.end.line, column: currentNode.loc.end.column, pos: currentNode.end, lineContent: lines[currentNode.loc.end.line - 1].trim(), message: '在此行末尾可能遗漏了逗号。', type: 'missing-comma', node: currentNode });
        }
      }
      continue;
    }

    // 3b. 检查条目结构是否正确
    if (elementNode.type !== 'ArrayExpression' || elementNode.elements.length !== 2) {
      const isSpecificCheck = options.checkEmpty || options.checkDuplicates || options.checkMissingComma || options.checkIdentical;
      if (!isSpecificCheck) {
        errors.push({ file, line: elementNode.loc.start.line, lineContent: lines[elementNode.loc.start.line - 1].trim(), message: '翻译条目必须是 `[原文, 译文]` 的数组格式。', type: 'structure', node: elementNode });
      }
      continue;
    }

    const originalNode = elementNode.elements[0];
    const translationNode = elementNode.elements[1];

    // 3c. 检查“空翻译”。
    if (options.checkEmpty) {
      const translationValue = getLiteralValue(translationNode);
      if (translationValue === '') {
        errors.push({ file, line: elementNode.loc.start.line, lineContent: lines[elementNode.loc.start.line - 1].trim(), message: '译文不能为空字符串。', type: 'empty-translation', node: elementNode });
      }
    }

    // 3d. 检查“重复的翻译”。
    if (options.checkDuplicates) {
      // 对正则表达式进行特殊处理，将其转换为字符串进行比较
      const originalValue = originalNode.type === 'Literal'
        ? originalNode.value
        : (originalNode.type === 'RegExpLiteral' ? `/${originalNode.pattern}/${originalNode.flags}` : null);

      if (originalValue !== null) {
        if (!seenOriginals.has(originalValue)) {
          seenOriginals.set(originalValue, []);
        }
        seenOriginals.get(originalValue).push({ line: elementNode.loc.start.line, lineContent: lines[elementNode.loc.start.line - 1].trim(), node: elementNode });
      }
    }

    // 3e. 检查“原文和译文相同”。
    if (options.checkIdentical) {
      const originalValue = getLiteralValue(originalNode);
      const translationValue = getLiteralValue(translationNode);
      if (originalValue !== null && originalValue === translationValue) {
        errors.push({ file, line: elementNode.loc.start.line, lineContent: lines[elementNode.loc.start.line - 1].trim(), message: '原文和译文完全相同。', type: 'identical-translation', node: elementNode });
      }
    }
  }

  // 4. 遍历结束后，处理收集到的重复的翻译信息。
  if (options.checkDuplicates) {
    for (const [originalValue, occurrences] of seenOriginals.entries()) {
      if (occurrences.length > 1) {
        errors.push({ file, line: occurrences[0].line, lineContent: '', message: `原文 "${originalValue}" 被多次定义。`, type: 'multi-duplicate', occurrences, node: occurrences[0].node });
      }
    }
  }
  return errors;
}

/**
/**
 * @function validateTranslationFiles
 * @description 校验所有翻译文件并打印结果的主函数。
 * 此函数作为校验流程的入口，它会调用 `findTranslationFiles` 找到所有目标文件，
 * 然后对每个文件执行 `validateFileContent`。
 * 它承担了双重职责：
 * 1. **打印日志**: 在校验过程中，直接向控制台打印格式化的、用户友好的错误报告，以便用户立即看到结果。
 * 2. **返回数据**: 返回一个包含所有错误的扁平化数组，供调用它的上层任务（如 `check-duplicates.js`）进行后续的编程处理（如提示、修复）。
 * @param {object} [options={}] - 包含要执行哪些检查的选项对象。
 * @returns {Promise<ValidationError[]>} 返回一个包含所有文件中发现的所有错误的扁平化数组。
 */
export async function validateTranslationFiles(options = {}) {
  const { checkEmpty = false, checkDuplicates = false, checkMissingComma = false, checkIdentical = false, ignoredPositions = new Set() } = options;
  const files = await findTranslationFiles();
  let allErrors = [];

  for (const file of files) {
    try {
        const content = await fs.readFile(file, 'utf-8');
        // 对每个文件调用核心校验逻辑。
        const errorsInFile = validateFileContent(file, content, { checkEmpty, checkDuplicates, checkMissingComma, checkIdentical, ignoredPositions });

        // 根据是否有错误以及检查类型，格式化并打印结果到控制台。
        if (errorsInFile.length > 0) {
            // 这部分复杂的逻辑是为了在特定检查模式下提供更友好的输出。
            // 例如，如果用户只要求检查空值，且该文件没有空值错误（但可能有其他错误），则不打印文件名和标题。
            const isOnlySpecificCheck = checkEmpty || checkDuplicates || checkMissingComma || checkIdentical;
            if (isOnlySpecificCheck && errorsInFile.every(e => e.type !== 'missing-comma' && e.type !== 'empty-translation' && e.type !== 'multi-duplicate' && e.type !== 'identical-translation')) {
                // 如果是特定检查，但没有发现该类错误，则不打印文件标题
            } else if (checkMissingComma && errorsInFile.every(e => e.type !== 'missing-comma')) {
                // 如果是逗号检查，但没有发现逗号错误，则不打印
            }
            else {
                // 打印文件头和错误详情。
                console.log(`\n❌ 文件: ${path.basename(file)} (发现 ${errorsInFile.length} 个问题)`);
                console.log('--------------------------------------------------');
                errorsInFile.forEach((e, index) => {
                    const errorTypeMap = { 'multi-duplicate': '重复的原文', 'structure': '结构错误', 'syntax': '语法错误', 'empty-translation': '空翻译', 'missing-comma': '可能的遗漏逗号', 'identical-translation': '原文与译文相同' };
                    const errorName = errorTypeMap[e.type] || '未知错误';
                    console.log(`  问题 ${index + 1}: ${errorName} - ${e.message}`);
                    if (e.type === 'multi-duplicate') {
                        // 对重复错误，特殊格式化以显示所有出现位置。
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
            // 如果文件没有错误，并且是特定检查模式，则打印通过信息。
            if (checkEmpty || checkDuplicates || checkMissingComma || checkIdentical) {
                console.log(`✅ 文件 ${path.basename(file)} 通过检查。`);
            }
        }
        // 将当前文件的错误合并到总错误列表中。
        allErrors = allErrors.concat(errorsInFile);
    } catch(e) {
        console.error(`❌ 处理文件 ${file} 时发生错误:`, e);
    }
  }
  return allErrors;
}
