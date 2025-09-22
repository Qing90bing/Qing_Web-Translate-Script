import { isDebugMode, updateDebugState, LOG_KEY } from '../utils/logger.js';
import { SUPPORTED_LANGUAGES } from '../../config/languages.js';

// --- 常量定义 ---
const MENU_COMMAND_ID = 'toggle_debug_log_command';
const OVERRIDE_LANG_KEY = 'web-translate-language-override';

// --- 私有函数 ---

/**
 * 设置语言覆盖并重新加载页面。
 * @param {string} langCode - 要设置的语言代码。
 */
function setOverrideLanguage(langCode) {
    GM_setValue(OVERRIDE_LANG_KEY, langCode);
    location.reload();
}

/**
 * 清除语言覆盖并重新加载页面。
 */
function clearOverrideLanguage() {
    GM_setValue(OVERRIDE_LANG_KEY, ''); // 使用空字符串表示无覆盖
    location.reload();
}

/**
 * 切换调试模式的函数。
 */
function toggleDebugMode() {
    const newMode = !isDebugMode;
    GM_setValue(LOG_KEY, newMode);
    updateDebugState(newMode);
    // 刷新页面以应用调试模式的更改，并重建菜单
    location.reload();
}

/**
 * 注册或更新所有菜单命令。
 */
function registerMenuCommands() {
    // 1. 切换调试日志的命令
    const debugStatus = isDebugMode ? '开启' : '关闭';
    GM_registerMenuCommand(
        `切换调试日志 (当前: ${debugStatus})`,
        toggleDebugMode,
        { id: MENU_COMMAND_ID }
    );

    // 2. 仅在调试模式下显示语言切换菜单
    if (isDebugMode) {
        const currentOverride = GM_getValue(OVERRIDE_LANG_KEY, '');
        
        // 添加一个标题，显示当前状态
        GM_registerMenuCommand('--- 语言调试菜单 ---', () => {});

        // 为每种支持的语言创建一个菜单项
        SUPPORTED_LANGUAGES.forEach(lang => {
            const isCurrent = currentOverride === lang.code;
            const menuText = `${isCurrent ? '✅' : '➡️'} 强制语言: ${lang.name}`;
            GM_registerMenuCommand(menuText, () => setOverrideLanguage(lang.code));
        });

        // 添加清除覆盖的选项
        GM_registerMenuCommand('🔄 清除语言强制 (恢复默认)', clearOverrideLanguage);
    }
}


// --- 导出函数 ---

/**
 * 初始化菜单模块。
 * 此函数会清空并重新注册所有菜单命令，以确保菜单状态的准确性。
 */
export function initializeMenu() {
    // 在 Tampermonkey 4.11+ 中，再次调用 GM_registerMenuCommand 会替换旧的。
    // 为了避免旧菜单残留，我们在这里直接调用注册函数。
    registerMenuCommands();
}
