/**
 * @file src/modules/ui/anti-flicker.js
 * @description
 * 防闪烁 (Anti-Flicker) 模块。
 *
 * **要解决的问题**:
 * 当脚本开始翻译页面时，用户可能会在短时间内看到原始内容，然后内容突然变成翻译后的文本。
 * 这种“闪烁”现象会严重影响用户体验。
 *
 * **解决方案**:
 * 1.  **立即隐藏**: 在脚本开始执行时，立即通过注入 CSS 的方式将整个 `<body>` 隐藏 (`visibility: hidden`)。
 * 2.  **翻译执行**: 在页面不可见的状态下执行首次全文翻译。
 * 3.  **平滑显示**: 翻译完成后，移除隐藏样式，并通过一个短暂的淡入过渡效果将页面内容平滑地展示给用户。
 *
 * 这种策略确保了用户看到的始终是翻译完成后的最终内容，从而消除了闪烁现象。
 */

import { UI_CONFIG } from '../../config/ui.js';
import { PERFORMANCE_CONFIG } from '../../config/optimization.js';

// 用于标识防闪烁样式标签的唯一 ID，方便后续移除。
const STYLE_ID = UI_CONFIG.antiFlicker.STYLE_ID;

/**
 * @function injectAntiFlickerStyle
 * @description 注入防闪烁样式。
 *              此函数应在脚本执行的最开始被调用，以确保在任何内容被渲染到屏幕之前隐藏页面。
 */
export function injectAntiFlickerStyle() {
    // 关键修复：这是一个竞争条件保护。在极端的边缘情况下，此脚本可能在 `document.documentElement`
    // (即 <html> 标签) 存在之前执行。如果它不存在，我们必须立即中止，否则将导致致命的 TypeError。
    if (!document.documentElement) {
        return;
    }

    // 幂等性检查：防止重复注入样式
    if (document.getElementById(STYLE_ID)) {
        return;
    }

    document.documentElement.classList.add(UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS);

    const antiFlickerStyle = document.createElement('style');
    antiFlickerStyle.id = STYLE_ID;

    // CSS 优化：已压缩以提升性能。
    // 1. 隐藏 body (translation-in-progress)
    // 2. 显示 body (translation-complete) 并使用过渡效果
    // 3. 保持加载动画可见 (spinner/loader/loading)
    const styleContent = `html.${UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS} body{visibility:hidden!important;opacity:0!important}html.${UI_CONFIG.antiFlicker.CLASS_COMPLETE} body{visibility:visible!important;opacity:1!important;transition:opacity .1s ease-in!important}html.${UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS} [class*="load"],html.${UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS} [class*="spin"],html.${UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS} [id*="load"],html.${UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS} [id*="spin"],html.${UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS} .loader,html.${UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS} .spinner,html.${UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS} .loading{visibility:visible!important;opacity:1!important}`;

    // 使用 `appendChild(document.createTextNode(...))` 的方式来设置样式内容，
    // 这是一种更安全、更能兼容严格内容安全策略 (CSP) 和 Trusted Types 的方法。
    antiFlickerStyle.appendChild(document.createTextNode(styleContent));

    // 此处 `document.documentElement` 已保证存在。
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    // 使用 `insertBefore` 将样式插入到 <head> 的最前面，确保它能优先于其他样式被应用。
    head.insertBefore(antiFlickerStyle, head.firstChild);

}

/**
 * @function removeAntiFlickerStyle
 * @description 移除防闪烁样式，并使页面内容可见。
 *              此函数应在首次全文翻译完成后被调用。
 */
export function removeAntiFlickerStyle() {
    // 再次添加保护，以防万一。
    if (!document.documentElement) {
        return;
    }

    // 切换 <html> 上的类名，这将触发 CSS 过渡效果，使页面平滑淡入。
    document.documentElement.classList.remove(UI_CONFIG.antiFlicker.CLASS_IN_PROGRESS);
    document.documentElement.classList.add(UI_CONFIG.antiFlicker.CLASS_COMPLETE);

    // 在过渡效果（0.1秒）结束后，从 DOM 中移除我们注入的 <style> 标签。
    // 这样做是为了保持 DOM 的干净，避免无用的样式规则残留。
    setTimeout(() => {
        const styleElement = document.getElementById(STYLE_ID);
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
    }, PERFORMANCE_CONFIG.FADE_IN_DURATION);
}