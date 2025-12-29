import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { color } from '../../../lib/colors.js';
import { t } from '../../../lib/terminal-i18n.js';
import { ProgressBar } from '../../../lib/progress.js';

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
    // --- 步骤 1: 初始化进度条 ---
    const bar = ProgressBar.createTaskProgressBar({
      format: '{bar} ' + color.green('{percentage}%') + ' | {value}/{total} | {text}',
      width: 30
    });
    bar.start(100, t('buildProject.initializing'));

    // --- 步骤 2: 使用 esbuild 执行打包 ---
    bar.update(10, t('buildProject.bundling'));

    const buildOptions = {
      entryPoints: [path.resolve('src/main.js')],
      bundle: true,
      write: false,
      charset: 'utf8',
      minify: false,
    };

    // 如果不保留格式（标准构建），则启用空白压缩以自动移除注释
    if (!preserveFormatting) {
      buildOptions.minifyWhitespace = true;
    }

    const result = await esbuild.build(buildOptions);
    bar.update(40, t('buildProject.generating'));

    // --- 步骤 3: 后处理代码并组合成最终脚本 ---
    const header = await fs.readFile(path.resolve('src/header.txt'), 'utf-8');

    let bundledCode = result.outputFiles[0].text;
    let finalScript;

    bar.update(60, t('buildProject.formatting'));

    if (preserveFormatting) {
      const formattedCode = await prettier.format(bundledCode, {
        parser: 'babel',
        semi: true,
        singleQuote: true,
        printWidth: 9999,
      });
      finalScript = `${header}\n\n${formattedCode}`;
    } else {
      // 在标准构建模式下，esbuild 已经移除了注释 (minifyWhitespace=true)。
      // 我们先用 Prettier 格式化代码，使其结构化，以便后续的正则能正确匹配并移除特定属性。
      let formattedCode = await prettier.format(bundledCode, {
        parser: 'babel', semi: true, singleQuote: true, printWidth: 9999,
      });

      // 移除特定的元数据属性
      formattedCode = formattedCode.replace(/^\s*description:\s*["'][\s\S]*?["'],?\s*$/gm, '');
      formattedCode = formattedCode.replace(/^\s*testUrl:\s*["'][\s\S]*?["'],?\s*$/gm, '');
      formattedCode = formattedCode.replace(/^\s*createdAt:\s*["'][\s\S]*?["'],?\s*$/gm, '');

      // 移除可能因为属性移除而产生的空行
      formattedCode = formattedCode.replace(/^\s*[\r\n]/gm, '');

      finalScript = `${header}\n\n${formattedCode}`;
    }

    // --- 步骤 4: 将最终脚本写入文件 ---
    const distDir = path.resolve('dist');
    await fs.mkdir(distDir, { recursive: true });
    const outputPath = path.join(distDir, 'Web-Translate-Script.user.js');
    await fs.writeFile(outputPath, finalScript);

    bar.finish(t('buildProject.done'));

    // 计算文件大小 (KB)
    const stats = await fs.stat(outputPath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2) + ' KB';

    // 漂亮的总结输出
    console.log(''); // 空行
    console.log(color.green(t('buildProject.buildSuccess')));
    console.log(color.underline(outputPath));
    console.log(color.dim(t('buildProject.fileSize', fileSizeInKB)));

  } catch (error) {
    if (error.errors && error.errors.length > 0) {
      console.error(color.lightRed(t('buildProject.esbuildError')));
      error.errors.forEach(e => console.error(color.red(t('buildProject.errorDetail', e.text, `${e.location.file}:${e.location.line}`))));
    } else {
      console.error(color.lightRed(t('buildProject.buildError')), error);
    }
  }
}