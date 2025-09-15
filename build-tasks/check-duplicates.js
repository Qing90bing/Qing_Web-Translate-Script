import { validateTranslationFiles } from './validation.js';
import { promptUserAboutErrors, promptForManualFix, promptForSyntaxFix } from './prompting.js';
import { fixDuplicatesAutomatically, applyManualFixes, applySyntaxFixes } from './fixing.js';

export default async function handleDuplicatesCheck() {
  console.log('🔍 开始校验“重复原文”问题...');
  const options = { checkDuplicates: true };
  const allErrors = await validateTranslationFiles(options);

  const syntaxErrors = allErrors.filter(e => e.type === 'syntax');
  const duplicateErrors = allErrors.filter(e => e.type === 'multi-duplicate');

  if (syntaxErrors.length > 0) {
    console.log('\n🚨 检测到语法错误！必须先解决这些问题才能继续。');
    const decisions = await promptForSyntaxFix(syntaxErrors);
    if (decisions && decisions.length > 0) {
      await applySyntaxFixes(decisions);
      console.log('\n✅ 语法修复已应用。建议重新运行检查以确认所有问题已解决。');
    } else {
      console.log('\n🤷‍ 未进行任何语法修复。操作已停止。');
    }
    return; // Stop execution, force user to re-run
  }

  if (duplicateErrors.length === 0) {
    console.log('\n✅ 未发现“重复原文”问题。');
    return;
  }

  const userAction = await promptUserAboutErrors(duplicateErrors, { isFullBuild: false });

  switch (userAction) {
    case 'auto-fix':
      await fixDuplicatesAutomatically(duplicateErrors);
      console.log('\n✅ 自动修复完成。建议您重新运行检查。');
      break;

    case 'manual-fix':
      const decisions = await promptForManualFix(duplicateErrors);
      if (decisions) {
        await applyManualFixes(decisions);
        console.log('\n✅ “重复原文”问题已通过手动方式修复。');
      }
      console.log('\n✅ 手动修复流程完成。');
      break;

    case 'ignore':
      console.log('\n⚠️ 问题已忽略，未进行任何修复操作。');
      break;
    case 'cancel':
      console.log('\n🛑 操作已取消。');
      break;
  }
}
