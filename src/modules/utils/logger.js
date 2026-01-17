/**
 * @file src/modules/utils/logger.js
 * @description
 * 提供一个集中式的、可切换的日志记录器。
 *
 * **核心功能**:
 * - **条件化日志**: 所有日志函数（`log`, `debug`, `error` 等）的输出都由一个全局的 `isDebugMode` 标志控制。只有当该标志为 `true` 时，日志才会真正打印到控制台。
 * - **状态持久化**: `isDebugMode` 的状态通过 `GM_getValue` 和 `GM_setValue` 在油猴脚本的存储中进行持久化，确保用户的设置在页面刷新后依然有效。
 * - **分级日志**: 提供不同级别的日志函数（`log`, `debug`, `error`, `warn`），并为每种级别的输出添加统一的前缀（如 `[汉化脚本-DEBUG]`），方便在开发者工具中进行筛选和识别。
 * - **专用日志**: 包含专门用于性能（`perf`）和翻译活动（`translateLog`）的日志函数，提供格式化的、结构清晰的输出。
 *
 * **工作流程**:
 * 1. 脚本启动时，从 `GM_storage` 读取 `LOG_KEY` 来初始化 `isDebugMode` 的值。
 * 2. `menu.js` 模块提供一个菜单命令，允许用户切换调试模式。当用户操作时，会调用 `updateDebugState` 并更新 `GM_storage` 中的值。
 * 3. 项目中的其他所有模块都从本文件导入日志函数，并使用它们来记录信息。这些函数内部会自动根据 `isDebugMode` 的值来决定是否输出。
 */

import { UI_CONFIG } from '../../config/ui.js';
import { STORAGE_KEYS } from '../../config/storage.js';

// 用于在油猴脚本存储中持久化日志开关状态的键。
export const LOG_KEY = STORAGE_KEYS.LOG_KEY;

// 模块加载时，立即从存储中读取当前的日志模式，默认为 false (关闭)。
export let isDebugMode = GM_getValue(LOG_KEY, false);

/**
 * @function updateDebugState
 * @description 更新 `isDebugMode` 的内部状态。
 *              此函数主要由 `menu.js` 模块在用户通过菜单切换调试模式时调用。
 * @param {boolean} newMode - 新的调试状态。
 */
export function updateDebugState(newMode) {
    isDebugMode = newMode;
}

/**
 * @function log
 * @description 统一的通用日志记录函数。
 *              只有当 `isDebugMode` 为 `true` 时，才会在控制台输出信息。
 * @param {...any} args - 需要打印到控制台的参数序列。
 */
export function log(...args) {
    if (isDebugMode) {
        // 使用一个统一的前缀，方便用户在控制台根据 "[汉化脚本]" 过滤信息。
        console.log(UI_CONFIG.LOG_PREFIX, ...args);
    }
}

/**
 * @function debug
 * @description 详细调试日志记录函数，用于输出更详尽的内部状态或流程信息。
 * @param {...any} args - 需要打印到控制台的参数序列。
 */
export function debug(...args) {
    if (isDebugMode) {
        console.debug(UI_CONFIG.LOG_PREFIX, '[DEBUG]', ...args);
    }
}

/**
 * @function error
 * @description 错误日志记录函数，用于输出捕获到的错误或关键性失败信息。
 * @param {...any} args - 需要打印到控制台的参数序列。
 */
export function error(...args) {
    if (isDebugMode) {
        console.error(UI_CONFIG.LOG_PREFIX, '[ERROR]', ...args);
    }
}

/**
 * @function warn
 * @description 警告日志记录函数，用于输出非致命性问题或潜在的异常情况。
 * @param {...any} args - 需要打印到控制台的参数序列。
 */
export function warn(...args) {
    if (isDebugMode) {
        console.warn(UI_CONFIG.LOG_PREFIX, '[WARN]', ...args);
    }
}

/**
 * @function perf
 * @description 性能日志记录函数，用于测量和报告特定操作的耗时。
 * @param {string} operation - 正在测量的操作的名称。
 * @param {number} duration - 操作耗时（毫秒）。
 * @param {...any} args - 其他需要一并输出的附加上下文信息。
 */
export function perf(operation, duration, ...args) {
    if (isDebugMode) {
        // 为了避免控制台被大量琐碎的性能信息淹没，只记录耗时超过 5 毫秒的操作。
        if (duration > 5) {
            console.log(UI_CONFIG.LOG_PREFIX, `[PERF] ${operation} 耗时: ${duration.toFixed(2)}ms`, ...args);
        }
    }
}

/**
 * @function translateLog
 * @description 翻译活动专用日志函数，以结构化的格式清晰地记录每一次成功的翻译操作。
 * @param {string} type - 翻译的类型（例如 '文本映射', '正则表达式', '属性'）。
 * @param {string} original - 原始文本。
 * @param {string} translated - 翻译后的文本。
 * @param {Element} [element=null] - （可选）与此次翻译相关的 DOM 元素。
 */
export function translateLog(type, original, translated, element = null) {
    if (isDebugMode) {
        // 只记录实际发生了内容变化的翻译。
        if (original !== translated) {
            const elementInfo = element ? ` 元素: ${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.replace(/\s+/g, '.') : ''}` : '';
            console.log(UI_CONFIG.LOG_PREFIX, `[TRANSLATE] ${type}:${elementInfo}\n  原文: "${original}"\n  译文: "${translated}"`);
        }
    }
}