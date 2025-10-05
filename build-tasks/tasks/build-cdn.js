import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import prettier from 'prettier';
import { embeddedSites } from '../../src/config/embedded-sites.js';
import { SUPPORTED_LANGUAGE_CODES } from '../../src/config/languages.js';
import { color } from '../lib/colors.js';
import { t } from '../lib/terminal-i18n.js';

/**
 * @function loadEmbeddedTranslations
 * @description 加载并编译指定网站的翻译文件。
 * @returns {Promise<string>} 返回一个包含所有嵌入翻译的 JavaScript 代码字符串。
 */
async function loadEmbeddedTranslations() {
  console.log(color.bold(t('buildCdn.embeddingTranslations')));
  const translations = {};

  // 一个健壮的序列化函数，用于将包含RegExp的JS对象转换为字符串。
  const serialize = (value) => {
    if (value instanceof RegExp) return value.toString();
    if (value === null) return 'null';
    if (typeof value !== 'object') {
      // 对字符串等基本类型使用JSON.stringify以正确处理转义。
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return `[${value.map(serialize).join(',')}]`;
    }
    const props = Object.keys(value)
      .map(key => `${JSON.stringify(key)}:${serialize(value[key])}`)
      .join(',');
    return `{${props}}`;
  };

  for (const lang of SUPPORTED_LANGUAGE_CODES) {
    translations[lang] = {};
    const langDir = path.resolve('src', 'translations', lang);
    try {
      const files = await fs.readdir(langDir);
      for (const site of embeddedSites) {
        const siteFile = `${site}.js`;
        if (files.includes(siteFile)) {
          const filePath = path.join(langDir, siteFile);
          // 通过在导入路径后附加时间戳查询参数来禁用缓存
          const module = await import(`${pathToFileURL(filePath).href}?v=${Date.now()}`);
          const dictionary = Object.values(module)[0];

          // 移除不需要的元数据字段
          delete dictionary.description;
          delete dictionary.testUrl;
          delete dictionary.createdAt;

          translations[lang][site] = serialize(dictionary);
          console.log(color.green(`  ✓ ${lang}/${site}`));
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(color.red(`加载 ${lang} 翻译时出错: ${error.message}`), error);
      }
    }
  }

  // 构建最终的 JS 对象字符串
  let jsString = 'const EMBEDDED_TRANSLATIONS = {\n';
  for (const lang in translations) {
    if (Object.keys(translations[lang]).length > 0) {
      jsString += `  '${lang}': {\n`;
      for (const site in translations[lang]) {
        jsString += `    '${site}': ${translations[lang][site]},\n`;
      }
      jsString += '  },\n';
    }
  }
  jsString += '};\n\n';

  return jsString;
}

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
    const header = await fs.readFile(path.resolve('src/header-cdn.txt'), 'utf-8');

    const bundledCode = result.outputFiles[0].text;
    const embeddedTranslationsCode = await loadEmbeddedTranslations();
    const embeddedSitesCode = `const EMBEDDED_SITES = ${JSON.stringify(embeddedSites)};\n\n`;

    // 将所有部分组合成一个完整的脚本
    const rawScript = `${header}\n\n${embeddedTranslationsCode}${embeddedSitesCode}${bundledCode}`;

    // 使用 Prettier 对整个脚本进行最终格式化，确保长字符串不会被换行
    console.log(color.green(t('buildProject.removingFormatting')));
    const finalScript = await prettier.format(rawScript, {
        parser: 'babel',
        semi: true,
        singleQuote: true,
        printWidth: 9999, // 关键：设置一个很大的值来防止自动换行
    });

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