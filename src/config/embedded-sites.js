/**
 * @file embedded-sites.js
 * @description
 * 此文件导出一个网站域名列表。
 * 当构建 CDN 版本的脚本时，此列表中指定的网站的翻译文件将被直接打包进最终的脚本中。
 * 这主要用于那些因为具有严格内容安全策略（CSP）而无法从外部 CDN 加载翻译脚本的网站。
 *
 * 如何使用:
 * - 将需要特殊处理的网站的根域名（例如 'aistudio.google.com'）添加到下面的数组中。
 * - 确保 `src/translations/` 目录下存在对应网站的翻译文件。
 * - 重新运行构建脚本 (node build.js) 来生成包含这些翻译的新 CDN 脚本。
 */

export const embeddedSites = [
  'aistudio.google.com',
];