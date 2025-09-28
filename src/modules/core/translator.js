/**
 * @file src/modules/core/translator.js
 * @description
 * 核心翻译引擎模块。
 * 此模块采用工厂函数模式 (`createTranslator`) 来创建一个独立的翻译器实例。
 * 每个实例都包含自己的状态（翻译规则、缓存等），并通过闭包进行管理，确保了状态的隔离和封装。
 *
 * **核心功能**:
 * 1.  **文本翻译**: 提供一个 `translateText` 函数，该函数结合了基于 Map 的快速查找（用于纯文本）和正则表达式匹配，并使用缓存来优化性能。
 * 2.  **元素翻译**:
 *     - 使用 `TreeWalker` API 高效地遍历 DOM 树，只处理需要翻译的文本节点。
 *     - 对纯文本内容的元素进行“整段翻译”优化 (`translateElementContent`)，避免破坏内部结构。
 *     - 递归处理 Shadow DOM，以支持 Web Components。
 * 3.  **状态管理**:
 *     - 使用 `WeakSet` (`translatedElements`) 来跟踪已翻译的元素，避免重复工作，并能自动处理垃圾回收。
 *     - 提供 `resetState` 方法来清除所有缓存，用于页面导航或语言切换等场景。
 *     - 提供 `deleteElement` 方法，允许外部模块（如 `observers.js`）在 DOM 变动时精确地使单个元素的缓存失效。
 */

import { ALL_UNTRANSLATABLE_TAGS, BLOCKS_CONTENT_ONLY, attributesToTranslate, BLOCKED_CSS_CLASSES } from '../../config.js';
import { log, debug, translateLog, perf } from '../utils/logger.js';

/**
 * @function createTranslator
 * @description 创建并初始化一个翻译器实例。这是一个工厂函数，每次调用都会返回一个拥有独立状态的新翻译器。
 * @param {Map<string, string>} textMap - 纯文本翻译规则的 Map 对象，键为原文，值为译文。
 * @param {Array<[RegExp, string]>} regexArr - 正则表达式翻译规则的数组。
 * @param {string[]} [blockedSelectors=[]] - 针对当前网站的、额外的禁止翻译的 CSS 选择器数组。
 * @returns {{translate: Function, resetState: Function, deleteElement: Function}} - 返回一个包含翻译 API 的对象。
 */
export function createTranslator(textMap, regexArr, blockedSelectors = []) {
    // --- 模块内部状态 ---
    // 通过闭包来管理每个翻译器实例的状态，确保实例之间互不干扰。
    let textTranslationMap = textMap;
    let regexRules = regexArr;
    let translationCache = new Map(); // 缓存已翻译的文本片段，避免对相同文本的重复计算。
    let translatedElements = new WeakSet(); // 使用 WeakSet 存储已处理过的元素节点，防止重复翻译，且不会阻止垃圾回收。
    
    // 合并全局配置和网站特定配置，构建最终的禁止翻译元素列表。
    const blockedElements = new Set([...ALL_UNTRANSLATABLE_TAGS]);
    const blockedElementSelectors = blockedSelectors || [];

    /**
     * @function isElementBlocked
     * @description 检查一个元素是否应该被阻止翻译。
     * @param {Element} element - 要检查的 DOM 元素。
     * @returns {boolean} 如果元素应被阻止，则返回 true。
     */
    function isElementBlocked(element) {
        const tagName = element.tagName?.toLowerCase();
        // 检查标签名是否在全局禁止列表中 (如 <style>, <script>)。
        if (blockedElements.has(tagName)) return true;
        
        // 检查元素是否具有被阻止的 CSS 类名。
        if (element.classList) {
            for (const className of element.classList) {
                if (BLOCKED_CSS_CLASSES.has(className)) return true;
            }
        }
        
        // 检查元素是否匹配网站特定的禁止选择器。
        for (const selector of blockedElementSelectors) {
            if (element.matches?.(selector)) return true;
        }
        
        return false;
    }

    /**
     * @function translateText
     * @description 对单个文本字符串执行翻译。
     * @param {string} text - 要翻译的文本。
     * @returns {string} 翻译后的文本。
     */
    function translateText(text) {
        if (!text || typeof text !== 'string') return text;
        const originalText = text;
        // 1. 性能优化：首先检查缓存。
        if (translationCache.has(originalText)) {
            return translationCache.get(originalText);
        }
        const trimmedText = text.trim();
        if (trimmedText === '') return text;
        let translatedText = text;
        let hasChanged = false;

        // 2. 优先使用 Map 进行纯文本精确匹配，因为其查找效率为 O(1)。
        const mapTranslation = textTranslationMap.get(trimmedText);
        if (mapTranslation) {
            // 保留原文中的前后空白字符。
            const leadingSpace = originalText.match(/^\s*/)[0] || '';
            const trailingSpace = originalText.match(/\s*$/)[0] || '';
            translatedText = leadingSpace + mapTranslation + trailingSpace;
            hasChanged = true;
            translateLog('文本映射', trimmedText, mapTranslation);
        } else {
            // 3. 如果没有精确匹配，则遍历正则表达式规则。
            for (const [match, replacement] of regexRules) {
                const newText = translatedText.replace(match, replacement);
                if (newText !== translatedText) {
                    translatedText = newText;
                    hasChanged = true;
                    translateLog('正则表达式', originalText, translatedText);
                }
            }
        }
        // 4. 如果文本被修改过，则将其存入缓存。
        if (hasChanged) {
            translationCache.set(originalText, translatedText);
        }
        return translatedText;
    }

    /**
     * @function translateElementContent
     * @description 一个性能优化函数，尝试对一个元素进行“整段内容”翻译。
     *              仅当一个元素的全部文本内容能在 `textTranslationMap` 中精确匹配时才生效。
     * @param {Element} element - 要翻译的元素。
     * @returns {boolean} 如果成功执行了整段翻译，则返回 true。
     */
    function translateElementContent(element) {
        if (!element || isElementBlocked(element) || element.isContentEditable) return false;

        // 安全检查：如果元素包含任何子元素（例如 <a>、<b>），则跳过此优化，
        // 因为直接修改 textContent 会破坏内部的 DOM 结构。此优化仅适用于只包含文本节点的元素。
        if (element.childElementCount > 0) return false;
        if (element.querySelector(Array.from(blockedElements).join(','))) return false;

        const fullText = element.textContent?.trim();
        if (!fullText) return false;

        const translation = textTranslationMap.get(fullText);
        if (!translation) return false;

        // 如果找到了匹配项，则清空所有子文本节点，并将翻译结果写入第一个文本节点。
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        if (textNodes.length === 0) return false;

        textNodes[0].nodeValue = translation; // 将翻译写入第一个文本节点
        for (let i = 1; i < textNodes.length; i++) {
            textNodes[i].nodeValue = ''; // 清空其余所有文本节点
        }
        log('整段翻译:', `"${fullText}"`, '->', `"${translation}"`);
        return true;
    }

    /**
     * @function translateElement
     * @description 核心翻译函数，递归地翻译一个元素及其所有后代。
     * @param {Element | ShadowRoot} element - 要翻译的根元素或 ShadowRoot。
     */
    function translateElement(element) {
        if (!element || translatedElements.has(element) || !(element instanceof Element || element instanceof ShadowRoot)) return;

        const tagName = element.tagName?.toLowerCase();

        // 检查元素是否应被完全跳过
        if (isElementBlocked(element) || element.isContentEditable) {
            translatedElements.add(element);
            return;
        }

        const isContentBlocked = BLOCKS_CONTENT_ONLY.has(tagName);

        // --- 1. 翻译元素内的文本节点 ---
        if (!isContentBlocked) {
            // 首先尝试性能更优的“整段翻译”
            if (translateElementContent(element)) {
                translatedElements.add(element);
                return;
            }

            // 如果整段翻译不适用，则回退到标准的 `TreeWalker` 遍历。
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
                acceptNode: function (node) {
                    if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
                    // 向上遍历，确保该文本节点的任何父级元素都不是被禁止翻译的。
                    let parent = node.parentElement;
                    while (parent) {
                        if (isElementBlocked(parent) || parent.isContentEditable) {
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
            
            if (nodesToTranslate.length > 0) {
                nodesToTranslate.forEach(textNode => {
                    const originalText = textNode.nodeValue;
                    const translatedText = translateText(originalText);
                    if (originalText !== translatedText) {
                        textNode.nodeValue = translatedText;
                    }
                });
            }
        }

        // --- 2. 翻译元素的属性 ---
        const elementsWithAttributes = element.matches(`[${attributesToTranslate.join("], [")}]`)
            ? [element, ...element.querySelectorAll(`[${attributesToTranslate.join("], [")}]`)]
            : [...element.querySelectorAll(`[${attributesToTranslate.join("], [")}]`)];

        if (elementsWithAttributes.length > 0) {
            elementsWithAttributes.forEach(el => {
                // 再次检查，确保这个带属性的元素本身没有被禁止。
                if (isElementBlocked(el)) return;

                attributesToTranslate.forEach(attr => {
                    if (el.hasAttribute(attr)) {
                        const originalValue = el.getAttribute(attr);
                        const translatedValue = translateText(originalValue);
                        if (originalValue !== translatedValue) {
                            el.setAttribute(attr, translatedValue);
                            translateLog(`属性[${attr}]`, originalValue, translatedValue);
                        }
                    }
                });
            });
        }

        // --- 3. 递归处理 Shadow DOM ---
        if (element.shadowRoot) {
            translateElement(element.shadowRoot);
        }

        // 将此元素标记为已处理，以避免重复工作。
        translatedElements.add(element);
    }

    // 返回一个包含公共 API 的对象。
    return {
        translate: translateElement,
        resetState: () => {
            translationCache.clear();
            translatedElements = new WeakSet();
            log('翻译器状态已重置');
        },
        // 允许外部模块（如 observers.js）在 DOM 变动时，精确地使单个元素的缓存失效。
        deleteElement: (element) => {
            translatedElements.delete(element);
        },
    };
}