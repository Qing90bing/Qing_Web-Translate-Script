// 导入词典
import { masterTranslationMap } from './translations/index.js';

// 通过将整个 masterTranslationMap 作为参数传递
// 我们可以防止构建工具错误地“摇树”优化掉未直接引用的部分
(function (translations) {
    'use strict';

    // 防闪烁模块 (v2)
    const antiFlickerStyle = document.createElement('style');
    antiFlickerStyle.id = 'anti-flicker-style';
    antiFlickerStyle.textContent = `
            body { visibility: hidden !important; opacity: 0 !important; }
            body.translation-ready {
                visibility: visible !important;
                opacity: 1 !important;
                transition: opacity 0.2s ease-in !important;
            }
            [class*="load"], [class*="spin"], [id*="load"], [id*="spin"],
            .loader, .spinner, .loading {
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    head.insertBefore(antiFlickerStyle, head.firstChild);

    // 在函数内部根据当前网站域名选择正确的词典
    const siteDictionary = translations[window.location.hostname];
    if (!siteDictionary) {
        document.body?.classList.add('translation-ready');
        // 如果当前网站没有对应的词典，提前移除防闪烁样式并退出
        setTimeout(() => {
            document.getElementById('anti-flicker-style')?.remove();
        }, 200);
        return;
    }

    // --- 从这里开始，是你原来的所有主逻辑代码，保持不变 ---

    // 自定义样式
    const customCSS = `
            /* 优化按钮和布局 */
            button {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                white-space: nowrap !important;
                gap: 4px !important;
            }

            .header.long[_ngcontent-ng-c2984080244] .code-header-text[_ngcontent-ng-c2984080244] {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                white-space: nowrap !important;
            }

            /* 防止翻译后的文字溢出，并避免中文词内换行 */
            .mat-button-wrapper, .mat-button-toggle-label-content, button {
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                word-break: keep-all !important; /* 防止中文词组在按钮内换行 */
            }

            /* 优化模型信息对话框显示 */
            .model-info, .column-title, .column-content {
                white-space: normal !important;
            }
        `;

    // 将所有字符串规则放入一个Map中，key为trim后的英文，便于快速查找
    // 正则表达式规则保持独立
    const regexRules = [];
    const textTranslationMap = new Map();

    for (const item of siteDictionary) {
        if (!Array.isArray(item) || item.length !== 2) continue;
        const [original, translation] = item;

        if (original instanceof RegExp) {
            regexRules.push(item);
        } else if (typeof original === 'string' && typeof translation === 'string') {
            // 将trim后的原文作为key，以实现稳定的匹配
            textTranslationMap.set(original.trim(), translation);
        }
    }

    const translationCache = new Map();
    // 是否启用调试模式 (默认 false)
    const DEBUG = false;

    // 元素内容合并翻译函数 - 处理被HTML标签分割的文本
    function translateElementContent(element) {
        if (!element || element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return false;

        // 获取元素的完整文本内容（忽略HTML标签）
        const fullText = element.textContent?.trim();
        if (!fullText) return false;

        // 查找是否有匹配的翻译
        const translation = textTranslationMap.get(fullText);
        if (!translation) return false;

        // 如果找到翻译，需要智能地替换文本节点
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    return node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        if (textNodes.length === 0) return false;

        // 如果只有一个文本节点，直接替换
        if (textNodes.length === 1) {
            textNodes[0].nodeValue = translation;
            if (DEBUG) console.log(`[元素内容翻译] "${fullText}" -> "${translation}"`);
            return true;
        }

        // 多个文本节点的情况：将翻译内容放在第一个节点，清空其他节点
        textNodes[0].nodeValue = translation;
        for (let i = 1; i < textNodes.length; i++) {
            textNodes[i].nodeValue = '';
        }

        if (DEBUG) console.log(`[元素内容合并翻译] "${fullText}" -> "${translation}"`);
        return true;
    }

    // 重写翻译函数，采用更稳定高效的"去空格匹配，保留格式替换"策略
    function translateText(text) {
        if (!text || typeof text !== 'string') return text;
        const originalText = text;

        if (translationCache.has(originalText)) {
            return translationCache.get(originalText);
        }

        const trimmedText = text.trim();
        if (trimmedText === '') return text;

        let translatedText = text;
        let hasChanged = false;

        // 第1步: 优先进行精确文本匹配（空格不敏感）
        const mapTranslation = textTranslationMap.get(trimmedText);
        if (mapTranslation) {
            // 找到了翻译，智能地保留原文中的前后空格
            const leadingSpace = originalText.match(/^\s*/)[0] || '';
            const trailingSpace = originalText.match(/\s*$/)[0] || '';
            translatedText = leadingSpace + mapTranslation + trailingSpace;
            hasChanged = true;
            if (DEBUG) console.log(`[文本匹配] "${trimmedText}" -> "${mapTranslation}"`);
        } else {
            // 第2步: 如果没有精确匹配，则应用正则表达式规则
            for (const [match, replacement] of regexRules) {
                const newText = translatedText.replace(match, replacement);
                if (newText !== translatedText) {
                    translatedText = newText;
                    hasChanged = true;
                    if (DEBUG) console.log(`[正则匹配] "${originalText}" -> "${translatedText}"`);
                }
            }
        }

        if (hasChanged) {
            translationCache.set(originalText, translatedText);
        }

        return translatedText;
    }

    // 标记已翻译的元素，避免重复操作
    let translatedElements = new WeakSet();

    function translateElement(element) {
        if (!element || translatedElements.has(element)) return;

        // 尝试元素内容合并翻译
        if (translateElementContent(element)) {
            translatedElements.add(element);
            return;
        }

        // 翻译文本节点
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    const parentTag = node.parentElement?.tagName?.toLowerCase();
                    if (parentTag === 'script' || parentTag === 'style') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 只接受包含非空白字符的节点
                    return node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const nodesToTranslate = [];
        while (walker.nextNode()) {
            nodesToTranslate.push(walker.currentNode);
        }

        nodesToTranslate.forEach(textNode => {
            const originalText = textNode.nodeValue;
            const translatedText = translateText(originalText);
            if (originalText !== translatedText) {
                textNode.nodeValue = translatedText;
            }
        });

        // 翻译属性
        const attributesToTranslate = ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'];
        const elementsWithAttributes = element.matches(`[${attributesToTranslate.join("], [")}]`)
            ? [element, ...element.querySelectorAll(`[${attributesToTranslate.join("], [")}]`)]
            : [...element.querySelectorAll(`[${attributesToTranslate.join("], [")}]`)];

        elementsWithAttributes.forEach(el => {
            attributesToTranslate.forEach(attr => {
                if (el.hasAttribute(attr)) {
                    const originalValue = el.getAttribute(attr);
                    const translatedValue = translateText(originalValue);
                    if (originalValue !== translatedValue) {
                        el.setAttribute(attr, translatedValue);
                    }
                }
            });
        });

        if (element.shadowRoot) {
            translateElement(element.shadowRoot);
        }

        translatedElements.add(element);
    }

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
            if (DEBUG) console.log('[模型变化检测] 检测到模型信息变化:', currentModelInfo);

            // 清除翻译缓存和元素标记，强制重新翻译
            translationCache.clear();
            translatedElements = new WeakSet();

            // 立即重新翻译整个文档
            setTimeout(() => {
                if (document.body) {
                    translateElement(document.body);
                }
            }, 100);

            return true;
        }
        return false;
    }

    function scheduleTranslation() {
        clearTimeout(translationTimer);
        translationTimer = setTimeout(() => {
            // 首先检测是否有模型变化
            const hasModelChange = detectModelChange();

            if (pendingNodes.size > 0) {
                const nodesToProcess = Array.from(pendingNodes);
                pendingNodes.clear();

                nodesToProcess.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        translateElement(node);
                    } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                        // 文本节点的变化也可能需要重新翻译整个父元素
                        translateElement(node.parentElement);
                    }
                });
            }

            // 如果有模型变化但没有待处理节点，也要确保翻译
            if (hasModelChange && pendingNodes.size === 0) {
                if (document.body) {
                    translateElement(document.body);
                }
            }
        }, 30); // 减少延迟以更快响应模型切换
    }

    //  MutationObserver 逻辑以处理动态内容变化
    const observer = new MutationObserver((mutations) => {
        let hasChanges = false;

        mutations.forEach((mutation) => {
            // 1. 处理新添加到页面的节点
            mutation.addedNodes.forEach((node) => {
                pendingNodes.add(node);
                hasChanges = true;
            });

            // 2. 处理已有节点文本内容的变化（例如按钮文字改变）
            if (mutation.type === 'characterData') {
                const targetElement = mutation.target.parentElement;
                if (targetElement) {
                    // 从“已翻译”集合中移除该元素的标记，以便重新翻译
                    translatedElements.delete(targetElement);
                    pendingNodes.add(targetElement); // 将其加入待翻译队列
                    hasChanges = true;
                }
            }

            // 3. 处理已有节点属性的变化（例如 placeholder 内容改变）
            if (mutation.type === 'attributes') {
                const targetElement = mutation.target;
                // 同样地，移除该元素的“已翻译”标记
                translatedElements.delete(targetElement);
                pendingNodes.add(targetElement); // 将其加入待翻译队列
                hasChanges = true;
            }
        });

        if (hasChanges) {
            scheduleTranslation();
        }
    });

    // 初始化和启动
    function initializeTranslation() {
        if (customCSS.trim()) {
            const styleElement = document.createElement('style');
            styleElement.textContent = customCSS;
            document.head.appendChild(styleElement);
        }

        translateElement(document.body);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'],
            characterData: true
        });

        document.body.classList.add('translation-ready');
        if (DEBUG) console.log('[汉化脚本-优化版] 初次翻译完成，显示页面');

        setTimeout(() => {
            document.getElementById('anti-flicker-style')?.remove();
        }, 500);

        // 初始化模型信息检测
        detectModelChange();

        if (DEBUG) console.log('[汉化脚本-优化版] 初始化完成');
    }

    function startTranslation() {
        if (document.body) {
            initializeTranslation();
        } else {
            new MutationObserver((_mutations, obs) => {
                if (document.body) {
                    obs.disconnect();
                    initializeTranslation();
                }
            }).observe(document.documentElement, { childList: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startTranslation);
    } else {
        startTranslation();
    }

    // 页面变化监听 - 优化SPA应用支持和模型切换检测
    let currentUrl = window.location.href;
    const pageObserver = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            if (DEBUG) console.log('[汉化脚本] 检测到页面URL变化，准备重新翻译');

            // 重置所有状态
            translationCache.clear();
            translatedElements = new WeakSet();
            lastModelInfo = '';

            // 在SPA导航后，DOM更新可能需要一点时间
            setTimeout(() => {
                console.log('[汉化脚本] 开始重新翻译新页面内容');
                if (document.body) {
                    translateElement(document.body);
                }
            }, 300);
        }
    });

    // 专门的模型切换监听器
    const modelChangeObserver = new MutationObserver((mutations) => {
        let shouldCheckModel = false;

        mutations.forEach((mutation) => {
            // 检测与模型相关的DOM变化
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node;
                        // 检测模型信息对话框或相关元素
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
            setTimeout(() => {
                detectModelChange();
            }, 50);
        }
    });

    // 确保在body存在后才开始监听
    if (document.body) {
        pageObserver.observe(document.body, { childList: true, subtree: true });
        modelChangeObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            pageObserver.observe(document.body, { childList: true, subtree: true });
            modelChangeObserver.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });
    }

    // 手动强制重新翻译功能（调试用）
    window.forceRetranslate = function () {
        console.log('[汉化脚本] 手动强制重新翻译');
        translationCache.clear();
        translatedElements = new WeakSet();
        lastModelInfo = '';
        if (document.body) {
            translateElement(document.body);
        }
    };

    // 暴露调试信息
    if (DEBUG) {
        window.translationDebug = {
            cache: translationCache,
            textMap: textTranslationMap,
            regexRules: regexRules,
            lastModelInfo: () => lastModelInfo
        };
    }

})(masterTranslationMap); // 将导入的 map 在这里作为参数传入
