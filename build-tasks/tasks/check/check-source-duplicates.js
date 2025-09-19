/**
 * @file build-tasks/tasks/check/check-source-duplicates.js
 * @description
 * 此任务负责检查并修复翻译文件中的"原文重复"问题。
 *
 * **核心工作流程**:
 * 1. **语法预检**: 首先调用 `validateTranslationFiles` 检查所有文件是否存在语法错误。
 *    如果存在，会优先处理语法修复，然后中止任务。这是因为语法错误会破坏 AST 的准确性，
 *    导致后续的重复检查结果不可靠。用户必须在修复语法问题后重新运行此任务。
 * 2. **原文重复检查**: 调用 `validateTranslationFiles` 并开启 `checkSourceDuplicates` 选项，找出所有错误。
 * 3. 如果没有发现原文重复错误，则退出。
 * 4. 如果发现原文重复错误，调用 `promptUserAboutErrors` 询问用户如何处理（自动、手动、忽略、取消）。
 * 5. 根据用户的选择：
 *    - **手动修复**: 调用 `promptForSourceDuplicateManualFix` 让用户为每组重复选择要保留的条目，然后调用 `applySourceDuplicateManualFixes` 应用用户的选择。
 *    - **忽略/取消**: 打印信息并退出。
 */

// 导入核心库
import { color } from '../../lib/colors.js';
import { validateTranslationFiles } from '../../lib/validation.js';
import { promptUserAboutErrors, promptForSyntaxFix, promptForSourceDuplicateManualFixImmediate } from '../../lib/prompting.js';
import { applySyntaxFixes, fixSourceDuplicatesAutomatically, applySourceDuplicateManualFixes } from '../../lib/fixing.js';

/**
 * @function handleSourceDuplicatesCheck
 * @description "检查原文重复"任务的主处理函数。
 * @returns {Promise<void>}
 */
export default async function handleSourceDuplicatesCheck() {
  console.log(color.cyan('🔍 开始校验"原文重复"问题...'));

  // 1. 调用验证器，只开启原文重复检查。
  const options = { checkSourceDuplicates: true };
  const allErrors = await validateTranslationFiles(options);

  // 2. 将返回的错误按类型（语法错误、原文重复错误）进行分类。
  const syntaxErrors = allErrors.filter(e => e.type === 'syntax');
  const sourceDuplicateErrors = allErrors.filter(e => e.type === 'source-duplicate');

  // 3. 优先处理语法错误。
  // 如果存在语法错误，原文重复检查的结果可能是不可靠的。因此，必须先修复语法问题。
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

  // 4. 如果没有原文重复错误，则告知用户并退出。
  if (sourceDuplicateErrors.length === 0) {
    console.log(color.green('\n✅ 未发现"原文重复"问题。'));
    return;
  }

  // 5. 如果存在原文重复错误，询问用户如何操作。
  const userAction = await promptUserAboutErrors(sourceDuplicateErrors, { isFullBuild: false, isSourceDuplicate: true });

  // 6. 根据用户的选择执行相应的修复流程。
  switch (userAction) {
    case 'auto-fix-source':
      // 自动修复：保留每组重复中的第一个版本，删除其他版本。
      await fixSourceDuplicatesAutomatically(sourceDuplicateErrors);
      console.log(color.green('\n🔧 "原文重复"问题已通过自动方式修复。'));
      break;

    case 'manual-fix-immediate':
      // 手动修复（立即保存）：让用户逐个选择要保留的版本，每次选择后立即保存。
      // 创建重新验证函数，用于在每次修复后重新检查文件
      const revalidateFunction = async () => {
        return await validateTranslationFiles({ checkSourceDuplicates: true });
      };
      
      const fixedCount = await promptForSourceDuplicateManualFixImmediate(
        sourceDuplicateErrors, 
        applySourceDuplicateManualFixes, 
        revalidateFunction
      );
      if (fixedCount > 0) {
        console.log(color.green(`\n✨ 总共即时修复了 ${fixedCount} 个"原文重复"问题。`));
      } else {
        console.log(color.yellow('\n🤷‍ 没有进行任何修复操作。'));
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