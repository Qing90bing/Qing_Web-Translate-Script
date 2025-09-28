/**
 * @file src/main.js
 * @description
 * 脚本的主入口文件（标准构建模式）。
 *
 * **核心职责**:
 * 1.  **模块编排**: 导入所有必需的模块，包括翻译数据、核心功能模块和 UI 模块。
 * 2.  **环境初始化**: 在脚本开始时立即注入“防闪烁”样式并初始化油猴菜单。
 * 3.  **语言与词典选择**:
 *     -   通过 `getUserLanguage` 函数，根据“调试覆盖 -> 浏览器语言”的优先级顺序确定要使用的目标语言。
 *     -   通过 `selectTranslationForSite` 函数，根据当前网站的域名和确定的语言，从 `masterTranslationMap` 中查找并选择合适的翻译词典。
 * 4.  **启动翻译流程**:
 *     -   如果找到了适用且已启用的词典，则调用 `initializeTranslation`，并将所有必要的依赖（如词典、核心函数）注入其中，正式启动翻译流程。
 *     -   如果没有找到词典或词典被禁用，则直接移除“防闪烁”样式并中止脚本执行。
 * 5.  **防止摇树优化 (Tree-shaking)**: 使用一个立即调用函数表达式 (IIFE) 来包裹整个逻辑，并将 `masterTranslationMap` 作为参数传入。这可以确保即使某些翻译模块在代码中没有被直接引用，构建工具（如 esbuild）也不会错误地将它们从最终的打包文件中移除。
 */

// 导入主翻译映射，它包含了所有网站的所有语言版本的翻译数据。
import { masterTranslationMap } from './translations/index.js';

// 导入配置和模块
import { SUPPORTED_LANGUAGE_CODES } from './config/languages.js';
import { log } from './modules/utils/logger.js';
import { initializeMenu } from './modules/ui/menu.js';
import { injectAntiFlickerStyle, removeAntiFlickerStyle } from './modules/ui/anti-flicker.js';
import { createTranslator } from './modules/core/translator.js';
import { initializeObservers } from './modules/core/observers.js';
import { initializeTranslation } from './modules/core/translationInitializer.js';

// 使用 IIFE 来创建一个独立的作用域，并防止构建工具进行不当的摇树优化。
(function (translations) {
    'use strict';

    // 无论后续逻辑如何，首先初始化菜单，确保任何情况下菜单都可用。
    initializeMenu();

    // 立即注入防闪烁样式，以防止页面在翻译完成前出现内容闪烁。
    injectAntiFlickerStyle();

    /**
     * @function getUserLanguage
     * @description 确定要使用的目标语言。
     * @returns {string} 最终确定的语言代码。
     */
    function getUserLanguage() {
        // 优先级 1: (调试模式) 检查是否有来自油猴菜单的语言强制覆盖设置。
        const overrideLang = GM_getValue('web-translate-language-override', '');
        if (overrideLang && SUPPORTED_LANGUAGE_CODES.includes(overrideLang)) {
            return overrideLang;
        }

        // 优先级 2: 检查 localStorage 中是否有用户通过其他方式设置的语言（为未来功能保留）。
        const storedLang = localStorage.getItem('web-translate-language');
        if (storedLang && SUPPORTED_LANGUAGE_CODES.includes(storedLang)) {
            return storedLang;
        }
        
        // 优先级 3: 检查浏览器的语言设置。
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            // 尝试将浏览器语言（可能包含地区代码，如 'en-US'）映射到我们支持的语言代码。
            // a. 查找完全匹配的语言代码。
            const exactMatch = SUPPORTED_LANGUAGE_CODES.find(code => 
                browserLang.toLowerCase() === code.toLowerCase()
            );
            if (exactMatch) return exactMatch;
            
            // b. 查找部分匹配的语言代码（例如，浏览器是 'zh-HK'，我们支持 'zh-hk'）。
            const partialMatch = SUPPORTED_LANGUAGE_CODES.find(code => 
                browserLang.toLowerCase().startsWith(code.toLowerCase())
            );
            if (partialMatch) return partialMatch;
            
            // c. 特殊处理中文变体：如果浏览器是任何中文变体（如 'zh-SG'），则回退到我们支持的第一个中文变体。
            if (browserLang.toLowerCase().startsWith('zh')) {
                const chineseVariant = SUPPORTED_LANGUAGE_CODES.find(code => 
                    code.toLowerCase().startsWith('zh')
                );
                if (chineseVariant) return chineseVariant;
            }
        }
        
        // 优先级 4: 如果以上都失败，则默认返回我们支持的第一个语言作为后备。
        return SUPPORTED_LANGUAGE_CODES[0] || 'zh-cn';
    }

    /**
     * @function selectTranslationForSite
     * @description 根据当前网站域名和用户语言偏好，从主翻译映射中选择合适的词典。
     * @param {string} hostname - 当前网站的域名。
     * @returns {object | undefined} 如果找到匹配的词典则返回该对象，否则返回 undefined。
     */
    function selectTranslationForSite(hostname) {
        const userLang = getUserLanguage();
        
        // 尝试使用 `域名#语言` 的格式查找特定语言的词典。
        const langSpecificKey = `${hostname}#${userLang}`;
        if (translations[langSpecificKey]) {
            return translations[langSpecificKey];
        }
        
        // 如果没有找到，则返回 undefined，表示此网站/语言组合没有可用的翻译。
        return undefined;
    }

    // --- 启动流程 ---

    // 1. 获取当前网站的词典。
    const siteDictionary = selectTranslationForSite(window.location.hostname);

    // 2. 如果没有找到词典，或者词典被明确禁用，则中止翻译流程。
    if (!siteDictionary || !siteDictionary.enabled) {
        // 立即移除防闪烁样式，以显示原始页面。
        removeAntiFlickerStyle();
        // 结束脚本执行。
        return;
    }

    log(`开始为网站 ${window.location.hostname} 初始化翻译，使用语言: ${siteDictionary.language}`);
    
    // 3. 如果找到有效的词典，则启动完整的翻译初始化流程。
    //    这里采用了依赖注入的方式，将所有需要的模块和配置传递给初始化函数。
    initializeTranslation(siteDictionary, createTranslator, removeAntiFlickerStyle, initializeObservers, log);

})(masterTranslationMap); // 将导入的主翻译映射作为参数传入 IIFE。