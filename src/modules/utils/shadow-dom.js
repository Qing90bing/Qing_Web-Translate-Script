/**
 * @file src/modules/utils/shadow-dom.js
 * @description
 * Shadow DOM 核心工具库。
 * 提供了一系列用于穿透、遍历和操作 Shadow DOM (包括 Open 和 Closed 模式) 的通用函数。
 * 
 * **核心功能**:
 * 1. `getShadowRoot`: 安全地获取元素的 Shadow Root，支持通过 patch 机制访问 Closed Shadow Root。
 * 2. `findAllShadowRoots`: 深度优先搜索，递归查找子树中的所有 Shadow Root。
 * 3. `deepQuerySelector`: 穿越 Shadow Boundary 查找元素的增强型选择器。
 */

/**
 * @function getShadowRoot
 * @description 获取元素的 Shadow Root。
 * 优先读取标准的 `element.shadowRoot` (Open 模式)。
 * 如果失败且存在通过 patch 注入的 `_wtsShadowRoot` (Closed 模式)，则返回它。
 * 
 * @param {Element} element - 目标元素
 * @returns {ShadowRoot|null} 返回 ShadowRoot 实例，如果不存在或无法访问则返回 null。
 */
export function getShadowRoot(element) {
    if (!element) return null;

    // 1. 尝试标准 API (针对 open 模式)
    if (element.shadowRoot) {
        return element.shadowRoot;
    }

    // 2. 尝试获取由 patchAttachShadow 注入的私有引用 (针对 closed 模式)
    // 注意：这依赖于 observers.js 中的 patch 逻辑
    if (element._wtsShadowRoot) {
        return element._wtsShadowRoot;
    }

    return null;
}

/**
 * @function findAllShadowRoots
 * @description 递归查找给定根节点下所有的 Shadow Root。
 * 使用深度优先遍历 (DFS) 算法，能够发现深层嵌套的 Shadow DOM。
 * 
 * @param {Node} root - 起始搜索的根节点 (通常是 document.body 或另一个 ShadowRoot)
 * @returns {ShadowRoot[]} 找到的所有 ShadowRoot 数组
 */
export function findAllShadowRoots(root) {
    const shadowRoots = [];
    if (!root) return shadowRoots;

    // 使用 TreeWalker 进行遍历，它比 querySelectorAll('*') 更快且更灵活
    // 注意：TreeWalker 默认不会进入 Shadow Root，我们需要在遍历过程中手动处理
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT,
        null
    );

    do {
        const node = walker.currentNode;

        // 检查当前节点是否有 Shadow Root
        const shadowRoot = getShadowRoot(node);
        if (shadowRoot) {
            shadowRoots.push(shadowRoot);

            // 重要：递归查找该 Shadow Root 内部
            // 我们不能简单地继续 walker，因为它跳不过 Shadow Boundary
            const innerShadowRoots = findAllShadowRoots(shadowRoot);
            if (innerShadowRoots.length > 0) {
                shadowRoots.push(...innerShadowRoots);
            }
        }
    } while (walker.nextNode());

    return shadowRoots;
}

/**
 * @function deepQuerySelector
 * @description 穿透 Shadow DOM 的选择器。
 * 支持常规选择器，并尝试在所有已知的 Shadow Root 中查找匹配项。
 * 
 * 注意：性能开销较大，应谨慎使用。
 * 
 * @param {string} selector - CSS 选择器
 * @param {Node} [root=document] - 搜索起始根
 * @returns {Element|null} 找到的第一个匹配元素
 */
export function deepQuerySelector(selector, root = document) {
    // 1. 尝试直接查找
    let result = root.querySelector(selector);
    if (result) return result;

    // 2. 如果根节点本身就是 ShadowRoot 或 Document，
    // 我们需要遍历其内部的所有元素来寻找嵌套的 ShadowRoots
    // 这里的策略是：获取所有可能的 ShadowHosts，然后进入它们

    // 使用 TreeWalker 寻找所有 Shadow Hosts
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: (node) => {
                return getShadowRoot(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        }
    );

    while (walker.nextNode()) {
        const host = walker.currentNode;
        const shadowRoot = getShadowRoot(host);

        if (shadowRoot) {
            // 在当前 Shadow Root 中递归查找
            const found = deepQuerySelector(selector, shadowRoot);
            if (found) return found;
        }
    }

    return null;
}
