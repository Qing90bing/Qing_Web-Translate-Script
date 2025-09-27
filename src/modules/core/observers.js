import { log, debug, perf } from '../utils/logger.js';

/**
 * 初始化并启动所有 MutationObservers。
 * @param {object} translator - 从 createTranslator 返回的翻译器实例。
 */
export function initializeObservers(translator) {
    // 智能观察器，使用防抖(debounce)优化性能，并增强模型切换检测
    let translationTimer;
    let pendingNodes = new Set();
    let lastModelInfo = '';

    // 检测模型信息变化的函数
    function detectModelChange() {
        const modelElements = document.querySelectorAll('.model-name, .model-info, [class*="model"]');
        const currentModelInfo = Array.from(modelElements).map(el => el.textContent?.trim()).join('|');

        if (currentModelInfo && currentModelInfo !== lastModelInfo) {
            lastModelInfo = currentModelInfo;
            log('检测到模型切换:', currentModelInfo);

            // 重置翻译器状态并重新翻译
            translator.resetState();
            setTimeout(() => {
                if (document.body) {
                    translator.translate(document.body);
                }
            }, 100);

            return true;
        }
        return false;
    }

    function scheduleTranslation() {
        clearTimeout(translationTimer);
        translationTimer = setTimeout(() => {
            const hasModelChange = detectModelChange();

            if (pendingNodes.size > 0) {
                const nodesToProcess = Array.from(pendingNodes);
                pendingNodes.clear();

                if (nodesToProcess.length > 5) {
                    debug(`处理 ${nodesToProcess.length} 个待翻译节点`);
                }
                
                const startTime = performance.now();
                
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

            if (hasModelChange && pendingNodes.size === 0) {
                if (document.body) {
                    translator.translate(document.body);
                }
            }
        }, 0);
    }

    // 主内容变化监听器
    const mainObserver = new MutationObserver((mutations) => {
        const dirtyRoots = new Set();
        let attributeChanges = 0;
        let childListChanges = 0;
        let textChanges = 0;
        
        for (const mutation of mutations) {
            let target = null;
            if (mutation.type === 'childList') {
                childListChanges++;
                target = mutation.target;
            } else if (mutation.type === 'attributes') {
                attributeChanges++;
                target = mutation.target;
            } else if (mutation.type === 'characterData') {
                textChanges++;
                target = mutation.target.parentElement;
            }
            if (target instanceof Element) dirtyRoots.add(target);
        }

        // 只有当变化数量较多时才记录详细信息
        if (dirtyRoots.size > 5) {
            debug(`检测到 DOM 变化: 子节点变化=${childListChanges}, 属性变化=${attributeChanges}, 文本变化=${textChanges}, 影响元素=${dirtyRoots.size}`);
        }
        
        if (dirtyRoots.size > 0) {
            for (const root of dirtyRoots) {
                translator.deleteElement(root);
                const descendants = root.getElementsByTagName('*');
                for (let i = 0; i < descendants.length; i++) {
                    translator.deleteElement(descendants[i]);
                }
                pendingNodes.add(root);
            }
            scheduleTranslation();
        }
    });

    // SPA 页面导航监听器
    let currentUrl = window.location.href;
    const pageObserver = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            log('检测到页面导航，将重新翻译:', currentUrl);
            translator.resetState();
            lastModelInfo = '';
            setTimeout(() => {
                log('开始重新翻译新页面内容...');
                if (document.body) translator.translate(document.body);
            }, 300);
        }
    });

    // 模型切换监听器
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
                if (parent?.classList?.contains('model-name') ||
                    parent?.classList?.contains('model-info') ||
                    parent?.querySelector?.('.model-name, .model-info')) {
                    shouldCheckModel = true;
                }
            }
        });
        if (shouldCheckModel) {
            setTimeout(() => detectModelChange(), 50);
        }
    });

    // 启动所有监听器
    mainObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'],
        characterData: true
    });
    
    pageObserver.observe(document.body, { childList: true, subtree: true });

    modelChangeObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // 暴露强制重翻功能
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