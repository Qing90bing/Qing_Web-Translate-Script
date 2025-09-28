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
 *    - **防抖 (Debounce)**: 通过 `scheduleTranslation` 函数，将短时间内发生的大量 DOM 变动合并到一次批量处理中，极大地减少了翻译函数的调用次数，避免性能瓶颈。
 *    - **缓存清理**: 在重新翻译一个节点之前，会先从缓存中删除该节点及其所有子节点的旧翻译，确保翻译的准确性。
 */

import { log, debug, perf } from '../utils/logger.js';

/**
 * @function initializeObservers
 * @description 初始化并启动所有 MutationObservers，为页面提供动态翻译能力。
 * @param {object} translator - 从 `translator.js` 的 `createTranslator` 函数返回的翻译器实例。
 */
export function initializeObservers(translator) {
    // --- 状态与调度器定义 ---

    // 用于防抖的计时器 ID
    let translationTimer;
    // 使用 Set 存储待处理的节点，自动去重
    let pendingNodes = new Set();
    // 用于追踪当前 AI 模型的名称，以检测模型切换
    let lastModelInfo = '';

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
            setTimeout(() => {
                if (document.body) {
                    translator.translate(document.body);
                }
            }, 100); // 延迟以等待 UI 更新完成

            return true;
        }
        return false;
    }

    /**
     * @function scheduleTranslation
     * @description 调度一次批量翻译。
     *              这是一个防抖函数，它将短时间内的多次调用合并为一次执行。
     */
    function scheduleTranslation() {
        clearTimeout(translationTimer);
        // 使用 setTimeout(..., 0) 将任务推迟到当前宏任务队列的末尾，
        // 允许在执行前收集所有同期的 DOM 变动。
        translationTimer = setTimeout(() => {
            // 在处理前，先检查是否有模型切换
            const hasModelChange = detectModelChange();

            if (pendingNodes.size > 0) {
                const nodesToProcess = Array.from(pendingNodes);
                pendingNodes.clear();

                if (nodesToProcess.length > 5) {
                    debug(`处理 ${nodesToProcess.length} 个待翻译节点`);
                }
                
                const startTime = performance.now();
                
                // 批量处理所有待翻译节点
                nodesToProcess.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        translator.translate(node);
                    } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                        translator.translate(node.parentElement);
                    }
                });
                
                const duration = performance.now() - startTime;
                perf('批量翻译', duration, `${nodesToProcess.length} 个节点`);
            }

            // 如果发生了模型切换，但没有其他挂起的节点，确保页面仍然被重新翻译。
            if (hasModelChange && pendingNodes.size === 0) {
                if (document.body) {
                    translator.translate(document.body);
                }
            }
        }, 0);
    }

    // --- MutationObserver 实例定义 ---

    // 1. 主内容变化监听器：负责处理绝大部分的 DOM 变动。
    const mainObserver = new MutationObserver((mutations) => {
        const dirtyRoots = new Set();
        
        for (const mutation of mutations) {
            let target = null;
            if (mutation.type === 'childList') {
                target = mutation.target;
            } else if (mutation.type === 'attributes') {
                target = mutation.target;
            } else if (mutation.type === 'characterData') {
                target = mutation.target.parentElement;
            }
            if (target instanceof Element) dirtyRoots.add(target);
        }
        
        if (dirtyRoots.size > 0) {
            for (const root of dirtyRoots) {
                // **关键步骤**: 在重新翻译前，必须先清除该节点及其所有后代的缓存。
                // 否则，如果一个已翻译的节点内部发生变化，旧的翻译文本（缓存）可能会被错误地保留。
                translator.deleteElement(root);
                const descendants = root.getElementsByTagName('*');
                for (let i = 0; i < descendants.length; i++) {
                    translator.deleteElement(descendants[i]);
                }
                // 将“脏”节点加入待处理队列
                pendingNodes.add(root);
            }
            // 调度一次批量翻译
            scheduleTranslation();
        }
    });

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
                if (document.body) translator.translate(document.body);
            }, 300); // 延迟以等待新页面组件加载完成
        }
    });

    // 3. 模型切换监听器：更精确、更快速地响应模型切换事件。
    const modelChangeObserver = new MutationObserver((mutations) => {
        let shouldCheckModel = false;
        mutations.forEach((mutation) => {
            // 检查是否有与模型信息相关的节点被添加或修改
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
                if (parent?.classList?.contains('model-name') ||
                    parent?.classList?.contains('model-info') ||
                    parent?.querySelector?.('.model-name, .model-info')) {
                    shouldCheckModel = true;
                }
            }
        });
        if (shouldCheckModel) {
            setTimeout(() => detectModelChange(), 50); // 快速响应模型切换
        }
    });

    // --- 启动所有监听器 ---
    mainObserver.observe(document.body, {
        childList: true, // 监听子节点的添加或删除
        subtree: true,   // 监听以 document.body 为根的所有后代节点
        attributes: true, // 监听属性变化
        attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'], // 只关心这些可能包含文本的属性
        characterData: true // 监听文本节点的内容变化
    });
    
    pageObserver.observe(document.body, { childList: true, subtree: true });

    modelChangeObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // 在 window 对象上暴露一个强制重翻的函数，便于手动调试。
    window.forceRetranslate = function () {
        log('强制重新翻译已触发。');
        translator.resetState();
        lastModelInfo = '';
        if (document.body) {
            translator.translate(document.body);
        }
    };

    log('监听器初始化完成。');
}