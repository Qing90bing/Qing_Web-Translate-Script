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

 * 2. **性能优化**:
 *    - **时间切片调度 (Time Slicing)**: 废弃了传统的防抖机制，改用基于 `requestAnimationFrame` 的任务队列系统。
 *      将繁重的翻译任务和 Shadow DOM 检测任务统一在翻译遍历中完成，在每一帧的空闲时间执行，确保主线程永不阻塞，实现 60FPS 流畅滚动。
 *    - **统一遍历**: 在 `translator.translate` 过程中同时发现并监听 Shadow Root，消除了额外的扫描开销，并解决了任务调度导致的资源竞争问题。
 *    - **缓存清理**: 在重新翻译一个节点之前，会先从缓存中删除该节点及其所有子节点的旧翻译，确保翻译的准确性。
 */

import { log, debug } from '../utils/logger.js';
import { attributesToTranslate } from '../../config/index.js';
import { findAllShadowRoots } from '../utils/shadow-dom.js';

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

    // [Fix: Memory Leak] 提升变量作用域，以便在 pageObserver 中访问并清理
    let extendedContentObserver = null;
    let extendedAttributeObserver = null;

    /**
     * @function processQueue
     * @description 核心调度循环。使用时间切片处理队列中的任务。
     */
    function processQueue() {
        const frameStart = performance.now();
        let tasksProcessed = 0;

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
            try {
                if (!node.isConnected) return;

                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                    translator.translate(node);
                } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                    translator.translate(node.parentElement);
                }
                tasksProcessed++;
            } catch (e) {
                // 仅在调试模式下记录错误，防止控制台刷屏，同时确保循环不中断
                debug('翻译节点时出错 (已忽略，不影响主循环):', e);
            }
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

            // [Fix: Memory Leak] 断开旧页面元素的观察器，释放对 Detached DOM Nodes 的引用
            if (extendedContentObserver) extendedContentObserver.disconnect();
            if (extendedAttributeObserver) extendedAttributeObserver.disconnect();

            setTimeout(() => {
                log('开始重新翻译新页面内容...');
                if (document.body) {
                    translationQueue.add(document.body);
                    scheduleProcessing();
                }
            }, 300);
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
                        // [New Feature] 保存 Shadow Root 引用以支持 Closed 模式
                        // 这允许我们在后续遍历中通过 element._wtsShadowRoot 访问它
                        if (init && init.mode === 'closed') {
                            this._wtsShadowRoot = shadowRoot;
                        }

                        observeRoot(shadowRoot);
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

    // 初始化时，使用深度优先遍历进行一次全量 Shadow DOM 扫描。
    // 这能确保即使是深层嵌套的 Shadow Root 也能被发现并监听。
    const existingShadowRoots = findAllShadowRoots(document.body);
    if (existingShadowRoots.length > 0) {
        log(`初始化扫描发现 ${existingShadowRoots.length} 个现存 Shadow Roots`);
        existingShadowRoots.forEach(root => observeRoot(root));
    }

    pageObserver.observe(document.body, { childList: true, subtree: true });

    // 4. 页面标题变化监听器 (增强版：支持动态替换 title 标签)
    let titleObserver = null;

    // 标题内容变化的处理器
    const handleTitleContentChange = () => {
        const titleElement = document.querySelector('title');
        if (titleElement) {
            // 避免重复翻译导致的循环，先清理缓存
            translator.deleteElement(titleElement);
            translator.translate(titleElement);
            // debug('页面标题内容已更新并重新翻译');
        }
    };

    /**
     * @function attachTitleObserver
     * @description 将观察器绑定到具体的 title 元素上
     */
    const attachTitleObserver = (element) => {
        if (!element) return;

        // 如果旧的观察器存在，先 disconnect (虽然后面 new 会覆盖引用，但为了保险最好断开)
        if (titleObserver) {
            titleObserver.disconnect();
        }

        titleObserver = new MutationObserver(handleTitleContentChange);
        titleObserver.observe(element, {
            childList: true,
            subtree: true,
            characterData: true // 有些浏览器直接改 textNode
        });

        // 立即翻译一次，确保新绑定的 title 初始状态被翻译
        translator.deleteElement(element);
        translator.translate(element);
    };

    // 监听 document.head 以捕获 title 标签本身的替换 (SPA常见行为)
    const headObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeName === 'TITLE') {
                        // debug('检测到新的 <title> 标签被注入');
                        attachTitleObserver(node);
                    }
                }
            }
        }
    });

    const headElement = document.head || document.querySelector('head');
    if (headElement) {
        headObserver.observe(headElement, { childList: true });
    }

    // 初始绑定
    const currentTitle = document.querySelector('title');
    if (currentTitle) {
        attachTitleObserver(currentTitle);
    }

    window.forceRetranslate = function () {
        log('强制重新翻译已触发。');
        translator.resetState();
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

        // [Fix: Memory Leak] 使用外部定义的变量，而非在此处声明 const
        extendedContentObserver = new MutationObserver(extendedMutationHandler);
        extendedAttributeObserver = new MutationObserver(extendedMutationHandler);

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