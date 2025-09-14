import fs from 'fs/promises';
import path from 'path';

/**
 * @typedef {import('./prompter.js').ManualFixDecision} ManualFixDecision
 * @typedef {import('./prompter.js').EmptyTranslationFixDecision} EmptyTranslationFixDecision
 * @typedef {import('./validator.js').ValidationError} ValidationError
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

export async function applyManualFixes(decisions) {
  if (!decisions || decisions.length === 0) {
    console.log('\n没有需要应用的修复。');
    return;
  }
  const linesToRemoveByFile = {};
  for (const decision of decisions) {
    if (decision.lineToKeep === 'skip') {
      continue;
    }
    if (!linesToRemoveByFile[decision.file]) {
      linesToRemoveByFile[decision.file] = new Set();
    }
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

export async function applyEmptyTranslationFixes(decisions) {
  const fixesToApply = decisions.filter(d => d.newTranslation !== null);
  if (fixesToApply.length === 0) {
    console.log('\n没有需要应用的空翻译修复（可能所有问题都被跳过了）。');
    return;
  }
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
    fileDecisions.sort((a, b) => b.error.node.range[0] - a.error.node.range[0]);
    for (const decision of fileDecisions) {
      const translationNode = decision.error.node.elements[1];
      const start = translationNode.range[0];
      const end = translationNode.range[1];
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

export async function applySyntaxFixes(decisions) {
  if (!decisions || decisions.length === 0) {
    return;
  }
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
    for (const decision of fileDecisions) {
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

export async function applySingleCommaFix(error) {
  const file = error.file;
  let content = await fs.readFile(file, 'utf-8');
  content = content.slice(0, error.pos) + ',' + content.slice(error.pos);
  await fs.writeFile(file, content, 'utf-8');
}

export async function identifyHighConfidenceCommaErrors(errors) {
  const highConfidenceFixes = [];
  const lowConfidenceSkips = [];
  const fileContents = {};
  for (const error of errors) {
    if (!fileContents[error.file]) {
      fileContents[error.file] = (await fs.readFile(error.file, 'utf-8')).split('\n');
    }
    const lines = fileContents[error.file];
    const errorLine = lines[error.line - 1] || '';
    const nextLine = lines[error.line] || '';
    const trimmedErrorLine = errorLine.trim();
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
