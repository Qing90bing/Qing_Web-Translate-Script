import { isDebugMode, updateDebugState, LOG_KEY } from '../utils/logger.js';

// 为菜单项定义一个唯一的、固定的ID
const MENU_COMMAND_ID = 'toggle_debug_log_command';

/**
 * 切换调试模式的函数。
 */
function toggleDebugMode() {
    // 翻转当前的调试模式状态
    const newMode = !isDebugMode;
    // 将新状态保存到持久化存储中
    GM_setValue(LOG_KEY, newMode);
    // 更新 logger 模块中的状态
    updateDebugState(newMode);
    // 状态已变更，现在更新菜单命令的文本以反映新状态。
    updateMenuCommand();
}

/**
 * 更新油猴菜单的命令文本。
 */
function updateMenuCommand() {
    const status = isDebugMode ? '开启' : '关闭';
    GM_registerMenuCommand(
        `切换调试日志 (当前: ${status})`,
        toggleDebugMode,
        { id: MENU_COMMAND_ID }
    );
}

/**
 * 初始化菜单模块。
 */
export function initializeMenu() {
    updateMenuCommand();
}
