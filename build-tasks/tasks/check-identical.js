/**
 * @file build-tasks/tasks/check-identical.js
 * @description
 * 此任务负责检查并修复翻译文件中“原文与译文相同”的问题。
 * 这种情况通常意味着翻译尚未完成，或者是一个占位符。
 *
 * 工作流程：
 * 1. 调用 `validateTranslationFiles` 并开启 `checkIdentical` 选项，找出所有原文和译文相同的条目。
 * 2. 如果没有问题，则退出。
 * 3. 如果发现问题，调用 `promptUserAboutIdenticalTranslations` 询问用户希望如何处理（自动、手动、忽略）。
 * 4. **自动修复**: 用户可以选择是将所有问题条目**全部移除**，还是将其译文**全部置空** (`""`)。
 *    然后调用 `fixIdenticalAutomatically` 执行此批量操作。
 * 5. **手动修复**:
 *    - 进入一个循环，每次循环都重新校验文件（并忽略用户已选择跳过的问题）。
 *    - 调用 `promptForSingleIdenticalFix`，向用户逐个展示问题条目。
 *    - 用户可以为每个条目选择**修改**（输入新译文）、**移除**、**忽略**、**全部忽略**或**中止**。
 *    - 调用 `applySingleIdenticalFix` 应用用户的单项修复决策。
 * 6. 结束时打印操作总结。
 */

// 导入核心库
import { validateTranslationFiles } from '../lib/validation.js';
import { promptUserAboutIdenticalTranslations, promptForSingleIdenticalFix } from '../lib/prompting.js';
import { fixIdenticalAutomatically, applySingleIdenticalFix } from '../lib/fixing.js';

/**
 * @function handleIdenticalCheck
 * @description “检查原文与译文相同”任务的主处理函数。
 */
export default async function handleIdenticalCheck() {
  console.log('🔍 开始校验“原文与译文相同”文件...');

  // 1. 查找所有原文和译文相同的错误。
  let identicalErrors = await validateTranslationFiles({ checkIdentical: true });
  if (identicalErrors.length === 0) {
      console.log('\n✅ 未发现“原文与译文相同”问题。');
      return;
  }

  // 2. 询问用户希望采取哪种顶层操作。
  const result = await promptUserAboutIdenticalTranslations(identicalErrors);
  if (!result || result.action === 'cancel') {
      console.log('\n🛑 操作已取消。');
      return;
  }

  // 3. 根据用户的顶层选择，执行相应流程。
  if (result.action === 'auto-fix') {
      // 自动修复流程
      await fixIdenticalAutomatically(result.decisions);
  } else if (result.action === 'ignore') {
      // 忽略流程
      console.log('\n🤷‍ 已忽略所有“原文与译文相同”问题。');
  } else if (result.action === 'manual-fix') {
      // 手动修复流程
      console.log('\n🔧 进入手动修复模式...');
      const ignoredPositions = new Set(); // 存储用户选择跳过的问题的起始位置
      let quit = false;
      let totalFixed = 0;
      let totalSkipped = 0;

      while (!quit) {
          // 每次循环都重新扫描，以获取最新的错误列表（并排除已忽略的）
          let currentErrors = await validateTranslationFiles({ checkIdentical: true, ignoredPositions });
          if (currentErrors.length === 0) {
              console.log(totalFixed > 0 ? '\n✅ 所有问题已处理完毕。' : '\n没有需要处理的问题了。');
              break;
          }

          const errorToFix = currentErrors[0]; // 一次处理一个
          // 提示用户对当前错误做出决策
          const decision = await promptForSingleIdenticalFix(errorToFix, currentErrors.length);

          // 根据用户的决策执行操作
          if (decision.action === 'retry') {
              // 如果用户在二次确认时取消了“中止”，则重新尝试当前问题
              continue;
          }
          if (decision.action === 'abort') {
              quit = true;
              continue;
          }
          if (decision.action === 'skip-all') {
              totalSkipped += currentErrors.length;
              quit = true;
              continue;
          }

          if (decision.action === 'skip') {
              // 将问题加入忽略列表
              ignoredPositions.add(errorToFix.node.range[0]);
              totalSkipped++;
              console.log('➡️ 已忽略此问题。正在查找下一个...');
          } else {
              // 应用修复（修改或移除）
              await applySingleIdenticalFix(decision);
              totalFixed++;
              console.log('✅ 已应用修复。正在重新扫描...');
          }
      }

      // 打印手动修复的总结
      console.log('\n----------------------------------------');
      console.log('📋 操作总结:');
      console.log(`  - 总共修复了 ${totalFixed} 个问题。`);
      if (totalSkipped > 0) {
          console.log(`  - 总共忽略了 ${totalSkipped} 个问题。`);
      }
      console.log('----------------------------------------');
  }
}
