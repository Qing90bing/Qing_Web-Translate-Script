/**
 * 翻译初始化模块
 * 负责处理翻译的初始化流程
 */

/**
 * 初始化翻译流程
 * @param {Object} siteDictionary - 站点词典
 * @param {Function} createTranslator - 翻译器创建函数
 * @param {Function} removeAntiFlickerStyle - 移除防闪烁样式函数
 * @param {Function} initializeObservers - 初始化观察者函数
 * @param {Function} log - 日志函数
 */
export function initializeTranslation(siteDictionary, createTranslator, removeAntiFlickerStyle, initializeObservers, log) {
    // 从新的数据结构中提取规则，过滤掉描述性属性
    const { description, testUrl, createdAt, language, styles: cssRules = [], jsRules = [], regexRules = [], textRules = [] } = siteDictionary;

    // 将所有纯文本翻译规则放入一个Map中，以便快速查找
    const textTranslationMap = new Map();
    for (const rule of textRules) {
        if (Array.isArray(rule) && rule.length === 2 && typeof rule[0] === 'string' && typeof rule[1] === 'string') {
            // 将trim后的原文作为key，以实现稳定的匹配
            textTranslationMap.set(rule[0].trim(), rule[1]);
        }
    }

    // 注入自定义CSS样式
    if (cssRules.length > 0) {
        const customStyleElement = document.createElement('style');
        customStyleElement.id = 'web-translate-custom-styles';
        // 使用 textContent 而不是 innerHTML 来避免 Trusted Types 错误
        customStyleElement.textContent = cssRules.join('\n');
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        head.appendChild(customStyleElement);
    }

    // 注入并执行自定义JS脚本
    if (jsRules.length > 0) {
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        for (const scriptText of jsRules) {
            if (typeof scriptText === 'string' && scriptText.trim()) {
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                // 使用 textContent 而不是 innerHTML 来避免 Trusted Types 错误
                scriptElement.textContent = scriptText;
                head.appendChild(scriptElement);
            }
        }
    }

    // 创建翻译器实例
    const translator = createTranslator(textTranslationMap, regexRules);

    // --- 初始化流程 ---

    function startTranslation() {
        if (document.body) {
            initializeFullTranslation();
        } else {
            // 等待 body 出现
            new MutationObserver((_mutations, obs) => {
                if (document.body) {
                    obs.disconnect();
                    initializeFullTranslation();
                }
            }).observe(document.documentElement, { childList: true });
        }
    }

    function initializeFullTranslation() {
        // 1. 执行首次全文翻译
        translator.translate(document.body);
        log(`初次翻译完成。使用语言: ${language || 'unknown'}`);

        // 2. 移除防闪烁遮罩，显示页面
        removeAntiFlickerStyle();

        // 3. 启动所有变化监听器
        initializeObservers(translator);
    }

    // 根据页面加载状态，启动翻译
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startTranslation);
    } else {
        startTranslation();
    }
}