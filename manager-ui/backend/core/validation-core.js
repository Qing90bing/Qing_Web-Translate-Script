/**
 * @file manager-ui/backend/core/validation-core.js
 * @description 验证功能的核心逻辑模块(与inquirer解耦)
 */

import fs from 'fs/promises';
import path from 'path';
import { parse } from 'acorn';

/**
 * 获取字面量值
 */
export function getLiteralValue(node) {
  if (!node) return null;
  if (node.type === 'Literal') {
    return node.value;
  }
  if (node.type === 'TemplateLiteral' && node.quasis.length === 1) {
    return node.quasis[0].value.cooked;
  }
  if (node.type === 'RegExpLiteral') {
    return `/${node.pattern}/${node.flags}`;
  }
  return null;
}

/**
 * 获取规则部分
 */
function getRuleParts(node) {
  if (!node) return null;

  if (node.type === 'RegExpLiteral') {
    const raw = node.raw;
    const lastSlashIndex = raw.lastIndexOf('/');
    const pattern = raw.substring(1, lastSlashIndex);
    const flags = raw.substring(lastSlashIndex + 1);
    return { pattern, flags };
  }

  if (node.type === 'Literal' && node.regex) {
    return { pattern: node.regex.pattern, flags: node.regex.flags || '' };
  }

  if (node.type === 'Literal' && typeof node.value === 'string') {
    const rawContent = node.raw.slice(1, -1);
    if (rawContent.startsWith('/') && rawContent.lastIndexOf('/') > 0) {
      const lastSlashIndex = rawContent.lastIndexOf('/');
      const pattern = rawContent.substring(1, lastSlashIndex);
      const flags = rawContent.substring(lastSlashIndex + 1);
      return { pattern, flags };
    }
    return { pattern: node.value, flags: '' };
  }
  
  if (node.type === 'TemplateLiteral' && node.quasis.length === 1) {
    return { pattern: node.quasis[0].value.cooked, flags: '' };
  }
  
  return null;
}

/**
 * 解包成员表达式
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
 * 查找翻译文件
 */
async function findTranslationFiles() {
  const translationsDir = path.resolve(process.cwd(), 'src', 'translations');
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

/**
 * 验证单个文件内容
 */
function validateFileContent(file, content, options) {
  const errors = [];
  let ast;

  try {
    ast = parse(content, { ecmaVersion: 'latest', sourceType: 'module', locations: true, ranges: true });
  } catch (e) {
    errors.push({
      file,
      line: e.loc.line,
      column: e.loc.column,
      pos: e.pos,
      lineContent: content.split('\n')[e.loc.line - 1] || '',
      message: `文件无法解析: ${e.message.replace(/ \(\d+:\d+\)$/, '')}`,
      type: 'syntax',
      node: null
    });
    return errors;
  }

  // 在 AST 中找到导出的翻译对象
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

  if (!translationObjectNode) return errors;

  const KNOWN_PROPERTIES = new Set(['styles', 'jsRules', 'regexRules', 'textRules']);

  // 检查未知属性
  for (const prop of translationObjectNode.properties) {
    const keyName = prop.key.name;
    if (!KNOWN_PROPERTIES.has(keyName)) {
      errors.push({
        file,
        line: prop.key.loc.start.line,
        lineContent: content.split('\n')[prop.key.loc.start.line - 1].trim(),
        message: `翻译对象中存在未知的属性: "${keyName}"。`,
        type: 'structure',
        node: prop,
      });
    }
  }

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
  const seenOriginals = new Map();
  const seenOriginalTexts = new Map();

  // 遍历所有规则
  for (const elementNode of allRuleNodes) {
    if (!elementNode) continue;

    // 检查遗漏逗号
    if (elementNode.type === 'MemberExpression') {
      if (options.checkMissingComma) {
        const chainedNodes = unpackMemberExpression(elementNode);
        for (let i = 0; i < chainedNodes.length - 1; i++) {
          const currentNode = chainedNodes[i];
          if (options.ignoredPositions && options.ignoredPositions.has(currentNode.end)) continue;
          errors.push({
            file,
            line: currentNode.loc.end.line,
            column: currentNode.loc.end.column,
            pos: currentNode.end,
            lineContent: lines[currentNode.loc.end.line - 1].trim(),
            message: '在此行末尾可能遗漏了逗号。',
            type: 'missing-comma',
            node: currentNode
          });
        }
      }
      continue;
    }

    // 检查条目结构
    if (elementNode.type !== 'ArrayExpression' || elementNode.elements.length !== 2) {
      const isSpecificCheck = options.checkEmpty || options.checkDuplicates || options.checkMissingComma || options.checkIdentical;
      if (!isSpecificCheck) {
        errors.push({
          file,
          line: elementNode.loc.start.line,
          lineContent: lines[elementNode.loc.start.line - 1].trim(),
          message: '翻译条目必须是 `[原文, 译文]` 的数组格式。',
          type: 'structure',
          node: elementNode
        });
      }
      continue;
    }

    const originalNode = elementNode.elements[0];
    const translationNode = elementNode.elements[1];

    // 检查空翻译
    if (options.checkEmpty) {
      if (options.ignoredPositions && options.ignoredPositions.has(elementNode.range[0])) {
        continue;
      }
      const translationValue = getLiteralValue(translationNode);
      if (translationValue === '') {
        errors.push({
          file,
          line: elementNode.loc.start.line,
          pos: elementNode.range[0],
          lineContent: lines[elementNode.loc.start.line - 1].trim(),
          message: '译文不能为空字符串。',
          type: 'empty-translation',
          node: elementNode
        });
      }
    }

    // 检查重复翻译
    if (options.checkDuplicates) {
      const originalValue = getLiteralValue(originalNode);
      const translationValue = getLiteralValue(translationNode);

      if (originalValue !== null) {
        const key = `${originalValue}::${translationValue}`;
        if (!seenOriginals.has(key)) {
          seenOriginals.set(key, []);
        }
        seenOriginals.get(key).push({
          line: elementNode.loc.start.line,
          lineContent: lines[elementNode.loc.start.line - 1].trim(),
          node: elementNode,
          originalValue: originalValue,
          translationValue: translationValue,
        });
      }
    }

    // 检查原文重复
    if (options.checkSourceDuplicates) {
      const originalParts = getRuleParts(originalNode);
      const translationParts = getRuleParts(translationNode);

      if (originalParts !== null) {
        const originalKey = `${originalParts.pattern}::${originalParts.flags}`;
        if (!seenOriginalTexts.has(originalKey)) {
          seenOriginalTexts.set(originalKey, []);
        }
        seenOriginalTexts.get(originalKey).push({
          line: elementNode.loc.start.line,
          lineContent: lines[elementNode.loc.start.line - 1].trim(),
          node: elementNode,
          originalValue: originalParts.pattern,
          originalParts: originalParts,
          translationValue: translationParts ? translationParts.pattern : 'null',
        });
      }
    }

    // 检查原文译文相同
    if (options.checkIdentical) {
      if (!(options.ignoredPositions && options.ignoredPositions.has(elementNode.range[0]))) {
        const originalParts = getRuleParts(originalNode);
        const translationParts = getRuleParts(translationNode);

        if (
          originalParts &&
          translationParts &&
          originalParts.pattern === translationParts.pattern &&
          originalParts.flags === translationParts.flags
        ) {
          errors.push({
            file,
            line: elementNode.loc.start.line,
            pos: elementNode.range[0],
            lineContent: lines[elementNode.loc.start.line - 1].trim(),
            message: '原文和译文完全相同。',
            type: 'identical-translation',
            node: elementNode,
          });
        }
      }
    }
  }

  // 处理重复翻译
  if (options.checkDuplicates) {
    for (const [key, occurrences] of seenOriginals.entries()) {
      if (occurrences.length > 1) {
        const firstOccurrence = occurrences[0];
        const { originalValue, translationValue } = firstOccurrence;

        const truncate = (str, len = 30) => (str.length > len ? `${str.substring(0, len)}...` : str);
        const displayOriginal = truncate(originalValue);
        const displayTranslation = truncate(translationValue);

        errors.push({
          file,
          line: firstOccurrence.line,
          lineContent: '',
          message: `规则 [${displayOriginal}, ${displayTranslation}] 被重复定义了 ${occurrences.length} 次。`,
          type: 'multi-duplicate',
          occurrences,
          node: firstOccurrence.node
        });
      }
    }
  }

  // 处理原文重复
  if (options.checkSourceDuplicates) {
    for (const [originalKey, occurrences] of seenOriginalTexts.entries()) {
      if (occurrences.length > 1) {
        const firstOccurrence = occurrences[0];
        const originalParts = firstOccurrence.originalParts;

        const truncate = (str, len = 30) => (str.length > len ? `${str.substring(0, len)}...` : str);
        
        let displayOriginal;
        if (originalParts.flags) {
          displayOriginal = truncate(`/${originalParts.pattern}/${originalParts.flags}`);
        } else {
          displayOriginal = truncate(originalParts.pattern);
        }

        errors.push({
          file,
          line: firstOccurrence.line,
          lineContent: '',
          message: `原文 "${displayOriginal}" 被重复使用了 ${occurrences.length} 次，分别对应不同的译文。`,
          type: 'source-duplicate',
          occurrences,
          node: firstOccurrence.node
        });
      }
    }
  }

  return errors;
}

/**
 * 验证所有翻译文件
 */
export async function validateTranslationFiles(options = {}) {
  const {
    checkEmpty = false,
    checkDuplicates = false,
    checkMissingComma = false,
    checkIdentical = false,
    checkSourceDuplicates = false,
    ignoredPositions = new Set()
  } = options;

  const files = await findTranslationFiles();
  let allErrors = [];

  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      const errorsInFile = validateFileContent(file, content, {
        checkEmpty,
        checkDuplicates,
        checkMissingComma,
        checkIdentical,
        checkSourceDuplicates,
        ignoredPositions
      });

      allErrors = allErrors.concat(errorsInFile);
    } catch (e) {
      console.error(`❌ 处理文件 ${file} 时发生错误:`, e);
    }
  }

  return allErrors;
}

/**
 * 运行特定类型的检查
 */
export async function runCheck(checkType) {
  const options = {};
  switch (checkType) {
    case 'comma':
      options.checkMissingComma = true;
      break;
    case 'empty':
      options.checkEmpty = true;
      break;
    case 'duplicates':
      options.checkDuplicates = true;
      break;
    case 'identical':
      options.checkIdentical = true;
      break;
    case 'source-duplicates':
      options.checkSourceDuplicates = true;
      break;
    default:
      throw new Error(`未知的检查类型: ${checkType}`);
  }

  const errors = await validateTranslationFiles(options);
  
  // 格式化结果
  const result = {
    success: errors.length === 0,
    errorCount: errors.length,
    errors: errors.map(error => ({
      file: path.basename(error.file),
      line: error.line,
      column: error.column,
      message: error.message,
      type: error.type,
      lineContent: error.lineContent,
      occurrences: error.occurrences?.map(occ => ({
        line: occ.line,
        lineContent: occ.lineContent
      }))
    }))
  };

  return result;
}