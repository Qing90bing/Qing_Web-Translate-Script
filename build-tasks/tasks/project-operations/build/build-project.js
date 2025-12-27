import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { color } from '../../../lib/colors.js';
import { t } from '../../../lib/terminal-i18n.js';

/**
 * @function handleFullBuild
 * @description "完整构建项目"任务的主处理函数。
 * @param {boolean} preserveFormatting - 指示是否应保留代码格式（注释、空格等）。
 * @returns {Promise<void>}
 */
export default async function handleFullBuild(preserveFormatting) {
  try {
    // --- 步骤 1: 使用 esbuild 执行打包 ---
    // 注意：启动消息和用户提示已移至主 build.js 文件中，以实现更好的流程控制。
    console.log(color.bold(t('buildProject.bundlingScript')));
    const result = await esbuild.build({
      entryPoints: [path.resolve('src/main.js')],
      bundle: true,
      write: false,
      charset: 'utf8',
      minify: false,
    });

    // --- 步骤 3: 后处理代码并组合成最终脚本 ---
    console.log(color.bold(t('buildProject.generatingFile')));
    const header = await fs.readFile(path.resolve('src/header.txt'), 'utf-8');

    let bundledCode = result.outputFiles[0].text;
    let finalScript;

    if (preserveFormatting) {
      const formattedCode = await prettier.format(bundledCode, {
        parser: 'babel',
        semi: true,
        singleQuote: true,
        printWidth: 9999,
      });
      finalScript = `${header}\n\n${formattedCode}`;
      console.log(color.green(t('buildProject.preservingFormatting')));
    } else {
      bundledCode = bundledCode.replace(
        /("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(`(?:\\.|[^`\\])*`)|(\/\*[\s\S]*?\*\/)|(\/\/.*)/g,
        (m, dq, sq, tl) => (dq || sq || tl ? m : '')
      );
      bundledCode = bundledCode.replace(/^\s*description:\s*["'][\s\S]*?["'],?\s*$/gm, '');
      bundledCode = bundledCode.replace(/^\s*testUrl:\s*["'][\s\S]*?["'],?\s*$/gm, '');
      bundledCode = bundledCode.replace(/^\s*createdAt:\s*["'][\s\S]*?["'],?\s*$/gm, '');
      let formattedCode = await prettier.format(bundledCode, {
        parser: 'babel', semi: true, singleQuote: true, printWidth: 9999,
      });
      formattedCode = formattedCode.replace(/^\s*[\r\n]/gm, '');
      finalScript = `${header}\n\n${formattedCode}`;
      console.log(color.green(t('buildProject.removingFormatting')));
    }

    // --- 步骤 4: 将最终脚本写入文件 ---
    const distDir = path.resolve('dist');
    await fs.mkdir(distDir, { recursive: true });
    const outputPath = path.join(distDir, 'Web-Translate-Script.user.js');
    await fs.writeFile(outputPath, finalScript);

    console.log(color.bold(color.lightGreen(t('buildProject.buildSuccess', color.underline(outputPath)))));

  } catch (error) {
    if (error.errors && error.errors.length > 0) {
      console.error(color.lightRed(t('buildProject.esbuildError')));
      error.errors.forEach(e => console.error(color.red(t('buildProject.errorDetail', e.text, `${e.location.file}:${e.location.line}`))));
    } else {
      console.error(color.lightRed(t('buildProject.buildError')), error);
    }
  }
}