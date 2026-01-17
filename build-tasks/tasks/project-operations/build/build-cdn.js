import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import prettier from 'prettier';
import { embeddedSites } from '../../../config/embedded-sites.js';
import { SUPPORTED_LANGUAGE_CODES } from '../../../../src/modules/utils/language.js';
import { color } from '../../../lib/colors.js';
import { t } from '../../../lib/terminal-i18n.js';
import { ProgressBar } from '../../../lib/progress.js';

/**
 * @function generateSupportedSites
 * @description 扫描翻译目录，自动生成 supported-sites.js 文件。
 * @returns {Promise<void>}
 */
async function generateSupportedSites() {
  const supportedSites = {};

  for (const lang of SUPPORTED_LANGUAGE_CODES) {
    const langDir = path.resolve('src', 'translations', lang, 'sites');
    try {
      const files = await fs.readdir(langDir);
      // 过滤 .js 文件并提取网站名
      const sites = files
        .filter(f => f.endsWith('.js'))
        .map(f => f.replace('.js', ''))
        .sort();
      if (sites.length > 0) {
        supportedSites[lang] = sites;
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(color.red(`扫描 ${lang} 翻译目录时出错: ${error.message}`));
      }
    }
  }

  // 生成 JS 文件内容
  let jsContent = `/**
 * @file src/config/supported-sites.js
 * @description
 * 支持翻译的网站列表，按语言区分。
 * 此文件由构建脚本自动生成，请勿手动编辑。
 *
 * 用于 CDN 版本的 @require 预加载，使脚本能快速判断当前网站是否有翻译，
 * 避免对无翻译网站发起不必要的网络请求。
 */

// eslint-disable-next-line no-unused-vars
var SUPPORTED_SITES = {\n`;

  for (const lang in supportedSites) {
    jsContent += `    '${lang}': [\n`;
    for (const site of supportedSites[lang]) {
      jsContent += `        '${site}',\n`;
    }
    jsContent += `    ],\n`;
  }
  jsContent += `};\n`;

  // 写入文件
  const outputPath = path.resolve('src', 'config', 'supported-sites.js');
  await fs.writeFile(outputPath, jsContent);

  // 打印统计信息
  const totalSites = Object.values(supportedSites).flat().length;
  const langCount = Object.keys(supportedSites).length;
  console.log(color.green(t('buildCdn.generatedSitesSummary', langCount, totalSites)));
}

/**
 * @function loadEmbeddedTranslations
 * @description 加载并编译指定网站的翻译文件。
 * @returns {Promise<string>} 返回一个包含所有嵌入翻译的 JavaScript 代码字符串。
 * @param {ProgressBar} bar - 进度条实例，用于更新进度文本。
 */
async function loadEmbeddedTranslations(bar) {
  // console.log(color.bold(t('buildCdn.embeddingTranslations')));
  const translations = {};

  // 一个健壮的序列化函数，用于将包含RegExp的JS对象转换为字符串。
  const serialize = (value) => {
    if (value instanceof RegExp) return value.toString();
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'function') return value.toString();
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
    const langDir = path.resolve('src', 'translations', lang, 'sites');
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
          if (bar) bar.update(bar.current, t('buildCdn.embedding', `${lang}/${site}`));
          // console.log(color.green(`  ✓ ${lang}/${site}`));
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
    // --- 步骤 1: 初始化进度条 ---
    const bar = ProgressBar.createTaskProgressBar({
      format: '{bar} ' + color.green('{percentage}%') + ' | {value}/{total} | {text}',
      width: 30
    });
    bar.start(100, t('buildProject.initializing'));

    // --- 步骤 1.5: 自动生成 supported-sites.js ---
    bar.update(5, t('buildCdn.generatingSupportedSites'));
    await generateSupportedSites();

    // --- 步骤 2: 使用 esbuild 执行打包 ---
    bar.update(10, t('buildProject.bundling'));

    const result = await esbuild.build({
      entryPoints: [path.resolve('src/main-cdn.js')],
      bundle: true,
      legalComments: 'none', // 使用 esbuild 内置功能安全地移除所有注释
      minify: false,
      write: false,
      charset: 'utf8',
    });

    bar.update(40, t('buildCdn.embeddingTranslations'));

    // --- 步骤 3: 后处理代码并组合成最终脚本 ---
    const header = await fs.readFile(path.resolve('src/header-cdn.txt'), 'utf-8');

    const bundledCode = result.outputFiles[0].text;
    const embeddedTranslationsCode = await loadEmbeddedTranslations(bar);
    const embeddedSitesCode = `const EMBEDDED_SITES = ${JSON.stringify(embeddedSites)};\n\n`;

    // 将所有部分组合成一个完整的脚本
    const rawScript = `${header}\n\n${embeddedTranslationsCode}${embeddedSitesCode}${bundledCode}`;

    // 使用 Prettier 对整个脚本进行最终格式化，确保长字符串不会被换行
    bar.update(80, t('buildProject.formatting'));
    const finalScript = await prettier.format(rawScript, {
      parser: 'babel',
      semi: true,
      singleQuote: true,
      printWidth: 9999, // 关键：设置一个很大的值来防止自动换行
    });

    // --- 步骤 4: 将最终脚本写入文件 ---
    const distDir = path.resolve('dist');
    await fs.mkdir(distDir, { recursive: true });
    // 我们将CDN版本保存为一个单独的文件，以避免覆盖标准构建。
    const outputPath = path.join(distDir, 'Web-Translate-Script.cdn.user.js');
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