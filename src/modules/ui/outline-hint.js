/**
 * @file src/modules/ui/outline-hint.js
 * @description
 * “翻译描边提示”模块。
 *
 * **用途**:
 * 这是一个面向开发者的调试辅助功能。网站开始原生支持多语言后，
 * 开发者往往需要确认“当前页面里哪些内容仍由本脚本翻译”，以便后续逐步移除翻译条目。
 * 开启后，所有被脚本实际翻译的元素都会显示虚线描边。
 *
 * **实现机制**:
 * - 通过 `data-wts-translated` 属性标记发生实际翻译的元素（文本、属性或伪元素）。
 * - 通过 `outline` 绘制描边，`outline` 不参与文档流布局，因此不会挤压或改变网站原有空间。
 * - 描边样式会同时注入主文档和翻译器发现的所有 Shadow Root，保证 Shadow DOM 内也能看到标记。
 * - 开关状态通过 `GM_getValue` / `GM_setValue` 持久化，切换后刷新页面生效。
 */

import { STORAGE_KEYS } from '../../config/storage.js';
import { UI_CONFIG } from '../../config/ui.js';

// --- 常量 ---
const OUTLINE_HINT_KEY = STORAGE_KEYS.OUTLINE_HINT_KEY;
const OUTLINE_STYLE_ID = UI_CONFIG.outlineHint.STYLE_ID;
const OUTLINE_ATTRIBUTE = UI_CONFIG.outlineHint.ATTRIBUTE;
const OUTLINE_CSS = UI_CONFIG.outlineHint.CSS;

// 模块加载时读取一次开关状态；菜单切换会刷新页面，因此无需在运行中再次读取。
export const outlineHintEnabled = GM_getValue(OUTLINE_HINT_KEY, false) === true;

/**
 * @function isOutlineHintEnabled
 * @description 当前页面是否启用了“翻译描边提示”。
 * @returns {boolean} 开启时返回 true，否则返回 false。
 */
export function isOutlineHintEnabled() {
    return outlineHintEnabled;
}

/**
 * @function injectOutlineHintStyle
 * @description 向指定的根节点（主文档或 Shadow Root）注入描边样式。
 *              只有启用描边提示时才真正执行。
 * @param {Document|ShadowRoot} [root=document] - 需要注入样式的根节点。
 */
export function injectOutlineHintStyle(root = document) {
    if (!outlineHintEnabled) return;

    const target = root.head || root.documentElement || root;
    if (!target) return;

    // 幂等性检查：避免重复注入样式（Document 与 ShadowRoot 均支持 getElementById）
    if (root.getElementById && root.getElementById(OUTLINE_STYLE_ID)) {
        return;
    }

    const style = document.createElement('style');
    style.id = OUTLINE_STYLE_ID;
    style.appendChild(document.createTextNode(OUTLINE_CSS));
    target.appendChild(style);
}

/**
 * @function markAsTranslated
 * @description 标记一个被脚本实际翻译的元素。
 *              只有启用描边提示时才写入 data 属性，避免正常翻译时产生额外 DOM 开销。
 * @param {Element|null|undefined} element - 发生翻译的元素。
 */
export function markAsTranslated(element) {
    if (!outlineHintEnabled) return;
    if (!(element instanceof Element)) return;
    if (element.hasAttribute(OUTLINE_ATTRIBUTE)) return;

    element.setAttribute(OUTLINE_ATTRIBUTE, '');
}
