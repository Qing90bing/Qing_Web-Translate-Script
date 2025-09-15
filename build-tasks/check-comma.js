import inquirer from 'inquirer';
import { validateTranslationFiles } from './validation.js';
import { promptForCommaFixAction, promptForSingleCommaFix } from './prompting.js';
import { identifyHighConfidenceCommaErrors, applySingleCommaFix } from './fixing.js';

export default async function handleCommaCheck() {
  console.log('🔍 开始检查“遗漏逗号”问题...');

  let initialErrors = await validateTranslationFiles({
    checkMissingComma: true, checkEmpty: false, checkDuplicates: false
  });

  if (initialErrors.length === 0) {
    console.log('\n✅ 未发现可能的“遗漏逗号”问题。');
    return;
  }

  const action = await promptForCommaFixAction(initialErrors.length);

  if (action === 'ignore') {
    console.log('\n🤷‍ 已忽略所有问题。');
    return;
  }

  let totalFixed = 0;
  let totalSkipped = 0;
  let manualMode = false;

  if (action === 'auto-fix') {
    console.log('\n🤖 正在以迭代方式自动修复高置信度问题...');
    let fixedInThisPass;
    let autoFixRounds = 0;
    const initialErrorCount = initialErrors.length;
    do {
      fixedInThisPass = 0;
      autoFixRounds++;
      const allCurrentErrors = await validateTranslationFiles({
        checkMissingComma: true, checkEmpty: false, checkDuplicates: false
      });
      if (allCurrentErrors.length === 0) break;

      const { highConfidenceFixes } = await identifyHighConfidenceCommaErrors(allCurrentErrors);
      if (highConfidenceFixes.length > 0) {
        await applySingleCommaFix(highConfidenceFixes[0]);
        fixedInThisPass++;
        totalFixed++;
      }
      if (autoFixRounds > initialErrorCount + 5) {
          console.error('🚨 自动修复似乎进入了无限循环，已中止。');
          break;
      }
    } while (fixedInThisPass > 0);

    console.log(`...自动修复完成，共修复了 ${totalFixed} 个问题。`);

    const remainingErrors = await validateTranslationFiles({
      checkMissingComma: true, checkEmpty: false, checkDuplicates: false
    });

    if (remainingErrors.length > 0) {
      const { continueWithManual } = await inquirer.prompt([{
          type: 'confirm',
          name: 'continueWithManual',
          message: `\n仍有 ${remainingErrors.length} 个低置信度问题未解决，您想现在手动处理它们吗？`,
          default: true
      }]);
      if (continueWithManual) {
        manualMode = true;
      } else {
        totalSkipped = remainingErrors.length;
        console.log('\n🤷‍ 已跳过剩余的低置信度问题。');
      }
    } else if (totalFixed > 0) {
        console.log('\n✅ 所有问题已在自动修复阶段处理完毕。');
    }
  }

  if (action === 'manual-fix') {
    manualMode = true;
  }

  if (manualMode) {
    console.log('\n🔧 进入手动修复模式...');
    const ignoredPositions = new Set();
    let quit = false;
    while (!quit) {
      const errors = await validateTranslationFiles({
        checkMissingComma: true, checkEmpty: false, checkDuplicates: false, ignoredPositions
      });
      if (errors.length === 0) {
        console.log('\n✅ 所有手动修复问题已处理完毕。');
        break;
      }
      const errorToFix = errors[0];
      const remaining = errors.length;
      const decision = await promptForSingleCommaFix(errorToFix, remaining);
      switch (decision) {
        case 'fix':
          await applySingleCommaFix(errorToFix);
          totalFixed++;
          console.log('✅ 已应用修复。正在重新扫描...');
          break;
        case 'skip':
          ignoredPositions.add(errorToFix.pos);
          totalSkipped++;
          console.log('➡️  已跳过此问题。正在查找下一个...');
          break;
        case 'skip-all':
          totalSkipped += remaining;
          quit = true;
          break;
        case 'abort':
          quit = true;
          break;
      }
    }
  }
  console.log('\n----------------------------------------');
  console.log('📋 操作总结:');
  console.log(`  - 总共修复了 ${totalFixed} 个问题。`);
  if (totalSkipped > 0) {
    console.log(`  - 总共跳过了 ${totalSkipped} 个问题。`);
  }
  console.log('----------------------------------------');
}
