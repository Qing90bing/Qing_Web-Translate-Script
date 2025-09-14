import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs/promises';
import { getLiteralValue } from './validator.js';

/**
 * @typedef {import('./validator.js').ValidationError} ValidationError
 */

/**
 * 针对发现的多种错误，提示用户选择下一步操作。
 * 此函数是错误处理流程的主要入口点。它会根据错误类型动态生成一个交互式列表，
 * 让用户决定是自动修复、手动处理、忽略错误还是取消操作。
 * @param {ValidationError[]} errors - 从校验器返回的错误对象数组。
 * @param {object} [options={}] - 可选的配置对象。
 * @param {boolean} [options.isFullBuild=false] - 是否为完整的构建流程。这会影响提示文本的内容（例如，“取消构建” vs “返回主菜单”）。
 * @returns {Promise<string>} 返回一个解析为字符串的 Promise，该字符串代表用户选择的操作（如 'auto-fix', 'manual-fix', 'ignore', 'cancel'）。
 */
export async function promptUserAboutErrors(errors, options = {}) {
  const { isFullBuild = false } = options;

  // 统计不同类型的错误数量，以便在提示信息中显示，并决定提供哪些选项。
  const duplicateErrorCount = errors.filter(e => e.type === 'multi-duplicate').length;
  const emptyTranslationCount = errors.filter(e => e.type === 'empty-translation').length;
  const manualFixErrorCount = duplicateErrorCount + emptyTranslationCount;

  // 根据存在的错误类型，动态构建提供给用户的选项。
  const choices = [];
  // 仅当存在“重复原文”错误时，才提供自动修复选项。
  if (duplicateErrorCount > 0) {
    choices.push({
      name: `✨ (自动) 快速修复 ${duplicateErrorCount} 组“重复原文”问题 (保留第一个)`,
      value: 'auto-fix',
    });
  }

  // 仅当存在可手动修复的错误（重复原文或空翻译）时，才提供手动修复选项。
  if (manualFixErrorCount > 0) {
    const verb = manualFixErrorCount > 1 ? '逐个处理' : '处理';
    let manualFixText = `🔧 (手动) ${verb} `;
    if (duplicateErrorCount > 0 && emptyTranslationCount > 0) {
      manualFixText += `${manualFixErrorCount} 个“重复原文”或“空翻译”问题`;
    } else if (duplicateErrorCount > 0) {
      manualFixText += `${manualFixErrorCount} 组“重复原文”问题`;
    } else {
      manualFixText += `${manualFixErrorCount} 个“空翻译”问题`;
    }
    choices.push({ name: manualFixText, value: 'manual-fix' });
  }

  // 根据是否为完整构建流程，定制“忽略”和“取消”选项的提示文本。
  const ignoreText = isFullBuild ? '⚠️ (忽略) 忽略所有错误并继续构建' : '⚠️ (忽略) 忽略当前问题';
  const cancelText = isFullBuild ? '❌ (取消) 取消构建' : '❌ (取消) 返回主菜单';

  // "忽略" 和 "取消" 是常驻选项。
  choices.push({ name: ignoreText, value: 'ignore' }, { name: cancelText, value: 'cancel' });

  console.log('\n----------------------------------------');
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `构建前发现 ${errors.length} 个问题，您想怎么做？`,
      choices: choices,
    },
  ]);

  return action;
}

/**
 * 提示用户手动解决“重复原文”的错误。
 * 函数会遍历所有重复原文的错误，并为每一组错误提供一个交互式列表，让用户选择要保留哪一个版本。
 * 用户可以选择保留某一个、跳过当前错误，或者中途退出整个修复流程。
 * @param {ValidationError[]} duplicateErrors - 一个只包含 'multi-duplicate' 类型错误的数组。
 * @returns {Promise<Array<object>|null>} 返回一个包含用户决策的数组。每个决策对象都指明了要保留的行。如果用户选择中途退出，则返回 `null`。
 */
export async function promptForManualFix(duplicateErrors) {
  const decisions = [];
  let userExited = false;

  for (let i = 0; i < duplicateErrors.length; i++) {
    const error = duplicateErrors[i];
    const originalText = error.message.match(/"(.*?)"/)[1] || '未知原文';
    
    // 为每个出现的位置创建一个选项
    const choices = error.occurrences.map(occ => ({
      name: `✅ (保留) 第 ${occ.line} 行 -> ${occ.lineContent}`,
      value: occ.line,
    }));

    // 添加“跳过”和“退出”选项
    choices.push(new inquirer.Separator());
    choices.push({ name: '➡️ (跳过) 暂时不处理此问题', value: 'skip' });
    choices.push({ name: '🛑 (退出) 放弃所有手动修复并退出', value: 'exit' });

    const { userChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'userChoice',
        message: `--[ 正在处理重复问题 ${i + 1} / ${duplicateErrors.length} ]--\n原文 "${originalText}" 被多次定义。请选择您想保留的版本：`,
        choices: choices,
      },
    ]);

    // 如果用户选择退出，需要二次确认，防止误操作。
    if (userChoice === 'exit') {
      const { confirmExit } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmExit', message: '您确定要退出吗？所有在此次手动修复中所做的选择都将丢失。', prefix: '⚠️', default: false }
      ]);
      if (confirmExit) {
        userExited = true;
        break; // 中断 for 循环，退出手动修复流程
      } else {
        i--; // 如果用户取消退出，则停留在当前问题上，重新循环
        continue;
      }
    }

    decisions.push({
      file: error.file,
      originalText: originalText,
      lineToKeep: userChoice,
      allOccurrences: error.occurrences,
    });
  }

  return userExited ? null : decisions;
}

/**
 * 提示用户为“空翻译”的条目提供译文。
 * 函数会遍历所有译文为空字符串的错误，并逐个提示用户输入新的翻译。
 * @param {ValidationError[]} emptyTranslationErrors - 一个只包含 'empty-translation' 类型错误的数组。
 * @returns {Promise<Array<object>>} 返回一个包含用户决策的数组。每个决策对象都包含原始错误信息和用户输入的新译文（如果用户跳过，则为 `null`）。
 */
export async function promptForEmptyTranslationFix(emptyTranslationErrors) {
  const decisions = [];
  console.log('\n----------------------------------------');
  console.log('📝 开始处理空翻译问题...');

  for (let i = 0; i < emptyTranslationErrors.length; i++) {
    const error = emptyTranslationErrors[i];
    const originalValue = getLiteralValue(error.node.elements[0]);

    const { newTranslation } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newTranslation',
        message: `--[ ${i + 1}/${emptyTranslationErrors.length} ]-- 文件: ${path.basename(error.file)}\n  - 原文: "${originalValue}"\n  - 请输入译文 (直接回车则跳过):`,
      },
    ]);

    // 将用户的输入（或 lack thereof）记录为决策。
    // 如果用户直接按回车，`newTranslation` 将是空字符串，`|| null` 会将其转换为 `null`，表示跳过。
    decisions.push({
      error,
      newTranslation: newTranslation || null,
    });
  }

  return decisions;
}

/**
 * 询问用户是否希望在最终构建的脚本中保留源文件中的注释和空白行。
 * 这是一个简单的“是/否”确认提示。
 * @returns {Promise<boolean>} 如果用户选择是，则返回 `true`；否则返回 `false`。
 */
export async function promptToPreserveFormatting() {
    console.log('\n----------------------------------------');
    const { preserve } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'preserve',
            message: '构建已准备就绪。您想在最终的脚本文件中保留注释和空白行吗？',
            default: false,
        }
    ]);
    return preserve;
}

/**
 * 提示用户修复语法错误，特别是针对“可能遗漏的逗号”提供交互式修复。
 * 此函数遍历语法错误列表。对于普通语法错误，它仅打印错误信息。
 * 对于一类特定的、由 `acorn` 解析器在数组末尾的成员表达式后抛出的 `Unexpected token` 错误，
 * 它会识别为“可能遗漏逗号”，并生成一个带高亮的代码预览，让用户确认是否要自动添加逗号。
 * @param {ValidationError[]} syntaxErrors - 从校验器返回的语法错误数组。
 * @returns {Promise<Array<object>>} 返回一个决策数组，包含用户确认要应用的所有修复。
 */
export async function promptForSyntaxFix(syntaxErrors) {
  const decisions = [];
  console.log('\n----------------------------------------');
  console.log('📝 开始处理语法错误...');

  for (let i = 0; i < syntaxErrors.length; i++) {
    const error = syntaxErrors[i];
    
    // 启发式地判断这是否是一个可自动修复的“遗漏逗号”错误。
    // 条件：错误信息包含 "Unexpected token"，且错误行的内容以 `[` 开头。
    // 这通常发生在 `[...], [...]` 之间缺少逗号的情况。
    const isMissingCommaError = error.message.includes('Unexpected token') && error.lineContent.trim().startsWith('[');

    // 如果不是我们能处理的特定错误类型，则只显示信息，让用户手动修复。
    if (!isMissingCommaError) {
      console.log(`\n--[ ${i + 1}/${syntaxErrors.length} ]-- 文件: ${path.basename(error.file)}`);
      console.log(`  - 错误: ${error.message}`);
      console.log(`  - 行号: ${error.line}`);
      console.log(`  - 内容: ${error.lineContent}`);
      console.log('  - 自动修复: ❌ 此类语法错误无法自动修复，请手动编辑文件。');
      continue;
    }

    // 为可修复的错误生成预览
    const fileContent = await fs.readFile(error.file, 'utf-8');
    const lines = fileContent.split('\n');
    // Acorn 报错的位置是下一行的行首，因此我们要修复的是错误行的上一行。
    const lineIndexToFix = error.line - 2; 
    const originalLine = lines[lineIndexToFix];
    const fixedLine = originalLine.trimEnd() + ',';

    // 使用 ANSI 转义码创建带颜色的代码预览，高亮新增的逗号。
    const preview = `
--- 问题代码 (第 ${error.line - 1}-${error.line} 行) ---
${originalLine}
${error.lineContent}
--------------------------

+++ 建议修复 (高亮部分为新增) +++
${originalLine.trimEnd()}\x1b[32m,\x1b[0m
${error.lineContent}
++++++++++++++++++++++++++`;

    // 弹出确认框，让用户决定是否接受此修复
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        prefix: '❓',
        message: `--[ ${i + 1}/${syntaxErrors.length} ]-- 文件: ${path.basename(error.file)}\n  - 检测到可能缺少逗号。预览如下:\n${preview}\n\n  您是否接受此项修复？`,
        default: true,
      },
    ]);

    if (confirm) {
      decisions.push({
        file: error.file,
        line: error.line - 1, // 记录要修改的真实行号
        fixedLine: fixedLine,
      });
    }
  }

  return decisions;
}

/**
 * 当检测到多个“遗漏逗号”问题时，询问用户希望采取哪种处理方式。
 * @param {number} errorCount - 检测到的“遗漏逗号”问题总数。
 * @returns {Promise<string>} 返回用户选择的操作：'auto-fix'（自动修复）, 'manual-fix'（手动修复）, 或 'ignore'（忽略）。
 */
export async function promptForCommaFixAction(errorCount) {
  console.log('\n----------------------------------------');
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `检测到 ${errorCount} 个可能的“遗漏逗号”问题。您想如何处理？`,
      choices: [
        {
          name: '✨ (自动) 尝试自动修复所有高置信度的问题',
          value: 'auto-fix',
        },
        {
          name: '🔧 (手动) 逐个预览并确认修复',
          value: 'manual-fix',
        },
        {
          name: '⚠️  (忽略) 暂时不处理这些问题',
          value: 'ignore',
        },
      ],
    },
  ]);
  return action;
}

/**
 * 在手动模式下，向用户逐个展示“可能遗漏的逗号”问题，并提供修复预览。
 * 这个函数用于处理置信度较低、需要用户逐一确认的逗号错误。
 * 它会生成一个包含上下文（错误行的上一行和下一行）和高亮修复建议的预览。
 * @param {ValidationError} error - 当前需要处理的单个“遗漏逗号”错误对象。
 * @param {number} remainingCount - 剩余待处理的错误数量，用于在提示中向用户显示进度。
 * @returns {Promise<string>} 返回用户的操作选择：'fix'（修复）, 'skip'（跳过）, 'skip-all'（全部跳过）, 或 'abort'（中止）。
 */
export async function promptForSingleCommaFix(error, remainingCount) {
  const fileContent = await fs.readFile(error.file, 'utf-8');
  const lines = fileContent.split('\n');
  const errorLineIndex = error.line - 1;

  // 获取错误行及其上下文，用于生成预览
  const lineAbove = lines[errorLineIndex - 1] || '';
  const errorLine = lines[errorLineIndex];
  const lineBelow = lines[errorLineIndex + 1] || '';

  // 计算逗号应该被插入的精确列位置
  let lineStartPos = 0;
  for (let j = 0; j < errorLineIndex; j++) {
    lineStartPos += lines[j].length + 1; // +1 for the newline character
  }
  const relativeColumn = error.pos - lineStartPos;

  // 构建带有 ANSI 颜色代码的建议修复行，使新增的逗号高亮（绿色）
  const fixedLine =
    errorLine.slice(0, relativeColumn) +
    '\x1b[32m,\x1b[0m' + // \x1b[32m 是绿色, \x1b[0m 是重置颜色
    errorLine.slice(relativeColumn);
  
  // 构建完整的预览文本，包括原始问题代码和建议的修复方案
  const preview = `
--- 问题代码 (文件: ${path.basename(error.file)}, 第 ${error.line} 行) ---
${lineAbove}
\x1b[31m${errorLine}\x1b[0m
${lineBelow}
----------------------------------

+++ 建议修复 (高亮部分为新增) +++
${lineAbove}
${fixedLine}
${lineBelow}
++++++++++++++++++++++++++++++++++`;

  // 显示交互式提示，让用户做出选择
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: `--[ 发现 ${remainingCount} 个问题 ]--\n  - ${error.message}\n${preview}\n\n  您想如何处理这个问题？`,
      choices: [
        { name: '✅ (修复) 应用此项修复', value: 'fix' },
        { name: '➡️ (跳过) 忽略此项，处理下一个', value: 'skip' },
        { name: '⏩ (全部跳过) 忽略所有剩余的问题', value: 'skip-all' },
        { name: '🛑 (中止) 放弃并退出', value: 'abort' },
      ],
    },
  ]);
  return choice;
}
