/**
 * @file build-tasks/lib/fixing.js
 * @description
 * 该文件包含了所有用于实际修改文件内容的函数。
 * 这些函数根据从 `prompting.js` 中获取的用户决策，来执行具体的修复操作，
 * 例如删除行、替换文本、插入字符等。
 * 它是将用户的修复意图转化为实际文件更改的核心模块。
 *
 * **核心策略**: 许多函数采用从文件末尾向前修改的策略（无论是按行号还是按字符范围降序排序）。
 * 这是为了防止在修改过程中，文件内容的长度发生变化，从而导致后续操作的定位（行号或索引）失效。
 */

import fs from 'fs/promises';
import path from 'path';
import { color } from './colors.js';
import { writeFilePreservingEol } from './utils.js';
// 从终端国际化模块导入翻译函数
import { t } from './terminal-i18n.js';

/**
 * @typedef {import('./prompting.js').ManualFixDecision} ManualFixDecision
 * @typedef {import('./prompting.js').EmptyTranslationFixDecision} EmptyTranslationFixDecision
 * @typedef {import('./validation.js').ValidationError} ValidationError
 */

/**
 * @function fixDuplicatesAutomatically
 * @description 自动修复"重复的翻译"的错误。
 * 修复策略非常简单：对于每一组重复的条目，保留其第一次出现的版本，并删除所有后续的重复版本。
 * 这是一个安全的、非破坏性的默认行为。
 * @param {ValidationError[]} duplicateErrors - 一个只包含 'multi-duplicate' 类型错误的数组。
 * @returns {Promise<void>}
 */
export async function fixDuplicatesAutomatically(duplicateErrors, reporter) {
  if (!duplicateErrors || duplicateErrors.length === 0) {
    console.log(color.yellow(t('fixing.noAutoFixDuplicates')));
    return;
  }

  // 1. 按文件路径将所有需要删除的行号进行分组，以优化I/O操作。
  const linesToRemoveByFile = {};
  for (const error of duplicateErrors) {
    if (!linesToRemoveByFile[error.file]) {
      linesToRemoveByFile[error.file] = new Set();
    }
    // 2. `slice(1)` 会跳过第一次出现的版本（保留它），将其余所有重复项的行号添加到待删除集合中。
    error.occurrences.slice(1).forEach(occ => {
      linesToRemoveByFile[error.file].add(occ.line);
    });
  }

  let totalFixed = 0;
  // 3. 遍历每个需要修改的文件。
  for (const file in linesToRemoveByFile) {
    const linesToRemove = Array.from(linesToRemoveByFile[file]);
    if (linesToRemove.length === 0) continue;
    totalFixed += linesToRemove.length;
    console.log(t('fixing.autoFixingFile', '\n' + color.cyan(`🔧`), color.underline(path.basename(file)), color.bold(linesToRemove.length)));

    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');

    // 4. **关键步骤**: 对行号进行降序排序。
    // 这是为了确保在删除行时，不会影响到后续待删除行的索引。
    // 如果升序删除，删除前面的行会导致后面所有行的索引都发生变化，从而删错行。
    linesToRemove.sort((a, b) => b - a);

    for (const lineNumber of linesToRemove) {
      // lineNumber 是从1开始的，而数组索引是从0开始的，所以需要-1。
      const lineContent = lines[lineNumber - 1]; // 获取被删除行的内容
      lines.splice(lineNumber - 1, 1);

      if (reporter) {
        reporter.recordFix(file, 'auto-fix', 'removed', lineNumber, lineContent.trim());
      }
    }

    // 5. 将修改后的行数组重新组合成文件内容，并写回文件。
    const fixedContent = lines.join('\n');
    await fs.writeFile(file, fixedContent, 'utf-8');
    console.log(t('fixing.fileAutoFixed', color.underline(path.basename(file))));
  }

  if (totalFixed > 0 && !reporter) { // 如果有 reporter，就不在这里打印总结了，交给 reporter
    const separator = color.dim(t('validation.separator').replace(/-/g, ''));
    console.log(`\n${separator}`);
    console.log(color.bold(t('fixing.autoFixSummaryTitle')));
    console.log(t('fixing.autoFixSummary', '  - ' + color.green(``), totalFixed));
    console.log(separator);
  }
}

/**
 * @function applyManualFixes
 * @description 应用用户在手动修复"重复的翻译"流程中所做的决策。
 * 此函数接收一个决策数组，根据用户为每个重复组选择要保留的行，来删除组内其他所有重复的行。
 * @param {Array<object>} decisions - 从 `promptForManualFix` 函数返回的用户决策数组。
 * @returns {Promise<void>}
 */
export async function applyManualFixes(decisions, reporter) {
  if (!decisions || decisions.length === 0) {
    console.log(color.yellow(t('fixing.noFixesToApply')));
    return;
  }

  // 1. 同样，按文件路径将所有需要删除的行号进行分组。
  const linesToRemoveByFile = {};
  for (const decision of decisions) {
    // 如果用户对某个重复组选择了"跳过"，则不处理此条目。
    if (decision.lineToKeep === 'skip') {
      continue;
    }

    if (!linesToRemoveByFile[decision.file]) {
      linesToRemoveByFile[decision.file] = new Set();
    }

    // 2. 遍历该重复组的所有出现位置。
    decision.allOccurrences.forEach(occ => {
      // 如果某个出现的行号不等于用户选择要保留的行号，则将其添加到待删除集合中。
      if (occ.line !== decision.lineToKeep) {
        linesToRemoveByFile[decision.file].add(occ.line);
      }
    });
  }

  let totalFixed = 0;
  // 3. 后续的文件读写和删除逻辑与 `fixDuplicatesAutomatically` 完全相同。
  for (const file in linesToRemoveByFile) {
    const linesToRemove = Array.from(linesToRemoveByFile[file]);
    if (linesToRemove.length === 0) continue;

    totalFixed += linesToRemove.length;
    console.log(t('fixing.fixingFile', '\n' + color.cyan(`🔧`), color.underline(path.basename(file)), color.bold(linesToRemove.length)));

    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');

    // 同样，对行号进行降序排序以安全地删除。
    linesToRemove.sort((a, b) => b - a);

    for (const lineNumber of linesToRemove) {
      const lineContent = lines[lineNumber - 1];
      lines.splice(lineNumber - 1, 1);

      if (reporter) {
        reporter.recordFix(file, 'manual-fix', 'removed', lineNumber, lineContent.trim());
      }
    }

    const fixedContent = lines.join('\n');
    await fs.writeFile(file, fixedContent, 'utf-8');
    console.log(t('fixing.fileFixed', color.underline(path.basename(file))));
  }

  if (!reporter) {
    if (totalFixed > 0) {
      console.log(color.green(t('fixing.totalFixed', totalFixed)));
    } else {
      console.log(color.yellow(t('fixing.noFixesToApplyManual')));
    }
  }
}

/**
 * @function applyEmptyTranslationFixes
 * @description 应用用户为"空翻译"条目提供的修复。
 * 此函数通过直接修改文件内容，将空字符串 `""` 替换为用户输入的新译文。
 * 它利用从 AST（抽象语法树）节点中获取的 `range` 信息来精确定位和替换，而不是基于行操作，
 * 这种方法更精确，不易受代码格式变化的影响。
 * @param {Array<object>} decisions - 从 `promptForEmptyTranslationFix` 函数返回的用户决策数组。
 * @returns {Promise<void>}
 */
export async function applyEmptyTranslationFixes(decisions) {
  // 1. 首先，过滤掉所有用户选择跳过（即 `newTranslation` 为 null）的决策。
  const fixesToApply = decisions.filter(d => d.newTranslation !== null);
  if (fixesToApply.length === 0) {
    // 如果没有需要应用的修复（例如用户选择全部跳过），则直接返回。
    // 调用此函数的上层逻辑会处理相应的日志输出。
    return;
  }

  // 2. 按文件路径对所有修复操作进行分组，以便一次性读写每个文件，提高效率。
  const fixesByFile = fixesToApply.reduce((acc, decision) => {
    const file = decision.error.file;
    if (!acc[file]) {
      acc[file] = [];
    }
    acc[file].push(decision);
    return acc;
  }, {});

  let totalFixed = 0;
  for (const file in fixesByFile) {
    const fileDecisions = fixesByFile[file];
    totalFixed += fileDecisions.length;

    let content = await fs.readFile(file, 'utf-8');

    // 3. **关键步骤**: 对同一个文件内的所有修复操作，按其在文件中的起始位置（`range[0]`）进行降序排序。
    // 这与按行号降序排序的原理相同：从文件末尾开始向前修改，可以避免因修改内容（特别是长度变化）
    // 而导致后续节点的 `range` 索引失效的问题。
    fileDecisions.sort((a, b) => b.error.node.range[0] - a.error.node.range[0]);

    for (const decision of fileDecisions) {
      const translationNode = decision.error.node.elements[1]; // 获取代表译文的 AST 节点
      const start = translationNode.range[0]; // 译文节点的起始位置
      const end = translationNode.range[1];   // 译文节点的结束位置
      // 将用户输入的字符串转换为带引号的 JSON 字符串格式。
      const newTranslationString = JSON.stringify(decision.newTranslation);
      // 4. 通过字符串切片和拼接，用新的翻译内容替换旧的（空的）翻译内容。
      content = content.slice(0, start) + newTranslationString + content.slice(end);
    }

    await fs.writeFile(file, content, 'utf-8');
  }

  if (totalFixed > 0) {
    console.log(color.green(t('fixing.updatingEmptyEntries', totalFixed)));
  }
}

/**
 * @function applySingleEmptyTranslationFix
 * @description 应用对单个"空翻译"错误的修复。
 * @param {object} decision - 包含错误对象和新译文的决策对象。
 * @param {ValidationError} decision.error - 需要修复的单个错误对象。
 * @param {string} decision.newTranslation - 用户输入的新译文。
 * @returns {Promise<void>}
 */
export async function applySingleEmptyTranslationFix(decision) {
  const { error, newTranslation } = decision;
  const file = error.file;

  let content = await fs.readFile(file, 'utf-8');

  const translationNode = error.node.elements[1]; // 获取代表译文的 AST 节点
  const start = translationNode.range[0]; // 译文节点的起始位置
  const end = translationNode.range[1];   // 译文节点的结束位置

  // 保持原始的引号风格（单引号或双引号）。
  const quote = translationNode.raw[0];
  // 转义新译文中的反斜杠和与外部引号相同的引号。
  const escapedTranslation = newTranslation.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), `\\${quote}`);
  const newTranslationString = `${quote}${escapedTranslation}${quote}`;

  // 通过字符串切片和拼接，用新的翻译内容替换旧的（空的）翻译内容。
  content = content.slice(0, start) + newTranslationString + content.slice(end);

  await fs.writeFile(file, content, 'utf-8');
}

/**
 * @function applySyntaxFixes
 * @description 应用用户确认的"遗漏逗号"等语法修复。
 * 此函数通过替换整个行来应用修复，这适用于在 `promptForSyntaxFix` 中生成的、已经包含完整新行内容的修复决策。
 * @param {Array<object>} decisions - 从 `promptForSyntaxFix` 函数返回的用户决策数组。
 * @returns {Promise<void>}
 */
export async function applySyntaxFixes(decisions) {
  if (!decisions || decisions.length === 0) {
    return;
  }

  // 1. 按文件对修复操作进行分组。
  const fixesByFile = decisions.reduce((acc, decision) => {
    const file = decision.file;
    if (!acc[file]) {
      acc[file] = [];
    }
    acc[file].push(decision);
    return acc;
  }, {});

  let totalFixed = 0;
  for (const file in fixesByFile) {
    const fileDecisions = fixesByFile[file];
    totalFixed += fileDecisions.length;
    console.log(t('fixing.fixingSyntaxErrors', '\n' + color.cyan(`🔧`), color.underline(path.basename(file)), color.bold(fileDecisions.length)));

    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');

    // 2. 遍历该文件的所有修复决策。
    for (const decision of fileDecisions) {
      // 确保行号有效，然后用修复后的行内容替换原始行。
      if (decision.line > 0 && decision.line <= lines.length) {
        lines[decision.line - 1] = decision.fixedLine;
      }
    }

    const fixedContent = lines.join('\n');
    await writeFilePreservingEol(file, content, fixedContent);
    console.log(t('fixing.syntaxErrorFixed', color.underline(path.basename(file))));
  }

  if (totalFixed > 0) {
    console.log(color.green(t('fixing.syntaxErrorsFixed', totalFixed)));
  }
}

/**
 * @function applySingleCommaFix
 * @description 应用对单个"遗漏逗号"错误的修复。
 * 此函数用于手动修复流程中，当用户确认要修复一个低置信度问题时被调用。
 * 它同样利用了 AST 提供的精确信息，通过字符串操作，在错误对象指定的精确字符位置（`pos`）插入一个逗号。
 * @param {ValidationError} error - 需要修复的单个错误对象。
 * @returns {Promise<void>}
 */
export async function applySingleCommaFix(error) {
  const file = error.file;
  let content = await fs.readFile(file, 'utf-8');
  // 在 `error.pos` 指定的精确位置插入一个逗号，完成修复。
  content = content.slice(0, error.pos) + ',' + content.slice(error.pos);
  await fs.writeFile(file, content, 'utf-8');
}

/**
 * @function identifyHighConfidenceCommaErrors
 * @description 将"遗漏逗号"的错误分为高置信度和低置信度两类。
 * 这个函数是实现"自动修复"或"手动修复"选择功能的基础。它通过一个启发式规则来判断一个错误
 * 是否有很大概率是由于两个数组条目 `[...]` 之间缺少逗号引起的。
 * @param {ValidationError[]} errors - 'missing-comma' 类型的错误数组。
 * @returns {Promise<{highConfidenceFixes: ValidationError[], lowConfidenceSkips: ValidationError[]}>}
 * 返回一个对象，包含两个数组：`highConfidenceFixes` 用于可以安全地自动修复的错误，
 * `lowConfidenceSkips` 用于需要用户手动审查的错误。
 */
export async function identifyHighConfidenceCommaErrors(errors) {
  const highConfidenceFixes = [];
  const lowConfidenceSkips = [];
  const fileContents = {}; // 缓存文件内容，避免在循环中重复读取同一个文件。

  for (const error of errors) {
    if (!fileContents[error.file]) {
      fileContents[error.file] = (await fs.readFile(error.file, 'utf-8')).split('\n');
    }
    const lines = fileContents[error.file];
    const errorLine = lines[error.line - 1] || '';
    const nextLine = lines[error.line] || '';
    const trimmedErrorLine = errorLine.trim();

    // **启发式规则**: 如果当前行以 `]` 或 `],` 结尾，并且下一行以 `[` 开头，
    // 那么我们"高度确信"这两行之间只是少了一个逗号。这覆盖了大多数情况。
    if ((trimmedErrorLine.endsWith('],') || trimmedErrorLine.endsWith(']')) && nextLine.trim().startsWith('[')) {
      highConfidenceFixes.push(error);
    } else {
      // 如果不符合上述规则，则归为低置信度，需要用户手动确认。
      lowConfidenceSkips.push(error);
    }
  }
  return {
    highConfidenceFixes,
    lowConfidenceSkips,
  };
}

/**
 * @function fixIdenticalAutomatically
 * @description 自动修复"原文与译文相同"的错误。
 * 根据用户选择的策略（移除或置空）进行批量处理。
 * @param {object} decisions - 包含修复类型和错误列表的决策对象。
 * @param {'remove'|'empty'} decisions.type - 修复类型。
 * @param {ValidationError[]} decisions.errors - 'identical-translation' 类型的错误数组。
 * @returns {Promise<void>}
 */
export async function fixIdenticalAutomatically(decisions, reporter) {
  const { type, errors } = decisions;

  if (!errors || errors.length === 0) {
    console.log(color.yellow(t('fixing.noAutoFixIdentical')));
    return;
  }

  // 1. 按文件路径对所有修复操作进行分组。
  const fixesByFile = errors.reduce((acc, error) => {
    if (!acc[error.file]) {
      acc[error.file] = [];
    }
    acc[error.file].push(error);
    return acc;
  }, {});

  let totalFixed = 0;
  for (const file in fixesByFile) {
    const fileErrors = fixesByFile[file];
    totalFixed += fileErrors.length;
    const actionText = type === 'remove' ? t('fixing.removingEntries', color.bold(fileErrors.length)) : t('fixing.emptyingEntries', color.bold(fileErrors.length));
    console.log(t('fixing.autoFixingIdenticalFile', '\n' + color.cyan(`🔧`), color.underline(path.basename(file)), actionText));

    let content = await fs.readFile(file, 'utf-8');

    // 2. 根据用户选择的修复类型执行不同逻辑。
    if (type === 'remove') {
      const lines = content.split('\n');
      // 创建一个包含所有待删除行号的 Set，以提高查找效率。
      const linesToRemove = new Set(fileErrors.map(e => e.line));

      // 为了 reporter，我们需要记录被删除的内容
      if (reporter) {
        fileErrors.forEach(e => {
          const lineContent = lines[e.line - 1]; // 注意 -1
          reporter.recordFix(file, 'auto-fix', 'removed', e.line, lineContent.trim());
        });
      }

      // 使用 filter() 方法一次性过滤掉所有需要删除的行。
      const newLines = lines.filter((_, index) => !linesToRemove.has(index + 1));
      content = newLines.join('\n');
    } else { // type === 'empty'
      // 置空操作需要精确定位，所以使用基于 AST range 的方法。
      // 同样从后往前处理，避免 AST range 索引失效。
      fileErrors.sort((a, b) => b.node.range[0] - a.node.range[0]);
      for (const error of fileErrors) {
        const translationNode = error.node.elements[1];
        const start = translationNode.range[0];
        const end = translationNode.range[1];
        // 使用空字符串 "" 替换原来的译文部分。
        content = content.slice(0, start) + '""' + content.slice(end);

        if (reporter) {
          reporter.recordFix(file, 'auto-fix', 'emptied', error.line, '... -> ""');
        }
      }
    }

    await fs.writeFile(file, content, 'utf-8');
    console.log(t('fixing.fileIdenticalAutoFixed', color.underline(path.basename(file))));
  }

  if (totalFixed > 0 && !reporter) {
    const separator = color.dim(t('validation.separator').replace(/-/g, ''));
    console.log(`\n${separator}`);
    console.log(color.bold(t('fixing.identicalAutoFixSummaryTitle')));
    const actionText = type === 'remove' ? t('fixing.identicalAutoFixSummaryRemoved', '  - ' + color.green(``), totalFixed) : t('fixing.identicalAutoFixSummaryEmptied', '  - ' + color.green(``), totalFixed);
    console.log(actionText);
    console.log(separator);
  }
}

/**
 * @function applySingleIdenticalFix
 * @description 应用用户在手动修复"原文与译文相同"流程中对单个词条所做的决策。
 * @param {object} decision - 从 `promptForSingleIdenticalFix` 函数返回的单个决策对象。
 * @returns {Promise<void>}
 */
export async function applySingleIdenticalFix(decision) {
  const { error, action, newTranslation } = decision;
  const file = error.file;

  const content = await fs.readFile(file, 'utf-8');
  let lines = content.split('\n');

  const errorLineIndex = error.line - 1;

  if (action === 'remove') {
    // 如果是移除操作，直接删除该行。
    lines.splice(errorLineIndex, 1);
  } else if (action === 'modify') {
    // 如果是修改操作，需要用新内容重建该行。
    const originalLine = lines[errorLineIndex];
    const originalIndent = originalLine.match(/^\s*/)[0] || ''; // 保留原始的缩进。

    const originalNode = error.node.elements[0];
    // 保留原始的原文部分，包括其引号类型，以避免不必要的格式变动。
    const originalValue = originalNode.type === 'Literal' ? originalNode.raw : JSON.stringify(originalNode.value);

    // 将用户输入的新译文格式化为带引号的 JSON 字符串。
    const newTranslationString = JSON.stringify(newTranslation);

    // 检查原始行是否以逗号结尾，并保留该逗号，以维持 JSON 数组的语法正确性。
    const lineEnding = originalLine.trim().endsWith(',') ? ',' : '';

    // 重建成新行，格式为：`  [ "原文", "新译文" ],`
    lines[errorLineIndex] = `${originalIndent}[${originalValue}, ${newTranslationString}]${lineEnding}`;
  }

  const fixedContent = lines.join('\n');
  await writeFilePreservingEol(file, content, fixedContent);
}

/**
 * @function fixSourceDuplicatesAutomatically
 * @description 自动修复"原文重复"的错误。
 * 修复策略：对于每一组重复的原文，保留其第一次出现的版本，并删除所有后续的重复版本。
 * @param {ValidationError[]} sourceDuplicateErrors - 一个只包含 'source-duplicate' 类型错误的数组。
 * @returns {Promise<void>}
 */
export async function fixSourceDuplicatesAutomatically(sourceDuplicateErrors, reporter) {
  if (!sourceDuplicateErrors || sourceDuplicateErrors.length === 0) {
    console.log(color.yellow(t('fixing.noAutoFixSourceDuplicates')));
    return;
  }

  // 1. 按文件路径将所有需要删除的行号进行分组，以优化I/O操作。
  const linesToRemoveByFile = {};
  for (const error of sourceDuplicateErrors) {
    if (!linesToRemoveByFile[error.file]) {
      linesToRemoveByFile[error.file] = new Set();
    }
    // 2. `slice(1)` 会跳过第一次出现的版本（保留它），将其余所有重复项的行号添加到待删除集合中。
    error.occurrences.slice(1).forEach(occ => {
      linesToRemoveByFile[error.file].add(occ.line);
    });
  }

  let totalFixed = 0;
  // 3. 遍历每个需要修改的文件。
  for (const file in linesToRemoveByFile) {
    const linesToRemove = Array.from(linesToRemoveByFile[file]);
    if (linesToRemove.length === 0) continue;
    totalFixed += linesToRemove.length;
    console.log(t('fixing.autoFixingSourceFile', '\n' + color.cyan(`🔧`), color.underline(path.basename(file)), color.bold(linesToRemove.length)));

    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');

    // 4. **关键步骤**: 对行号进行降序排序。
    // 这是为了确保在删除行时，不会影响到后续待删除行的索引。
    linesToRemove.sort((a, b) => b - a);

    for (const lineNumber of linesToRemove) {
      // lineNumber 是从1开始的，而数组索引是从0开始的，所以需要-1。
      const lineContent = lines[lineNumber - 1];
      lines.splice(lineNumber - 1, 1);

      if (reporter) {
        reporter.recordFix(file, 'auto-fix', 'removed', lineNumber, lineContent.trim());
      }
    }

    // 5. 将修改后的行数组重新组合成文件内容，并写回文件。
    const fixedContent = lines.join('\n');
    await fs.writeFile(file, fixedContent, 'utf-8');
    console.log(t('fixing.fileSourceAutoFixed', color.underline(path.basename(file))));
  }

  if (totalFixed > 0 && !reporter) {
    const separator = color.dim(t('validation.separator').replace(/-/g, ''));
    console.log(`\n${separator}`);
    console.log(color.bold(t('fixing.sourceAutoFixSummaryTitle')));
    console.log(t('fixing.sourceAutoFixSummary', '  - ' + color.green(``), totalFixed));
    console.log(separator);
  }
}

/**
 * @function applySourceDuplicateManualFixes
 * @description 应用用户在手动修复"原文重复"流程中所做的决策。
 * 此函数接收一个决策数组，根据用户为每个重复组选择要保留的行，来删除组内其他所有重复的行。
 * @param {Array<object>} decisions - 从 `promptForSourceDuplicateManualFix` 函数返回的用户决策数组。
 * @returns {Promise<void>}
 */
export async function applySourceDuplicateManualFixes(decisions, reporter) {
  if (!decisions || decisions.length === 0) {
    console.log(color.yellow(t('fixing.noFixesToApply')));
    return;
  }

  // 1. 同样，按文件路径将所有需要删除的行号进行分组。
  const linesToRemoveByFile = {};
  for (const decision of decisions) {
    if (!linesToRemoveByFile[decision.file]) {
      linesToRemoveByFile[decision.file] = new Set();
    }

    // 2. 遍历该重复组的所有出现位置。
    decision.occurrences.forEach(occ => {
      // 如果某个出现的行号不等于用户选择要保留的行号，则将其添加到待删除集合中。
      if (occ.line !== decision.lineToKeep) {
        linesToRemoveByFile[decision.file].add(occ.line);
      }
    });
  }

  let totalFixed = 0;
  // 3. 后续的文件读写和删除逻辑与 `fixDuplicatesAutomatically` 完全相同。
  for (const file in linesToRemoveByFile) {
    const linesToRemove = Array.from(linesToRemoveByFile[file]);
    if (linesToRemove.length === 0) continue;

    totalFixed += linesToRemove.length;
    console.log(t('fixing.fixingFile', '\n' + color.cyan(`🔧`), color.underline(path.basename(file)), color.bold(linesToRemove.length)));

    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');

    // 同样，对行号进行降序排序以安全地删除。
    linesToRemove.sort((a, b) => b - a);

    for (const lineNumber of linesToRemove) {
      const lineContent = lines[lineNumber - 1];
      lines.splice(lineNumber - 1, 1);

      if (reporter) {
        reporter.recordFix(file, 'manual-fix', 'removed', lineNumber, lineContent.trim());
      }
    }

    const fixedContent = lines.join('\n');
    await fs.writeFile(file, fixedContent, 'utf-8');
    console.log(t('fixing.fileFixed', color.underline(path.basename(file))));
  }

  if (!reporter) {
    if (totalFixed > 0) {
      console.log(color.green(t('fixing.totalFixed', totalFixed)));
    } else {
      console.log(color.yellow(t('fixing.noFixesToApplyManual')));
    }
  }
}
