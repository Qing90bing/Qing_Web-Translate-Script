/**
 * @file build-tasks/tasks/check/check-source-duplicates.js
 * @description
 * 此任务负责检查并修复翻译文件中的"原文重复"问题（即多个不同的译文对应同一个原文）。
 *
 * **核心工作流程**:
 * 1. **语法预检**: 首先调用 `validateTranslationFiles` 检查所有文件是否存在语法错误。
 *    如果存在，会优先处理语法修复，然后中止任务。这是因为语法错误会破坏 AST 的准确性，
 *    导致后续的重复检查结果不可靠。用户必须在修复语法问题后重新运行此任务。
 * 2. **原文重复检查**: 调用 `validateTranslationFiles` 并开启 `checkSourceDuplicates` 选项，找出所有错误。
 * 3. 如果没有发现原文重复错误，则退出。
 * 4. 如果发现错误，调用 `promptUserAboutErrors` 询问用户如何处理。
 * 5. **执行分支**:
 *    - **自动修复 ('auto-fix-source')**: 调用 `fixSourceDuplicatesAutomatically`，保留每组重复中的第一个版本，删除其他所有版本。
 *    - **立即手动修复 ('manual-fix-immediate')**:
 *      - 调用 `promptForSourceDuplicateManualFixImmediate`，这是一个特殊的交互式修复循环。
 *      - 在循环中，用户为第一个错误组选择要保留的版本后，**立即应用修复**。
 *      - 修复后，**立即重新扫描所有文件**以获取最新的错误列表。
 *      - 这种“修复一个 -> 重新扫描全部”的模式确保了后续决策都是基于最新的文件状态，避免了因一次修复影响到其他错误而导致的问题。
 *    - **忽略/取消**: 打印信息并退出。
 */

// 导入核心库
import { color } from '../../lib/colors.js';
import { validateTranslationFiles } from '../../lib/validation.js';
import { promptUserAboutErrors, promptForSyntaxFix, promptForSourceDuplicateManualFixImmediate } from '../../lib/prompting.js';
import { applySyntaxFixes, fixSourceDuplicatesAutomatically, applySourceDuplicateManualFixes } from '../../lib/fixing.js';
// 从终端国际化模块导入翻译函数
import { t } from '../../lib/terminal-i18n.js';

/**
 * @function handleSourceDuplicatesCheck
 * @description "检查原文重复"任务的主处理函数。
 * @returns {Promise<void>}
 */
import { ProgressBar } from '../../lib/progress.js';
import { printValidationResults } from '../../lib/validation.js';

/**
 * @function handleSourceDuplicatesCheck
 * @description "检查原文重复"任务的主处理函数。
 * @returns {Promise<void>}
 */
export default async function handleSourceDuplicatesCheck() {
  console.log(color.cyan(t('checkTasks.checkingSourceDuplicates')));

  const progressBar = new ProgressBar({
    format: `${color.cyan('{bar}')} {percentage}% | {value}/{total} | {text}`
  });

  // 1. 调用验证器，只开启原文重复检查。
  const options = {
    checkSourceDuplicates: true,
    silent: true,
    onProgress: (current, total, file) => {
      progressBar.total = total;
      progressBar.update(current, `${t('checkTasks.scanning')} ${file}`);
    }
  };

  progressBar.start(0, t('checkTasks.scanning'));
  const allErrors = await validateTranslationFiles(options);
  progressBar.stop(true);

  // 如果有错误，需要手动打印
  if (allErrors.length > 0) {
    const errorsByFile = {};
    for (const error of allErrors) {
      if (!errorsByFile[error.file]) errorsByFile[error.file] = [];
      errorsByFile[error.file].push(error);
    }
    for (const [file, errors] of Object.entries(errorsByFile)) {
      printValidationResults(errors, file, options);
    }
  }

  // 2. 将返回的错误按类型（语法错误、原文重复错误）进行分类。
  const syntaxErrors = allErrors.filter(e => e.type === 'syntax');
  const sourceDuplicateErrors = allErrors.filter(e => e.type === 'source-duplicate');

  // 3. 优先处理语法错误。
  // 如果存在语法错误，原文重复检查的结果可能是不可靠的。因此，必须先修复语法问题。
  if (syntaxErrors.length > 0) {
    console.log(color.lightRed(t('checkTasks.sourceDuplicateSyntaxError')));
    // 提示用户修复可自动修复的语法错误。
    const decisions = await promptForSyntaxFix(syntaxErrors);
    if (decisions && decisions.length > 0) {
      await applySyntaxFixes(decisions);
      console.log(color.green(t('checkTasks.syntaxFixApplied')));
    } else {
      console.log(color.yellow(t('checkTasks.noSyntaxFix')));
    }
    // 中止当前任务，强制用户在修复语法错误后重新运行，以确保在干净的 AST 上进行重复检查。
    return;
  }

  // 4. 如果没有原文重复错误，则告知用户并退出。
  if (sourceDuplicateErrors.length === 0) {
    console.log(color.green(t('checkTasks.noSourceDuplicatesFound')));
    return;
  }

  // 5. 如果存在原文重复错误，询问用户如何操作。
  const userAction = await promptUserAboutErrors(sourceDuplicateErrors, { isFullBuild: false, isSourceDuplicate: true });

  // 6. 根据用户的选择执行相应的修复流程。
  switch (userAction) {
    case 'auto-fix-source':
      console.clear();
      // 自动修复：保留每组重复中的第一个版本，删除其他版本。
      await fixSourceDuplicatesAutomatically(sourceDuplicateErrors);
      console.log(color.green(t('checkTasks.autoFixCompleteSource')));
      break;

    case 'manual-fix-immediate':
      console.clear();
      // 手动修复（立即保存）：让用户逐个选择要保留的版本，每次选择后立即保存并重新验证。
      // 定义一个重新验证的函数，并将其作为参数传递给交互式提示模块。
      // 这使得 `prompting` 模块可以在每次修复后回调此函数，以获取最新的错误状态。
      const revalidateFunction = async () => {
        return await validateTranslationFiles({ checkSourceDuplicates: true, silent: true });
      };

      // 调用特殊的立即修复提示函数
      const fixedCount = await promptForSourceDuplicateManualFixImmediate(
        sourceDuplicateErrors,
        applySourceDuplicateManualFixes, // 传递用于应用修复的函数
        revalidateFunction // 传递用于重新验证的函数
      );

      // 根据修复结果打印总结
      if (fixedCount > 0) {
        console.log(color.green(t('checkTasks.immediateFixedCount', fixedCount)));
      } else {
        console.log(color.yellow(t('checkTasks.noSourceFix')));
      }
      break;

    case 'ignore':
      console.clear();
      console.log(color.yellow(t('checkTasks.emptyIssuesIgnored')));
      break;
    case 'cancel':
      console.clear();
      console.log(color.dim(t('checkTasks.operationCancelled')));
      break;
  }
}