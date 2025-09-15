import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { promptToPreserveFormatting } from './prompting.js';

export default async function handleFullBuild() {
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

    // --- 步骤 3: 后处理并组合最终脚本 ---
    console.log('\n--- (阶段 2/2) 生成最终文件 ---');
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

    // --- 步骤 4: 写入最终文件 ---
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
