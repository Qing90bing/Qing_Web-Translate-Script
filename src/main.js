// 导入词典
import { masterTranslationMap } from './translations/index.js';


// 导入模块
import { SUPPORTED_LANGUAGE_CODES } from './config/languages.js';
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

    // 获取用户语言偏好
    function getUserLanguage() {
        // 首先检查 localStorage 中是否有用户设置的语言
        const storedLang = localStorage.getItem('web-translate-language');
        if (storedLang && SUPPORTED_LANGUAGE_CODES.includes(storedLang)) {
            return storedLang;
        }
        
        // 然后检查浏览器语言设置
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            // 将浏览器语言映射到支持的语言
            if (browserLang.startsWith('zh-HK') || browserLang.startsWith('zh-hk')) {
                return 'zh-hk';
            } else if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-tw')) {
                return 'zh-tw';
            } else if (browserLang.startsWith('zh')) {
                return 'zh-cn';
            }
        }
        
        // 默认返回简体中文
        return 'zh-cn';
    }

    // 根据用户语言偏好选择合适的翻译文件
    function selectTranslationForSite(hostname) {
        const userLang = getUserLanguage();
        
        // 首先尝试查找带语言标识的翻译文件
        const langSpecificKey = `${hostname}#${userLang}`;
        if (translations[langSpecificKey]) {
            return translations[langSpecificKey];
        }
        
        // 如果没有找到语言特定的翻译文件，尝试查找不带语言标识的
        if (translations[hostname]) {
            return translations[hostname];
        }
        
        // 如果还是没有找到，尝试其他中文变体
        const chineseVariants = SUPPORTED_LANGUAGE_CODES;
        for (const lang of chineseVariants) {
            const variantKey = `${hostname}#${lang}`;
            if (translations[variantKey]) {
                return translations[variantKey];
            }
        }
        
        // 最后返回 undefined，表示没有找到合适的翻译文件
        return undefined;
    }

    // 在函数内部根据当前网站域名和用户语言偏好选择正确的词典
    const siteDictionary = selectTranslationForSite(window.location.hostname);
    if (!siteDictionary) {
        // 如果当前网站没有对应的词典，立即显示页面
        removeAntiFlickerStyle();
        return;
    }

    // 检查翻译文件是否启用
    if (!siteDictionary.enabled) {
        // 如果翻译文件被禁用，立即显示页面
        removeAntiFlickerStyle();
        return;
    }

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
        log(`初次翻译完成。使用语言: ${language || 'unknown'}`);

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