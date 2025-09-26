import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { color } from '../lib/colors.js';
import { t } from '../lib/terminal-i18n.js';

/**
 * @function handleCdnBuild
 * @description “CDN 构建”任务的主处理函数。
 * 此函数负责创建一个针对 CDN 使用进行优化的脚本版本。
 * 它会打包一个轻量级的加载器脚本，该脚本在运行时动态地从 CDN 获取翻译文件。
 * @returns {Promise<void>}
 */
export default async function handleCdnBuild() {
  try {
    console.log(color.cyan(t('buildProject.startingBuild')));
    console.log(color.bold(t('buildCdn.modeMessage')));

    // --- 步骤 1: 使用 esbuild 执行打包 ---
    // 我们打包一个新的入口文件 `main-cdn.js`，这个文件不包含任何翻译数据。
    console.log(color.bold(t('buildProject.bundlingScript')));
    const result = await esbuild.build({
      entryPoints: [path.resolve('src/main-cdn.js')],
      bundle: true,
      legalComments: 'none', // 使用 esbuild 内置功能安全地移除所有注释
      minify: false,
      write: false,
      charset: 'utf8',
    });

    // --- 步骤 2: 后处理代码并组合成最终脚本 ---
    console.log(color.bold(t('buildProject.generatingFile')));
    const header = await fs.readFile(path.resolve('src/header.txt'), 'utf-8');

    let bundledCode = result.outputFiles[0].text;

    // 直接使用 Prettier 格式化已移除注释的代码
    let formattedCode = await prettier.format(bundledCode, {
        parser: 'babel', semi: true, singleQuote: true, printWidth: 9999,
    });
    // 移除多余的空行
    formattedCode = formattedCode.replace(/^\s*[\r\n]/gm, '');
    console.log(color.green(t('buildProject.removingFormatting')));

    const finalScript = `${header}\n\n${formattedCode}`;

    // --- 步骤 3: 将最终脚本写入文件 ---
    const distDir = path.resolve('dist');
    await fs.mkdir(distDir, { recursive: true });
    // 我们将CDN版本保存为一个单独的文件，以避免覆盖标准构建。
    const outputPath = path.join(distDir, 'Web-Translate-Script.cdn.user.js');
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