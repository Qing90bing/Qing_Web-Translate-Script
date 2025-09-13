import fs from 'fs/promises';
import path from 'path';

/**
 * @typedef {import('./prompter.js').ManualFixDecision} ManualFixDecision
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
