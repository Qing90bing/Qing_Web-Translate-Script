/**
 * @file build-tasks/tasks/check-duplicates.js
 * @description
 * 此任务负责检查并修复翻译文件中的“重复的翻译”问题。
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

/**
 * @function handleDuplicatesCheck
 * @description “检查重复的翻译”任务的主处理函数。
 * @returns {Promise<void>}
 */
export default async function handleDuplicatesCheck() {
  console.log(color.cyan('🔍 开始校验“重复的翻译”问题...'));

  // 1. 调用验证器，只开启重复检查。
  const options = { checkDuplicates: true };
  const allErrors = await validateTranslationFiles(options);

  // 2. 将返回的错误按类型（语法错误、重复错误）进行分类。
  const syntaxErrors = allErrors.filter(e => e.type === 'syntax');
  const duplicateErrors = allErrors.filter(e => e.type === 'multi-duplicate');

  // 3. 优先处理语法错误。
  // 如果存在语法错误，重复检查的结果可能是不可靠的。因此，必须先修复语法问题。
  if (syntaxErrors.length > 0) {
    console.log(color.lightRed('\n🚨 检测到语法错误！必须先解决这些问题才能继续。'));
    // 提示用户修复可自动修复的语法错误。
    const decisions = await promptForSyntaxFix(syntaxErrors);
    if (decisions && decisions.length > 0) {
      await applySyntaxFixes(decisions);
      console.log(color.green('\n✅ 语法修复已应用。建议重新运行检查以确认所有问题已解决。'));
    } else {
      console.log(color.yellow('\n🤷‍ 未进行任何语法修复。操作已停止。'));
    }
    // 中止当前任务，强制用户在修复语法错误后重新运行，以确保在干净的 AST 上进行重复检查。
    return;
  }

  // 4. 如果没有重复错误，则告知用户并退出。
  if (duplicateErrors.length === 0) {
    console.log(color.green('\n✅ 未发现“重复的翻译”问题。'));
    return;
  }

  // 5. 如果存在重复错误，询问用户如何操作。
  const userAction = await promptUserAboutErrors(duplicateErrors, { isFullBuild: false });

  // 6. 根据用户的选择执行相应的修复流程。
  switch (userAction) {
    case 'auto-fix':
      // 自动修复：保留第一个，删除后续所有重复项。
      await fixDuplicatesAutomatically(duplicateErrors);
      console.log(color.green('\n✨ 自动修复完成。建议您重新运行检查。'));
      break;

    case 'manual-fix':
      // 手动修复：让用户逐个选择要保留的版本。
      const decisions = await promptForManualFix(duplicateErrors);
      if (decisions) { // 如果用户没有中途退出手动修复流程
        await applyManualFixes(decisions);
        console.log(color.green('\n🔧 “重复的翻译”问题已通过手动方式修复。'));
      } else {
        console.log(color.yellow('\n🛑 手动修复已中途退出。'));
      }
      break;

    case 'ignore':
      console.log(color.yellow('\n🤷‍ 问题已忽略，未进行任何修复操作。'));
      break;
    case 'cancel':
      console.log(color.dim('\n🛑 操作已取消。'));
      break;
  }
}
