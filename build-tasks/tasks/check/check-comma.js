/**
 * @file build-tasks/tasks/check-comma.js
 * @description
 * 此任务负责检查并修复翻译文件中"可能遗漏的逗号"问题。
 * 这是所有检查任务中最复杂的一个，因为它结合了复杂的自动修复和手动修复两种模式。
 *
 * **核心工作流程**:
 * 1. **初步检查**: 调用 `validateTranslationFiles` 找出所有可能的逗号遗漏问题。
 * 2. 如果没有问题，则退出。
 * 3. **顶层决策**: 调用 `promptForCommaFixAction` 询问用户是想"自动修复"、"手动修复"还是"忽略"。
 * 4. **自动修复模式**:
 *    - 此模式采用**迭代修复**策略。它会进入一个循环，每次循环都重新扫描文件，
 *      找出所有"高置信度"的错误，然后只修复*第一个*。
 *    - 这么做的原因是，修复一个逗号错误可能会解决掉后续的另一个错误（或引入新错误），
 *      因此每次只修复一个并重新扫描，可以确保修复的准确性。
 *    - 循环在没有更多高置信度错误时结束。之后，如果仍有低置信度问题，会询问用户是否转为手动处理。
 * 5. **手动修复模式**:
 *    - 此模式也采用循环，每次都重新扫描文件（并排除用户已忽略的问题）。
 *    - 每次循环都调用 `promptForSingleCommaFix`，向用户展示第一个错误的详细信息和修复预览，
 *      然后根据用户的选择（修复、跳过、全部跳过、中止）执行相应操作。
 * 6. **总结**: 结束时打印操作总结。
 */

import inquirer from 'inquirer';
// 导入核心库
import { color } from '../../lib/colors.js';
import { validateTranslationFiles } from '../../lib/validation.js';
import { promptForCommaFixAction, promptForSingleCommaFix } from '../../lib/prompting.js';
import { identifyHighConfidenceCommaErrors, applySingleCommaFix } from '../../lib/fixing.js';
// 从终端国际化模块导入翻译函数
import { t } from '../../lib/terminal-i18n.js';

/**
 * @function handleCommaCheck
 * @description "检查遗漏逗号"任务的主处理函数。
 * @returns {Promise<void>}
 */
import { ProgressBar } from '../../lib/progress.js';
import { printValidationResults } from '../../lib/validation.js';

/**
 * @function handleCommaCheck
 * @description "检查遗漏逗号"任务的主处理函数。
 * @returns {Promise<void>}
 */
export default async function handleCommaCheck() {
  console.log(color.cyan(t('checkTasks.checkingMissingComma')));

  const progressBar = new ProgressBar({
    format: `${color.cyan('{bar}')} {percentage}% | {value}/{total} | {text}`
  });

  // 1. 初次校验，找出所有潜在的逗号问题。
  // 使用 silent: true 防止打印默认日志，并使用 onProgress 更新进度条
  progressBar.start(0, t('checkTasks.scanning'));

  let initialErrors = await validateTranslationFiles({
    checkMissingComma: true, checkEmpty: false, checkDuplicates: false,
    silent: true,
    onProgress: (current, total, file) => {
      progressBar.total = total; // 确保 total 被正确设置
      progressBar.update(current, `${t('checkTasks.scanning')} ${file}`);
    }
  });

  progressBar.stop(true); // 清除进度条

  if (initialErrors.length === 0) {
    console.log(color.green(t('checkTasks.noMissingCommaFound')));
    return;
  }

  // 手动打印错误信息
  //先把错误按文件分组
  const errorsByFile = {};
  for (const error of initialErrors) {
    if (!errorsByFile[error.file]) {
      errorsByFile[error.file] = [];
    }
    errorsByFile[error.file].push(error);
  }

  // 依次打印每个文件的错误
  for (const [file, errors] of Object.entries(errorsByFile)) {
    printValidationResults(errors, file, { checkMissingComma: true });
  }

  // 2. 询问用户如何处理这些错误。
  const action = await promptForCommaFixAction(initialErrors.length);

  if (action === 'ignore') {
    console.clear();
    console.log(color.yellow(t('checkTasks.ignoreAll')));
    return;
  }

  console.clear();

  // 初始化统计变量
  let totalFixed = 0;
  let totalSkipped = 0;
  let manualMode = false;

  // 3. 如果用户选择自动修复...
  if (action === 'auto-fix') {
    console.clear();
    console.log(color.cyan(t('checkTasks.autoFixingHighConfidence')));
    let fixedInThisPass;
    let autoFixRounds = 0;
    const initialErrorCount = initialErrors.length;

    // 进入迭代修复循环
    do {
      fixedInThisPass = 0;
      autoFixRounds++;
      // 每次循环都重新扫描文件，获取最新的错误状态
      const allCurrentErrors = await validateTranslationFiles({
        checkMissingComma: true, checkEmpty: false, checkDuplicates: false, silent: true
      });
      if (allCurrentErrors.length === 0) break; // 如果没有错误了，就退出循环

      // 识别出高置信度的错误
      const { highConfidenceFixes } = await identifyHighConfidenceCommaErrors(allCurrentErrors);
      if (highConfidenceFixes.length > 0) {
        // 只修复第一个高置信度错误，然后重新开始循环
        await applySingleCommaFix(highConfidenceFixes[0]);
        fixedInThisPass++;
        totalFixed++;
      }

      // 安全阀：为了防止因意外的逻辑错误（例如，修复操作引入了新的、同样高置信度的错误）
      // 导致无限循环，这里设置一个最大修复轮数。如果修复轮数远超初始错误数，则强制中止。
      if (autoFixRounds > initialErrorCount + 5) {
        console.error(color.lightRed('🚨 ' + t('checkTasks.autoFixInfiniteLoop')));
        break;
      }
    } while (fixedInThisPass > 0); // 只要上一轮成功修复了问题，就继续循环

    console.log(color.cyan(t('checkTasks.autoFixComplete', totalFixed)));

    // 自动修复后，再次检查是否还有剩余的（低置信度）错误
    const remainingErrors = await validateTranslationFiles({
      checkMissingComma: true, checkEmpty: false, checkDuplicates: false, silent: true
    });

    if (remainingErrors.length > 0) {
      // 询问用户是否要手动处理这些低置信度错误
      const { continueWithManual } = await inquirer.prompt([{
        type: 'confirm',
        name: 'continueWithManual',
        message: t('checkTasks.continueWithManual', color.yellow(remainingErrors.length)),
        default: true
      }]);
      if (continueWithManual) {
        manualMode = true; // 设置标志，以便后续进入手动模式
      } else {
        totalSkipped = remainingErrors.length;
        console.log(color.yellow(t('checkTasks.skippedLowConfidence')));
      }
    } else if (totalFixed > 0) {
      console.log(color.green(t('checkTasks.allFixedInAuto')));
    }
  }

  // 如果用户最初就选择了手动修复，直接设置标志
  if (action === 'manual-fix') {
    manualMode = true;
  }

  // 4. 如果需要进入手动模式...
  if (manualMode) {
    console.log(color.cyan(t('checkTasks.enteringManualMode')));
    const ignoredPositions = new Set(); // 用于存储用户选择"跳过"的错误位置
    let quit = false;
    while (!quit) {
      console.clear();
      // 每次循环都重新扫描文件，但会忽略用户已选择跳过的问题
      const errors = await validateTranslationFiles({
        checkMissingComma: true, checkEmpty: false, checkDuplicates: false, ignoredPositions, silent: true
      });
      if (errors.length === 0) {
        console.log(color.green(t('checkTasks.allManualFixed')));
        break;
      }
      const errorToFix = errors[0]; // 一次只处理一个错误
      const remaining = errors.length;
      // 弹出预览和选项，让用户决策
      const decision = await promptForSingleCommaFix(errorToFix, remaining);

      // 根据用户决策执行操作
      switch (decision) {
        case 'fix':
          await applySingleCommaFix(errorToFix);
          totalFixed++;
          console.log(color.green(t('checkTasks.fixed')));
          break;
        case 'skip':
          // 将错误位置加入忽略集合，下次扫描时将跳过此错误
          ignoredPositions.add(errorToFix.pos);
          totalSkipped++;
          console.log(color.yellow(t('checkTasks.skipped')));
          break;
        case 'skip-all':
          totalSkipped += remaining;
          quit = true; // 退出循环
          break;
        case 'abort':
          quit = true; // 退出循环
          break;
      }
    }
  }

  // 5. 打印最终的操作总结
  const separator = color.dim(t('validation.separator').replace(/-/g, ''));
  console.log(`\n${separator}`);
  console.log(color.bold(t('checkTasks.operationSummaryTitle')));
  console.log(t('checkTasks.totalFixed', '  - ' + color.green(``), totalFixed));
  if (totalSkipped > 0) {
    console.log(t('checkTasks.totalSkipped', '  - ' + color.yellow(``), totalSkipped));
  }
  console.log(separator);
}