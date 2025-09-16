/**
 * @file build-tasks/tasks/check-empty.js
 * @description
 * 此任务负责检查并修复翻译文件中的“空翻译”问题（即 `["原文", ""]` 这样的条目）。
 *
 * **核心工作流程**:
 * 1. **语法预检**: 与其他检查任务类似，首先进行语法检查。如果发现语法错误，
 *    任务将中止并提示用户先修复语法问题，以保证后续检查的准确性。
 * 2. **空翻译检查**: 调用 `validateTranslationFiles` 并开启 `checkEmpty` 选项，找出所有错误。
 * 3. 如果没有发现错误，则退出。
 * 4. 如果发现错误，调用 `promptUserAboutErrors` 询问用户如何处理。
 * 5. 对于“空翻译”问题，不存在“自动修复”的可能，因为程序无法猜测正确的译文。
 *    因此，唯一的修复选项是“手动修复”，即逐个为问题词条输入新译文。
 */

// 导入核心库
import path from 'path';
import { color } from '../../lib/colors.js';
import { validateTranslationFiles } from '../../lib/validation.js';
import { promptUserAboutErrors, promptForSingleEmptyTranslationFix, promptForSyntaxFix } from '../../lib/prompting.js';
import { applySingleEmptyTranslationFix, applySyntaxFixes } from '../../lib/fixing.js';

/**
 * @function handleEmptyCheck
 * @description “检查空翻译”任务的主处理函数。
 * @returns {Promise<void>}
 */
export default async function handleEmptyCheck() {
  console.log(color.cyan('🔍 开始校验“空翻译”问题...'));

  // 1. 调用验证器，只开启空翻译检查。
  const options = { checkEmpty: true };
  const allErrors = await validateTranslationFiles(options);

  // 2. 将返回的错误按类型分类。
  const syntaxErrors = allErrors.filter(e => e.type === 'syntax');
  const emptyErrors = allErrors.filter(e => e.type === 'empty-translation');

  // 3. 优先处理语法错误。
  if (syntaxErrors.length > 0) {
    console.log(color.lightRed('\n🚨 检测到语法错误！必须先解决这些问题才能继续。'));
    const decisions = await promptForSyntaxFix(syntaxErrors);
    if (decisions && decisions.length > 0) {
      await applySyntaxFixes(decisions);
      console.log(color.green('\n✅ 语法修复已应用。建议重新运行检查以确认所有问题已解决。'));
    } else {
      console.log(color.yellow('\n🤷‍ 未进行任何语法修复。操作已停止。'));
    }
    // 中止任务，强制用户在修复语法错误后重新运行。
    return;
  }

  // 4. 如果没有空翻译错误，则告知用户并退出。
  if (emptyErrors.length === 0) {
    console.log(color.green('\n✅ 未发现“空翻译”问题。'));
    return;
  }

  // 5. 如果存在空翻译错误，询问用户如何操作。
  // 注意：对于空翻译，唯一真正的选项是手动修复或忽略。
  const userAction = await promptUserAboutErrors(emptyErrors, { isFullBuild: false });
  
  let totalFixed = 0;
  let totalSkipped = 0;

  // 6. 根据用户的选择执行操作。
  switch (userAction) {
    case 'manual-fix':
      console.log(color.cyan('\n🔧 进入手动修复模式...'));
      const ignoredPositions = new Set();
      let quit = false;

      while (!quit) {
        // 每次循环都重新校验，以获取最新的错误列表，并排除已忽略的
        const currentErrors = (await validateTranslationFiles({ checkEmpty: true, ignoredPositions }))
          .filter(e => e.type === 'empty-translation');

        if (currentErrors.length === 0) {
          console.log(color.green('\n✅ 所有“空翻译”问题已处理完毕。'));
          break;
        }

        const errorToFix = currentErrors[0];
        const remaining = currentErrors.length;
        
        // 提示用户对单个问题进行操作
        const decision = await promptForSingleEmptyTranslationFix(errorToFix, remaining);

        switch (decision.action) {
          case 'fix':
            await applySingleEmptyTranslationFix({ error: errorToFix, newTranslation: decision.newTranslation });
            totalFixed++;
            console.log(color.green('  -> ✅ 已应用修复并保存。正在重新扫描...'));
            break;
          case 'skip':
            ignoredPositions.add(errorToFix.pos);
            totalSkipped++;
            console.log(color.yellow('  -> ➡️ 已跳过此问题。正在查找下一个...'));
            break;
          case 'skip-all':
            totalSkipped += remaining;
            quit = true;
            break;
          case 'abort':
            quit = true;
            break;
          case 'retry':
            // 不做任何事，循环将再次处理同一个错误
            break;
        }
      }
      break;

    case 'ignore':
      totalSkipped = emptyErrors.length;
      console.log(color.yellow('\n🤷‍ 问题已忽略，未进行任何修复操作。'));
      break;
    case 'cancel':
      console.log(color.dim('\n🛑 操作已取消。'));
      break;

    case 'auto-fix': // `promptUserAboutErrors` 可能会显示此选项（如果混合了其他错误类型），但它不适用于此任务。
    default:
      console.log(color.yellow('\n🤷‍ 无适用操作，已忽略问题。'));
      break;
  }

  // 7. 打印最终的操作总结
  if (totalFixed > 0 || totalSkipped > 0) {
    const separator = color.dim('----------------------------------------');
    console.log(`\n${separator}`);
    console.log(color.bold('📋 操作总结:'));
    if (totalFixed > 0) {
      console.log(`  - ${color.green(`总共修复了 ${totalFixed} 个问题。`)}`);
    }
    if (totalSkipped > 0) {
      console.log(`  - ${color.yellow(`总共跳过了 ${totalSkipped} 个问题。`)}`);
    }
    console.log(separator);
  }
}
