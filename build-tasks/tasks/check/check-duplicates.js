/**
 * @file build-tasks/tasks/check-duplicates.js
 * @description
 * 此任务负责检查并修复翻译文件中的"重复的翻译"问题。
 *
 * **核心工作流程**:
 * 1. **语法预检**: 首先调用 `validateTranslationFiles` 检查所有文件是否存在语法错误。
 *    如果存在，会优先处理语法修复，然后中止任务。这是因为语法错误会破坏 AST 的准确性，
 *    导致后续的重复检查结果不可靠。用户必须在修复语法问题后重新运行此任务。
 * 2. **重复检查**: 调用 `validateTranslationFiles` 并开启 `checkDuplicates` 选项，找出所有错误。
 * 3. 如果没有发现重复错误，则退出。
 * 4. 如果发现重复错误，调用 `promptUserAboutErrors` 询问用户如何处理（自动、手动、忽略、取消）。
 * 5. 根据用户的选择：
 *    - **自动修复**: 调用 `fixDuplicatesAutomatically`，保留每组重复中的第一个条目，删除其余的。
 *    - **手动修复**: 调用 `promptForManualFix` 让用户为每组重复选择要保留的条目，然后调用 `applyManualFixes` 应用用户的选择。
 *    - **忽略/取消**: 打印信息并退出。
 */

// 导入核心库
import { color } from '../../lib/colors.js';
import { validateTranslationFiles } from '../../lib/validation.js';
import { promptUserAboutErrors, promptForManualFix, promptForSyntaxFix } from '../../lib/prompting.js';
import { fixDuplicatesAutomatically, applyManualFixes, applySyntaxFixes } from '../../lib/fixing.js';
// 从终端国际化模块导入翻译函数
import { t } from '../../lib/terminal-i18n.js';

/**
 * @function handleDuplicatesCheck
 * @description "检查重复的翻译"任务的主处理函数。
 * @returns {Promise<void>}
 */
import { ProgressBar } from '../../lib/progress.js';
import { printValidationResults } from '../../lib/validation.js';

/**
 * @function handleDuplicatesCheck
 * @description "检查重复的翻译"任务的主处理函数。
 * @returns {Promise<void>}
 */
import { ValidationReporter } from '../../lib/reporter.js';

export default async function handleDuplicatesCheck() {
  console.log(color.cyan(t('checkTasks.checkingDuplicates')));

  const progressBar = new ProgressBar({
    format: `${color.cyan('{bar}')} {percentage}% | {value}/{total} | {text}`
  });

  const options = {
    checkDuplicates: true,
    silent: true,
    onProgress: (current, total, file) => {
      progressBar.total = total;
      progressBar.update(current, `${t('checkTasks.scanning')} ${file}`);
    }
  };

  progressBar.start(0, t('checkTasks.scanning'));
  const allErrors = await validateTranslationFiles(options);
  progressBar.stop(true);

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

  const syntaxErrors = allErrors.filter(e => e.type === 'syntax');
  const duplicateErrors = allErrors.filter(e => e.type === 'multi-duplicate');

  if (syntaxErrors.length > 0) {
    console.log(color.lightRed(t('checkTasks.duplicateSyntaxError')));
    const decisions = await promptForSyntaxFix(syntaxErrors);
    if (decisions && decisions.length > 0) {
      await applySyntaxFixes(decisions);
      console.log(color.green(t('checkTasks.syntaxFixApplied')));
    } else {
      console.log(color.yellow(t('checkTasks.noSyntaxFix')));
    }
    return;
  }

  if (duplicateErrors.length === 0) {
    console.log(color.green(t('checkTasks.noDuplicatesFound')));
    return;
  }

  const userAction = await promptUserAboutErrors(duplicateErrors, { isFullBuild: false });

  // 初始化报告器
  const reporter = new ValidationReporter();

  switch (userAction) {
    case 'auto-fix':
      console.clear();
      // 自动修复：保留第一个，删除后续所有重复项。
      await fixDuplicatesAutomatically(duplicateErrors, reporter);
      console.log(color.green(t('checkTasks.autoFixCompleteDuplicates')));
      break;

    case 'manual-fix':
      console.clear();
      // 手动修复：让用户逐个选择要保留的版本。
      const decisions = await promptForManualFix(duplicateErrors);
      if (decisions) {
        await applyManualFixes(decisions, reporter);
        console.log(color.green(t('checkTasks.manualFixCompleteDuplicates')));
      } else {
        console.log(color.yellow(t('checkTasks.manualFixAborted')));
      }
      break;

    case 'ignore':
      console.clear();
      reporter.addSkipped(duplicateErrors.length);
      console.log(color.yellow(t('checkTasks.emptyIssuesIgnored')));
      break;
    case 'cancel':
      console.clear();
      console.log(color.dim(t('checkTasks.operationCancelled')));
      break;
  }

  // 打印总结
  reporter.printSummary();
}