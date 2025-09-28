import { ALL_UNTRANSLATABLE_TAGS, BLOCKS_ALL_TRANSLATION, BLOCKS_CONTENT_ONLY, attributesToTranslate, BLOCKED_CSS_CLASSES } from '../../config.js';
import { log, debug, error, translateLog, perf } from '../utils/logger.js';

/**
 * 创建并初始化一个翻译器实例。
 * @param {Map} textMap - 文本翻译的映射表。
 * @param {Array} regexArr - 正则表达式翻译规则。
 * @param {Array} blockedSelectors - 网站特定的禁止翻译元素选择器。
 * @returns {{translate: function, resetState: function, getTranslatedElements: function}} - 返回一个包含翻译API的对象。
 */
export function createTranslator(textMap, regexArr, blockedSelectors = []) {
    // 模块内部状态，将由工厂函数在闭包中管理
    let textTranslationMap = textMap;
    let regexRules = regexArr;
    let translationCache = new Map();
    let translatedElements = new WeakSet();
    
    // 合并全局禁止翻译标签和网站特定的禁止翻译元素选择器
    const blockedElements = new Set([...ALL_UNTRANSLATABLE_TAGS]);
    const blockedElementSelectors = blockedSelectors || [];

    // 检查元素是否应该被阻止翻译
    function isElementBlocked(element) {
        // 检查标签名是否在全局禁止翻译标签中
        const tagName = element.tagName?.toLowerCase();
        if (blockedElements.has(tagName)) {
            return true;
        }
        
        // 检查元素是否具有被阻止的CSS类名
        if (element.classList) {
            for (const className of element.classList) {
                if (BLOCKED_CSS_CLASSES.has(className)) {
                    return true;
                }
            }
        }
        
        // 检查元素是否匹配网站特定的禁止翻译选择器
        for (const selector of blockedElementSelectors) {
            if (element.matches && element.matches(selector)) {
                return true;
            }
        }
        
        return false;
    }

    // 文本翻译函数
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
            translateLog('文本映射', trimmedText, mapTranslation);
        } else {
            for (const [match, replacement] of regexRules) {
                const newText = translatedText.replace(match, replacement);
                if (newText !== translatedText) {
                    translatedText = newText;
                    hasChanged = true;
                    translateLog('正则表达式', originalText, translatedText);
                }
            }
        }
        if (hasChanged) {
            translationCache.set(originalText, translatedText);
        }
        return translatedText;
    }

    // 元素内容合并翻译函数
    function translateElementContent(element) {
        const tagName = element.tagName?.toLowerCase();
        const startTime = performance.now();

        if (!element || isElementBlocked(element) || element.isContentEditable) {
            return false;
        }
        // 安全检查：如果元素包含子元素（例如 <a>、<b>），则跳过此优化，
        // 以防止破坏内部 DOM 结构。此优化仅适用于纯文本节点。
        if (element.childElementCount > 0) {
            return false;
        }

        if (element.querySelector(Array.from(blockedElements).join(','))) {
            return false;
        }
        const fullText = element.textContent?.trim();
        if (!fullText) {
            return false;
        }
        const translation = textTranslationMap.get(fullText);
        if (!translation) {
            return false;
        }

        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => (node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
        });
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        if (textNodes.length === 0) {
            return false;
        }
        textNodes[0].nodeValue = translation;
        for (let i = 1; i < textNodes.length; i++) {
            textNodes[i].nodeValue = '';
        }
        const duration = performance.now() - startTime;
        perf('元素内容翻译', duration, `${tagName}`);
        log('整段翻译:', `"${fullText}"`, '->', `"${translation}"`);
        return true;
    }

    // 核心翻译函数
    function translateElement(element) {
        if (!element || translatedElements.has(element) || !(element instanceof Element)) return;

        const tagName = element.tagName.toLowerCase();
        const startTime = performance.now();

        if (isElementBlocked(element) || element.isContentEditable) {
            translatedElements.add(element);
            return;
        }

        const isContentBlocked = BLOCKS_CONTENT_ONLY.has(tagName);

        if (!isContentBlocked) {
            if (translateElementContent(element)) {
                translatedElements.add(element);
                const duration = performance.now() - startTime;
                perf('元素翻译完成', duration, `${tagName} (整段)`);
                return;
            }

            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
                acceptNode: function (node) {
                    if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
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
            
            // 批量翻译文本节点
            if (nodesToTranslate.length > 0) {
                let translatedCount = 0;
                nodesToTranslate.forEach(textNode => {
                    const originalText = textNode.nodeValue;
                    const translatedText = translateText(originalText);
                    if (originalText !== translatedText) {
                        textNode.nodeValue = translatedText;
                        translatedCount++;
                    }
                });
                
                // 只有当有实际翻译时才记录
                if (translatedCount > 0) {
                    debug(`翻译了 ${tagName} 中的 ${translatedCount} 个文本节点`);
                }
            }
        }

        // 翻译属性
        const elementsWithAttributes = element.matches(`[${attributesToTranslate.join("], [")}]`)
            ? [element, ...element.querySelectorAll(`[${attributesToTranslate.join("], [")}]`)]
            : [...element.querySelectorAll(`[${attributesToTranslate.join("], [")}]`)];

        if (elementsWithAttributes.length > 0) {
            let translatedAttrCount = 0;
            elementsWithAttributes.forEach(el => {
                let current = el;
                let isBlockedByContainer = false;
                while (current && current !== element.parentElement) {
                    if (isElementBlocked(current)) {
                        isBlockedByContainer = true;
                        break;
                    }
                    if (current === element) break;
                    current = current.parentElement;
                }

                if (isBlockedByContainer) {
                    return;
                }

                attributesToTranslate.forEach(attr => {
                    if (el.hasAttribute(attr)) {
                        const originalValue = el.getAttribute(attr);
                        const translatedValue = translateText(originalValue);
                        if (originalValue !== translatedValue) {
                            el.setAttribute(attr, translatedValue);
                            translatedAttrCount++;
                            translateLog(`属性[${attr}]`, originalValue, translatedValue);
                        }
                    }
                });
            });
            
            // 只有当有实际翻译时才记录
            if (translatedAttrCount > 0) {
                debug(`翻译了 ${translatedAttrCount} 个属性`);
            }
        }

        // 处理 Shadow DOM
        if (element.shadowRoot) {
            translateElement(element.shadowRoot);
        }

        translatedElements.add(element);
        const duration = performance.now() - startTime;
        perf('元素翻译完成', duration, `${tagName}`);
    }

    return {
        translate: translateElement,
        resetState: () => {
            translationCache.clear();
            translatedElements = new WeakSet();
            log('翻译器状态已重置');
        },
        // 允许 observer 删除单个元素的翻译记录
        deleteElement: (element) => {
            translatedElements.delete(element);
        },
    };
}