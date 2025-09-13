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
import { validateTranslationFiles } from './scripts/validator.js';
import { promptUserAboutErrors, promptForManualFix } from './scripts/prompter.js';
import { applyManualFixes, fixDuplicatesAutomatically } from './scripts/fixer.js';


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

      switch (userAction) {
        case 'auto-fix':
          await fixDuplicatesAutomatically(duplicateErrors);
          console.log('\n✅ 自动修复完成。建议您重新运行构建脚本，以确保所有问题都已解决。');
          process.exit(0); // 正常退出，让用户重新运行
          break;
        
        case 'manual-fix':
          const decisions = await promptForManualFix(duplicateErrors);
          if (decisions === null) {
            console.log('\n🛑 已退出手动修复流程，构建已取消。');
          } else {
            await applyManualFixes(decisions);
            console.log('\n✅ 手动修复完成。建议您重新运行构建脚本，以确保所有问题都已解决。');
          }
          process.exit(0); // 正常退出
          break;

        case 'ignore':
          console.log('\n⚠️  您选择忽略错误，构建将继续...');
          break;
        case 'cancel':
          console.log('\n🛑 构建已取消。');
          process.exit(0); // 正常退出
          break;
      }
    } else {
        console.log('\n✅ 所有翻译文件均通过校验！');
    }


    // --- 步骤 3: 执行 esbuild 打包 ---
    console.log('\n🚀 开始构建...');
    const result = await esbuild.build({
      entryPoints: [path.resolve('src/main.js')],
      bundle: true,
      write: false, // 不将结果写入文件，而是保留在内存中进行后续处理
      charset: 'utf8',
      minify: false, // 我们需要可读的输出，所以关闭完全压缩
      minifySyntax: true, // 但我们压缩语法，这有助于移除一些空白
      legalComments: 'none', // 移除所有注释
    });

    // --- 步骤 4: 后处理并组合最终脚本 ---
    const header = await fs.readFile(path.resolve('src/header.txt'), 'utf-8');
    
    // 从打包结果中获取代码文本
    let bundledCode = result.outputFiles[0].text;
    
    // 使用正则表达式移除所有多余的空白行
    bundledCode = bundledCode.replace(/^\s*[\r\n]/gm, '');

    // 将头部信息和处理后的代码拼接成最终脚本
    const finalScript = `${header}\n\n${bundledCode}`;

    // --- 步骤 5: 写入最终文件 ---
    const distDir = path.resolve('dist');
    await fs.mkdir(distDir, { recursive: true }); // 确保dist目录存在

    const outputPath = path.join(distDir, 'Web-Translate-Script.user.js');
    await fs.writeFile(outputPath, finalScript);

    console.log(`\n🎉 构建成功！最终脚本位于: ${outputPath}`);

  } catch (error) {
    // 捕获构建过程中的任何错误
    if (error.errors && error.errors.length > 0) {
      // 捕获并美化esbuild的特定错误
      console.error('❌ esbuild 构建失败:');
      error.errors.forEach(e => console.error(`  - 错误信息: ${e.text} [位置: ${e.location.file}:${e.location.line}]`));
    } else {
      // 捕获其他未知错误
      console.error('❌ 构建过程中发生未知错误:', error);
    }
    process.exit(1); // 以错误码退出
  }
}

// 执行构建流程
build();