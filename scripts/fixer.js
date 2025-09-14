import fs from 'fs/promises';
import path from 'path';

/**
 * @typedef {import('./prompter.js').ManualFixDecision} ManualFixDecision
 * @typedef {import('./prompter.js').EmptyTranslationFixDecision} EmptyTranslationFixDecision
 * @typedef {import('./validator.js').ValidationError} ValidationError
 */

/**
 * 自动修复“重复原文”的错误。
 * 修复策略非常简单：对于每一组重复的条目，保留其第一次出现的版本，并删除所有后续的重复版本。
 * @param {ValidationError[]} duplicateErrors - 一个只包含 'multi-duplicate' 类型错误的数组。
 * @returns {Promise<void>}
 */
export async function fixDuplicatesAutomatically(duplicateErrors) {
  if (!duplicateErrors || duplicateErrors.length === 0) {
    console.log('\n 没有发现可自动修复的重复条目。');
    return;
  }

  // 按文件路径将所有需要删除的行号进行分组。
  const linesToRemoveByFile = {};
  for (const error of duplicateErrors) {
    if (!linesToRemoveByFile[error.file]) {
      linesToRemoveByFile[error.file] = new Set();
    }
    // `slice(1)` 会跳过第一个出现的版本，将其余所有重复项的行号添加到待删除集合中。
    error.occurrences.slice(1).forEach(occ => {
      linesToRemoveByFile[error.file].add(occ.line);
    });
  }

  let totalFixed = 0;
  for (const file in linesToRemoveByFile) {
    const linesToRemove = Array.from(linesToRemoveByFile[file]);
    if (linesToRemove.length === 0) continue;
    totalFixed += linesToRemove.length;
    console.log(`\n🔧 正在自动修复文件 ${path.basename(file)}，移除 ${linesToRemove.length} 个重复条目...`);
    
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    // 对行号进行降序排序，这样在删除行时，不会影响到后续待删除行的索引。
    linesToRemove.sort((a, b) => b - a);
    
    for (const lineNumber of linesToRemove) {
      lines.splice(lineNumber - 1, 1); // lineNumber 是从1开始的，数组索引是从0开始的。
    }
    
    const fixedContent = lines.join('\n');
    await fs.writeFile(file, fixedContent, 'utf-8');
    console.log(`✅ 文件 ${path.basename(file)} 已成功自动修复。`);
  }

  if (totalFixed > 0) {
      console.log(`\n✨ 总共自动修复了 ${totalFixed} 个问题。`);
  }
}

/**
 * 应用用户在手动修复流程中所做的决策。
 * 此函数接收一个决策数组，根据用户选择要保留的行，来删除其他重复的行。
 * @param {Array<object>} decisions - 从 `promptForManualFix` 函数返回的用户决策数组。
 * @returns {Promise<void>}
 */
export async function applyManualFixes(decisions) {
  if (!decisions || decisions.length === 0) {
    console.log('\n 没有需要应用的修复。');
    return;
  }

  const linesToRemoveByFile = {};
  for (const decision of decisions) {
    // 如果用户选择“跳过”，则不处理此条目。
    if (decision.lineToKeep === 'skip') {
      continue;
    }

    if (!linesToRemoveByFile[decision.file]) {
      linesToRemoveByFile[decision.file] = new Set();
    }
    
    // 将所有未被选为保留的行添加到待删除集合中。
    decision.allOccurrences.forEach(occ => {
      if (occ.line !== decision.lineToKeep) {
        linesToRemoveByFile[decision.file].add(occ.line);
      }
    });
  }

  let totalFixed = 0;
  for (const file in linesToRemoveByFile) {
    const linesToRemove = Array.from(linesToRemoveByFile[file]);
    if (linesToRemove.length === 0) continue;
    
    totalFixed += linesToRemove.length;
    console.log(`\n🔧 正在修复文件 ${path.basename(file)}，移除 ${linesToRemove.length} 个重复条目...`);
    
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    // 同样，对行号进行降序排序以安全地删除。
    linesToRemove.sort((a, b) => b - a);
    
    for (const lineNumber of linesToRemove) {
      lines.splice(lineNumber - 1, 1);
    }
    
    const fixedContent = lines.join('\n');
    await fs.writeFile(file, fixedContent, 'utf-8');
    console.log(`✅ 文件 ${path.basename(file)} 已成功修复。`);
  }

  if (totalFixed > 0) {
      console.log(`\n✨ 总共修复了 ${totalFixed} 个问题。`);
  } else {
      console.log('\n没有需要应用的修复（可能所有问题都被跳过了）。');
  }
}

/**
 * 应用用户为“空翻译”条目提供的修复。
 * 此函数通过直接修改文件内容，将空字符串 `""` 替换为用户输入的新译文。
 * 它利用 AST 节点中的 `range` 信息来精确定位和替换。
 * @param {Array<object>} decisions - 从 `promptForEmptyTranslationFix` 函数返回的用户决策数组。
 * @returns {Promise<void>}
 */
export async function applyEmptyTranslationFixes(decisions) {
  // 首先，过滤掉所有用户选择跳过（newTranslation 为 null）的决策。
  const fixesToApply = decisions.filter(d => d.newTranslation !== null);
  if (fixesToApply.length === 0) {
    console.log('\n没有需要应用的空翻译修复（可能所有问题都被跳过了）。');
    return;
  }

  // 按文件路径对所有修复操作进行分组，以便一次性读写每个文件。
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
    console.log(`\n🔧 正在修复文件 ${path.basename(file)}，更新 ${fileDecisions.length} 个空翻译...`);
    
    let content = await fs.readFile(file, 'utf-8');
    
    // 对同一个文件内的所有修复操作，按其在文件中的位置（range[0]）进行降序排序。
    // 这样可以从文件末尾开始向前修改，避免了因修改内容导致后续节点的 range 索引失效的问题。
    fileDecisions.sort((a, b) => b.error.node.range[0] - a.error.node.range[0]);

    for (const decision of fileDecisions) {
      const translationNode = decision.error.node.elements[1];
      const start = translationNode.range[0];
      const end = translationNode.range[1];
      const newTranslationString = JSON.stringify(decision.newTranslation);
      // 通过字符串切片和拼接，用新的翻译内容替换旧的（空的）翻译内容。
      content = content.slice(0, start) + newTranslationString + content.slice(end);
    }
    
    await fs.writeFile(file, content, 'utf-8');
    console.log(`✅ 文件 ${path.basename(file)} 已成功修复。`);
  }

  if (totalFixed > 0) {
    console.log(`\n✨ 总共更新了 ${totalFixed} 个空翻译条目。`);
  }
}

/**
 * 应用用户确认的“遗漏逗号”语法修复。
 * 此函数通过替换整个行来应用修复，这适用于 `promptForSyntaxFix` 中生成的修复决策。
 * @param {Array<object>} decisions - 从 `promptForSyntaxFix` 函数返回的用户决策数组。
 * @returns {Promise<void>}
 */
export async function applySyntaxFixes(decisions) {
  if (!decisions || decisions.length === 0) {
    return;
  }

  // 按文件对修复操作进行分组。
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
    console.log(`\n🔧 正在修复文件 ${path.basename(file)} 中的 ${fileDecisions.length} 个语法问题...`);
    
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    // 遍历该文件的所有修复决策。
    for (const decision of fileDecisions) {
      // 确保行号有效，然后用修复后的行替换原始行。
      if (decision.line > 0 && decision.line <= lines.length) {
        lines[decision.line - 1] = decision.fixedLine;
      }
    }
    
    const fixedContent = lines.join('\n');
    await fs.writeFile(file, fixedContent, 'utf-8');
    console.log(`✅ 文件 ${path.basename(file)} 已成功修复。`);
  }

  if (totalFixed > 0) {
    console.log(`\n✨ 总共修复了 ${totalFixed} 个语法问题。`);
  }
}

/**
 * 应用对单个“遗漏逗号”错误的修复。
 * 此函数用于手动修复流程中，当用户确认要修复一个低置信度问题时被调用。
 * 它通过字符串操作，在错误对象指定的精确字符位置（`pos`）插入一个逗号。
 * @param {ValidationError} error - 需要修复的单个错误对象。
 * @returns {Promise<void>}
 */
export async function applySingleCommaFix(error) {
  const file = error.file;
  let content = await fs.readFile(file, 'utf-8');
  // 在 `error.pos` 指定的精确位置插入一个逗号。
  content = content.slice(0, error.pos) + ',' + content.slice(error.pos);
  await fs.writeFile(file, content, 'utf-8');
}

/**
 * 将“遗漏逗号”的错误分为高置信度和低置信度两类。
 * 这个函数是实现“自动修复”或“手动修复”选择的基础。它通过一个启发式规则来判断一个错误
 * 是否有很大概率是由于两个数组条目间缺少逗号引起的。
 * @param {ValidationError[]} errors - 'missing-comma' 类型的错误数组。
 * @returns {Promise<{highConfidenceFixes: ValidationError[], lowConfidenceSkips: ValidationError[]}>}
 * 返回一个对象，包含两个数组：`highConfidenceFixes` 用于可以安全地自动修复的错误，
 * `lowConfidenceSkips` 用于需要用户手动审查的错误。
 */
export async function identifyHighConfidenceCommaErrors(errors) {
  const highConfidenceFixes = [];
  const lowConfidenceSkips = [];
  const fileContents = {}; // 缓存文件内容，避免重复读取

  for (const error of errors) {
    if (!fileContents[error.file]) {
      fileContents[error.file] = (await fs.readFile(error.file, 'utf-8')).split('\n');
    }
    const lines = fileContents[error.file];
    const errorLine = lines[error.line - 1] || '';
    const nextLine = lines[error.line] || '';
    const trimmedErrorLine = errorLine.trim();
    
    // 启发式规则：如果当前行以 `]` 或 `],` 结尾，并且下一行以 `[` 开头，
    // 那么我们“高度确信”这两行之间只是少了一个逗号。
    if ((trimmedErrorLine.endsWith('],') || trimmedErrorLine.endsWith(']')) && nextLine.trim().startsWith('[')) {
      highConfidenceFixes.push(error);
    } else {
      lowConfidenceSkips.push(error);
    }
  }
  return { 
    highConfidenceFixes, 
    lowConfidenceSkips,
  };
}

export async function fixIdenticalAutomatically(decisions) {
  const { type, errors } = decisions;

  if (!errors || errors.length === 0) {
    console.log('\n没有发现可自动修复的“原文与译文相同”条目。');
    return;
  }

  // 按文件路径对所有修复操作进行分组
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
    const actionText = type === 'remove' ? `移除 ${fileErrors.length} 个“原文与译文相同”条目` : `置空 ${fileErrors.length} 个“原文与译文相同”条目`;
    console.log(`\n🔧 正在自动修复文件 ${path.basename(file)}，${actionText}...`);

    let content = await fs.readFile(file, 'utf-8');
    
    // 自动修复时，移除和置空的操作方式不同
    if (type === 'remove') {
        const lines = content.split('\n');
        // 创建一个包含所有待删除行号的 Set，以提高查找效率
        const linesToRemove = new Set(fileErrors.map(e => e.line));
        // 过滤掉需要删除的行
        const newLines = lines.filter((_, index) => !linesToRemove.has(index + 1));
        content = newLines.join('\n');
    } else { // type === 'empty'
        // 从后往前处理，避免 AST range 索引失效
        fileErrors.sort((a, b) => b.node.range[0] - a.node.range[0]);
        for (const error of fileErrors) {
            const translationNode = error.node.elements[1];
            const start = translationNode.range[0];
            const end = translationNode.range[1];
            // 使用 "" 替换原来的译文部分
            content = content.slice(0, start) + '""' + content.slice(end);
        }
    }
    
    await fs.writeFile(file, content, 'utf-8');
    console.log(`✅ 文件 ${path.basename(file)} 已成功自动修复。`);
  }

  if (totalFixed > 0) {
    console.log(`\n✨ 总共自动修复了 ${totalFixed} 个“原文与译文相同”问题。`);
  }
}

/**
 * 应用用户在手动修复“原文与译文相同”流程中所做的决策。
 * @param {Array<object>} decisions - 从 `promptForIdenticalManualFix` 函数返回的用户决策数组。
 * @returns {Promise<void>}
 */
export async function applySingleIdenticalFix(decision) {
    const { error, action, newTranslation } = decision;
    const file = error.file;

    const content = await fs.readFile(file, 'utf-8');
    let lines = content.split('\n');
    
    const errorLineIndex = error.line - 1;

    if (action === 'remove') {
        lines.splice(errorLineIndex, 1);
    } else if (action === 'modify') {
        const originalLine = lines[errorLineIndex];
        const originalIndent = originalLine.match(/^\s*/)[0] || '';
        
        const originalNode = error.node.elements[0];
        const originalValue = originalNode.type === 'Literal' ? originalNode.raw : JSON.stringify(originalNode.value);

        const newTranslationString = JSON.stringify(newTranslation);
        
        const lineEnding = originalLine.trim().endsWith(',') ? ',' : '';

        lines[errorLineIndex] = `${originalIndent}[${originalValue}, ${newTranslationString}]${lineEnding}`;
    }

    const fixedContent = lines.join('\n');
    await fs.writeFile(file, fixedContent, 'utf-8');
}
