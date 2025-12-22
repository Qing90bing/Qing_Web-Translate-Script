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

import { ALL_UNTRANSLATABLE_TAGS, BLOCKS_ALL_TRANSLATION, BLOCKS_CONTENT_ONLY, attributesToTranslate, BLOCKED_CSS_CLASSES } from '../../config.js';
import { log, debug, translateLog, perf } from '../utils/logger.js';

/**
 * @function createTranslator
 * @description 创建并初始化一个翻译器实例。这是一个工厂函数，每次调用都会返回一个拥有独立状态的新翻译器。
 * @param {Map<string, string>} textMap - 纯文本翻译规则的 Map 对象，键为原文，值为译文。
 * @param {Array<[RegExp, string]>} regexArr - 正则表达式翻译规则的数组。
 * @param {string[]} [blockedSelectors=[]] - 针对当前网站的、额外的禁止翻译的 CSS 选择器数组。
 * @param {string[]} [extendedSelectors=[]] - 内容增强翻译区选择器。
 * @param {string[]} [customAttributes=[]] - 属性白名单。
 * @param {string[]} [blockedAttributes=[]] - 属性黑名单。
 * @param {Array<{selector: string, type: string}>} [pseudoRules=[]] - 伪元素翻译规则列表 (可选，现已支持通用自动翻译)。
 * @returns {{translate: Function, resetState: Function, deleteElement: Function, translatePseudoElements: Function, onShadowRootFound: Function}} - 返回一个包含翻译 API 的对象。
 */
export function createTranslator(textRules, regexArr, blockedSelectors = [], extendedSelectors = [], customAttributes = [], blockedAttributes = [], pseudoRules = []) {
    // --- 模块内部状态 ---
    // 通过闭包来管理每个翻译器实例的状态，确保实例之间互不干扰。

    // Shadow Root 发现回调 (由 observers.js 注入)
    let shadowRootFoundCallback = null;

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

    // --- 3. 位掩码优化 (Bitmask Optimization) ---
    // 为了极致的运行时性能，我们将标签检查逻辑从 Set 查找 (O(1) ~ O(log N)) 优化为位掩码操作 (O(1), CPU 指令级)。
    // 虽然 Set 已经很快，但在每帧处理成千上万个 DOM 节点时，节省的每一纳秒都能减少主线程阻塞。

    /**
     * @constant {number} MASK_NO_TRANSLATE
     * @description 位掩码：表示该标签完全禁止翻译（包括内容和属性）。
     * 二进制: 0001 (十进制: 1)
     */
    const MASK_NO_TRANSLATE = 1;

    /**
     * @constant {number} MASK_CONTENT_ONLY
     * @description 位掩码：表示该标签仅禁止翻译文本内容，但允许翻译属性。
     * 二进制: 0010 (十进制: 2)
     */
    const MASK_CONTENT_ONLY = 2;

    /**
     * @constant {Object<string, number>} TAG_FLAGS
     * @description 标签名到位掩码的静态映射表。
     * 使用对象字面量作为查找表，在这类高频各异的字符串查找中通常比 Map 更快（V8 隐藏类优化）。
     * 
     * **动态初始化**:
     * 为了确保 `config.js` 是唯一的“真理来源 (Single Source of Truth)”，
     * 我们不再此处硬编码标签，而是从 `config.js` 导入的 Set 中动态构建此表。
     * 这样，用户只需修改 `config.js`，此处逻辑会自动同步，无需担忧维护问题。
     */
    const TAG_FLAGS = {};

    // 1. 注册完全禁止的标签 (Mask: 1)
    // 为了应对 SVG 或 XHTML 可能返回小写 tagName 的情况，同时注册大写和小写形式。
    BLOCKS_ALL_TRANSLATION.forEach(tag => {
        TAG_FLAGS[tag.toUpperCase()] = MASK_NO_TRANSLATE;
        TAG_FLAGS[tag.toLowerCase()] = MASK_NO_TRANSLATE;
    });

    // 2. 注册仅禁止内容的标签 (Mask: 2)
    BLOCKS_CONTENT_ONLY.forEach(tag => {
        const upperTag = tag.toUpperCase();
        const lowerTag = tag.toLowerCase();

        // 辅助函数：安全地合并标志位
        const mergeFlag = (key, mask) => {
            // 如果该标签已经被标记为 NO_TRANSLATE，则不降级为 CONTENT_ONLY。
            if ((TAG_FLAGS[key] & MASK_NO_TRANSLATE) !== MASK_NO_TRANSLATE) {
                TAG_FLAGS[key] = (TAG_FLAGS[key] || 0) | mask;
            }
        };

        mergeFlag(upperTag, MASK_CONTENT_ONLY);
        mergeFlag(lowerTag, MASK_CONTENT_ONLY);
    });

    /**
     * @function isElementBlocked
     * @description 检查一个元素是否应该被阻止翻译。
     * **优化说明**: 使用位掩码 (Bitmask) 替代 `Set.has()`。
     * 
     * @param {Element} element - 要检查的 DOM 元素。
     * @returns {boolean} 如果元素应被阻止，则返回 true。
     */
    function isElementBlocked(element) {
        // 0. 安全检查：必须是 Element 节点 (ShadowRoot 或 TextNode 没有 matches 方法)
        if (!(element instanceof Element)) return false;

        // 1. 获取标签名
        const tagName = element.tagName; // tagName 通常是大写的，直接使用避免 toLowerCase() 开销

        // 2. 位掩码优化：优先进行极速检查 (O(1))
        // 如果 TAG_FLAGS[tagName] 是 undefined (假值)，则说明该标签不在任何禁止列表中。
        const flags = TAG_FLAGS[tagName];

        // 使用位与运算 (&) 检查特定位是否被置位。
        if (flags & MASK_NO_TRANSLATE) return true;

        // 3. 检查 isContentEditable (较昂贵的 DOM 属性访问，排在位掩码之后)
        // 这是一个动态属性，无法缓存到静态表中。
        if (element.isContentEditable) return true;

        // 4. 检查 CSS 类名 (无法避免的 DOMList 遍历，但放在最后做)
        if (element.classList && element.classList.length > 0) {
            // 优化：for...of 循环比 forEach 稍微快一点点，且支持 break
            for (const className of element.classList) {
                if (BLOCKED_CSS_CLASSES.has(className)) return true;
            }
        }

        // 5. 检查网站特定的选择器 (最慢的部分)
        if (blockedElementSelectors.length > 0) {
            for (const selector of blockedElementSelectors) {
                if (element.matches(selector)) return true;
            }
        }

        return false;
    }

    /**
     * @function isInsideBlockedElement
     * @description (漏洞修复版) 检查一个元素本身或其任何祖先元素是否匹配“翻译禁区”规则。
     * @param {Element} element - 要检查的 DOM 元素。
     * @returns {boolean} 如果元素位于“翻译禁区”内，则返回 true。
     */
    function isInsideBlockedElement(element) {
        let current = element;
        while (current) {
            // 在每一层调用优化后的 isElementBlocked
            if (isElementBlocked(current)) {
                return true;
            }

            const root = current.getRootNode();
            if (root instanceof ShadowRoot) {
                current = root.host;
            } else {
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
        const originalText = text;
        // 1. 性能优化：首先检查缓存。
        if (translationCache.has(originalText)) {
            return translationCache.get(originalText);
        }

        // 内存保护：简单粗暴但有效的 LRU 近似策略
        // 如果缓存过大，直接清空，防止特定页面（如无限滚动流）导致内存泄漏。
        if (translationCache.size > 5000) {
            translationCache.clear();
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

        // 4. 结果缓存 (Memoization)
        // 优化：无论是否翻译成功，都缓存结果。
        // 之前的逻辑只缓存成功的翻译 (hasChanged)。
        // 现在我们缓存所有结果，包括那些“不需要翻译”的文本。
        // 这极大地避免了对同一段常见文本（如 "Share", "Like", "123"）重复执行昂贵的正则遍历 (O(N*M))。
        translationCache.set(originalText, translatedText);

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
     * @function translatePseudoElements
     * @description 通用的伪元素翻译函数。
     *              检查该元素的 ::before 和 ::after 伪元素内容，
     *              如果有内容且能被翻译，则设置对应的 data-wts-* 属性。
     * @param {Element} element - 要处理的 DOM 元素。
     */
    function translatePseudoElements(element) {
        if (!element || !element.tagName) return;

        // 辅助函数：处理单个伪类型
        const handleType = (type) => {
            // 检查是否手动配置了伪元素规则 (虽然现在是通用的，但保留对旧配置的兼容或特定优化)
            // 实际上通用方案不需要检查 pseudoRules，但如果用户只想翻译特定元素，
            // 我们这里采用“默认全检查”的策略，因为性能主要由调用方 (mouseover/TreeWalker) 控制。
            // 如果在 TreeWalker 中调用，会非常频繁，所以 getComputedStyle 的开销需要注意。
            // 优化：TreeWalker 中可能只对 pseudoRules 中定义的元素调用？
            // 不，现在要求是“通用”。
            // 为了避免遍历时的性能灾难，我们在 translateElement (主遍历) 中
            // 应该只对 pseudoRules 里的调用 (如果存在)。
            // 而 mouseover 事件触发的调用是针对特定元素的，可以做全检查。
            // 
            // 等等，如果现在是 zero-config，那 TreeWalker 里怎么知道该检查谁？
            // 如果对页面上每个元素都做 getComputedStyle，性能会爆炸。
            // 因此：**通用方案主要依赖 mouseover (交互式)**。
            // 对于静态显示的伪元素 (非 hover)，如果用户没有配置，我们很难低成本地自动发现。
            // 所以：
            // 1. 如果有 pseudoRules，translateElement 会处理它们 (静态显示)。
            // 2. 无论有没有 pseudoRules，mouseover 都会尝试翻译鼠标下的元素 (动态/交互显示)。

            try {
                const pseudoStyle = window.getComputedStyle(element, `::${type}`);
                const content = pseudoStyle.getPropertyValue('content');

                // content 通常返回带引号的字符串，如 '"text"' 或 'none'
                if (content && content !== 'none' && content !== 'normal') {
                    // 移除首尾的引号 (支持单引号或双引号)
                    const cleanContent = content.replace(/^['"]|['"]$/g, '');

                    if (cleanContent.trim()) {
                        const translated = translateText(cleanContent);
                        // 关键：只有当**确实发生了翻译**时，才设置 data 属性。
                        // 这防止了将图标代码或无意义文本错误地“翻译”并回写，
                        // 同时也避免了对未匹配翻译规则的元素产生视觉副作用。
                        if (translated !== cleanContent) {
                            const attrName = `data-wts-${type}`;
                            if (element.getAttribute(attrName) !== translated) {
                                element.setAttribute(attrName, translated);
                                translateLog(`通用伪元素[::${type}]`, cleanContent, translated);
                            }
                        }
                    }
                }
            } catch (e) {
                // 忽略错误
            }
        };

        handleType('before');
        handleType('after');
    }

    /**
     * @function translateElement
     * @description 核心翻译函数，递归地翻译一个元素及其所有后代。
     * @param {Element | ShadowRoot} element - 要翻译的根元素或 ShadowRoot。
     */
    function translateElement(element) {
        if (!element || translatedElements.has(element) || !(element instanceof Element || element instanceof ShadowRoot)) return;

        // Hook: 如果当前处理的是 ShadowRoot，触发回调以便观察器可以监听它
        if (element instanceof ShadowRoot && shadowRootFoundCallback) {
            shadowRootFoundCallback(element);
        }

        // 使用新的、更健壮的检查来决定是否应完全跳过此元素及其后代。
        if (isInsideBlockedElement(element)) {
            translatedElements.add(element);
            return;
        }

        const tagName = element.tagName; // 优化：直接使用大写 tagName，避免 toLowerCase

        // 位掩码优化：检查是否仅屏蔽内容
        // 逻辑：如果 (flags & MASK_CONTENT_ONLY) 不为 0，则为真。
        const flags = TAG_FLAGS[tagName] || 0;
        const isContentBlocked = (flags & MASK_CONTENT_ONLY) !== 0;

        // --- 1. 单次遍历处理文本和属性 ---
        // 核心性能优化：
        // 将文本翻译和属性翻译合并到一次 TreeWalker 遍历中。
        // 这消除了之前使用 querySelectorAll('*') 进行第二次 DOM 遍历的巨大开销 (从 O(2N) 降为 O(N))。
        // 同时保留了 TreeWalker 强大的剪枝能力，能高效跳过被屏蔽的子树。

        if (!isContentBlocked) {
            // 首先尝试性能更优的“整段翻译”
            if (translateElementContent(element)) {
                // 即使整段翻译成功，我们仍需检查伪元素
                // (仅对配置中明确指定的，以避免性能损耗)
                if (element instanceof Element && pseudoRules.length > 0) {
                    // 旧逻辑：检查是否匹配配置
                    for (const rule of pseudoRules) {
                        if (element.matches(rule.selector)) {
                            // 这里可以调用通用翻译函数，因为它现在是安全的
                            translatePseudoElements(element);
                            break;
                        }
                    }
                }
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

            // 处理根元素本身的属性和伪元素（如果根元素不是 ShadowRoot 且未被屏蔽）
            if (element instanceof Element && !isElementBlocked(element)) {
                translateAttributes(element);
                // 仅当存在显式配置时，在遍历阶段处理伪元素
                if (pseudoRules.length > 0) {
                    for (const rule of pseudoRules) {
                        if (element.matches(rule.selector)) {
                            translatePseudoElements(element);
                            break;
                        }
                    }
                }
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

                    // 仅当存在显式配置时，在遍历阶段处理伪元素
                    // 注意：通用自动翻译主要依赖 mouseover，因为在此处对所有元素做 computedStyle 太慢
                    if (pseudoRules.length > 0) {
                        for (const rule of pseudoRules) {
                            if (node.matches(rule.selector)) {
                                translatePseudoElements(node);
                                break;
                            }
                        }
                    }

                    // (漏洞修复) 在遍历过程中，实时检查并递归进入 Shadow DOM。
                    // 这是支持嵌套 Web Components 的关键。
                    if (node.shadowRoot) {
                        // 发现嵌套 ShadowRoot，触发回调并递归
                        if (shadowRootFoundCallback) shadowRootFoundCallback(node.shadowRoot);
                        translateElement(node.shadowRoot);
                    }
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
        // (漏洞修复)
        // 原始的递归调用已被移入 TreeWalker 循环中，以确保能处理嵌套的 Shadow DOM。
        // 但我们仍需处理根元素本身就带有 Shadow DOM 的情况 (例如，当 translateElement 的输入是 custom element 时)。
        if (element.shadowRoot) {
            // 确保根元素的 Shadow DOM 也能被观察到
            if (shadowRootFoundCallback) shadowRootFoundCallback(element.shadowRoot);
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
        translatePseudoElements, // 暴露给外部使用
        // 允许外部注册 Shadow Root 发现回调
        setShadowRootCallback: (callback) => {
            shadowRootFoundCallback = callback;
        }
    };
}