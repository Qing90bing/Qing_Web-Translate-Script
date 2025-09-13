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

    // 将所有字符串规则放入一个Map中，key为trim后的英文，便于快速查找
    // 正则表达式规则保持独立
    const regexRules = [];
    const textTranslationMap = new Map();

    const cssRules = [];
    for (const item of siteDictionary) {
        if (!Array.isArray(item) || item.length !== 2) continue;
        const [original, translation] = item;

        // 提取自定义CSS规则
        if (original === 'css') {
            cssRules.push(translation);
            continue;
        }

        if (original instanceof RegExp) {
            regexRules.push(item);
        } else if (typeof original === 'string' && typeof translation === 'string') {
            // 将trim后的原文作为key，以实现稳定的匹配
            textTranslationMap.set(original.trim(), translation);
        }
    }

    // 注入自定义CSS
    if (cssRules.length > 0) {
        const customStyleElement = document.createElement('style');
        customStyleElement.id = 'web-translate-custom-styles';
        customStyleElement.textContent = cssRules.join('\n');
        const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
        head.appendChild(customStyleElement);
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
