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
export function createTranslator(textRules, regexArr, blockedSelectors = [], extendedSelectors = [], customAttributes = [], blockedAttributes = []) {
    // --- 模块内部状态 ---
    // 通过闭包来管理每个翻译器实例的状态，确保实例之间互不干扰。

    // 预处理翻译规则：将纯文本规则转换为 Map 以实现 O(1) 查找
    const textTranslationMap = new Map();
    if (Array.isArray(textRules)) {
        for (const rule of textRules) {
            if (Array.isArray(rule) && rule.length === 2 && typeof rule[0] === 'string' && typeof rule[1] === 'string') {
                textTranslationMap.set(rule[0].trim(), rule[1]);
            }
        }
    }

    let regexRules = regexArr;
    let translationCache = new Map(); // 缓存已翻译的文本片段，避免对相同文本的重复计算。
    let translatedElements = new WeakSet(); // 使用 WeakSet 存储已处理过的元素节点，防止重复翻译，且不会阻止垃圾回收。
    
    // 合并全局配置和网站特定配置，构建最终的禁止翻译元素列表。
    const blockedElements = new Set([...ALL_UNTRANSLATABLE_TAGS]);
    const blockedElementSelectors = blockedSelectors || [];

    // --- 属性白名单与黑名单处理 ---
    // 1. 合并全局白名单和网站自定义白名单。
    const whitelist = new Set([...attributesToTranslate, ...customAttributes]);

    // 2. 从白名单中移除所有在黑名单中定义的属性，确保黑名单的最高优先级。
    for (const attr of blockedAttributes) {
        whitelist.delete(attr);
    }

    // 3. 生成最终的待翻译属性列表。
    const finalAttributesToTranslate = whitelist;

    /**
     * @function isInsideExtendedElement
     * @description 检查一个元素是否位于“内容增强翻译区” (`extendedElements`) 之内。
     *              此区域内的元素，其所有未被白名单 (`customAttributes`) 覆盖的属性，
     *              都会经过一个严格的、仅限纯文本的全值匹配翻译。
     * @param {Element} element - 要检查的 DOM 元素。
     * @returns {boolean} 如果元素在“内容增强翻译区”内，则返回 true。
     */
    function isInsideExtendedElement(element) {
        if (!element || extendedSelectors.length === 0) return false;
        // 使用 `closest` 方法高效地向上查找，看是否能匹配任何一个扩展元素选择器。
        for (const selector of extendedSelectors) {
            if (element.closest(selector)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @function isElementBlocked
     * @description 检查一个元素是否应该被阻止翻译。此函数是“原子”检查，仅检查元素自身，不检查祖先。
     * @param {Element} element - 要检查的 DOM 元素。
     * @returns {boolean} 如果元素应被阻止，则返回 true。
     */
    function isElementBlocked(element) {
        // 优先检查 isContentEditable，因为这是不应翻译的强信号。
        if (element.isContentEditable) return true;

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
     * @function isInsideBlockedElement
     * @description (漏洞修复版) 检查一个元素本身或其任何祖先元素（包括 Shadow DOM 的宿主）是否匹配“翻译禁区”规则。
     *              这确保了屏蔽规则能正确地“继承”并“跨越” Shadow DOM 边界。
     * @param {Element} element - 要检查的 DOM 元素。
     * @returns {boolean} 如果元素位于“翻译禁区”内，则返回 true。
     */
    function isInsideBlockedElement(element) {
        let current = element;
        // 向上遍历DOM树，包括跨越 Shadow DOM 的边界
        while (current) {
            // 在每个层级上，调用 isElementBlocked 进行“原子”检查
            if (isElementBlocked(current)) {
                return true;
            }

            const root = current.getRootNode();
            // 如果到达了 Shadow Root 的顶层，则跳到其宿主元素 (host) 继续向上遍历
            if (root instanceof ShadowRoot) {
                current = root.host;
            } else {
                // 否则，在常规 DOM 中正常向上遍历
                current = current.parentElement;
            }
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
        console.log('DEBUG: translateText called for:', text.substring(0, 20));
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
        // 使用新的 isInsideBlockedElement 进行更可靠的前置检查
        if (!element || isInsideBlockedElement(element)) return false;

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

        // 使用新的、更健壮的检查来决定是否应完全跳过此元素及其后代。
        if (isInsideBlockedElement(element)) {
            translatedElements.add(element);
            return;
        }

        const tagName = element.tagName?.toLowerCase();
        const isContentBlocked = BLOCKS_CONTENT_ONLY.has(tagName);

        // --- 1. 单次遍历处理文本和属性 ---
        // 核心性能优化：
        // 将文本翻译和属性翻译合并到一次 TreeWalker 遍历中。
        // 这消除了之前使用 querySelectorAll('*') 进行第二次 DOM 遍历的巨大开销 (从 O(2N) 降为 O(N))。
        // 同时保留了 TreeWalker 强大的剪枝能力，能高效跳过被屏蔽的子树。

        if (!isContentBlocked) {
            // 首先尝试性能更优的“整段翻译”
            if (translateElementContent(element)) {
                translatedElements.add(element);
                return;
            }

            const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
                acceptNode: function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 如果元素本身被屏蔽，拒绝并跳过其整个子树。
                        // 这同时阻止了对该子树内文本节点和子元素属性的处理。
                        if (isElementBlocked(node)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        // 接受元素节点，以便在循环中处理其属性
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    
                    // 对于文本节点：
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (!node.nodeValue?.trim()) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        // 文本节点被接受，将在循环中处理
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    
                    return NodeFilter.FILTER_SKIP;
                }
            });

            // 处理根元素本身的属性（如果根元素不是 ShadowRoot 且未被屏蔽）
            if (element instanceof Element && !isElementBlocked(element)) {
                 translateAttributes(element);
            }

            while (walker.nextNode()) {
                const node = walker.currentNode;

                if (node.nodeType === Node.TEXT_NODE) {
                    const originalText = node.nodeValue;
                    const translatedText = translateText(originalText);
                    if (originalText !== translatedText) {
                        node.nodeValue = translatedText;
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // 处理元素属性
                    translateAttributes(node);
                }
            }
        } else {
             // 如果内容被屏蔽，但我们仍可能需要处理根元素的属性（虽然通常 BLOCKS_CONTENT_ONLY 意味着完全忽略内容）
             // 原有逻辑是如果 isContentBlocked，跳过文本翻译步骤，直接进入属性翻译步骤。
             // 为了保持兼容，如果 isContentBlocked，我们仅处理属性。
             // 这种情况下，我们需要回退到遍历元素处理属性，因为 TreeWalker 可能会被我们的逻辑跳过？
             // 不，如果 isContentBlocked (例如 script/style)，其实通常也不需要翻译属性。
             // 但为了保险，针对 isContentBlocked 为 true 的情况（极少数），我们可以保留简单的处理。
             // 实际上 BLOCKS_CONTENT_ONLY 目前代码中没有看到具体定义，假设它是空的或特定的。
             // 如果 isContentBlocked，原有逻辑是跳过文本处理，继续做属性处理。
             // 我们可以简单地只对该元素本身做属性处理，或者递归？
             // 鉴于 isContentBlocked 的元素通常不包含需要翻译的子元素属性（如 code 块），
             // 我们这里仅处理当前元素的属性即可。
             if (element instanceof Element) translateAttributes(element);
        }

        /**
         * @function translateAttributes
         * @description 提取出来的属性翻译逻辑
         * @param {Element} el - 要处理的元素
         */
        function translateAttributes(el) {
            if (!el.hasAttributes()) return;
            // 注意：isInsideBlockedElement 在 TreeWalker 中已经被隐式处理了（父级被 REJECT，子级不会遍历到）。
            // 但对于根元素，或者通过其他方式进入的元素，可能需要检查。
            // 在 TreeWalker 循环中，node 是通过 acceptNode (即 !isElementBlocked) 的。
            // 且其父级也没被 REJECT。所以这里是安全的。
            
            // 遍历元素的所有属性，应用三级优先级翻译模型。
            for (const attr of el.attributes) {
                const attrName = attr.name;
                const originalValue = attr.value;

                if (!originalValue || !originalValue.trim()) continue;

                // 优先级 1: 检查属性是否在黑名单中。
                if (blockedAttributes.includes(attrName)) {
                    continue;
                }

                // 优先级 2: 检查属性是否在白名单中。
                if (finalAttributesToTranslate.has(attrName)) {
                    const translatedValue = translateText(originalValue);
                    if (originalValue !== translatedValue) {
                        el.setAttribute(attrName, translatedValue);
                        translateLog(`白名单属性[${attrName}]`, originalValue, translatedValue);
                    }
                }
                // 优先级 3: 扩展翻译区检查
                // 优化：isInsideExtendedElement 可能会向上遍历。在 TreeWalker 中，我们可以尝试优化这个？
                // 暂时保持原样，因为 extendedElements 通常很少。
                else if (isInsideExtendedElement(el)) {
                    const trimmedValue = originalValue.trim();
                    if (textTranslationMap.has(trimmedValue)) {
                        const translated = textTranslationMap.get(trimmedValue);
                        const leadingSpace = originalValue.match(/^\s*/)[0] || '';
                        const trailingSpace = originalValue.match(/\s*$/)[0] || '';
                        const translatedValue = leadingSpace + translated + trailingSpace;

                        if (originalValue !== translatedValue) {
                            el.setAttribute(attrName, translatedValue);
                            translateLog(`扩展区属性[${attrName}]`, originalValue, translatedValue);
                        }
                    }
                }
            }
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