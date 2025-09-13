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
