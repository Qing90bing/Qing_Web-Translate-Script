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
import { validateTranslationFiles } from './scripts/validator.js';
import { 
  promptUserAboutErrors, 
  promptForManualFix, 
  promptForEmptyTranslationFix,
  promptToPreserveFormatting
} from './scripts/prompter.js';
import { 
  applyManualFixes, 
  fixDuplicatesAutomatically,
  applyEmptyTranslationFixes
} from './scripts/fixer.js';


/**
 * 主构建函数，封装了整个构建流程。
 */
async function build() {
  try {
    // --- 步骤 1: 执行翻译文件校验 ---
    console.log('🔍 开始校验翻译文件...');
    const validationErrors = await validateTranslationFiles();

    // --- 步骤 2: 如果发现错误，则进入交互式处理流程 ---
    if (validationErrors.length > 0) {
      const userAction = await promptUserAboutErrors(validationErrors);
      const duplicateErrors = validationErrors.filter(e => e.type === 'multi-duplicate');
      const emptyTranslationErrors = validationErrors.filter(e => e.type === 'empty-translation');

      switch (userAction) {
        case 'auto-fix':
          if(duplicateErrors.length > 0) {
            await fixDuplicatesAutomatically(duplicateErrors);
            console.log('\n✅ 自动修复完成。建议您重新运行构建脚本，以确保所有问题都已解决。');
          } else {
            console.log('\n🤷 没有可自动修复的问题。');
          }
          process.exit(0);
          break;
        
        case 'manual-fix':
          let needsRebuild = false;
          if (duplicateErrors.length > 0) {
            const decisions = await promptForManualFix(duplicateErrors);
            if (decisions === null) {
              console.log('\n🛑 已退出手动修复流程，构建已取消。');
              process.exit(0);
            }
            await applyManualFixes(decisions);
            needsRebuild = true;
          }
          if (emptyTranslationErrors.length > 0) {
            const decisions = await promptForEmptyTranslationFix(emptyTranslationErrors);
            await applyEmptyTranslationFixes(decisions);
            needsRebuild = true;
          }
          if(needsRebuild){
            console.log('\n✅ 手动修复完成。建议您重新运行构建脚本，以确保所有问题都已解决。');
          } else {
            console.log('\n🤷 没有需要手动修复的问题。');
          }
          process.exit(0);
          break;

        case 'ignore':
          console.log('\n⚠️  您选择忽略错误，构建将继续...');
          break;
        case 'cancel':
          console.log('\n🛑 构建已取消。');
          process.exit(0);
          break;
      }
    } else {
        console.log('\n✅ 所有翻译文件均通过校验！');
    }

    // --- 新步骤: 询问是否保留格式 ---
    const preserveFormatting = await promptToPreserveFormatting();


    // --- 步骤 3: 执行 esbuild 打包 ---
    console.log('\n🚀 开始构建...');
    const result = await esbuild.build({
      entryPoints: [path.resolve('src/main.js')],
      bundle: true,
      write: false,
      charset: 'utf8',
      minify: false,
    });

    // --- 步骤 4: 后处理并组合最终脚本 ---
    const header = await fs.readFile(path.resolve('src/header.txt'), 'utf-8');
    
    let bundledCode = result.outputFiles[0].text;
    let finalScript;

    if (preserveFormatting) {
        // 如果保留格式，只进行 Prettier 格式化以保证基本代码风格
        const formattedCode = await prettier.format(bundledCode, {
            parser: 'babel',
            semi: true,
            singleQuote: true,
            printWidth: 9999, // 设置一个很大的值来防止自动换行
        });
        finalScript = `${header}\n\n${formattedCode}`;
        console.log('💅 已保留注释和空白行，仅执行基本格式化。');
    } else {
        // 否则，执行完整的清理流程
        // 1. 移除所有注释
        bundledCode = bundledCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        
        // 2. 使用 Prettier 进行专业格式化
        let formattedCode = await prettier.format(bundledCode, {
            parser: 'babel',
            semi: true,
            singleQuote: true,
            printWidth: 9999, // 设置一个很大的值来防止自动换行
        });

        // 3. 移除 Prettier 可能留下的多余空白行
        formattedCode = formattedCode.replace(/^\s*[\r\n]/gm, '');

        // 将头部信息和处理后的代码拼接成最终脚本
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
    process.exit(1);
  }
}

// 执行构建流程
build();