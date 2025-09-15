import { validateTranslationFiles } from './validation.js';
import { promptUserAboutErrors, promptForEmptyTranslationFix, promptForSyntaxFix } from './prompting.js';
import { applyEmptyTranslationFixes, applySyntaxFixes } from './fixing.js';

export default async function handleEmptyCheck() {
  console.log('🔍 开始校验“空翻译”问题...');
  const options = { checkEmpty: true };
  const allErrors = await validateTranslationFiles(options);

  const syntaxErrors = allErrors.filter(e => e.type === 'syntax');
  const emptyErrors = allErrors.filter(e => e.type === 'empty-translation');

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

  if (emptyErrors.length === 0) {
    console.log('\n✅ 未发现“空翻译”问题。');
    return;
  }

  // For empty translations, the only real option is manual fix or ignore.
  const userAction = await promptUserAboutErrors(emptyErrors, { isFullBuild: false });

  switch (userAction) {
    case 'manual-fix':
      const decisions = await promptForEmptyTranslationFix(emptyErrors);
      await applyEmptyTranslationFixes(decisions);
      console.log('\n✅ “空翻译”问题已通过手动方式修复。');
      break;

    case 'ignore':
      console.log('\n⚠️ 问题已忽略，未进行任何修复操作。');
      break;
    case 'cancel':
      console.log('\n🛑 操作已取消。');
      break;

    case 'auto-fix': // This option might be shown by the prompter, but it doesn't apply here.
    default:
      console.log('\n🤷‍ 无适用操作，已忽略问题。');
      break;
  }
}
