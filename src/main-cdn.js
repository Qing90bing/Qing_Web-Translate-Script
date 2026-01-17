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
import { getUserLanguage } from './modules/utils/language.js';
import { log } from './modules/utils/logger.js';
import { initializeMenu } from './modules/ui/menu.js';
import { injectAntiFlickerStyle, removeAntiFlickerStyle } from './modules/ui/anti-flicker.js';
import { createTranslator } from './modules/core/translator.js';
import { initializeObservers } from './modules/core/observers.js';
import { initializeTranslation } from './modules/core/translationInitializer.js';

// 导入 CDN 配置
import {
    CDN_TIMEOUT_MS,
    CDN_MAX_RETRIES,
    CDN_RETRY_DELAY_MS,
    getCdnUrls
} from './config/cdn.js';

// 使用一个立即调用的异步函数表达式 (IIAFE) 来包裹整个逻辑，以支持顶层的 await。
(async function () {
    'use strict';

    // 无论后续逻辑如何，首先初始化菜单，确保任何情况下菜单都可用。
    initializeMenu();

    // 获取当前网站和用户语言
    const hostname = window.location.hostname;
    const userLang = getUserLanguage();

    // 检查当前语言是否支持该网站（使用 @require 预加载的列表）
    // 如果 SUPPORTED_SITES 存在且当前网站不在列表中，则直接跳过
    if (typeof SUPPORTED_SITES !== 'undefined') {
        const supportedList = SUPPORTED_SITES[userLang] || [];
        if (!supportedList.includes(hostname)) {
            // 该语言不支持此网站，直接返回，不发起任何网络请求
            log(`${hostname} 暂无可匹配的翻译`);
            return;
        }
    }

    // 网站在支持列表中，注入防闪烁样式
    injectAntiFlickerStyle();



    /**
     * @function fetchWithFallbacks
     * @description 依次尝试从多个 URL 获取内容，直到成功为止。
     * 每个 URL 支持重试机制，以处理瞬时网络波动。
     * @param {string[]} urls - 一个包含多个URL的数组，按优先级排列。
     * @returns {Promise<{content: string|null, sourceUrl: string|null}>} 返回第一个成功获取到的内容和其来源URL；如果全部失败则返回 null。
     */
    async function fetchWithFallbacks(urls) {
        for (const url of urls) {
            // 为每个 URL 执行重试逻辑
            for (let attempt = 1; attempt <= CDN_MAX_RETRIES; attempt++) {
                try {
                    const startTime = performance.now();
                    // 将基于回调的 GM_xmlhttpRequest 封装成一个 Promise
                    const result = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: url,
                            timeout: CDN_TIMEOUT_MS,
                            onload: (response) => {
                                const duration = performance.now() - startTime;
                                if (response.status >= 200 && response.status < 300) {
                                    log(`从 ${url} 成功加载，耗时: ${duration.toFixed(0)}ms`);
                                    resolve({ success: true, content: response.responseText });
                                } else if (response.status === 404) {
                                    // 404 表示文件不存在于仓库，完全停止尝试（换 CDN 也没用）
                                    log(`文件不存在 (404)`, 'warn');
                                    resolve({ success: false, notFound: true });
                                } else {
                                    // 其他 HTTP 错误，可以考虑重试
                                    log(`${url} 返回 ${response.status}`, 'error');
                                    reject(new Error(`HTTP_${response.status}`));
                                }
                            },
                            onerror: (error) => {
                                log(`${url} 网络错误: ${error.statusText}`, 'error');
                                reject(new Error('NETWORK_ERROR'));
                            },
                            ontimeout: () => {
                                log(`${url} 超时 (${CDN_TIMEOUT_MS}ms)`, 'error');
                                reject(new Error('TIMEOUT'));
                            },
                        });
                    });

                    // 处理结果
                    if (result.success) {
                        return { content: result.content, sourceUrl: url };
                    }
                    if (result.notFound) {
                        // 文件不存在，直接返回，不再尝试其他 CDN
                        return { content: null, sourceUrl: null };
                    }
                } catch (error) {
                    // 只有网络错误和超时才重试
                    log(`[${attempt}/${CDN_MAX_RETRIES}] ${url} 失败: ${error.message}`, 'error');
                    if (attempt < CDN_MAX_RETRIES) {
                        await new Promise(r => setTimeout(r, CDN_RETRY_DELAY_MS));
                    }
                }
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
        // 使用配置文件中的 getCdnUrls 函数生成 CDN URL 列表
        const cdnUrls = getCdnUrls(userLang, hostname);

        log(`正在从 CDN 加载: ${hostname}.js (${userLang})`);
        const result = await fetchWithFallbacks(cdnUrls);

        if (!result.content) {
            // 无需打印错误，fetchWithFallbacks 已经处理了日志
            return null;
        }

        // 内容验证：检查是否为有效的 JS 模块（应包含 export）
        const trimmedContent = result.content.trim();
        if (!trimmedContent.includes('export')) {
            log(`CDN 返回的内容不是有效的 JS 模块: ${hostname}.js`, 'error');
            return null;
        }

        let blobUrl = '';
        try {
            const blob = new Blob([result.content], { type: 'text/javascript' });
            blobUrl = URL.createObjectURL(blob);

            const module = await import(blobUrl);

            // 成功加载后立即释放 Blob URL
            URL.revokeObjectURL(blobUrl);
            blobUrl = ''; // 标记已释放

            const dictionary = Object.values(module)[0];

            if (dictionary && typeof dictionary === 'object') {
                log(`成功加载翻译: ${hostname}.js`, 'success');
                return dictionary;
            }
            log(`翻译文件格式无效: ${hostname}.js`, 'error');
            return null;
        } catch (e) {
            log(`解析翻译脚本出错: ${e.message}`, 'error');
            return null;
        } finally {
            // 仅在异常情况下释放（正常情况已在上面释放）
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        }
    }

    // --- 主逻辑 ---

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