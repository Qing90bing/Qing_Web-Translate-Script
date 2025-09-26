/**
 * @file build-tasks/lib/prompting.js
 * @description
 * 该文件包含了所有与用户通过命令行进行交互的功能。
 * 它基于 `inquirer` 库，提供了一系列函数，用于向用户提出问题、
 * 显示选项、请求输入，并根据用户的选择返回相应的结果。
 * 这个模块是实现交互式修复流程的核心。
 *
 * **设计理念**: 此模块中的函数力求提供上下文感知（Context-Aware）的提示。
 * 例如，同一个操作（如"取消"）在不同场景下会显示不同的文本（"取消构建" vs "返回主菜单"），
 * 以便为用户提供最清晰的指引。
 */

// 导入第三方库 `inquirer`，用于创建交互式的命令行界面。
import inquirer from 'inquirer';
// 导入 Node.js 的 `path` 模块，用于处理文件和目录路径。
import path from 'path';
// 导入 Node.js 的 `fs.promises` 模块，用于异步文件系统操作。
import fs from 'fs/promises';
// 从本地 `colors.js` 模块导入颜色工具。
import { color } from './colors.js';
// 从本地 `validation.js` 模块导入辅助函数。
import { getLiteralValue } from './validation.js';
// 从终端国际化模块导入翻译函数
import { t } from './terminal-i18n.js';

/**
 * @typedef {import('./validation.js').ValidationError} ValidationError
 * @description JSDoc 类型定义，用于在下面的函数中引用从 validation.js 导出的 ValidationError 类型。
 * 这有助于提高代码的可读性和开发工具的智能提示。
 */

/**
 * @function promptUserAboutErrors
 * @description 针对发现的多种错误，提示用户选择下一步操作。
 * 这是错误处理流程的通用入口点。它会根据检测到的错误类型（如重复、空值）动态生成一个选项列表，
 * 让用户决定是自动修复、手动处理、全部忽略还是取消操作。
 * @param {ValidationError[]} errors - 从 `validation.js` 的校验函数返回的错误对象数组。
 * @param {object} [options={}] - 可选的配置对象。
 * @param {boolean} [options.isFullBuild=false] - 标记当前是否为完整的构建流程。这会影响提示文本的内容
 *   （例如，"取消构建" vs "返回主菜单"），使提示更符合上下文。
 * @returns {Promise<string>} 返回一个解析为字符串的 Promise，该字符串代表用户选择的操作
 *   （例如 'auto-fix', 'manual-fix', 'ignore', 'cancel'）。
 */
export async function promptUserAboutErrors(errors, options = {}) {
  const { isFullBuild = false, isSourceDuplicate = false } = options;

  // 1. 统计不同类型的错误数量，以便在提示信息中清晰地展示，并据此决定提供哪些修复选项。
  const duplicateErrorCount = errors.filter(e => e.type === 'multi-duplicate').length;
  const sourceDuplicateErrorCount = errors.filter(e => e.type === 'source-duplicate').length;
  const emptyTranslationCount = errors.filter(e => e.type === 'empty-translation').length;
  const manualFixErrorCount = duplicateErrorCount + sourceDuplicateErrorCount + emptyTranslationCount;

  // 2. 根据存在的错误类型，动态构建提供给用户的选项列表 (`choices`)。
  const choices = [];
  // 仅当存在"重复的翻译"错误时，才提供自动修复选项，因为这是唯一可以被安全地自动修复的场景（保留第一个）。
  if (duplicateErrorCount > 0) {
    choices.push({
      name: (t('prompting.autoFixName', duplicateErrorCount)),
      value: 'auto-fix',
    });
  }
  
  // 为原文重复错误提供自动修复选项（保留第一个出现的译文）
  if (sourceDuplicateErrorCount > 0) {
    choices.push({
      name: t('prompting.autoFixSourceName', sourceDuplicateErrorCount),
      value: 'auto-fix-source',
    });
  }

  // 仅当存在可手动修复的错误（重复的翻译、原文重复或空翻译）时，才提供手动修复选项。
  if (manualFixErrorCount > 0) {
    const verb = manualFixErrorCount > 1 ? t('prompting.manualFixText', t('prompting.manualFixMultiText', manualFixErrorCount)) : t('prompting.manualFixText', t('prompting.manualFixEmptyText', manualFixErrorCount));
    let manualFixText = verb;
    if (sourceDuplicateErrorCount > 0) {
      manualFixText = t('prompting.manualFixText', t('prompting.manualFixSourceText', sourceDuplicateErrorCount));
      choices.push({ name: manualFixText, value: 'manual-fix-immediate' });
    } else if (duplicateErrorCount > 0 && emptyTranslationCount > 0) {
      manualFixText = t('prompting.manualFixText', t('prompting.manualFixMultiText', manualFixErrorCount));
      choices.push({ name: manualFixText, value: 'manual-fix' });
    } else if (duplicateErrorCount > 0) {
      manualFixText = t('prompting.manualFixText', t('prompting.manualFixDuplicateText', manualFixErrorCount));
      choices.push({ name: manualFixText, value: 'manual-fix' });
    } else {
      manualFixText = t('prompting.manualFixText', t('prompting.manualFixEmptyText', manualFixErrorCount));
      choices.push({ name: manualFixText, value: 'manual-fix' });
    }
  }

  // 3. 根据 `isFullBuild` 标志，定制"忽略"和"取消"选项的提示文本，使其更贴合当前的操作流程。
  const ignoreText = isFullBuild ? t('prompting.ignoreText') : t('prompting.ignoreTextPartial');
  const cancelText = isFullBuild ? t('prompting.cancelText') : t('prompting.cancelTextPartial');

  // "忽略" 和 "取消" 是常驻选项，总是提供给用户。
  choices.push({ name: ignoreText, value: 'ignore' }, { name: cancelText, value: 'cancel' });

  // 4. 显示一个分隔线，然后使用 `inquirer` 弹出提示框。
  const separator = '\n' + t('prompting.separator');
  console.log(color.dim(separator));
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: t('prompting.messagePrefix', color.yellow(errors.length)),
      choices: choices,
      pageSize: 20, // 增加 pageSize 选项以显示更多行
    },
  ]);

  // 5. 返回用户选择的操作字符串。
  return action;
}

/**
 * @function promptForManualFix
 * @description 提示用户手动解决"重复的翻译"的错误。
 * 该函数会遍历所有"重复的翻译"的错误。对于每一组重复，它都会提供一个交互式列表，
 * 列出所有出现该原文的位置，并让用户选择要保留哪一个版本。
 * 用户可以选择保留某一个、跳过当前错误，或者中途退出整个修复流程。
 * @param {ValidationError[]} duplicateErrors - 一个只包含 'multi-duplicate' 类型错误的数组。
 * @returns {Promise<Array<object>|null>} 返回一个包含用户决策的数组。
 *   每个决策对象都指明了文件、原文、要保留的行号以及所有出现的位置。
 *   如果用户选择中途退出，则返回 `null`。
 */
export async function promptForManualFix(duplicateErrors) {
  const decisions = [];
  let userExited = false;

  for (let i = 0; i < duplicateErrors.length; i++) {
    const error = duplicateErrors[i];
    // 从错误对象中直接获取原文文本，避免依赖易变的错误消息格式。
    const originalText = error.occurrences[0].originalValue || t('validation.unknownSource');
    
    // 1. 为每个出现的位置（occurrence）创建一个选项，显示其行号和行内容。
    const choices = error.occurrences.map(occ => ({
      name: t('prompting.choiceKeep', occ.line, occ.lineContent),
      value: occ.line, // `value` 是该选项的实际返回值
    }));

    // 2. 添加"跳过"和"退出"这两个特殊操作选项。
    choices.push(new inquirer.Separator());
    choices.push({ name: t('prompting.choiceSkip'), value: 'skip' });
    choices.push({ name: t('prompting.choiceExit'), value: 'exit' });

    // 3. 使用 `inquirer` 显示提示，并附上进度信息（例如 "正在处理 1 / 5"）。
    const progress = color.dim(`[${i + 1}/${duplicateErrors.length}]`);
    const { userChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'userChoice',
        message: t('prompting.processingDuplicate', progress, color.yellow(`"${originalText}"`)),
        choices: choices,
        pageSize: 20, // 增加 pageSize 选项以显示更多行
      },
    ]);

    // 4. 处理用户的选择。
    if (userChoice === 'exit') {
      // 如果用户选择退出，需要二次确认，防止误操作。
      const { confirmExit } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmExit', message: t('prompting.confirmExit'), prefix: '⚠️', default: false }
      ]);
      if (confirmExit) {
        userExited = true;
        break; // 确认退出后，中断 for 循环。
      } else {
        i--; // 如果用户取消退出，则将循环计数器减一，以便下次循环时能重新处理当前问题。
        continue;
      }
    }

    // 5. 将用户的决策（要保留的行）存储起来。
    decisions.push({
      file: error.file,
      originalText: originalText,
      lineToKeep: userChoice,
      allOccurrences: error.occurrences,
    });
  }

  // 6. 如果用户中途退出了，返回 `null`；否则，返回所有决策的数组。
  return userExited ? null : decisions;
}

/**
 * @function promptForEmptyTranslationFix
 * @description 提示用户为"空翻译"的条目提供译文。
 * 该函数会遍历所有译文为空字符串的错误，并逐个弹出输入框，提示用户输入新的翻译。
 * 这是纯手动操作，因为程序无法猜测正确的译文。
 * @param {ValidationError[]} emptyTranslationErrors - 一个只包含 'empty-translation' 类型错误的数组。
 * @returns {Promise<Array<object>>} 返回一个包含用户决策的数组。
 *   每个决策对象都包含原始错误信息和用户输入的新译文。如果用户跳过（直接回车），新译文将为 `null`。
 */
export async function promptForEmptyTranslationFix(emptyTranslationErrors) {
  const decisions = [];
  const separator = color.dim('\n' + t('prompting.separator'));
  console.log(separator);
  console.log(color.bold(t('prompting.emptyTranslationTitle')));

  for (let i = 0; i < emptyTranslationErrors.length; i++) {
    const error = emptyTranslationErrors[i];
    // 从 AST 节点中获取原文的值。
    const originalValue = getLiteralValue(error.node.elements[0]);

    // 弹出一个输入框，显示文件名、原文，并请求用户输入译文。
    const progress = color.dim(`[${i + 1}/${emptyTranslationErrors.length}]`);
    const { newTranslation } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newTranslation',
        message: t('prompting.emptyTranslationPrompt', progress, color.underline(path.basename(error.file)), color.yellow(`"${originalValue}"`), color.cyan(t('prompting.enterTranslation'))),
      },
    ]);

    // 将用户的输入记录为决策。
    // 如果用户直接按回车，`newTranslation` 将是空字符串。`|| null` 会将其转换为 `null`，作为"跳过"的标记。
    decisions.push({
      error,
      newTranslation: newTranslation || null,
    });
  }

  return decisions;
}

/**
 * @function promptForSingleEmptyTranslationFix
 * @description 在手动模式下，向用户逐个展示"空翻译"问题。
 * @param {ValidationError} error - 当前需要处理的单个"空翻译"错误对象。
 * @param {number} remainingCount - 剩余待处理的错误数量。
 * @returns {Promise<object>} 返回一个包含用户决策的对象，例如 `{ action: 'fix', newTranslation: '...' }`。
 */
export async function promptForSingleEmptyTranslationFix(error, remainingCount) {
  const originalText = getLiteralValue(error.node.elements[0]);

  const progress = color.cyan(t('prompting.singleEmptyTranslationProgress', remainingCount));
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: t('prompting.singleEmptyTranslationMessage', progress, color.underline(path.basename(error.file)), color.yellow(`"${originalText}"`), error.line),
      choices: [
        { name: t('prompting.singleEmptyTranslationFix'), value: 'fix' },
        new inquirer.Separator(),
        { name: t('prompting.singleEmptyTranslationSkip'), value: 'skip' },
        { name: t('prompting.singleEmptyTranslationSkipAll'), value: 'skip-all' },
        { name: t('prompting.singleEmptyTranslationAbort'), value: 'abort' },
      ],
      pageSize: 20, // 增加 pageSize 选项以显示更多行
    },
  ]);

  // 如果用户选择中止，进行二次确认。
  if (action === 'abort') {
      const { confirmExit } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmExit', message: t('prompting.confirmAbort'), prefix: '⚠️', default: false }
      ]);
      // 如果用户取消中止，返回一个特殊状态 `retry`，让调用者可以重新处理此项。
      if (!confirmExit) {
        return { action: t('prompting.retry') };
      }
  }

  // 如果用户选择修复，则弹出输入框让其输入新译文。
  if (action === 'fix') {
    const { newTranslation } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newTranslation',
        message: t('prompting.enterNewTranslation', color.yellow(`"${originalText}"`)),
      }
    ]);
    // 如果用户直接回车，则视为跳过
    if (!newTranslation) {
        return { action: t('prompting.skip') };
    }
    return { action: 'fix', newTranslation };
  }
  
  // 对于其他情况（如 'skip', 'skip-all', 'abort' 等），直接返回决策。
  return { action };
}


/**
 * @function promptToPreserveFormatting
 * @description 在构建项目前，询问用户希望以哪种方式构建项目。
 * @returns {Promise<string|null>} 返回用户的选择：'preserve' (调试构建), 'no-preserve' (标准构建), 'cdn' (CDN 构建), 或 null (取消).
 */
export async function promptToPreserveFormatting() {
    // 如果是测试环境，直接返回 'no-preserve'
    if (process.env.TEST_NO_FORMATTING === 'true') {
        return 'no-preserve';
    }
    
    const separator = color.dim('\n' + t('prompting.separator'));
    console.log(separator);
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: t('prompting.buildOptionsTitle'),
            choices: [
                {
                    name: t('prompting.standardBuild'), // 📦 标准构建
                    value: 'no-preserve'
                },
                {
                    name: t('prompting.debugBuild'), // 🔍 调试构建
                    value: 'preserve'
                },
                {
                    name: t('prompting.cdnBuild'), // 🚀 CDN 构建
                    value: 'cdn'
                },
                new inquirer.Separator(),
                {
                    name: t('prompting.cancelBuild'), // ❌ 取消构建
                    value: 'cancel'
                }
            ],
            default: 'no-preserve',
        }
    ]);
    
    if (action === 'cancel') {
        return null;
    }
    
    return action;
}

/**
 * @function promptForSyntaxFix
 * @description 提示用户修复语法错误，特别是针对"可能遗漏的逗号"提供交互式修复。
 * 此函数会遍历所有语法错误。对于无法自动处理的普通语法错误，它仅打印错误信息让用户知晓。
 * 对于一类特定的、由 `acorn` 解析器在数组末尾的成员表达式后抛出的 `Unexpected token` 错误，
 * 它会通过启发式方法识别为"可能遗漏逗号"，并生成一个带高亮的代码预览，让用户确认是否要自动添加逗号。
 * @param {ValidationError[]} syntaxErrors - 从校验器返回的语法错误数组。
 * @returns {Promise<Array<object>>} 返回一个决策数组，包含用户确认要应用的所有修复操作。
 */
export async function promptForSyntaxFix(syntaxErrors) {
  const decisions = [];
  const separator = color.dim('\n' + t('prompting.separator'));
  console.log(separator);
  console.log(color.bold(t('prompting.syntaxErrorTitle')));

  for (let i = 0; i < syntaxErrors.length; i++) {
    const error = syntaxErrors[i];
    
    // 1. 使用启发式方法判断这是否是一个可自动修复的"遗漏逗号"错误。
    // 条件：错误信息包含 "Unexpected token"，且错误行的内容以 `[` 开头。
    // 这个特征通常出现在 `[...]` 和 `[...]` 之间缺少逗号的场景。
    const isMissingCommaError = error.message.includes('Unexpected token') && error.lineContent.trim().startsWith('[');

    // 2. 如果不是我们能处理的特定错误类型，则只显示信息，让用户去手动修复。
    if (!isMissingCommaError) {
      const progress = color.dim(`[${i + 1}/${syntaxErrors.length}]`);
      console.log(t('prompting.syntaxErrorProgress', progress, color.underline(path.basename(error.file))));
      console.log(t('prompting.syntaxError', color.red(t('validation.syntax')), error.message));
      console.log(t('prompting.lineNumber', color.dim(t('validation.lineLabel').split(':')[0]), error.line));
      console.log(t('prompting.lineContent', color.dim(t('validation.contentLabel').split(':')[0]), error.lineContent));
      console.log(color.yellow(t('prompting.autoFixUnavailable')));
      continue; // 继续处理下一个错误
    }

    // 3. 对于可修复的错误，生成修复预览。
    const fileContent = await fs.readFile(error.file, 'utf-8');
    const lines = fileContent.split('\n');
    // Acorn 报错的位置是下一行的行首，因此我们要修复的是错误行的上一行。
    const lineIndexToFix = error.line - 2; 
    const originalLine = lines[lineIndexToFix];
    const fixedLine = originalLine.trimEnd() + ','; // 在行尾添加逗号

    // 4. 使用颜色工具创建带高亮的预览，让用户一目了然。
    const preview = `
--- ${t('validation.contentLabel').split(':')[0]} ${t('validation.lineRange', error.line - 1, error.line)} ---
${originalLine}
${error.lineContent}
--------------------------

+++ ${t('validation.contentLabel').split(':')[0]} ${t('validation.highlightNote')} +++
${originalLine.trimEnd()}${color.green(',')}
${error.lineContent}
++++++++++++++++++++++++++`;

    // 5. 弹出确认框，显示预览图，让用户决定是否接受此修复。
    const progress = color.dim(`[${i + 1}/${syntaxErrors.length}]`);
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        prefix: '❓',
        message: t('prompting.missingCommaDetected', progress, color.underline(path.basename(error.file)), preview),
        default: true,
      },
    ]);

    // 6. 如果用户确认，则将此修复操作记录到决策数组中。
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
 * @function promptForCommaFixAction
 * @description 当检测到多个"遗漏逗号"问题时，询问用户希望采取哪种处理方式。
 * @param {number} errorCount - 检测到的"遗漏逗号"问题总数。
 * @returns {Promise<string>} 返回用户选择的操作：'auto-fix'（自动修复）, 'manual-fix'（手动修复）, 或 'ignore'（忽略）。
 */
export async function promptForCommaFixAction(errorCount) {
  const separator = color.dim('\n' + t('prompting.separator'));
  console.log(separator);
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: t('prompting.commaFixActionMessage', color.yellow(errorCount)),
      choices: [
        {
          name: t('prompting.commaFixAuto'),
          value: 'auto-fix',
        },
        {
          name: t('prompting.commaFixManual'),
          value: 'manual-fix',
        },
        {
          name: t('prompting.commaFixIgnore'),
          value: 'ignore',
        },
      ],
      pageSize: 20, // 增加 pageSize 选项以显示更多行
    },
  ]);
  return action;
}

/**
 * @function promptForSingleCommaFix
 * @description 在手动模式下，向用户逐个展示"可能遗漏的逗号"问题，并提供修复预览。
 * 这个函数用于处理那些置信度较低、需要用户逐一确认才能修复的逗号错误。
 * 它会生成一个包含上下文（错误行的上一行和下一行）和高亮修复建议的预览。
 * @param {ValidationError} error - 当前需要处理的单个"遗漏逗号"错误对象。
 * @param {number} remainingCount - 剩余待处理的错误数量，用于在提示中向用户显示进度。
 * @returns {Promise<string>} 返回用户的操作选择：'fix'（修复）, 'skip'（跳过）, 'skip-all'（全部跳过）, 或 'abort'（中止）。
 */
export async function promptForSingleCommaFix(error, remainingCount) {
  const fileContent = await fs.readFile(error.file, 'utf-8');
  const lines = fileContent.split('\n');
  const errorLineIndex = error.line - 1;

  // 1. 获取错误行及其上下文（上一行和下一行），用于生成更清晰的预览。
  const lineAbove = lines[errorLineIndex - 1] || '';
  const errorLine = lines[errorLineIndex];
  const lineBelow = lines[errorLineIndex + 1] || '';

  // 2. 根据 AST 返回的精确字符位置（`error.pos`），计算出逗号应该被插入的列位置。
  let lineStartPos = 0;
  for (let j = 0; j < errorLineIndex; j++) {
    lineStartPos += lines[j].length + 1; // +1 for the newline character
  }
  const relativeColumn = error.pos - lineStartPos;

  // 3. 构建带有颜色高亮的建议修复行，使新增的逗号在视觉上更醒目。
  //    `\x1b[32m` 是设置颜色为绿色的转义码, `\x1b[0m` 是重置颜色的转义码。
  const fixedLine =
    errorLine.slice(0, relativeColumn) +
    color.green(',') +
    errorLine.slice(relativeColumn);
  
  // 4. 构建完整的预览文本，包括原始问题代码和建议的修复方案。
  const preview = `
--- ${t('validation.contentLabel').split(':')[0]} ${t('validation.fileLine', path.basename(error.file), error.line)} ---
${lineAbove}
${color.red(errorLine)}
${lineBelow}
----------------------------------

+++ ${t('validation.contentLabel').split(':')[0]} ${t('validation.highlightNote')} +++
${lineAbove}
${fixedLine}
${lineBelow}
++++++++++++++++++++++++++++++++++`;

  // 5. 显示交互式列表提示，让用户做出选择。
  const progress = color.dim(t('prompting.singleCommaFixProgress', remainingCount));
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: t('prompting.singleCommaFixMessage', progress, color.yellow(error.message), preview),
      choices: [
        { name: t('prompting.singleCommaFix'), value: 'fix' },
        { name: t('prompting.singleCommaSkip'), value: 'skip' },
        { name: t('prompting.singleCommaSkipAll'), value: 'skip-all' },
        { name: t('prompting.singleCommaAbort'), value: 'abort' },
      ],
      pageSize: 20, // 增加 pageSize 选项以显示更多行
    },
  ]);
  return choice;
}

/**
 * @function promptForIdenticalAutoFix
 * @description 提示用户选择自动修复"原文与译文相同"问题的方式。
 * @returns {Promise<string>} 返回用户的选择：'remove'（移除）或 'empty'（将译文置空）。
 */
/**
 * @function promptForIdenticalAutoFix
 * @description 提示用户选择自动修复"原文与译文相同"问题的具体方式（全部移除或全部置空）。
 * @private
 * @returns {Promise<'remove'|'empty'|'cancel'>} 返回用户的选择。
 */
async function promptForIdenticalAutoFix() {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: t('prompting.identicalAutoFixMessage', color.cyan(t('prompting.identicalAutoFixRemove'))),
      choices: [
        { name: t('prompting.identicalAutoFixRemove'), value: 'remove' },
        { name: t('prompting.identicalAutoFixEmpty'), value: 'empty' },
        new inquirer.Separator(),
        { name: t('prompting.identicalAutoFixBack'), value: 'cancel' },
      ],
      pageSize: 20, // 增加 pageSize 选项以显示更多行
    },
  ]);
  return choice;
}

/**
 * @function promptForSingleIdenticalFix
 * @description 提示用户手动修复单个"原文与译文相同"的问题。
 * @param {ValidationError} error - 单个 'identical-translation' 类型的错误。
 * @param {number} remainingCount - 剩余待处理的错误数量。
 * @returns {Promise<object>} 返回一个包含用户决策的对象，例如 `{ error, action: 'modify', newTranslation: '...' }`。
 */
export async function promptForSingleIdenticalFix(error, remainingCount) {
  const originalText = getLiteralValue(error.node.elements[0]);

  // 1. 提供多个处理选项：修改、移除、忽略、全部忽略、中止。
  const progress = color.cyan(t('prompting.singleIdenticalProgress', remainingCount));
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: t('prompting.singleIdenticalMessage', progress, color.underline(path.basename(error.file)), color.yellow(`"${originalText}"`), error.line, color.cyan(error.lineContent.trim())),
      choices: [
        { name: t('prompting.singleIdenticalModify'), value: 'modify' },
        { name: t('prompting.singleIdenticalRemove'), value: 'remove' },
        new inquirer.Separator(),
        { name: t('prompting.singleIdenticalSkip'), value: 'skip' },
        { name: t('prompting.singleIdenticalSkipAll'), value: 'skip-all' },
        { name: t('prompting.singleIdenticalAbort'), value: 'abort' },
      ],
      pageSize: 20, // 增加 pageSize 选项以显示更多行
    },
  ]);

  // 2. 如果用户选择中止，进行二次确认。
  if (action === 'abort') {
      const { confirmExit } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmExit', message: t('prompting.confirmAbort'), prefix: '⚠️', default: false }
      ]);
      // 如果用户取消中止，返回一个特殊状态 `retry`，让调用者可以重新处理此项。
      if (!confirmExit) {
        return { error, action: t('prompting.retry') };
      }
  }

  // 3. 如果用户选择修改，则弹出输入框让其输入新译文。
  if (action === 'modify') {
    const { newTranslation } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newTranslation',
        message: t('prompting.enterNewTranslation', color.yellow(`"${originalText}"`)),
        // 验证确保输入不为空。
        validate: input => input.trim() !== '' ? true : t('prompting.translationCannotBeEmpty')
      }
    ]);
    return { error, action: 'modify', newTranslation };
  }
  
  // 4. 对于其他情况（如 'remove', 'skip' 等），直接返回决策。
  return { error, action };
}


/**
 * @function promptUserAboutIdenticalTranslations
 * @description 针对发现的"原文与译文相同"错误，提示用户选择顶层操作（自动修复、手动修复、忽略）。
 * @param {ValidationError[]} errors - 'identical-translation' 类型的错误数组。
 * @returns {Promise<{action: string, decisions?: any}|null>} 返回一个包含用户顶层选择的对象，如果用户取消则返回 null。
 */
export async function promptUserAboutIdenticalTranslations(errors) {
  const separator = '\n' + t('prompting.separator');
  console.log(color.dim(separator));
  // 1. 首先询问用户是想自动处理、手动处理还是直接忽略。
  const { primaryAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'primaryAction',
      message: t('prompting.identicalTranslationMessage', color.yellow(errors.length)),
      choices: [
        { name: t('prompting.identicalTranslationAuto'), value: 'auto-fix' },
        { name: t('prompting.identicalTranslationManual'), value: 'manual-fix' },
        new inquirer.Separator(),
        { name: t('prompting.identicalTranslationIgnore'), value: 'ignore' },
      ],
      pageSize: 20, // 增加 pageSize 选项以显示更多行
    },
  ]);

  // 2. 根据用户的选择，进行下一步操作。
  switch (primaryAction) {
    case 'auto-fix':
      // 如果选择自动修复，则调用 `promptForIdenticalAutoFix` 询问具体的修复方式（移除还是置空）。
      const autoFixType = await promptForIdenticalAutoFix();
      if (autoFixType === 'cancel') {
        return { action: 'cancel' };
      }
      // 将自动修复的类型和所有相关错误打包返回。
      return { action: 'auto-fix', decisions: { type: autoFixType, errors } };

    case 'manual-fix':
      // 如果选择手动修复，直接返回该动作，具体的循环处理将在上层函数中进行。
      return { action: 'manual-fix' };
    
    case 'ignore':
      // 如果选择忽略，也直接返回该动作。
      return { action: 'ignore' };

    default:
      return null;
  }
}

/**
 * @function promptForSourceDuplicateManualFix
 * @description 提示用户手动解决"原文重复"的错误。
 * 该函数会遍历所有"原文重复"的错误。对于每一组重复，它都会提供一个交互式列表，
 * 列出所有使用该原文的位置，并让用户选择要保留哪一个版本。
 * 用户可以选择保留某一个、跳过当前错误，或者中途退出整个修复流程。
 * @param {ValidationError[]} sourceDuplicateErrors - 一个只包含 'source-duplicate' 类型错误的数组。
 * @returns {Promise<Array<object>|null>} 返回一个包含用户决策的数组。
 *   每个决策对象都指明了文件、原文、要保留的行号以及所有出现的位置。
 *   如果用户选择中途退出，则返回 `null`。
 */
export async function promptForSourceDuplicateManualFix(sourceDuplicateErrors) {
  const decisions = [];
  let userExited = false;

  for (let i = 0; i < sourceDuplicateErrors.length; i++) {
    const error = sourceDuplicateErrors[i];
    // 从错误对象中直接获取原文文本，避免依赖易变的错误消息格式。
    const originalText = error.occurrences[0].originalValue || t('validation.unknownSource');
    
    // 1. 为每个出现的位置（occurrence）创建一个选项，显示其行号、对应的译文和行内容。
    const choices = error.occurrences.map((occ, index) => {
      const translationText = occ.translationValue || t('validation.unknownTranslation');
      const truncate = (str, len = 25) => (str.length > len ? `${str.substring(0, len)}...` : str);
      const displayTranslation = truncate(translationText);
      return {
        name: t('prompting.sourceDuplicateChoiceKeep', occ.line, originalText, displayTranslation),
        value: occ.line, // `value` 是该选项的实际返回值
      };
    });

    // 2. 添加"跳过"和"退出"这两个特殊操作选项。
    choices.push(new inquirer.Separator());
    choices.push({ name: t('prompting.choiceSkip'), value: 'skip' });
    choices.push({ name: t('prompting.choiceExit'), value: 'exit' });

    // 3. 使用 `inquirer` 显示提示，并附上进度信息（例如 "正在处理 1 / 5"）。
    const progress = color.dim(`[${i + 1}/${sourceDuplicateErrors.length}]`);
    const { userChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'userChoice',
        message: t('prompting.processingSourceDuplicate', progress, color.yellow(`"${originalText}"`)),
        choices: choices,
        pageSize: 20, // 增加 pageSize 选项以显示更多行
      },
    ]);

    // 4. 处理用户的选择。
    if (userChoice === 'exit') {
      // 如果用户选择退出，需要二次确认，防止误操作。
      const { confirmExit } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmExit', message: t('prompting.confirmExit'), prefix: '⚠️', default: false }
      ]);
      if (confirmExit) {
        userExited = true;
        break; // 退出循环
      }
      // 如果用户取消退出，则重新处理当前错误。
      i--; // 重复当前迭代
      continue;
    }

    if (userChoice === 'skip') {
      // 如果用户选择跳过，则不记录任何决定，直接继续处理下一个错误。
      continue;
    }

    // 如果用户选择了一个具体的行号，则记录这个决定。
    decisions.push({
      file: error.file,
      originalText: originalText,
      lineToKeep: userChoice, // 用户选择保留的行号
      occurrences: error.occurrences, // 所有出现的位置，便于在修复时删除其他项
    });
  }

  // 如果用户中途退出，返回 `null`。
  if (userExited) {
    return null;
  }

  // 否则，返回用户的所有决定。
  return decisions;
}

/**
 * @function promptForSourceDuplicateManualFixImmediate
 * @description 提示用户手动解决"原文重复"的错误，但每次选择后立即保存，而不是批量处理。
 * 该函数会遍历所有"原文重复"的错误。对于每一组重复，它都会提供一个交互式列表，
 * 列出所有使用该原文的位置，让用户选择要保留哪一个版本，然后立即应用修复。
 * @param {ValidationError[]} sourceDuplicateErrors - 一个只包含 'source-duplicate' 类型错误的数组。
 * @param {Function} applyFunction - 用于立即应用单个修复的函数。
 * @param {Function} revalidateFunction - 用于重新验证并获取最新错误列表的函数。
 * @returns {Promise<number>} 返回成功修复的错误数量。
 */
export async function promptForSourceDuplicateManualFixImmediate(sourceDuplicateErrors, applyFunction, revalidateFunction) {
  let fixedCount = 0;
  let remainingErrors = [...sourceDuplicateErrors]; // 创建副本

  while (remainingErrors.length > 0) {
    const error = remainingErrors[0]; // 始终处理第一个错误
    // 从错误对象中直接获取原文文本，避免依赖易变的错误消息格式。
    const originalText = error.occurrences[0].originalValue || t('validation.unknownSource');
    
    // 1. 为每个出现的位置（occurrence）创建一个选项，显示其行号、对应的译文和行内容。
    const choices = error.occurrences.map((occ, index) => {
      const translationText = occ.translationValue || t('validation.unknownTranslation');
      const truncate = (str, len = 25) => (str.length > len ? `${str.substring(0, len)}...` : str);
      const displayTranslation = truncate(translationText);
      return {
        name: t('prompting.sourceDuplicateChoiceKeep', occ.line, originalText, displayTranslation),
        value: occ.line, // `value` 是该选项的实际返回值
      };
    });

    // 2. 添加"跳过"和"退出"这两个特殊操作选项。
    choices.push(new inquirer.Separator());
    choices.push({ name: t('prompting.choiceSkip'), value: 'skip' });
    choices.push({ name: t('prompting.choiceExit'), value: 'exit' });

    // 3. 使用 `inquirer` 显示提示，并附上进度信息。
    const progress = color.dim(t('prompting.sourceDuplicateImmediateProgress', remainingErrors.length));
    const { userChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'userChoice',
        message: t('prompting.processingSourceDuplicateImmediate', progress, color.yellow(`"${originalText}"`)),
        choices: choices,
        pageSize: 20, // 增加 pageSize 选项以显示更多行
      },
    ]);

    // 4. 处理用户的选择。
    if (userChoice === 'exit') {
      // 如果用户选择退出，需要二次确认，防止误操作。
      const { confirmExit } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmExit', message: t('prompting.confirmAbort'), prefix: '⚠️', default: false }
      ]);
      if (confirmExit) {
        break; // 退出循环
      }
      // 如果用户取消退出，则继续处理当前错误。
      continue;
    }

    if (userChoice === 'skip') {
      // 如果用户选择跳过，则不做任何操作，移除当前错误并继续处理下一个。
      remainingErrors.shift(); // 移除第一个元素
      continue;
    }

    // 如果用户选择了一个具体的行号，则立即应用修复。
    const decision = {
      file: error.file,
      originalText: originalText,
      lineToKeep: userChoice, // 用户选择保留的行号
      occurrences: error.occurrences, // 所有出现的位置，便于在修复时删除其他项
    };

    try {
      await applyFunction([decision]); // 立即应用单个修复
      console.log(color.green(`✅ ${t('validation.sourceDuplicateRule', originalText, 1).replace(' 被重复使用了 1 次，分别对应不同的译文。', '')} ${t('checkTasks.fixed')}`));
      fixedCount++;
      
      // 关键步骤：修复后重新验证并更新剩余错误列表
      if (revalidateFunction) {
        const newErrors = await revalidateFunction();
        const sourceDuplicateErrors = newErrors.filter(e => e.type === 'source-duplicate');
        remainingErrors = sourceDuplicateErrors;
      } else {
        // 如果没有提供重新验证函数，则只是移除当前错误
        remainingErrors.shift();
      }
    } catch (err) {
      console.error(color.red(`❌ ${t('validation.fileProcessingError', originalText).replace('❌ 处理文件 ', '').replace(' 时发生错误:', '')} ${t('validation.fileProcessingError', err.message)}`));
      // 出错时也移除当前错误，避免无限循环
      remainingErrors.shift();
    }
  }

  return fixedCount;
}