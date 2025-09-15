/**
 * @file build-tasks/tasks/check-comma.js
 * @description
 * 此任务负责检查并修复翻译文件中“可能遗漏的逗号”问题。
 * 这是所有检查任务中最复杂的一个，因为它结合了自动修复和手动修复两种模式。
 *
 * 工作流程：
 * 1. 调用 `validateTranslationFiles` 找出所有可能的逗号遗漏问题。
 * 2. 如果没有问题，则退出。
 * 3. 如果有问题，调用 `promptForCommaFixAction` 询问用户是想自动修复、手动修复还是忽略。
 * 4. **自动修复模式**:
 *    - 进入一个循环，每次循环都重新校验文件。
 *    - 调用 `identifyHighConfidenceCommaErrors` 将问题分为“高置信度”和“低置信度”。
 *    - 对第一个“高置信度”问题应用修复 `applySingleCommaFix`。
 *    - 重复此过程，直到没有高置信度问题为止。这种迭代式修复是为了处理修复一个问题后可能出现的连锁反应。
 *    - 自动修复后，如果仍有（低置信度）问题，会询问用户是否进入手动模式。
 * 5. **手动修复模式**:
 *    - 进入一个循环，每次循环都重新校验文件。
 *    - 调用 `promptForSingleCommaFix`，向用户展示第一个错误的详细信息和修复预览。
 *    - 根据用户的选择（修复、跳过、全部跳过、中止）执行相应操作。
 * 6. 结束时打印操作总结。
 */

import inquirer from 'inquirer';
// 导入核心库
import { color } from '../lib/colors.js';
import { validateTranslationFiles } from '../lib/validation.js';
import { promptForCommaFixAction, promptForSingleCommaFix } from '../lib/prompting.js';
import { identifyHighConfidenceCommaErrors, applySingleCommaFix } from '../lib/fixing.js';

/**
 * @function handleCommaCheck
 * @description “检查遗漏逗号”任务的主处理函数。
 */
export default async function handleCommaCheck() {
  console.log(color.cyan('🔍 开始检查“遗漏逗号”问题...'));

  // 1. 初次校验，找出所有潜在的逗号问题。
  let initialErrors = await validateTranslationFiles({
    checkMissingComma: true, checkEmpty: false, checkDuplicates: false
  });

  if (initialErrors.length === 0) {
    console.log(color.green('\n✅ 未发现可能的“遗漏逗号”问题。'));
    return;
  }

  // 2. 询问用户如何处理这些错误。
  const action = await promptForCommaFixAction(initialErrors.length);

  if (action === 'ignore') {
    console.log(color.yellow('\n🤷‍ 已忽略所有问题。'));
    return;
  }

  // 初始化统计变量
  let totalFixed = 0;
  let totalSkipped = 0;
  let manualMode = false;

  // 3. 如果用户选择自动修复...
  if (action === 'auto-fix') {
    console.log(color.cyan('\n🤖 正在以迭代方式自动修复高置信度问题...'));
    let fixedInThisPass;
    let autoFixRounds = 0;
    const initialErrorCount = initialErrors.length;

    // 进入迭代修复循环
    do {
      fixedInThisPass = 0;
      autoFixRounds++;
      // 每次循环都重新扫描文件，获取最新的错误状态
      const allCurrentErrors = await validateTranslationFiles({
        checkMissingComma: true, checkEmpty: false, checkDuplicates: false
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

      // 安全阀：防止因意外逻辑导致无限循环
      if (autoFixRounds > initialErrorCount + 5) {
          console.error(color.lightRed('🚨 自动修复似乎进入了无限循环，已中止。'));
          break;
      }
    } while (fixedInThisPass > 0); // 只要上一轮成功修复了问题，就继续循环

    console.log(color.cyan(`...自动修复完成，共修复了 ${color.bold(totalFixed)} 个问题。`));

    // 自动修复后，再次检查是否还有剩余的（低置信度）错误
    const remainingErrors = await validateTranslationFiles({
      checkMissingComma: true, checkEmpty: false, checkDuplicates: false
    });

    if (remainingErrors.length > 0) {
      // 询问用户是否要手动处理这些低置信度错误
      const { continueWithManual } = await inquirer.prompt([{
          type: 'confirm',
          name: 'continueWithManual',
          message: `\n仍有 ${color.yellow(remainingErrors.length)} 个低置信度问题未解决，您想现在手动处理它们吗？`,
          default: true
      }]);
      if (continueWithManual) {
        manualMode = true; // 设置标志，以便后续进入手动模式
      } else {
        totalSkipped = remainingErrors.length;
        console.log(color.yellow('\n🤷‍ 已跳过剩余的低置信度问题。'));
      }
    } else if (totalFixed > 0) {
        console.log(color.green('\n✅ 所有问题已在自动修复阶段处理完毕。'));
    }
  }

  // 如果用户最初就选择了手动修复，直接设置标志
  if (action === 'manual-fix') {
    manualMode = true;
  }

  // 4. 如果需要进入手动模式...
  if (manualMode) {
    console.log(color.cyan('\n🔧 进入手动修复模式...'));
    const ignoredPositions = new Set(); // 用于存储用户选择“跳过”的错误位置
    let quit = false;
    while (!quit) {
      // 每次循环都重新扫描文件，但会忽略用户已选择跳过的问题
      const errors = await validateTranslationFiles({
        checkMissingComma: true, checkEmpty: false, checkDuplicates: false, ignoredPositions
      });
      if (errors.length === 0) {
        console.log(color.green('\n✅ 所有手动修复问题已处理完毕。'));
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
          console.log(color.green('✅ 已应用修复。正在重新扫描...'));
          break;
        case 'skip':
          // 将错误位置加入忽略集合，下次扫描时将跳过此错误
          ignoredPositions.add(errorToFix.pos);
          totalSkipped++;
          console.log(color.yellow('➡️ 已跳过此问题。正在查找下一个...'));
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
  const separator = color.dim('----------------------------------------');
  console.log(`\n${separator}`);
  console.log(color.bold('📋 操作总结:'));
  console.log(`  - ${color.green(`总共修复了 ${totalFixed} 个问题。`)}`);
  if (totalSkipped > 0) {
    console.log(`  - ${color.yellow(`总共跳过了 ${totalSkipped} 个问题。`)}`);
  }
  console.log(separator);
}
