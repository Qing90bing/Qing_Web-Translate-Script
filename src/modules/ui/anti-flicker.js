const STYLE_ID = 'anti-flicker-style';

/**
 * 注入防闪烁样式。
 * 立即在html根元素上添加类，并注入CSS来隐藏body，直到翻译完成。
 */
export function injectAntiFlickerStyle() {
    // 立即在html根元素上添加类，以防止任何内容闪烁
    document.documentElement.classList.add('translation-in-progress');

    const antiFlickerStyle = document.createElement('style');
    antiFlickerStyle.id = STYLE_ID;
    
    const styleContent = `
        /* 在翻译进行中时，隐藏body，但保持加载指示器可见 */
        html.translation-in-progress body {
            visibility: hidden !important;
            opacity: 0 !important;
        }
        html.translation-complete body {
            visibility: visible !important;
            opacity: 1 !important;
            transition: opacity 0.1s ease-in !important;
        }
        html.translation-in-progress [class*="load"],
        html.translation-in-progress [class*="spin"],
        html.translation-in-progress [id*="load"],
        html.translation-in-progress [id*="spin"],
        html.translation-in-progress .loader,
        html.translation-in-progress .spinner,
        html.translation-in-progress .loading {
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;

    // 【修复】使用 textNode 来安全地插入样式，以兼容 Trusted Types
    antiFlickerStyle.appendChild(document.createTextNode(styleContent));
    
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    head.insertBefore(antiFlickerStyle, head.firstChild);
}

/**
 * 移除防闪烁样式，并使页面可见。
 */
export function removeAntiFlickerStyle() {
    document.documentElement.classList.remove('translation-in-progress');
    document.documentElement.classList.add('translation-complete');

    // 在过渡效果（0.1秒）结束后移除样式标签，清理DOM
    setTimeout(() => {
        const styleElement = document.getElementById(STYLE_ID);
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
    }, 100);
}