/**
 * @file src/main-cdn.js
 * @description
 * 脚本的主入口文件（CDN 构建模式）。
 *
 * **核心职责**:
 * 此文件是作为“轻量级加载器”的角色。与将所有翻译数据打包的标准版不同，
 * 它负责在运行时动态地从 CDN (内容分发网络) 获取当前网站所需的翻译数据。
 *
 * **工作流程**:
 * 1.  **环境初始化**: 与标准版类似，立即注入防闪烁样式并初始化油猴菜单。
 * 2.  **语言确定**: 调用 `getUserLanguage` 确定用户的目标语言。
 * 3.  **翻译源确定**:
 *     a.  **优先检查嵌入式翻译**: 首先检查当前网站的翻译是否已被直接“嵌入”到脚本中（通过 `EMBEDDED_TRANSLATIONS` 全局变量）。这是为有严格内容安全策略（CSP）的网站准备的优化。
 *     b.  **从 CDN 加载**: 如果没有嵌入式翻译，则调用 `loadTranslationScript` 尝试从多个 CDN 源（主源和备用源）异步获取翻译文件。
 * 4.  **动态执行**: 使用 `Blob` 和动态 `import()` 技术来安全地执行从 CDN 获取的脚本代码，并从中提取出翻译词典对象。
 * 5.  **启动翻译**: 如果成功获取到词典并且该词典是启用的，则调用 `initializeTranslation` 启动完整的翻译流程，其后续步骤与标准版相同。
 * 6.  **失败处理**: 如果在任何步骤中失败（如无法获取词典），则中止执行并显示原始网页。
 */

// 导入模块
import { SUPPORTED_LANGUAGE_CODES } from './modules/utils/language.js';
import { log } from './modules/utils/logger.js';
import { initializeMenu } from './modules/ui/menu.js';
import { injectAntiFlickerStyle, removeAntiFlickerStyle } from './modules/ui/anti-flicker.js';
import { createTranslator } from './modules/core/translator.js';
import { initializeObservers } from './modules/core/observers.js';
import { initializeTranslation } from './modules/core/translationInitializer.js';

// 使用一个立即调用的异步函数表达式 (IIAFE) 来包裹整个逻辑，以支持顶层的 await。
(async function () {
    'use strict';

    // 无论后续逻辑如何，首先初始化菜单，确保任何情况下菜单都可用。
    initializeMenu();

    // 立即注入防闪烁样式。
    injectAntiFlickerStyle();

    /**
     * @function getUserLanguage
     * @description 获取用户语言偏好，逻辑与 main.js 中的版本相同。
     * @returns {string} 返回一个代表用户语言的代码（例如 'zh-cn'）。
     */
    function getUserLanguage() {
        const overrideLang = GM_getValue('web-translate-language-override', '');
        if (overrideLang && SUPPORTED_LANGUAGE_CODES.includes(overrideLang)) return overrideLang;
        const storedLang = localStorage.getItem('web-translate-language');
        if (storedLang && SUPPORTED_LANGUAGE_CODES.includes(storedLang)) return storedLang;
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            const lowerBrowserLang = browserLang.toLowerCase();
            if (SUPPORTED_LANGUAGE_CODES.includes(lowerBrowserLang)) return lowerBrowserLang;
            const partialMatch = SUPPORTED_LANGUAGE_CODES.find(code => lowerBrowserLang.startsWith(code));
            if (partialMatch) return partialMatch;
        }
        return 'zh-cn';
    }

    /**
     * @function fetchWithFallbacks
     * @description 依次尝试从多个 URL 获取内容，直到成功为止。这是一个提供网络冗余的关键函数。
     * @param {string[]} urls - 一个包含多个URL的数组，按优先级排列。
     * @returns {Promise<{content: string|null, sourceUrl: string|null}>} 返回第一个成功获取到的内容和其来源URL；如果全部失败则返回 null。
     */
    async function fetchWithFallbacks(urls) {
        for (const url of urls) {
            try {
                const startTime = performance.now();
                // 将基于回调的 GM_xmlhttpRequest 封装成一个 Promise，以便在 async/await 流程中使用。
                const content = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        onload: (response) => {
                            const duration = performance.now() - startTime;
                            if (response.status >= 200 && response.status < 300) {
                                log(`从 ${url} 成功加载内容，状态码: ${response.status}，耗时: ${duration.toFixed(2)}ms`);
                                resolve(response.responseText);
                            } else {
                                log(`从 ${url} 请求失败，状态码: ${response.status}，耗时: ${duration.toFixed(2)}ms`, 'error');
                                reject(new Error(`请求失败，状态码: ${response.status}`));
                            }
                        },
                        onerror: (error) => {
                            const duration = performance.now() - startTime;
                            log(`从 ${url} 网络请求出错: ${error.statusText}，耗时: ${duration.toFixed(2)}ms`, 'error');
                            reject(new Error(`网络请求出错: ${error.statusText}`));
                        },
                        ontimeout: () => {
                            const duration = performance.now() - startTime;
                            log(`从 ${url} 请求超时，耗时: ${duration.toFixed(2)}ms`, 'error');
                            reject(new Error('请求超时'));
                        },
                    });
                });
                return { content, sourceUrl: url };
            } catch (error) {
                log(`从 ${url} 加载失败: ${error.message}`, 'error');
            }
        }
        return { content: null, sourceUrl: null };
    }

    /**
     * @function loadTranslationScript
     * @description 从 CDN 加载并安全地执行翻译脚本。
     * @param {string} hostname - 当前网站的主机名。
     * @param {string} userLang - 用户的语言代码。
     * @returns {Promise<object|null>} 返回翻译词典对象，如果失败则返回 null。
     */
    async function loadTranslationScript(hostname, userLang) {
        const repoUser = 'qing90bing';
        const repoName = 'qing_web-translate-script';

        // 为了防止浏览器或 CDN 缓存旧版本的脚本，为 jsDelivr URL 添加一个基于时间的缓存破坏参数。
        const cacheBuster = `?v=${new Date().getTime()}`;

        // 定义主 CDN (raw.githubusercontent) 和备用 CDN (jsDelivr) 的 URL 列表。
        const cdnUrls = [
            `https://raw.githubusercontent.com/${repoUser}/${repoName}/main/src/translations/${userLang}/sites/${hostname}.js`,
            `https://cdn.jsdelivr.net/gh/${repoUser}/${repoName}@latest/src/translations/${userLang}/sites/${hostname}.js${cacheBuster}`
        ];

        log(`正在尝试从 CDN 加载翻译文件: ${hostname}.js for ${userLang}...`);
        const result = await fetchWithFallbacks(cdnUrls);

        if (!result.content) {
            log(`无法从所有 CDN 源获取翻译文件: ${hostname}.js`, 'error');
            return null;
        }

        log(`成功从 ${result.sourceUrl} 获取到翻译文件内容`);

        let blobUrl = '';
        try {
            // **安全执行远程代码的关键步骤**:
            // 为了绕过严格的 CSP (特别是 Trusted Types)，我们将获取到的脚本文本包装成一个 Blob 对象，
            // 然后为其创建一个临时的、唯一的 Blob URL。
            const blob = new Blob([result.content], { type: 'text/javascript' });
            blobUrl = URL.createObjectURL(blob);

            // 使用动态 import() 来加载这个 Blob URL。这被现代浏览器认为是安全的模块加载方式。
            const module = await import(blobUrl);
            const dictionary = Object.values(module)[0]; // 假设模块总是默认导出一个对象。

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
            // 释放已创建的 Blob URL 以避免内存泄漏。
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        }
    }

    // --- 主逻辑 ---
    const hostname = window.location.hostname;
    const userLang = getUserLanguage();

    let siteDictionary = null;

    // 检查是否存在由构建过程注入的全局嵌入式翻译对象。
    if (typeof EMBEDDED_TRANSLATIONS !== 'undefined' && typeof EMBEDDED_SITES !== 'undefined') {
        // 优先级 1: 尝试从嵌入式对象中获取翻译。
        if (EMBEDDED_TRANSLATIONS[userLang]?.[hostname]) {
            log(`找到 ${hostname} 的内联翻译 (${userLang})。`);
            siteDictionary = EMBEDDED_TRANSLATIONS[userLang][hostname];
        } else if (EMBEDDED_SITES.includes(hostname)) {
            // 如果网站在嵌入列表中，但没有找到当前语言的翻译，则中止流程，不尝试从 CDN 加载。
            // 这是因为嵌入列表中的网站通常意味着无法从 CDN 加载。
            log(`网站 ${hostname} 在嵌入列表中，但未找到 ${userLang} 的翻译。显示原始网页。`);
            removeAntiFlickerStyle();
            return;
        }
    }

    // 优先级 2: 如果没有找到嵌入式翻译，则尝试从 CDN 加载。
    if (!siteDictionary) {
        log(`未找到内联翻译，尝试从 CDN 加载...`);
        siteDictionary = await loadTranslationScript(hostname, userLang);
    }

    // 检查最终获取的词典是否有效和启用。
    if (!siteDictionary || !siteDictionary.enabled) {
        if (siteDictionary && !siteDictionary.enabled) {
            log(`网站 ${hostname} 的翻译词典已被禁用。`);
        } else {
            log(`未找到或加载失败 ${hostname} 的翻译词典。显示原始网页。`);
        }
        removeAntiFlickerStyle();
        return;
    }

    // 如果一切顺利，启动翻译流程。
    initializeTranslation(siteDictionary, createTranslator, removeAntiFlickerStyle, initializeObservers, log);

})();