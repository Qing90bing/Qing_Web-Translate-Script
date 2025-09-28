/**
 * @file src/modules/core/translationInitializer.js
 * @description
 * 翻译初始化模块，是整个翻译流程的“编排者”或“总指挥”。
 * 它负责在页面上执行翻译前的所有准备工作，并协调后续的翻译和监听任务。
 *
 * **核心职责**:
 * 1.  **处理站点词典**: 解析从 `main.js` 传入的特定于当前网站的翻译配置（`siteDictionary`）。
 * 2.  **注入资源**: 将配置中的自定义 CSS 样式和 JavaScript 脚本注入到页面中。
 * 3.  **创建翻译器**: 调用 `createTranslator` 函数，创建一个包含所有翻译规则的翻译器实例。
 * 4.  **协调启动**: 智能地判断页面的加载状态（`DOMContentLoaded`），在合适的时机启动首次全文翻译。
 * 5.  **启动监听**: 在首次翻译完成后，调用 `initializeObservers` 来启动 `MutationObserver`，以处理页面后续的动态内容变化。
 *
 * **设计模式**:
 * 此模块大量使用“依赖注入”模式，它不直接创建依赖（如 `translator`, `logger`），而是接收外部传入的函数或实例。
 * 这种设计提高了模块的解耦度和可测试性。
 */

/**
 * @function initializeTranslation
 * @description 初始化翻译流程的入口函数。
 * @param {object} siteDictionary - 当前网站的翻译配置对象。
 * @param {Function} createTranslator - 用于创建翻译器实例的工厂函数。
 * @param {Function} removeAntiFlickerStyle - 用于移除“防闪烁”样式的函数。
 * @param {Function} initializeObservers - 用于初始化 `MutationObserver` 的函数。
 * @param {Function} log - 日志记录函数。
 */
export function initializeTranslation(siteDictionary, createTranslator, removeAntiFlickerStyle, initializeObservers, log) {
    // 从站点词典中解构出所有规则，并为可能不存在的规则提供默认空数组。
    const { language, styles: cssRules = [], blockedElements = [], jsRules = [], regexRules = [], textRules = [] } = siteDictionary;
    
    log(`开始初始化翻译流程，使用语言: ${language || 'unknown'}`);

    // --- 步骤 1: 预处理翻译规则 ---
    // 将纯文本翻译规则放入一个 Map 中，以实现 O(1) 的查找复杂度，显著提高翻译性能。
    const textTranslationMap = new Map();
    for (const rule of textRules) {
        if (Array.isArray(rule) && rule.length === 2 && typeof rule[0] === 'string' && typeof rule[1] === 'string') {
            // 对原文进行 trim() 处理，可以避免因前后空格不一致导致的匹配失败问题。
            textTranslationMap.set(rule[0].trim(), rule[1]);
        }
    }
    
    if (textTranslationMap.size > 0) {
        log(`加载了 ${textTranslationMap.size} 条文本翻译规则`);
    }

    // --- 步骤 2: 注入自定义资源 ---
    // 注入自定义 CSS 样式
    if (cssRules.length > 0) {
        const customStyleElement = document.createElement('style');
        customStyleElement.id = 'web-translate-custom-styles';
        // 使用 `appendChild(document.createTextNode(...))` 的方式来设置样式内容，
        // 这是一种更安全、更能兼容严格内容安全策略 (CSP) 和 Trusted Types 的方法。
        customStyleElement.appendChild(document.createTextNode(cssRules.join('\n')));
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        head.appendChild(customStyleElement);
        log(`注入了 ${cssRules.length} 条自定义CSS样式`);
    }

    // 注入并执行自定义 JS 脚本
    if (jsRules.length > 0) {
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        let executedScripts = 0;
        for (const scriptText of jsRules) {
            if (typeof scriptText === 'string' && scriptText.trim()) {
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                // 同样使用 `appendChild` 来安全地注入脚本内容。
                scriptElement.appendChild(document.createTextNode(scriptText));
                head.appendChild(scriptElement);
                executedScripts++;
            }
        }
        if (executedScripts > 0) {
            log(`执行了 ${executedScripts} 条自定义JS脚本`);
        }
    }

    // --- 步骤 3: 创建翻译器实例 ---
    // 将处理好的规则传递给翻译器工厂函数，创建一个包含特定网站翻译逻辑的翻译器实例。
    const translator = createTranslator(textTranslationMap, regexRules, blockedElements);

    // --- 步骤 4: 协调并启动翻译流程 ---

    /**
     * @function startTranslation
     * @description 启动翻译的入口，它会确保在 `document.body` 存在后才执行真正的翻译初始化。
     */
    function startTranslation() {
        if (document.body) {
            initializeFullTranslation();
        } else {
            // 如果 `document.body` 尚未加载，则使用一个临时的 MutationObserver 来等待它出现。
            // 这种情况在某些脚本执行时机非常早的场景下可能发生。
            new MutationObserver((_mutations, obs) => {
                if (document.body) {
                    obs.disconnect(); // 找到 body 后立即断开此临时观察者
                    initializeFullTranslation();
                }
            }).observe(document.documentElement, { childList: true });
        }
    }

    /**
     * @function initializeFullTranslation
     * @description 执行完整的首次翻译流程，并启动后续的动态监听。
     */
    function initializeFullTranslation() {
        log('开始执行初次全文翻译...');
        const startTime = performance.now();
        
        // 1. 执行首次全文翻译
        translator.translate(document.body);
        const duration = performance.now() - startTime;
        
        log(`初次翻译完成。使用语言: ${language || 'unknown'}, 耗时: ${duration.toFixed(2)}ms`);

        // 2. 移除防闪烁遮罩，将翻译好的页面内容展示给用户。
        removeAntiFlickerStyle();

        // 3. 启动所有用于处理动态内容变化的 `MutationObserver`。
        initializeObservers(translator);
    }

    // 根据页面的加载状态，智能地选择启动翻译的时机。
    if (document.readyState === 'loading') {
        // 如果文档仍在加载中，则等待 `DOMContentLoaded` 事件，以确保所有初始的 DOM 元素都已构建完毕。
        document.addEventListener('DOMContentLoaded', startTranslation);
    } else {
        // 如果文档已经加载完成（'interactive' 或 'complete' 状态），则直接启动翻译。
        startTranslation();
    }
}