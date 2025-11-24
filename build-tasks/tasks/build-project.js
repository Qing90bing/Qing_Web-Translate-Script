import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { color } from '../lib/colors.js';
import { t } from '../lib/terminal-i18n.js';

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
    
    // 如果不保留格式（即标准构建），则让 esbuild 负责移除注释和空白。
    // 这比使用正则表达式更安全，因为它基于 AST 解析。
    const minifyOptions = preserveFormatting ? {} : {
        minifySyntax: true,
        minifyWhitespace: true,
        minifyIdentifiers: false, // 保持变量名不变，方便调试
    };

    const result = await esbuild.build({
      entryPoints: [path.resolve('src/main.js')],
      bundle: true,
      write: false,
      charset: 'utf8',
      minify: false, // 默认不开启完全压缩，通过下方具体选项控制
      ...minifyOptions,
    });

    // --- 步骤 3: 后处理代码并组合成最终脚本 ---
    console.log(color.bold(t('buildProject.generatingFile')));
    const header = await fs.readFile(path.resolve('src/header.txt'), 'utf-8');

    let bundledCode = result.outputFiles[0].text;
    
    // 即使在压缩模式下，我们也可能想要移除特定的元数据字段（如 description, testUrl）
    // 但必须非常小心。这里改用稍微更严格的正则，或者如果这些字段体积不大，
    // 在 esbuild 压缩后保留它们也是可以接受的。
    // 为了安全性，我们暂时只移除极其明显的行首字段，且确保不误伤代码。
    // 如果 preserveFormatting 为 false，esbuild 已经将代码压缩为一行或几行，
    // 这时的多行正则替换可能会失效或行为改变。
    // 因此，只有在 preserveFormatting 为 true (未压缩) 时，才尝试手动清理，
    // 或者完全信任 esbuild 的 tree shaking (如果配置得当)。
    
    // 鉴于之前的正则造成了 bug，且这些字段占用的体积微乎其微，
    // 在标准构建中我们不再手动通过正则去移除它们，以免引入新的风险。
    // esbuild 的 minifySyntax 已经足够高效。

    let finalScript;

    if (preserveFormatting) {
        const formattedCode = await prettier.format(bundledCode, {
            parser: 'babel',
            semi: true,
            singleQuote: true,
            printWidth: 99999, 
        });
        finalScript = `${header}\n\n${formattedCode}`;
        console.log(color.green(t('buildProject.preservingFormatting')));
    } else {
        // 在非保留格式模式下，esbuild 已经去除了注释。
        // 我们只需要再做一次 prettier 格式化，确保代码是整洁的（虽然紧凑，但结构清晰）。
        // 注意：如果不希望 Prettier 重新把代码展开得太长，可以调整 printWidth。
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
