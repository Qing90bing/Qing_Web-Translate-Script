// 导入词典
import { masterTranslationMap } from './translations/index.js';


// 导入模块
import { log } from './modules/utils/logger.js';
import { initializeMenu } from './modules/ui/menu.js';
import { injectAntiFlickerStyle, removeAntiFlickerStyle } from './modules/ui/anti-flicker.js';
import { createTranslator } from './modules/core/translator.js';
import { initializeObservers } from './modules/core/observers.js';

// 通过将整个 masterTranslationMap 作为参数传递
// 我们可以防止构建工具错误地“摇树”优化掉未直接引用的部分
(function (translations) {
    'use strict';

    // 注入防闪烁样式
    injectAntiFlickerStyle();

    // 在函数内部根据当前网站域名选择正确的词典
    const siteDictionary = translations[window.location.hostname];
    if (!siteDictionary) {
        // 如果当前网站没有对应的词典，立即显示页面
        removeAntiFlickerStyle();
        return;
    }

    // 从新的数据结构中提取规则，过滤掉描述性属性
    const { description, testUrl, createdAt, styles: cssRules = [], jsRules = [], regexRules = [], textRules = [] } = siteDictionary;

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
                scriptElement.textContent = scriptText;
                head.appendChild(scriptElement);
            }
        }
    }

    // 创建翻译器实例
    const translator = createTranslator(textTranslationMap, regexRules);





    // --- 初始化流程 ---

    function initializeTranslation() {
        // 1. 执行首次全文翻译
        translator.translate(document.body);
        log('初次翻译完成。');

        // 2. 移除防闪烁遮罩，显示页面
        removeAntiFlickerStyle();

        // 3. 启动所有变化监听器
        initializeObservers(translator);
    }

    function startTranslation() {
        if (document.body) {
            initializeTranslation();
        } else {
            // 等待 body 出现
            new MutationObserver((_mutations, obs) => {
                if (document.body) {
                    obs.disconnect();
                    initializeTranslation();
                }
            }).observe(document.documentElement, { childList: true });
        }
    }

    // 根据页面加载状态，启动翻译
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startTranslation);
    } else {
        startTranslation();
    }


    // 初始化菜单
    initializeMenu();


})(masterTranslationMap); // 将导入的 map 在这里作为参数传入
