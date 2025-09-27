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
    const { language, styles: cssRules = [], blockedElements = [], jsRules = [], regexRules = [], textRules = [] } = siteDictionary;
    
    log(`开始初始化翻译流程，使用语言: ${language || 'unknown'}`);

    // 将所有纯文本翻译规则放入一个Map中，以便快速查找
    const textTranslationMap = new Map();
    for (const rule of textRules) {
        if (Array.isArray(rule) && rule.length === 2 && typeof rule[0] === 'string' && typeof rule[1] === 'string') {
            // 将trim后的原文作为key，以实现稳定的匹配
            textTranslationMap.set(rule[0].trim(), rule[1]);
        }
    }
    
    if (textTranslationMap.size > 0) {
        log(`加载了 ${textTranslationMap.size} 条文本翻译规则`);
    }

    // 注入自定义CSS样式
    if (cssRules.length > 0) {
        const customStyleElement = document.createElement('style');
        customStyleElement.id = 'web-translate-custom-styles';
        // 【修复】使用 textNode 来安全地插入样式，以兼容 Trusted Types
        customStyleElement.appendChild(document.createTextNode(cssRules.join('\n')));
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        head.appendChild(customStyleElement);
        log(`注入了 ${cssRules.length} 条自定义CSS样式`);
    }

    // 注入并执行自定义JS脚本
    if (jsRules.length > 0) {
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        let executedScripts = 0;
        for (const scriptText of jsRules) {
            if (typeof scriptText === 'string' && scriptText.trim()) {
                const scriptElement = document.createElement('script');
                scriptElement.type = 'text/javascript';
                // 【修复】使用 textNode 来安全地插入脚本，以兼容 Trusted Types
                scriptElement.appendChild(document.createTextNode(scriptText));
                head.appendChild(scriptElement);
                executedScripts++;
            }
        }
        if (executedScripts > 0) {
            log(`执行了 ${executedScripts} 条自定义JS脚本`);
        }
    }

    // 创建翻译器实例，传递网站特定的禁止翻译元素配置
    const translator = createTranslator(textTranslationMap, regexRules, blockedElements);

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
        log('开始执行初次全文翻译...');
        const startTime = performance.now();
        
        // 1. 执行首次全文翻译
        translator.translate(document.body);
        const duration = performance.now() - startTime;
        
        log(`初次翻译完成。使用语言: ${language || 'unknown'}, 耗时: ${duration.toFixed(2)}ms`);

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