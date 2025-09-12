// 导入词典
import { masterTranslationMap } from './translations/index.js';

// 通过将整个 masterTranslationMap 作为参数传递
// 我们可以防止构建工具错误地“摇树”优化掉未直接引用的部分
(function (translations) {
    'use strict';

    // 防闪烁模块 (v3)
    // 立即在html根元素上添加类，以防止任何内容闪烁
    document.documentElement.classList.add('translation-in-progress');

    const antiFlickerStyle = document.createElement('style');
    antiFlickerStyle.id = 'anti-flicker-style';
    antiFlickerStyle.textContent = `
            /* 在翻译进行中时，隐藏body，但保持加载指示器可见 */
            html.translation-in-progress body {
                visibility: hidden !important;
                opacity: 0 !important;
            }
            html.translation-complete body {
                visibility: visible !important;
                opacity: 1 !important;
                transition: opacity 0.3s ease-in !important;
            }
            html.translation-in-progress [class*="load"],
            html.translation-in-progress [class*="spin"],
            html.translation-in-progress [id*="load"],
            html.translation-in-progress [id*="spin"],
            html.translation-in-progress .loader,
            html.translation-in-progress .spinner,
            html.translation-in-progress .loading {
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    head.insertBefore(antiFlickerStyle, head.firstChild);

    // 在函数内部根据当前网站域名选择正确的词典
    const siteDictionary = translations[window.location.hostname];
    if (!siteDictionary) {
        // 如果当前网站没有对应的词典，立即显示页面
        document.documentElement.classList.remove('translation-in-progress');
        document.documentElement.classList.add('translation-complete');
        // 在过渡效果（0.3秒）结束后移除样式标签
        setTimeout(() => {
            document.getElementById('anti-flicker-style')?.remove();
        }, 500);
        return;
    }

    // 将所有字符串规则放入一个Map中，key为trim后的英文，便于快速查找
    // 正则表达式规则保持独立
    const regexRules = [];
    const textTranslationMap = new Map();

    const cssRules = [];
    for (const item of siteDictionary) {
        if (!Array.isArray(item) || item.length !== 2) continue;
        const [original, translation] = item;

        // 提取自定义CSS规则
        if (original === 'css') {
            cssRules.push(translation);
            continue;
        }

        if (original instanceof RegExp) {
            regexRules.push(item);
        } else if (typeof original === 'string' && typeof translation === 'string') {
            // 将trim后的原文作为key，以实现稳定的匹配
            textTranslationMap.set(original.trim(), translation);
        }
    }

    // 注入自定义CSS
    if (cssRules.length > 0) {
        const customStyleElement = document.createElement('style');
        customStyleElement.id = 'web-translate-custom-styles';
        customStyleElement.textContent = cssRules.join('\n');
        head.appendChild(customStyleElement);
    }

    const translationCache = new Map();

    // --- 日志记录模块 ---
    // 用于在油猴菜单中存储日志开关状态的键
    const LOG_KEY = 'web_translate_debug_mode';
    // 从存储中读取当前日志模式，默认为 false (关闭)
    let isDebugMode = GM_getValue(LOG_KEY, false);

    /**
     * 统一的日志记录函数。
     * 只有当 isDebugMode 为 true 时，才会在控制台输出信息。
     * @param {...any} args - 需要打印到控制台的参数。
     */
    function log(...args) {
        if (isDebugMode) {
            // 使用一个统一的前缀，方便用户在控制台过滤信息
            console.log('[汉化脚本]', ...args);
        }
    }


    // 定义两种不可翻译的标签集合，以实现更精细的控制
    // 1. 完全阻塞型：这些标签内部的任何内容（包括子孙的文本和属性）都不会被翻译
    const BLOCKS_ALL_TRANSLATION = new Set(['script', 'style', 'pre', 'code']);
    // 2. 内容阻塞型：这些标签的文本内容不翻译，但placeholder等属性可以翻译
    const BLOCKS_CONTENT_ONLY = new Set(['textarea', 'input']);
    // 合并两者，用于需要检查所有不可翻译文本内容的场景
    const ALL_UNTRANSLATABLE_TAGS = new Set([...BLOCKS_ALL_TRANSLATION, ...BLOCKS_CONTENT_ONLY]);

    // 元素内容合并翻译函数 - 逻辑保持不变，但现在依赖于新的标签集合
    function translateElementContent(element) {
        const tagName = element.tagName?.toLowerCase();

        if (!element || ALL_UNTRANSLATABLE_TAGS.has(tagName) || element.isContentEditable) {
            return false;
        }
        if (element.querySelector(Array.from(ALL_UNTRANSLATABLE_TAGS).join(','))) {
            return false;
        }
        const fullText = element.textContent?.trim();
        if (!fullText) return false;
        const translation = textTranslationMap.get(fullText);
        if (!translation) return false;

        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => (node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
        });
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        if (textNodes.length === 0) return false;
        textNodes[0].nodeValue = translation;
        for (let i = 1; i < textNodes.length; i++) {
            textNodes[i].nodeValue = '';
        }
        log('整段翻译:', `"${fullText}"`, '->', `"${translation}"`);
        return true;
    }

    // 文本翻译函数 - 无需改动
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
        const mapTranslation = textTranslationMap.get(trimmedText);
        if (mapTranslation) {
            const leadingSpace = originalText.match(/^\s*/)[0] || '';
            const trailingSpace = originalText.match(/\s*$/)[0] || '';
            translatedText = leadingSpace + mapTranslation + trailingSpace;
            hasChanged = true;
        } else {
            for (const [match, replacement] of regexRules) {
                const newText = translatedText.replace(match, replacement);
                if (newText !== translatedText) {
                    translatedText = newText;
                    hasChanged = true;
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

    // 核心翻译函数 - 使用了新的标签分类逻辑
    function translateElement(element) {
        if (!element || translatedElements.has(element) || !(element instanceof Element)) return;

        const tagName = element.tagName.toLowerCase();

        // 如果是完全阻塞型标签或可编辑元素，则完全跳过
        if (BLOCKS_ALL_TRANSLATION.has(tagName) || element.isContentEditable) {
            translatedElements.add(element);
            return;
        }

        const isContentBlocked = BLOCKS_CONTENT_ONLY.has(tagName);

        // --- 文本内容翻译 ---
        if (!isContentBlocked) {
            // 1. 尝试合并翻译
            if (translateElementContent(element)) {
                translatedElements.add(element);
                return;
            }

            // 2. 使用TreeWalker进行深度文本节点翻译
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
                acceptNode: function (node) {
                    if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
                    let parent = node.parentElement;
                    while (parent) {
                        if (ALL_UNTRANSLATABLE_TAGS.has(parent.tagName.toLowerCase()) || parent.isContentEditable) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (parent === element) break;
                        parent = parent.parentElement;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            });
            const nodesToTranslate = [];
            while (walker.nextNode()) nodesToTranslate.push(walker.currentNode);
            nodesToTranslate.forEach(textNode => {
                const originalText = textNode.nodeValue;
                const translatedText = translateText(originalText);
                if (originalText !== translatedText) {
                    textNode.nodeValue = translatedText;
                }
            });
        }

        // --- 属性翻译 ---
        const attributesToTranslate = ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'];
        const elementsWithAttributes = element.matches(`[${attributesToTranslate.join("], [")}]`)
            ? [element, ...element.querySelectorAll(`[${attributesToTranslate.join("], [")}]`)]
            : [...element.querySelectorAll(`[${attributesToTranslate.join("], [")}]`)];

        elementsWithAttributes.forEach(el => {
            let current = el;
            let isBlockedByContainer = false;
            while (current && current !== element.parentElement) {
                if (BLOCKS_ALL_TRANSLATION.has(current.tagName.toLowerCase())) {
                    isBlockedByContainer = true;
                    break;
                }
                if (current === element) break;
                current = current.parentElement;
            }

            if (isBlockedByContainer) return;

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
            log('检测到模型切换:', currentModelInfo);

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
        }, 0); // 减少延迟以更快响应模型切换
    }

    //  MutationObserver 逻辑以处理动态内容变化 - 最终版
    const observer = new MutationObserver((mutations) => {
        const dirtyRoots = new Set();

        for (const mutation of mutations) {
            let target = null;
            // 将变更的“根”元素（通常是发生变更的组件的容器）作为目标
            if (mutation.type === 'childList') {
                target = mutation.target;
            } else if (mutation.type === 'attributes') {
                target = mutation.target;
            } else if (mutation.type === 'characterData') {
                target = mutation.target.parentElement;
            }

            if (target instanceof Element) {
                dirtyRoots.add(target);
            }
        }

        if (dirtyRoots.size > 0) {
            for (const root of dirtyRoots) {
                // 清除根及其所有后代的翻译状态，以强制重翻整个“脏”区域
                translatedElements.delete(root);
                const descendants = root.getElementsByTagName('*');
                for (let i = 0; i < descendants.length; i++) {
                    translatedElements.delete(descendants[i]);
                }
                pendingNodes.add(root);
            }
            scheduleTranslation();
        }
    });

    // 初始化和启动
    function initializeTranslation() {

        translateElement(document.body);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'],
            characterData: true
        });

        // 移除“进行中”状态，添加“完成”状态，触发CSS过渡效果
        document.documentElement.classList.remove('translation-in-progress');
        document.documentElement.classList.add('translation-complete');
        log('初次翻译完成，页面已显示。');

        // 在过渡效果（0.3秒）结束后移除样式标签，清理DOM
        setTimeout(() => {
            document.getElementById('anti-flicker-style')?.remove();
        }, 500);

        // 初始化模型信息检测
        detectModelChange();

        log('脚本初始化完成，开始监听页面变化。');
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
            log('检测到页面导航，将重新翻译:', currentUrl);

            // 重置所有状态
            translationCache.clear();
            translatedElements = new WeakSet();
            lastModelInfo = '';

            // 在SPA导航后，DOM更新可能需要一点时间
            setTimeout(() => {
                log('开始重新翻译新页面内容...');
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
        log('强制重新翻译已触发。');
        translationCache.clear();
        translatedElements = new WeakSet();
        lastModelInfo = '';
        if (document.body) {
            translateElement(document.body);
        }
    };

    // 暴露调试信息
    if (isDebugMode) {
        window.translationDebug = {
            cache: translationCache,
            textMap: textTranslationMap,
            regexRules: regexRules,
            lastModelInfo: () => lastModelInfo
        };
    }


    // --- 菜单命令模块 (v2 - 稳定版) ---
    // 为菜单项定义一个唯一的、固定的ID，这是实现动态更新的关键。
    const MENU_COMMAND_ID = 'toggle_debug_log_command';

    /**
     * 更新油猴菜单的命令文本，以反映当前日志记录的状态 (开启/关闭)。
     * 使用 ID 来更新现有菜单项，而不是删除和重建，这更可靠。
     */
    function updateMenuCommand() {
        const status = isDebugMode ? '开启' : '关闭';
        GM_registerMenuCommand(
            `切换调试日志 (当前: ${status})`,
            toggleDebugMode,
            { id: MENU_COMMAND_ID } // 提供固定的ID
        );
    }

    /**
     * 切换调试模式的函数。
     * 当用户点击油猴菜单中的命令时，此函数将被调用。
     */
    function toggleDebugMode() {
        // 翻转当前的调试模式状态
        isDebugMode = !isDebugMode;
        // 将新状态保存到持久化存储中
        GM_setValue(LOG_KEY, isDebugMode);
        // 状态已变更，现在更新菜单命令的文本以反映新状态。
        updateMenuCommand();
    }

    // --- 初始化 ---
    // 脚本加载时立即初始化/更新菜单命令
    updateMenuCommand();


})(masterTranslationMap); // 将导入的 map 在这里作为参数传入
