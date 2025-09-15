import { validateTranslationFiles } from './validation.js';
import { promptUserAboutIdenticalTranslations, promptForSingleIdenticalFix } from './prompting.js';
import { fixIdenticalAutomatically, applySingleIdenticalFix } from './fixing.js';

export default async function handleIdenticalCheck() {
  console.log('🔍 开始校验“原文与译文相同”文件...');
  let identicalErrors = await validateTranslationFiles({ checkIdentical: true });
  if (identicalErrors.length === 0) {
      console.log('\n✅ 未发现“原文与译文相同”问题。');
      return;
  }

  const result = await promptUserAboutIdenticalTranslations(identicalErrors);
  if (!result || result.action === 'cancel') {
      console.log('\n🛑 操作已取消。');
      return;
  }

  if (result.action === 'auto-fix') {
      await fixIdenticalAutomatically(result.decisions);
  } else if (result.action === 'ignore') {
      console.log('\n🤷‍ 已忽略所有“原文与译文相同”问题。');
  } else if (result.action === 'manual-fix') {
      console.log('\n🔧 进入手动修复模式...');
      const ignoredPositions = new Set();
      let quit = false;
      let totalFixed = 0;
      let totalSkipped = 0;

      while (!quit) {
          let currentErrors = await validateTranslationFiles({ checkIdentical: true, ignoredPositions });
          if (currentErrors.length === 0) {
              console.log(totalFixed > 0 ? '\n✅ 所有问题已处理完毕。' : '\n没有需要处理的问题了。');
              break;
          }

          const errorToFix = currentErrors[0];
          const decision = await promptForSingleIdenticalFix(errorToFix, currentErrors.length);

          if (decision.action === 'retry') {
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
              ignoredPositions.add(errorToFix.node.range[0]);
              totalSkipped++;
              console.log('➡️  已忽略此问题。正在查找下一个...');
          } else {
              await applySingleIdenticalFix(decision);
              totalFixed++;
              console.log('✅ 已应用修复。正在重新扫描...');
          }
      }

      console.log('\n----------------------------------------');
      console.log('📋 操作总结:');
      console.log(`  - 总共修复了 ${totalFixed} 个问题。`);
      if (totalSkipped > 0) {
          console.log(`  - 总共忽略了 ${totalSkipped} 个问题。`);
      }
      console.log('----------------------------------------');
  }
}
