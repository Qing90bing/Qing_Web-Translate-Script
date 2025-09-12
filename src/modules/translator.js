import { ALL_UNTRANSLATABLE_TAGS, BLOCKS_ALL_TRANSLATION, BLOCKS_CONTENT_ONLY, attributesToTranslate } from '../config.js';
import { log } from './logger.js';

// 模块内部状态，将由工厂函数在闭包中管理
let textTranslationMap;
let regexRules;
let translationCache;
let translatedElements;

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

// 元素内容合并翻译函数
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

// 核心翻译函数
function translateElement(element) {
    if (!element || translatedElements.has(element) || !(element instanceof Element)) return;

    const tagName = element.tagName.toLowerCase();

    if (BLOCKS_ALL_TRANSLATION.has(tagName) || element.isContentEditable) {
        translatedElements.add(element);
        return;
    }

    const isContentBlocked = BLOCKS_CONTENT_ONLY.has(tagName);

    if (!isContentBlocked) {
        if (translateElementContent(element)) {
            translatedElements.add(element);
            return;
        }

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

/**
 * 创建并初始化一个翻译器实例。
 * @param {Map} textMap - 文本翻译的映射表。
 * @param {Array} regexArr - 正则表达式翻译规则。
 * @returns {{translate: function, resetState: function, getTranslatedElements: function}} - 返回一个包含翻译API的对象。
 */
export function createTranslator(textMap, regexArr) {
    // 设置此实例使用的翻译数据
    textTranslationMap = textMap;
    regexRules = regexArr;
    // 为此实例初始化状态
    translationCache = new Map();
    translatedElements = new WeakSet();

    return {
        translate: translateElement,
        resetState: () => {
            translationCache.clear();
            translatedElements = new WeakSet();
        },
        // 允许 observer 删除单个元素的翻译记录
        deleteElement: (element) => {
            translatedElements.delete(element);
        },
    };
}
