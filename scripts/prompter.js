import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs/promises';
import { getLiteralValue } from './validator.js';

/**
 * @typedef {import('./validator.js').ValidationError} ValidationError
 * @description 从校验器模块导入错误对象的类型定义，以实现类型提示。
 */

/**
 * @typedef {Object} ManualFixDecision
 * @description 定义一个手动修复决策对象的结构。
 * @property {string} file - 发生错误的文件的路径。
 * @property {string} originalText - 重复的原文文本。
 * @property {number | 'skip'} lineToKeep - 用户选择保留的行号，或者'skip'表示跳过。
 * @property {Array<object>} allOccurrences - 该重复原文的所有出现位置的完整信息。
 */


/**
 * 当发现校验错误时，提示用户决定下一步操作。
 * @param {ValidationError[]} errors - 从校验器返回的错误对象数组。
 * @param {object} options - 提示选项。
 * @param {boolean} [options.isFullBuild=false] - 当前是否在完整构建流程中。
 * @returns {Promise<'auto-fix' | 'manual-fix' | 'ignore' | 'cancel'>} 返回用户选择的操作标识符。
 */
export async function promptUserAboutErrors(errors, options = {}) {
  const { isFullBuild = false } = options;
  const duplicateErrorCount = errors.filter(e => e.type === 'multi-duplicate').length;
  const emptyTranslationCount = errors.filter(e => e.type === 'empty-translation').length;
  const manualFixErrorCount = duplicateErrorCount + emptyTranslationCount;

  const choices = [];
  if (duplicateErrorCount > 0) {
    choices.push({
      name: `✨ (自动) 快速修复 ${duplicateErrorCount} 组“重复原文”问题 (保留第一个)`,
      value: 'auto-fix',
    });
  }

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

    choices.push({
      name: manualFixText,
      value: 'manual-fix',
    });
  }

  const ignoreText = isFullBuild ? '⚠️  (忽略) 忽略所有错误并继续构建' : '⚠️  (忽略) 忽略当前问题';
  const cancelText = isFullBuild ? '❌ (取消) 取消构建' : '❌ (取消) 返回主菜单';

  choices.push(
    { name: ignoreText, value: 'ignore' },
    { name: cancelText, value: 'cancel' }
  );

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
 * 交互式地提示用户手动修复每一组重复项。
 * @param {ValidationError[]} duplicateErrors - `multi-duplicate`类型的错误对象数组。
 * @returns {Promise<ManualFixDecision[] | null>} 返回一个包含用户所有决策的数组；如果用户中途退出，则返回null。
 */
export async function promptForManualFix(duplicateErrors) {
  const decisions = [];
  let userExited = false;

  for (let i = 0; i < duplicateErrors.length; i++) {
    const error = duplicateErrors[i];
    const originalText = error.message.match(/"(.*?)"/)[1] || '未知原文';
    
    // 为每个重复项创建一个选项
    const choices = error.occurrences.map(occ => ({
      name: `✅ (保留) 第 ${occ.line} 行 -> ${occ.lineContent}`,
      value: occ.line,
    }));

    // 添加分隔符和额外操作选项
    choices.push(new inquirer.Separator());
    choices.push({ name: '➡️  (跳过) 暂时不处理此问题', value: 'skip' });
    choices.push({ name: '🛑 (退出) 放弃所有手动修复并退出', value: 'exit' });

    const { userChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'userChoice',
        message: `--[ 正在处理重复问题 ${i + 1} / ${duplicateErrors.length} ]--\n原文 "${originalText}" 被多次定义。请选择您想保留的版本：`,
        choices: choices,
      },
    ]);

    if (userChoice === 'exit') {
      // 如果用户选择退出，进行二次确认
      const { confirmExit } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmExit',
          message: '您确定要退出吗？所有在此次手动修复中所做的选择都将丢失。',
          prefix: '⚠️',
          default: false,
        }
      ]);
      if (confirmExit) {
        userExited = true;
        break; // 退出主循环
      } else {
        i--; // 如果用户取消退出，则停留在当前问题上重新提问
        continue;
      }
    }

    // 记录用户的决定
    decisions.push({
      file: error.file,
      originalText: originalText,
      lineToKeep: userChoice, // 可能是行号，也可能是 'skip'
      allOccurrences: error.occurrences,
    });
  }

  if (userExited) {
    return null; // 返回null以告知主流程用户已取消操作
  }

  return decisions;
}


/**
 * Prompts the user on how to proceed with found "missing comma" errors.
 * @param {number} errorCount - The number of "missing-comma" errors found.
 * @returns {Promise<'auto-fix' | 'manual-fix' | 'ignore'>}
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
 * Interactively prompts the user to fix a single "missing comma" error.
 * @param {ValidationError} error - The single 'missing-comma' error object to fix.
 * @param {number} remainingCount - The total number of errors remaining.
 * @returns {Promise<'fix' | 'skip' | 'skip-all' | 'abort'>} The user's decision.
 */
export async function promptForSingleCommaFix(error, remainingCount) {
  const fileContent = await fs.readFile(error.file, 'utf-8');
  const lines = fileContent.split('\n');

  const errorLineIndex = error.line - 1;
  const lineAbove = lines[errorLineIndex - 1] || '';
  const errorLine = lines[errorLineIndex];
  const lineBelow = lines[errorLineIndex + 1] || '';

  // To generate an accurate preview, we must calculate the insertion column
  // relative to the start of the line, using the absolute position `error.pos`.
  let lineStartPos = 0;
  for (let j = 0; j < errorLineIndex; j++) {
    lineStartPos += lines[j].length + 1; // +1 for the newline char
  }
  const relativeColumn = error.pos - lineStartPos;

  const fixedLine =
    errorLine.slice(0, relativeColumn) +
    '\x1b[32m,\x1b[0m' + // Insert green comma
    errorLine.slice(relativeColumn);

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

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: `--[ 发现 ${remainingCount} 个问题 ]--\n  - ${error.message}\n${preview}\n\n  您想如何处理这个问题？`,
      choices: [
        { name: '✅ (修复) 应用此项修复', value: 'fix' },
        { name: '➡️  (跳过) 忽略此项，处理下一个', value: 'skip' },
        { name: '⏩ (全部跳过) 忽略所有剩余的问题', value: 'skip-all' },
        { name: '🛑 (中止) 放弃并退出', value: 'abort' },
      ],
    },
  ]);

  return choice;
}


/**
 * @typedef {Object} EmptyTranslationFixDecision
 * @description 定义一个空翻译修复决策对象的结构。
 * @property {ValidationError} error - 原始的'empty-translation'错误对象。
 * @property {string | null} newTranslation - 用户输入的新译文，如果用户选择跳过则为null。
 */

/**
 * 交互式地提示用户修复每一个空翻译条目。
 * @param {ValidationError[]} emptyTranslationErrors - `empty-translation`类型的错误对象数组。
 * @returns {Promise<EmptyTranslationFixDecision[]>} 返回一个包含用户所有决策的数组。
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

    decisions.push({
      error,
      newTranslation: newTranslation || null,
    });
  }

  return decisions;
}


/**
 * 提示用户是否在最终的打包文件中保留注释和空白行。
 * @returns {Promise<boolean>} 如果用户选择是，则返回 true，否则返回 false。
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
 * @typedef {Object} SyntaxFixDecision
 * @description 定义一个语法修复决策对象的结构。
 * @property {string} file - 发生错误的文件的路径。
 * @property {number} line - 需要修改的行的行号 (1-based)。
 * @property {string} fixedLine - 修正后的该行完整内容。
 */

/**
 * 交互式地提示用户修复可自动处理的语法错误。
 * @param {ValidationError[]} syntaxErrors - 'syntax' 类型的错误对象数组。
 * @returns {Promise<SyntaxFixDecision[]>} 返回一个包含用户所有修复决策的数组。
 */
export async function promptForSyntaxFix(syntaxErrors) {
  const decisions = [];
  console.log('\n----------------------------------------');
  console.log('📝 开始处理语法错误...');

  for (let i = 0; i < syntaxErrors.length; i++) {
    const error = syntaxErrors[i];
    
    // 一个简单的启发式方法，用于检测数组元素之间可能缺少的逗号。
    // Acorn 对此的报错是 "Unexpected token"，当它看到一个 `[` 时。
    const isMissingCommaError = error.message.includes('Unexpected token') && error.lineContent.trim().startsWith('[');

    if (!isMissingCommaError) {
      console.log(`\n--[ ${i + 1}/${syntaxErrors.length} ]-- 文件: ${path.basename(error.file)}`);
      console.log(`  - 错误: ${error.message}`);
      console.log(`  - 行号: ${error.line}`);
      console.log(`  - 内容: ${error.lineContent}`);
      console.log('  - 自动修复: ❌ 此类语法错误无法自动修复，请手动编辑文件。');
      continue;
    }

    const fileContent = await fs.readFile(error.file, 'utf-8');
    const lines = fileContent.split('\n');
    // 行号是 1-based，我们需要的是错误行的前一行
    const lineIndexToFix = error.line - 2; 
    const originalLine = lines[lineIndexToFix];
    const fixedLine = originalLine.trimEnd() + ',';

    const preview = `
--- 问题代码 (第 ${error.line - 1}-${error.line} 行) ---
${originalLine}
${error.lineContent}
--------------------------

+++ 建议修复 (高亮部分为新增) +++
${originalLine.trimEnd()}\x1b[32m,\x1b[0m
${error.lineContent}
++++++++++++++++++++++++++`;

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
        line: error.line - 1, // 1-based line number
        fixedLine: fixedLine,
      });
    }
  }

  return decisions;
}
