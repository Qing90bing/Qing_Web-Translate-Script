// 导入模块
import { SUPPORTED_LANGUAGE_CODES } from './config/languages.js';
import { log } from './modules/utils/logger.js';
import { initializeMenu } from './modules/ui/menu.js';
import { injectAntiFlickerStyle, removeAntiFlickerStyle } from './modules/ui/anti-flicker.js';
import { createTranslator } from './modules/core/translator.js';
import { initializeObservers } from './modules/core/observers.js';
import { initializeTranslation } from './modules/core/translationInitializer.js';

(async function () {
    'use strict';

    // 无论后续逻辑如何，首先初始化菜单，确保任何情况下菜单都可用
    initializeMenu();

    // 注入防闪烁样式
    injectAntiFlickerStyle();

    /**
     * @function getUserLanguage
     * @description 获取用户语言偏好。
     * @returns {string} 返回一个代表用户语言的代码（例如 'zh-cn'）。
     */
    function getUserLanguage() {
        // (调试模式) 检查是否有来自菜单的语言覆盖设置
        const overrideLang = GM_getValue('web-translate-language-override', '');
        if (overrideLang && SUPPORTED_LANGUAGE_CODES.includes(overrideLang)) {
            return overrideLang;
        }

        // 首先检查 localStorage 中是否有用户设置的语言
        const storedLang = localStorage.getItem('web-translate-language');
        if (storedLang && SUPPORTED_LANGUAGE_CODES.includes(storedLang)) {
            return storedLang;
        }

        // 然后检查浏览器语言设置
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const lowerBrowserLang = browserLang.toLowerCase();
            // 查找完全匹配的语言代码
            if (SUPPORTED_LANGUAGE_CODES.includes(lowerBrowserLang)) {
                return lowerBrowserLang;
            }
            // 查找部分匹配的语言代码（例如 'en-us' 匹配 'en'）
            const partialMatch = SUPPORTED_LANGUAGE_CODES.find(code =>
                lowerBrowserLang.startsWith(code)
            );
            if (partialMatch) {
                return partialMatch;
            }
        }

        // 默认返回 'zh-cn'
        return 'zh-cn';
    }

    /**
     * @function fetchWithFallbacks
     * @description 依次尝试从多个 URL 获取内容，直到成功为止。
     * @param {string[]} urls - 一个包含多个URL的数组。
     * @returns {Promise<string|null>} 返回第一个成功获取到的内容，如果全部失败则返回 null。
     */
    async function fetchWithFallbacks(urls) {
        for (const url of urls) {
            try {
                return await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        onload: (response) => {
                            if (response.status >= 200 && response.status < 300) {
                                resolve(response.responseText);
                            } else {
                                reject(new Error(`请求失败，状态码: ${response.status}`));
                            }
                        },
                        onerror: (error) => reject(new Error(`网络请求出错: ${error.statusText}`)),
                        ontimeout: () => reject(new Error('请求超时')),
                    });
                });
            } catch (error) {
                log(`从 ${url} 加载失败: ${error.message}`, 'error');
            }
        }
        return null;
    }

    /**
     * @function loadTranslationScript
     * @description 从 CDN 加载并执行翻译脚本。
     * @param {string} hostname - 当前网站的主机名。
     * @param {string} userLang - 用户的语言代码。
     * @returns {Promise<object|null>} 返回翻译词典对象，如果失败则返回 null。
     */
    async function loadTranslationScript(hostname, userLang) {
        const repoUser = 'qing90bing';
        const repoName = 'qing_web-translate-script';

        // 定义主 CDN (jsDelivr) 和备用 CDN (raw.githubusercontent) 的 URL
        const cdnUrls = [
            `https://cdn.jsdelivr.net/gh/${repoUser}/${repoName}@latest/src/translations/${userLang}/${hostname}.js`,
            `https://raw.githubusercontent.com/${repoUser}/${repoName}/main/src/translations/${userLang}/${hostname}.js`
        ];

        log(`正在尝试从 CDN 加载翻译文件: ${hostname}.js for ${userLang}...`);
        const scriptText = await fetchWithFallbacks(cdnUrls);

        if (!scriptText) {
            log(`无法从所有 CDN 源获取翻译文件: ${hostname}.js`, 'error');
            return null;
        }

        let blobUrl = '';
        try {
            // 为了绕过严格的CSP (Trusted Types)，我们将脚本文本创建一个Blob URL
            // 然后使用动态 import()，这被认为是安全的模块加载方式
            const blob = new Blob([scriptText], { type: 'text/javascript' });
            blobUrl = URL.createObjectURL(blob);

            const module = await import(blobUrl);
            const dictionary = Object.values(module)[0]; // 假设总是导出一个对象

            if (dictionary && typeof dictionary === 'object') {
                log(`成功从 CDN 加载并解析翻译: ${hostname}.js`, 'success');
                return dictionary;
            }
            log(`从 CDN 加载的脚本没有有效的导出对象: ${hostname}.js`, 'error');
            return null;
        } catch (e) {
            log(`执行从 CDN 加载的翻译脚本时出错: ${e.message}`, 'error');
            return null;
        } finally {
            // 释放创建的Blob URL以避免内存泄漏
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        }
    }

    // --- 主逻辑 ---
    const hostname = window.location.hostname;
    const userLang = getUserLanguage();

    const siteDictionary = await loadTranslationScript(hostname, userLang);

    if (!siteDictionary || !siteDictionary.enabled) {
        if (siteDictionary && !siteDictionary.enabled) {
            log(`网站 ${hostname} 的翻译词典已被禁用。`);
        } else {
            log(`未找到或加载失败 ${hostname} 的翻译词典。显示原始网页。`);
        }
        removeAntiFlickerStyle();
        return;
    }

    // 初始化翻译流程
    initializeTranslation(siteDictionary, createTranslator, removeAntiFlickerStyle, initializeObservers, log);

})();