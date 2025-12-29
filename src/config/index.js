/**
 * @file src/config/index.js
 * @description
 * 全局配置文件，定义了翻译引擎在处理 DOM 元素时的核心行为规则。
 * 此文件中的配置是通用的，适用于所有网站，用于控制哪些元素、属性或内容应该被翻译或忽略。
 */

// --- 标签翻译行为配置 ---

/**
 * @const {Set<string>} BLOCKS_ALL_TRANSLATION
 * @description
 * 完全阻塞翻译的 HTML 标签集合。
 * 当一个元素使用此集合中的标签时，该元素及其所有后代元素（包括文本内容和属性）都将被翻译引擎完全忽略。
 * 这适用于那些包含代码、样式或预格式化文本的标签，翻译它们可能会破坏其功能或显示。
 *
 * @example
 * // <pre><code>...</code></pre> 中的所有内容都不会被翻译。
 */
export const BLOCKS_ALL_TRANSLATION = new Set(['script', 'style', 'pre', 'code', 'svg']);

/**
 * @const {Set<string>} BLOCKS_CONTENT_ONLY
 * @description
 * 仅阻塞**文本内容**翻译的 HTML 标签集合。
 * 当一个元素使用此集合中的标签时，其直接的文本内容不会被翻译，但其属性（如 `title`, `placeholder`）
 * 以及其**非阻塞类型**的子孙元素仍然可以被翻译。
 * 目前此集合为空，保留用于未来可能的扩展。
 *
 * @example
 * // 如果 'textarea' 在此集合中，<textarea title="原始标题">原始文本</textarea>
 * // "原始文本" 不会被翻译，但 "原始标题" 会被翻译。
 */
export const BLOCKS_CONTENT_ONLY = new Set([]);

/**
 * @const {Set<string>} ALL_UNTRANSLATABLE_TAGS
 * @description
 * 一个合并了 `BLOCKS_ALL_TRANSLATION` 和 `BLOCKS_CONTENT_ONLY` 的集合。
 * 此常量主要用于在 `translator.js` 中进行快速、统一的标签类型检查。
 */
export const ALL_UNTRANSLATABLE_TAGS = new Set([...BLOCKS_ALL_TRANSLATION, ...BLOCKS_CONTENT_ONLY]);


// --- 属性与类名配置 ---

/**
 * @const {string[]} attributesToTranslate
 * @description
 * 需要被翻译的 HTML 属性列表。
 * 翻译引擎会检查元素的这些属性，并对其值应用翻译规则。
 */
export const attributesToTranslate = ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip', 'label'];

/**
 * @const {Set<string>} BLOCKED_CSS_CLASSES
 * @description
 * 全局禁止翻译的 CSS 类名集合。
 * 任何包含了此集合中任意一个类名的 HTML 元素，都将被翻译引擎完全忽略。
 * 这为开发者提供了一种简单、直接的方式来在页面上局部禁用翻译。
 *
 * @example
 * // <p class="notranslate">This text will be ignored.</p>
 */
export const BLOCKED_CSS_CLASSES = new Set(['notranslate', 'kbd']);

// --- 嵌入式站点配置 ---

/**
 * @const {string[]} embeddedSites
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
export const embeddedSites = [
    'aistudio.google.com',
    'gemini.google.com'
];
