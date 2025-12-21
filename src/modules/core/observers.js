/**
 * @file src/modules/core/observers.js
 * @description
 * 负责初始化和管理多个 `MutationObserver` 实例，以实现对页面动态内容的实时翻译。
 * 这是使翻译功能在单页应用（SPA）和动态网页中保持“活性”的核心模块。
 *
 * **核心策略**:
 * 1. **多观察者分离关注点**:
 *    - `mainObserver`: 负责绝大多数的 DOM 变动，如节点增删、属性修改和文本内容变化。
 *    - `pageObserver`: 专门用于检测 SPA 中的页面导航（URL 变化）。
 *    - `modelChangeObserver`: 专门用于快速响应 AI 模型切换等特定、高优先级的 UI 变化。
 * 2. **性能优化**:
 *    - **时间切片调度 (Time Slicing)**: 废弃了传统的防抖机制，改用基于 `requestAnimationFrame` 的任务队列系统。
 *      将繁重的翻译任务和 Shadow DOM 检测任务统一在翻译遍历中完成，在每一帧的空闲时间执行，确保主线程永不阻塞，实现 60FPS 流畅滚动。
 *    - **统一遍历**: 在 `translator.translate` 过程中同时发现并监听 Shadow Root，消除了额外的扫描开销，并解决了任务调度导致的资源竞争问题。
 *    - **缓存清理**: 在重新翻译一个节点之前，会先从缓存中删除该节点及其所有子节点的旧翻译，确保翻译的准确性。
 */

import { log, debug, perf } from '../utils/logger.js';
import { attributesToTranslate } from '../../config.js';

/**
 * @function initializeObservers
 * @description 初始化并启动所有 MutationObservers，为页面提供动态翻译能力。
 * @param {object} translator - 从 `translator.js` 的 `createTranslator` 函数返回的翻译器实例。
 */
export function initializeObservers(translator, extendedElements = [], customAttributes = [], blockedAttributes = []) {
    // --- 状态与调度器定义 ---

    // 1. 任务队列
    // 使用 Set 存储待翻译的节点，自动去重。
    // 注意：不再需要独立的 shadowCheckQueue，因为翻译过程会自动发现并注册 Shadow Root。
    const translationQueue = new Set();

    // 2. 调度器状态
    let isScheduled = false;
    const FRAME_BUDGET = 12; // 每帧最大执行时间 (ms)，留给浏览器渲染

    // 用于追踪当前 AI 模型的名称，以检测模型切换
    let lastModelInfo = '';

    /**
     * @function processQueue
     * @description 核心调度循环。使用时间切片处理队列中的任务。
     */
    function processQueue() {
        const frameStart = performance.now();
        let tasksProcessed = 0;

        // 1. 优先检测模型切换 (高优先级)
        const hasModelChange = detectModelChange();
        if (hasModelChange && translationQueue.size === 0) {
            if (document.body) {
                translator.translate(document.body);
            }
        }

        // 2. 处理翻译队列
        // 辅助函数：处理队列直到时间耗尽
        const processSet = (queue, processor) => {
            if (queue.size === 0) return true; // 完成

            const iterator = queue[Symbol.iterator]();
            let result = iterator.next();

            while (!result.done) {
                if (performance.now() - frameStart > FRAME_BUDGET) {
                    return false; // 未完成，时间耗尽
                }

                const item = result.value;
                queue.delete(item); // 从队列移除
                processor(item);

                result = iterator.next();
            }
            return true; // 完成
        };

        const translationProcessor = (node) => {
            if (!node.isConnected) return;

            if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                translator.translate(node);
            } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                translator.translate(node.parentElement);
            }
            tasksProcessed++;
        };

        if (!processSet(translationQueue, translationProcessor)) {
            // 还有剩余任务，请求下一帧
            requestAnimationFrame(processQueue);
            return;
        }

        // 所有队列已清空
        isScheduled = false;

        // 可选：性能打点
        // if (tasksProcessed > 0) perf('时间切片批处理', performance.now() - frameStart, `${tasksProcessed} 个节点`);
    }

    /**
     * @function scheduleProcessing
     * @description 请求调度处理。
     */
    function scheduleProcessing() {
        if (!isScheduled) {
            isScheduled = true;
            requestAnimationFrame(processQueue);
        }
    }

    /**
     * @function detectModelChange
     * @description 检测页面中表示 AI 模型信息的元素是否发生变化。
     *              这对于 AI 对话界面至关重要，因为切换模型通常需要更新整个界面的翻译。
     * @returns {boolean} 如果检测到模型变化，则返回 true。
     */
    function detectModelChange() {
        const modelElements = document.querySelectorAll('.model-name, .model-info, [class*="model"]');
        const currentModelInfo = Array.from(modelElements).map(el => el.textContent?.trim()).join('|');

        if (currentModelInfo && currentModelInfo !== lastModelInfo) {
            lastModelInfo = currentModelInfo;
            log('检测到模型切换:', currentModelInfo);

            // 重置翻译器状态（清除所有缓存）并重新翻译整个页面。
            translator.resetState();

            // 模型切换是重大 UI 变更，我们稍微延迟以等待 DOM 稳定，然后强制翻译整个 body
            setTimeout(() => {
                if (document.body) {
                    translationQueue.add(document.body);
                    scheduleProcessing();
                }
            }, 100);

            return true;
        }
        return false;
    }

    // --- MutationObserver 实例定义 ---

    const mutationHandler = (mutations) => {
        let hasUpdates = false;

        for (const mutation of mutations) {
            // 1. 处理新增节点
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 仅需加入翻译队列。Shadow Root 发现和监听将由 translator 在遍历过程中自动触发。
                        translationQueue.add(node);
                        translator.deleteElement(node); // 确保新节点无缓存
                        hasUpdates = true;
                    } else if (node.nodeType === Node.TEXT_NODE) {
                        // 文本节点变动需要翻译其父元素
                        if (node.parentElement) {
                            translationQueue.add(node.parentElement);
                            translator.deleteElement(node.parentElement);
                            hasUpdates = true;
                        }
                    }
                });

            } else if (mutation.type === 'attributes') {
                const target = mutation.target;
                translationQueue.add(target);
                translator.deleteElement(target);
                hasUpdates = true;

            } else if (mutation.type === 'characterData') {
                const target = mutation.target.parentElement;
                if (target) {
                    translationQueue.add(target);
                    translator.deleteElement(target);
                    hasUpdates = true;
                }
            }
        }

        if (hasUpdates) {
            scheduleProcessing();
        }
    };

    // 1. 主内容变化监听器
    const mainObserver = new MutationObserver(mutationHandler);

    // 使用一个 Set 来跟踪已经附加了观察器的 ShadowRoot，防止重复操作。
    const observedShadowRoots = new WeakSet();

    /**
     * @function observeRoot
     * @description (新增) 动态地为一个根节点（document.body 或 shadowRoot）附加 MutationObserver。
     * @param {Node} root - 要监听的根节点。
     */
    function observeRoot(root) {
        if (!root || observedShadowRoots.has(root)) {
            return;
        }

        // debug('正在动态监听新的根节点:', root); // 减少日志以提升性能
        const observer = new MutationObserver(mutationHandler);
        observer.observe(root, observerConfig);
        observedShadowRoots.add(root);
    }

    // 2. SPA 页面导航监听器：专门用于检测 URL 变化。
    let currentUrl = window.location.href;
    const pageObserver = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            log('检测到页面导航，将重新翻译:', currentUrl);
            // 页面导航是重大变化，需要完全重置状态。
            translator.resetState();
            lastModelInfo = '';
            setTimeout(() => {
                log('开始重新翻译新页面内容...');
                if (document.body) {
                    translationQueue.add(document.body);
                    scheduleProcessing();
                }
            }, 300);
        }
    });

    // 3. 模型切换监听器
    const modelChangeObserver = new MutationObserver((mutations) => {
        let shouldCheckModel = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node;
                        if (element.classList?.contains('mat-mdc-dialog-component-host') ||
                            element.querySelector?.('.model-name, .model-info') ||
                            element.classList?.contains('model-name') ||
                            element.classList?.contains('model-info')) {
                            shouldCheckModel = true;
                        }
                    }
                });
            }
            if (mutation.type === 'characterData') {
                const parent = mutation.target.parentElement;
                if (parent) {
                    if (parent.classList?.contains('model-name') ||
                        parent.classList?.contains('model-info') ||
                        parent.querySelector?.('.model-name, .model-info')) {
                        shouldCheckModel = true;
                    }
                }
            }
        });
        if (shouldCheckModel) {
            setTimeout(() => detectModelChange(), 0);
        }
    });

    // --- 启动所有监听器 ---

    const whitelist = new Set([...attributesToTranslate, ...customAttributes]);
    for (const attr of blockedAttributes) {
        whitelist.delete(attr);
    }
    const finalAttributeFilter = [...whitelist];

    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: finalAttributeFilter,
        characterData: true
    };

    // 关键：注册 Shadow Root 发现回调
    if (translator.setShadowRootCallback) {
        translator.setShadowRootCallback((shadowRoot) => {
            observeRoot(shadowRoot);
        });
    }

    // --- Monkey Patch: 拦截 attachShadow 以捕获动态创建的 Shadow Root ---
    function patchAttachShadow(win, winName) {
        try {
            if (!win || !win.Element || !win.Element.prototype || !win.Element.prototype.attachShadow) {
                // debug(`[${winName}] 环境不支持 attachShadow Patch (缺少必要对象)`);
                return false;
            }

            const originalAttachShadow = win.Element.prototype.attachShadow;

            // 防止重复 patch
            if (originalAttachShadow._isPatchedByWTS) {
                // debug(`[${winName}] attachShadow 已经被 Patch 过了`);
                return true;
            }

            const patchedAttachShadow = function (init) {
                const shadowRoot = originalAttachShadow.call(this, init);
                try {
                    if (shadowRoot) {
                        observeRoot(shadowRoot);
                        // 额外做一个简单的检查，如果是在翻译队列中已有的元素，可能需要重新调度？
                        // 不，observeRoot 足够了。
                    }
                } catch (e) {
                    // console.warn('处理 ShadowRoot 失败:', e);
                }
                return shadowRoot;
            };

            // 标记我们的 patch 函数，防止被重复应用
            patchedAttachShadow._isPatchedByWTS = true;

            // 尝试使用 assignment
            try {
                win.Element.prototype.attachShadow = patchedAttachShadow;
            } catch (err) {
                // 如果 assignment 失败 (可能是 readonly)，尝试 defineProperty
                try {
                    Object.defineProperty(win.Element.prototype, 'attachShadow', {
                        value: patchedAttachShadow,
                        writable: true,
                        configurable: true
                    });
                } catch (err2) {
                    throw new Error(`Assignment failed: ${err.message}, DefineProperty failed: ${err2.message}`);
                }
            }

            // 验证是否生效
            if (win.Element.prototype.attachShadow !== patchedAttachShadow) {
                throw new Error('Patch 写入后未生效 (可能被重置或被 Proxy 拦截)');
            }

            log(`[${winName}] 已成功拦截 Element.prototype.attachShadow`);
            return true;

        } catch (e) {
            // 仅在调试模式或确实失败时记录，避免惊吓用户。
            // 如果两个环境都失败了，那是问题。如果一个成功一个失败，可能正常。
            debug(`[${winName}] 拦截 attachShadow 失败:`, e.message);
            return false;
        }
    }

    // 尝试 Patch 当前窗口环境
    const resultWindow = patchAttachShadow(window, 'window');

    // 尝试 Patch 页面原始窗口环境 (如果是油猴环境且存在 unsafeWindow)
    let resultUnsafe = false;
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow !== window) {
        resultUnsafe = patchAttachShadow(unsafeWindow, 'unsafeWindow');
    }

    // 汇总报告
    if (!resultWindow && !resultUnsafe) {
        log('警告: 无法在任何环境中拦截 attachShadow。动态 Shadow DOM 翻译可能会失效。这通常是由于网站严格的 CSP 或安全策略导致。');
    }

    // 启动主观察器来监听 document.body (保持原有逻辑)
    // 注意：在这里调用 observeRoot 是安全的，即使 patch 失败，至少我们还能监听主文档的变化。
    observeRoot(document.body);

    // 初始化时，使用 TreeWalker 进行一次全量 Shadow DOM 扫描。
    // 或者页面可能有未被翻译的部分。为了安全，保留这个初始化扫描。
    const initWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (n) => n.shadowRoot ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    });
    while (initWalker.nextNode()) {
        observeRoot(initWalker.currentNode.shadowRoot);
    }

    pageObserver.observe(document.body, { childList: true, subtree: true });

    modelChangeObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // 4. 页面标题变化监听器
    const titleObserver = new MutationObserver(() => {
        const titleElement = document.querySelector('title');
        if (titleElement) {
            translator.deleteElement(titleElement);
            translator.translate(titleElement); // 标题通常很短，直接同步翻译无妨，且不在 body 内
            debug('页面标题已重新翻译');
        }
    });

    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleObserver.observe(titleElement, {
            childList: true,
            subtree: true
        });
    }

    window.forceRetranslate = function () {
        log('强制重新翻译已触发。');
        translator.resetState();
        lastModelInfo = '';
        if (document.body) {
            translationQueue.add(document.body);
            scheduleProcessing();
        }
    };

    // 5. 扩展元素监听器
    if (extendedElements.length > 0) {
        // 扩展元素的逻辑稍微复杂，为了保持一致性，
        // 我们也将触发翻译的任务统一扔进 translationQueue。

        const extendedMutationHandler = (mutations) => {
            let hasUpdates = false;
            for (const mutation of mutations) {
                let target;
                if (mutation.type === 'characterData') {
                    target = mutation.target.parentElement;
                } else if (mutation.type === 'attributes') {
                    target = mutation.target;
                }

                if (target instanceof Element) {
                    translator.deleteElement(target);
                    translationQueue.add(target);
                    hasUpdates = true;
                }
            }
            if (hasUpdates) scheduleProcessing();
        };

        const extendedContentObserver = new MutationObserver(extendedMutationHandler);
        const extendedAttributeObserver = new MutationObserver(extendedMutationHandler);

        log(`正在为 ${extendedElements.length} 个选择器初始化扩展元素监控。`);

        const processExtendedElements = (elements) => {
            if (elements.length === 0) return;
            elements.forEach(element => {
                translator.deleteElement(element);
                translationQueue.add(element);

                // 确保监听
                extendedContentObserver.observe(element, { characterData: true, subtree: true });
                extendedAttributeObserver.observe(element, { attributes: true, subtree: true });
            });
            scheduleProcessing();
        };

        // 初始处理
        extendedElements.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    processExtendedElements(Array.from(elements));
                }
            } catch (e) {
                console.error(`extendedElements 中的选择器无效: "${selector}"`, e);
            }
        });

        // 动态添加处理
        const additionObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            extendedElements.forEach(selector => {
                                const matchedElements = [];
                                if (addedNode.matches(selector)) matchedElements.push(addedNode);
                                addedNode.querySelectorAll(selector).forEach(el => matchedElements.push(el));

                                if (matchedElements.length > 0) {
                                    processExtendedElements(matchedElements);
                                }
                            });
                        }
                    }
                }
            }
        });

        additionObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        log('扩展元素观察器已激活。');
    }

    log('监听器初始化完成 (Time Slicing Enabled)。');
}