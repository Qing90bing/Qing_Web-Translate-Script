/**
 * @file src/config/embedded-sites.js
 * @description
 * 定义一个网站域名列表，这些网站的翻译数据将在 CDN 构建模式下被直接嵌入到最终脚本中。
 *
 * **目的**:
 * 主要用于处理那些具有严格内容安全策略 (Content Security Policy, CSP) 的网站。
 * 这些网站可能会阻止从外部 CDN (如 Gist, JsDelivr) 加载脚本，导致标准的 CDN 版本翻译功能失效。
 * 通过将这些网站的翻译数据直接“嵌入”到核心脚本中，可以绕过 CSP 的限制，确保翻译功能在这些特殊网站上也能正常工作。
 *
 * **如何使用**:
 * 1. 将需要嵌入翻译的网站的根域名 (例如 'aistudio.google.com') 添加到下面的 `embeddedSites` 数组中。
 * 2. 确保 `src/translations/` 目录下存在该网站对应的翻译文件。
 * 3. 运行 `node build.js` 并选择“CDN 构建”选项，以生成包含这些嵌入式翻译的新脚本。
 */

// embeddedSites 数组
// 此数组包含了一系列网站域名。在执行“CDN 构建” (`build-cdn.js`) 时，
// 构建脚本会查找这些域名对应的翻译文件，并将它们的内容直接打包进最终生成的
// `Web-Translate-Script.cdn.user.js` 文件中。
export const embeddedSites = [
  'aistudio.google.com',
  'gemini.google.com'
];