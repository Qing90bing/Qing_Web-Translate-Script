/**
 * @file build-tasks/tasks/check-empty.js
 * @description
 * 此任务负责检查并修复翻译文件中的"空翻译"问题（即 `["原文", ""]` 这样的条目）。
 *
 * **核心工作流程**:
 * 1. **语法预检**: 与其他检查任务类似，首先进行语法检查。如果发现语法错误，
 *    任务将中止并提示用户先修复语法问题，以保证后续检查的准确性。
 * 2. **空翻译检查**: 调用 `validateTranslationFiles` 并开启 `checkEmpty` 选项，找出所有错误。
 * 3. 如果没有发现错误，则退出。
 * 4. 如果发现错误，调用 `promptUserAboutErrors` 询问用户如何处理。
 * 5. 对于"空翻译"问题，不存在"自动修复"的可能，因为程序无法猜测正确的译文。
 *    因此，唯一的修复选项是"手动修复"。
 * 6. **手动修复模式**:
 *    - 采用**迭代修复**策略，进入一个循环，每次循环都重新扫描文件（并排除用户已忽略的问题）。
 *    - 每次循环都调用 `promptForSingleEmptyTranslationFix`，向用户展示第一个错误的详细信息。
 *    - 根据用户的选择（修复、跳过、全部跳过、中止）执行相应操作。
 *    - 修复操作是立即生效的，因此下一次循环的扫描将基于最新的文件内容，确保处理流程的健壮性。
 * 7. **总结**: 结束时打印操作总结。
 */

// 导入核心库
import path from 'path';
import { color } from '../../lib/colors.js';
import { validateTranslationFiles } from '../../lib/validation.js';
import { promptUserAboutErrors, promptForSingleEmptyTranslationFix, promptForSyntaxFix } from '../../lib/prompting.js';
import { applySingleEmptyTranslationFix, applySyntaxFixes } from '../../lib/fixing.js';
// 从终端国际化模块导入翻译函数
import { t } from '../../lib/terminal-i18n.js';

/**
 * @function handleEmptyCheck
 * @description "检查空翻译"任务的主处理函数。
 * @returns {Promise<void>}
 */
export default async function handleEmptyCheck() {
  console.log(color.cyan(t('checkTasks.checkingEmpty')));

  // 1. 调用验证器，只开启空翻译检查。
  const options = { checkEmpty: true };
  const allErrors = await validateTranslationFiles(options);

  // 2. 将返回的错误按类型分类。
  const syntaxErrors = allErrors.filter(e => e.type === 'syntax');
  const emptyErrors = allErrors.filter(e => e.type === 'empty-translation');

  // 3. 优先处理语法错误，因为语法错误会影响 AST 的准确性。
  if (syntaxErrors.length > 0) {
    console.log(color.lightRed(t('checkTasks.syntaxErrorDetected')));
    const decisions = await promptForSyntaxFix(syntaxErrors);
    if (decisions && decisions.length > 0) {
      await applySyntaxFixes(decisions);
      console.log(color.green(t('checkTasks.syntaxFixApplied')));
    } else {
      console.log(color.yellow(t('checkTasks.noSyntaxFix')));
    }
    // 中止任务，强制用户在修复语法错误后重新运行。
    return;
  }

  // 4. 如果没有空翻译错误，则告知用户并退出。
  if (emptyErrors.length === 0) {
    console.log(color.green(t('checkTasks.noEmptyFound')));
    return;
  }

  // 5. 如果存在空翻译错误，询问用户如何操作。
  // 注意：对于空翻译，唯一真正的选项是手动修复或忽略。
  const userAction = await promptUserAboutErrors(emptyErrors, { isFullBuild: false });
  
  // 初始化统计变量
  let totalFixed = 0;
  let totalSkipped = 0;

  // 6. 根据用户的选择执行操作。
  switch (userAction) {
    case 'manual-fix':
      console.log(color.cyan(t('checkTasks.enteringManualModeEmpty')));
      // ignoredPositions 用于存储用户选择"跳过"的错误位置的集合。
      // Set 数据结构可以确保每个位置只被记录一次，并提供高效的查找。
      const ignoredPositions = new Set();
      let quit = false;

      // 进入迭代式手动修复循环
      while (!quit) {
        // 每次循环都重新校验，以获取最新的错误列表，并排除已忽略的。
        // 这种方式确保了每次处理的都是当前文件状态下的第一个错误。
        const currentErrors = (await validateTranslationFiles({ checkEmpty: true, ignoredPositions }))
          .filter(e => e.type === 'empty-translation');

        // 如果没有更多（未被忽略的）错误，则退出循环。
        if (currentErrors.length === 0) {
          console.log(color.green(t('checkTasks.allEmptyFixed')));
          break;
        }

        const errorToFix = currentErrors[0]; // 每次只处理列表中的第一个错误。
        const remaining = currentErrors.length;
        
        // 提示用户对单个问题进行操作，并等待其决策。
        const decision = await promptForSingleEmptyTranslationFix(errorToFix, remaining);

        switch (decision.action) {
          case 'fix':
            // 如果用户选择修复，则调用修复函数立即应用更改。
            await applySingleEmptyTranslationFix({ error: errorToFix, newTranslation: decision.newTranslation });
            totalFixed++;
            console.log(color.green(t('checkTasks.emptyFixed')));
            break;
          case 'skip':
            // 如果用户选择跳过，则将该错误的位置添加到忽略集合中。
            // `errorToFix.pos` 是该错误在文件中的起始字符索引，是一个唯一的标识符。
            ignoredPositions.add(errorToFix.pos);
            totalSkipped++;
            console.log(color.yellow(t('checkTasks.emptySkipped')));
            break;
          case 'skip-all':
            // 如果用户选择全部跳过，则记录剩余所有错误为已跳过，并设置退出标志。
            totalSkipped += remaining;
            quit = true;
            break;
          case 'abort':
            // 如果用户选择中止，直接设置退出标志。
            quit = true;
            break;
          case 'retry':
            // 如果用户在确认中止时选择了“否”，prompting 模块会返回 'retry'。
            // 在这种情况下，我们什么都不做，循环将自然地在下一次迭代中重新处理同一个错误。
            break;
        }
      }
      break;

    case 'ignore':
      totalSkipped = emptyErrors.length;
      console.log(color.yellow(t('checkTasks.emptyIssuesIgnored')));
      break;
    case 'cancel':
      console.log(color.dim(t('checkTasks.operationCancelled')));
      break;

    // `promptUserAboutErrors` 可能会显示 'auto-fix' 选项（如果混合了其他错误类型），但它不适用于此任务。
    case 'auto-fix':
    default:
      console.log(color.yellow(t('checkTasks.noApplicableAction')));
      break;
  }

  // 7. 打印最终的操作总结
  if (totalFixed > 0 || totalSkipped > 0) {
    const separator = color.dim(t('validation.separator').replace(/-/g, ''));
    console.log(`\n${separator}`);
    console.log(color.bold(t('checkTasks.operationSummaryTitle')));
    if (totalFixed > 0) {
      console.log(t('checkTasks.totalFixed', '  - ' + color.green(``), totalFixed));
    }
    if (totalSkipped > 0) {
      console.log(t('checkTasks.totalSkipped', '  - ' + color.yellow(``), totalSkipped));
    }
    console.log(separator);
  }
}