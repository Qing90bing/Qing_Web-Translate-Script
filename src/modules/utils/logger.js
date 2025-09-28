// 用于在油猴菜单中存储日志开关状态的键
export const LOG_KEY = 'web_translate_debug_mode';

// 从存储中读取当前日志模式，默认为 false (关闭)
export let isDebugMode = GM_getValue(LOG_KEY, false);

/**
 * 更新 isDebugMode 的内部状态。
 * 这个函数将由菜单模块调用。
 * @param {boolean} newMode - 新的调试状态。
 */
export function updateDebugState(newMode) {
    isDebugMode = newMode;
}

/**
 * 统一的日志记录函数。
 * 只有当 isDebugMode 为 true 时，才会在控制台输出信息。
 * @param {...any} args - 需要打印到控制台的参数。
 */
export function log(...args) {
    if (isDebugMode) {
        // 使用一个统一的前缀，方便用户在控制台过滤信息
        console.log('[汉化脚本]', ...args);
    }
}

/**
 * 详细日志记录函数，用于输出更详细的调试信息
 * @param {...any} args - 需要打印到控制台的参数。
 */
export function debug(...args) {
    if (isDebugMode) {
        console.debug('[汉化脚本-DEBUG]', ...args);
    }
}

/**
 * 错误日志记录函数
 * @param {...any} args - 需要打印到控制台的参数。
 */
export function error(...args) {
    if (isDebugMode) {
        console.error('[汉化脚本-ERROR]', ...args);
    }
}

/**
 * 警告日志记录函数
 * @param {...any} args - 需要打印到控制台的参数。
 */
export function warn(...args) {
    if (isDebugMode) {
        console.warn('[汉化脚本-WARN]', ...args);
    }
}

/**
 * 性能日志记录函数，用于记录翻译耗时等性能信息
 * @param {string} operation - 操作名称
 * @param {number} duration - 操作耗时（毫秒）
 * @param {...any} args - 其他参数
 */
export function perf(operation, duration, ...args) {
    if (isDebugMode) {
        // 只记录超过阈值的性能信息，避免过多输出
        if (duration > 5) {
            console.log(`[汉化脚本-PERF] ${operation} 耗时: ${duration.toFixed(2)}ms`, ...args);
        }
    }
}

/**
 * 翻译日志记录函数，专门用于记录翻译相关的信息
 * @param {string} type - 翻译类型（文本/属性等）
 * @param {string} original - 原文
 * @param {string} translated - 译文
 * @param {Element} element - 相关元素（可选）
 */
export function translateLog(type, original, translated, element = null) {
    if (isDebugMode) {
        // 只记录实际发生了翻译变化的内容
        if (original !== translated) {
            const elementInfo = element ? ` 元素: ${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.replace(/\s+/g, '.') : ''}` : '';
            console.log(`[汉化脚本-TRANSLATE] ${type}:${elementInfo}\n  原文: "${original}"\n  译文: "${translated}"`);
        }
    }
}