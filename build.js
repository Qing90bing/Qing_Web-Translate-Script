/**
 * @file build.js
 * @description
 * 本脚本是为“网页翻译”油猴脚本项目量身定制的构建工具。
 *
 * 它执行以下核心任务：
 * 1. **校验(Validation)**：在构建前，首先扫描 `src/translations` 目录下的所有翻译文件，
 *    检查是否存在格式错误或重复的翻译条目。
 * 2. **交互(Interaction)**：如果发现错误，会通过一个用户友好的命令行菜单提示用户，
 *    让用户选择自动修复、手动修复、忽略错误或取消构建。
 * 3. **修复(Fixing)**：根据用户的选择，执行相应的修复操作，清理源文件。
 * 4. **打包(Bundling)**：使用 `esbuild` 将 `src/main.js` 作为入口，把所有相关的
 *    JavaScript 模块打包成一个文件。
 * 5. **整合(Integration)**：读取油猴脚本的头部信息（`src/header.txt`），并将其与
 *    打包后的代码整合成最终的 `.user.js` 文件。
 * 6. **输出(Output)**：将最终生成的脚本文件输出到 `dist` 文件夹中，并进行定制化
 *    的格式处理（移除注释和空白行，但保持可读性）。
 * 
 * ---
 * 如何使用:
 * 1. 确保你已经安装了 Node.js 和 npm。
 * 2. 在终端里进入这个项目所在的文件夹。
 * 3. 运行 `npm install` 来安装依赖。
 * 4. 运行 `node build.js` 来执行此脚本。
 * ---
 * 
 */

import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import inquirer from 'inquirer';
import { validateTranslationFiles } from './scripts/validator.js';
import { 
  promptUserAboutErrors, 
  promptForManualFix, 
  promptForEmptyTranslationFix,
  promptToPreserveFormatting,
  promptForSyntaxFix,
  promptForCommaFixAction,
  promptForSingleCommaFix
} from './scripts/prompter.js';
import { 
  applyManualFixes, 
  fixDuplicatesAutomatically,
  applyEmptyTranslationFixes,
  applySyntaxFixes,
  identifyHighConfidenceCommaErrors,
  applySingleCommaFix
} from './scripts/fixer.js';

/**
 * 暂停执行，等待用户按下任意键继续。
 */
async function pressAnyKeyToContinue() {
  console.log('\n');
  await inquirer.prompt({
    type: 'input',
    name: 'key',
    message: '✅ 操作完成。按回车键返回主菜单...',
  });
}

/**
 * 处理特定的校验和修复流程。
 * @param {object} options - 校验选项。
 * @param {boolean} [options.checkEmpty=false] - 是否检查空翻译。
 * @param {boolean} [options.checkDuplicates=false] - 是否检查重复原文。
 */
async function handleCheck(options) {
  console.log('🔍 开始校验翻译文件...');
  const allErrors = await validateTranslationFiles(options);

  const syntaxErrors = allErrors.filter(e => e.type === 'syntax');
  const otherErrors = allErrors.filter(e => e.type !== 'syntax');

  if (syntaxErrors.length > 0) {
    console.log('\n🚨 检测到语法错误！必须先解决这些问题才能继续。');
    const decisions = await promptForSyntaxFix(syntaxErrors);
    if (decisions && decisions.length > 0) {
      await applySyntaxFixes(decisions);
      console.log('\n✅ 语法修复已应用。建议重新运行检查以确认所有问题已解决。');
    } else {
      console.log('\n🤷‍ 未进行任何语法修复。操作已停止。');
    }
    return; // 停止执行，强制用户重新运行
  }

  if (otherErrors.length === 0) {
    console.log('\n✅ 未发现相关问题。');
    return;
  }

  const userAction = await promptUserAboutErrors(otherErrors, { isFullBuild: false });

  switch (userAction) {
    case 'auto-fix':
      // 自动修复仅适用于重复项
      const duplicatesToAutoFix = otherErrors.filter(e => e.type === 'multi-duplicate');
      await fixDuplicatesAutomatically(duplicatesToAutoFix);
      console.log('\n✅ 自动修复完成。建议您重新运行检查。');
      break;
    
    case 'manual-fix':
      if (options.checkDuplicates) {
        const duplicateErrors = otherErrors.filter(e => e.type === 'multi-duplicate');
        if (duplicateErrors.length > 0) {
          const decisions = await promptForManualFix(duplicateErrors);
          if (decisions) {
            await applyManualFixes(decisions);
            console.log('\n✅ “重复原文”问题已修复。');
          }
        }
      }
      if (options.checkEmpty) {
        console.log('\n🔄 重新校验“空翻译”问题...');
        const validationResult = await validateTranslationFiles({ checkEmpty: true, checkDuplicates: false });
        // 此时不应再有语法错误，但以防万一
        const emptyErrors = validationResult.filter(e => e.type === 'empty-translation');
        
        if (emptyErrors.length > 0) {
           console.log(`\n发现 ${emptyErrors.length} 个“空翻译”问题，现在开始处理...`);
          const decisions = await promptForEmptyTranslationFix(emptyErrors);
          await applyEmptyTranslationFixes(decisions);
        } else {
            console.log('\n✅ 未发现“空翻译”问题。');
        }
      }
      console.log('\n✅ 手动修复流程完成。');
      break;

    case 'ignore':
      console.log('\n⚠️  问题已忽略，未进行任何修复操作。');
      break;
    case 'cancel':
      console.log('\n🛑 操作已取消。');
      break;
  }
}

async function handleMissingCommaCheck() {
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

/**
 * 运行完整的构建流程，包括打包和输出。
 */
async function runFullBuild() {
  try {
    console.log('👟 开始执行完整构建流程...');

    // --- 步骤 1: 询问是否保留格式 ---
    const preserveFormatting = await promptToPreserveFormatting();

    // --- 步骤 2: 执行 esbuild 打包 ---
    console.log('\n--- (阶段 1/2) 打包脚本 ---');
    const result = await esbuild.build({
      entryPoints: [path.resolve('src/main.js')],
      bundle: true,
      write: false,
      charset: 'utf8',
      minify: false,
    });

    // --- 步骤 4: 后处理并组合最终脚本 ---
    console.log('\n--- (阶段 3/3) 生成最终文件 ---');
    const header = await fs.readFile(path.resolve('src/header.txt'), 'utf-8');
    
    let bundledCode = result.outputFiles[0].text;
    let finalScript;

    if (preserveFormatting) {
        const formattedCode = await prettier.format(bundledCode, {
            parser: 'babel', semi: true, singleQuote: true, printWidth: 9999,
        });
        finalScript = `${header}\n\n${formattedCode}`;
        console.log('💅 已保留注释和空白行。');
    } else {
        bundledCode = bundledCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        let formattedCode = await prettier.format(bundledCode, {
            parser: 'babel', semi: true, singleQuote: true, printWidth: 9999,
        });
        formattedCode = formattedCode.replace(/^\s*[\r\n]/gm, '');
        finalScript = `${header}\n\n${formattedCode}`;
        console.log('🧹 已移除注释和多余空白行。');
    }

    // --- 步骤 5: 写入最终文件 ---
    const distDir = path.resolve('dist');
    await fs.mkdir(distDir, { recursive: true });
    const outputPath = path.join(distDir, 'Web-Translate-Script.user.js');
    await fs.writeFile(outputPath, finalScript);

    console.log(`\n🎉 构建成功！最终脚本位于: ${outputPath}`);

  } catch (error) {
    if (error.errors && error.errors.length > 0) {
      console.error('❌ esbuild 构建失败:');
      error.errors.forEach(e => console.error(`  - 错误信息: ${e.text} [位置: ${e.location.file}:${e.location.line}]`));
    } else {
      console.error('❌ 构建过程中发生未知错误:', error);
    }
  }
}

/**
 * 显示主菜单并处理用户输入。
 */
async function main() {
  while (true) {
    console.clear();
    console.log('=======================================');
    console.log('    构建工具 & 翻译文件校验器');
    console.log('=======================================');
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '您想做什么？\n  (推荐流程: 先修复“遗漏逗号”，再处理其他检查，最后构建项目)\n',
        prefix: '⚙️',
        choices: [
          new inquirer.Separator('--- 检查与修复 ---'),
          { name: '1. 🔧 检查“遗漏逗号”问题', value: 'checkMissingComma' },
          { name: '2. 🔧 检查“空翻译”问题', value: 'checkEmpty' },
          { name: '3. 🔧 检查“重复原文”问题', value: 'checkDuplicates' },
          new inquirer.Separator('--- 项目操作 ---'),
          { name: '4. 👟 完整构建项目', value: 'fullBuild' },
          { name: '5. 🚪 退出', value: 'exit' },
        ],
      },
    ]);

    switch (action) {
      case 'checkEmpty':
        await handleCheck({ checkEmpty: true, checkDuplicates: false });
        await pressAnyKeyToContinue();
        break;
      case 'checkDuplicates':
        await handleCheck({ checkEmpty: false, checkDuplicates: true });
        await pressAnyKeyToContinue();
        break;
      case 'checkMissingComma':
        await handleMissingCommaCheck();
        await pressAnyKeyToContinue();
        break;
      case 'fullBuild':
        await runFullBuild();
        await pressAnyKeyToContinue();
        break;
      case 'exit':
        console.log('👋 再见！');
        return;
    }
  }
}

// 执行主菜单流程
main();