import fs from 'fs/promises';
import path from 'path';

/**
 * @typedef {import('./prompter.js').ManualFixDecision} ManualFixDecision
 * @typedef {import('./prompter.js').EmptyTranslationFixDecision} EmptyTranslationFixDecision
 * @typedef {import('./validator.js').ValidationError} ValidationError
 * @description 从其他模块导入类型定义，以实现类型提示和代码智能。
 */

/**
 * 自动修复所有重复条目，默认保留第一个出现的版本。
 * @param {ValidationError[]} duplicateErrors - 'multi-duplicate'类型的错误对象数组。
 * @returns {Promise<void>}
 */
export async function fixDuplicatesAutomatically(duplicateErrors) {
  if (!duplicateErrors || duplicateErrors.length === 0) {
    console.log('\n没有发现可自动修复的重复条目。');
    return;
  }

  const linesToRemoveByFile = {};

  for (const error of duplicateErrors) {
    if (!linesToRemoveByFile[error.file]) {
      linesToRemoveByFile[error.file] = new Set();
    }
    // 获取所有出现的位置，跳过第一个（保留），然后将其余的行号添加到待删除集合中。
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

    // 按降序对行号进行排序，这样在从后往前删除时，不会影响前面行的索引。
    linesToRemove.sort((a, b) => b - a);

    for (const lineNumber of linesToRemove) {
      lines.splice(lineNumber - 1, 1);
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
 * 根据用户在手动修复流程中做出的决定，对文件应用修复。
 * @param {ManualFixDecision[]} decisions - 从交互式提示器返回的决策对象数组。
 * @returns {Promise<void>}
 */
export async function applyManualFixes(decisions) {
  if (!decisions || decisions.length === 0) {
    console.log('\n没有需要应用的修复。');
    return;
  }

  const linesToRemoveByFile = {};

  // 处理决策，收集所有需要被删除的行。
  for (const decision of decisions) {
    // 如果用户选择跳过此问题，则不进行任何操作。
    if (decision.lineToKeep === 'skip') {
      continue;
    }

    if (!linesToRemoveByFile[decision.file]) {
      linesToRemoveByFile[decision.file] = new Set();
    }

    // 找出所有出现的位置，除了用户选择要保留的那一行。
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

    // 按降序对行号进行排序，以避免在删除时发生行索引偏移问题。
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
 * 根据用户的输入，应用对空翻译条目的修复。
 * @param {EmptyTranslationFixDecision[]} decisions - 从交互式提示器返回的决策对象数组。
 * @returns {Promise<void>}
 */
export async function applyEmptyTranslationFixes(decisions) {
  const fixesToApply = decisions.filter(d => d.newTranslation !== null);

  if (fixesToApply.length === 0) {
    console.log('\n没有需要应用的空翻译修复（可能所有问题都被跳过了）。');
    return;
  }

  // 按文件对修复进行分组
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

    // 按节点在文件中的位置逆序排序，从后往前修改，避免位置索引失效
    fileDecisions.sort((a, b) => b.error.node.range[0] - a.error.node.range[0]);

    for (const decision of fileDecisions) {
      const translationNode = decision.error.node.elements[1];
      const start = translationNode.range[0];
      const end = translationNode.range[1];
      
      // 使用 JSON.stringify 来确保字符串被正确地转义和引用
      const newTranslationString = JSON.stringify(decision.newTranslation);
      
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
 * @typedef {import('./prompter.js').SyntaxFixDecision} SyntaxFixDecision
 */

/**
 * 根据用户在交互式提示中的决定，应用语法修复。
 * @param {SyntaxFixDecision[]} decisions - 从语法修复提示器返回的决策对象数组。
 * @returns {Promise<void>}
 */
export async function applySyntaxFixes(decisions) {
  if (!decisions || decisions.length === 0) {
    // 如果没有决策，则不执行任何操作。
    return;
  }

  // 按文件对修复进行分组，以便每个文件只读写一次。
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

    // 应用此文件的所有修复。
    // 因为我们是整行替换，所以操作顺序不像拼接或删除那样重要。
    for (const decision of fileDecisions) {
      // decision.line 是 1-based，因此我们使用 `decision.line - 1` 作为 0-based 的数组索引。
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
