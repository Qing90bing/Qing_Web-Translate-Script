/**
 * @file src/modules/ui/menu.js
 * @description
 * 菜单管理模块。
 * 此模块负责创建和管理油猴脚本在浏览器扩展菜单中的所有命令。
 * 它利用 Greasemonkey/Tampermonkey 提供的 `GM_*` API 来实现动态菜单，
 * 主要用于提供开发者调试功能。
 *
 * **核心功能**:
 * 1.  **调试模式切换**: 提供一个菜单项，用于开启或关闭详细的控制台日志输出。
 * 2.  **翻译描边提示**: 提供一个菜单项，用于高亮所有被脚本实际翻译的元素，方便开发者区分“原生多语言”与“脚本翻译”。
 * 3.  **语言强制覆盖**: 在调试模式下，会额外显示一个语言子菜单，允许开发者强制使用某种特定语言来渲染页面，
 *     这对于测试特定语言的翻译效果非常有用，无需修改系统或浏览器语言。
 *
 * **实现机制**:
 * - 所有状态（如调试模式是否开启、当前覆盖的语言）都通过 `GM_setValue` / `GM_getValue` 持久化存储在脚本管理器中。
 * - 每次状态变更后，都会调用 `location.reload()` 来刷新页面。这是必要的，因为菜单状态和脚本的初始化逻辑（如日志级别）都需要在页面加载时确定。
 */

import { isDebugMode, updateDebugState, LOG_KEY } from '../utils/logger.js';
import { SUPPORTED_LANGUAGES } from '../../config/languages.js';
import { STORAGE_KEYS } from '../../config/storage.js';
import { UI_CONFIG } from '../../config/ui.js';

// --- 常量定义 ---
// 用于切换调试日志命令的唯一 ID，虽然在此脚本中不是必需的，但保留作为良好实践。
const MENU_COMMAND_ID = UI_CONFIG.MENU_COMMAND_ID;
// 用于在脚本存储中持久化语言覆盖设置的键名。
const OVERRIDE_LANG_KEY = STORAGE_KEYS.OVERRIDE_LANG_KEY;
// 用于在脚本存储中持久化“翻译描边提示”开关状态的键名。
const OUTLINE_HINT_KEY = STORAGE_KEYS.OUTLINE_HINT_KEY;
// 用于切换“翻译描边提示”菜单命令的唯一 ID。
const OUTLINE_HINT_COMMAND_ID = UI_CONFIG.OUTLINE_HINT_COMMAND_ID;

// --- 私有函数 ---

/**
 * @private
 * @function setOverrideLanguage
 * @description 设置语言覆盖，将其存储到 GM 存储中，并重新加载页面以应用更改。
 * @param {string} langCode - 要强制使用的语言代码 (例如 'zh-cn')。
 */
function setOverrideLanguage(langCode) {
    GM_setValue(OVERRIDE_LANG_KEY, langCode);
    location.reload();
}

/**
 * @private
 * @function clearOverrideLanguage
 * @description 清除语言覆盖设置，并重新加载页面以恢复默认行为。
 */
function clearOverrideLanguage() {
    GM_setValue(OVERRIDE_LANG_KEY, ''); // 使用空字符串表示无覆盖
    location.reload();
}

/**
 * @private
 * @function toggleDebugMode
 * @description 切换调试模式的函数。它会更新 GM 存储中的状态，并重新加载页面。
 */
function toggleDebugMode() {
    const newMode = !isDebugMode;
    GM_setValue(LOG_KEY, newMode); // 持久化新状态
    updateDebugState(newMode); // 立即更新当前脚本实例中的日志状态（尽管页面即将刷新）
    // 刷新页面是必要的，以便重新构建菜单（显示/隐藏语言菜单）并让脚本的日志系统在初始化时就以正确的模式运行。
    location.reload();
}

/**
 * @private
 * @function toggleOutlineHint
 * @description 切换“翻译描边提示”的开关状态，并重新加载页面以应用或取消描边。
 */
function toggleOutlineHint() {
    const newMode = !GM_getValue(OUTLINE_HINT_KEY, false);
    GM_setValue(OUTLINE_HINT_KEY, newMode);
    location.reload();
}

/**
 * @private
 * @function registerMenuCommands
 * @description 注册或更新所有的菜单命令。
 *              此函数是构建整个菜单的核心。
 */
function registerMenuCommands() {
    // 1. 注册“切换调试日志”的命令
    // 动态地在菜单文本中显示当前的状态（开启/关闭），为用户提供即时反馈。
    const debugStatus = isDebugMode ? '开启' : '关闭';
    GM_registerMenuCommand(
        `切换调试日志 (当前: ${debugStatus})`,
        toggleDebugMode,
        { id: MENU_COMMAND_ID }
    );

    // 2. 注册“翻译描边提示”的命令
    // 开发者在排查“哪些内容仍由脚本翻译”时，不需要先开启调试日志，因此始终显示在菜单中。
    const outlineStatus = GM_getValue(OUTLINE_HINT_KEY, false) ? '开启' : '关闭';
    GM_registerMenuCommand(
        `翻译描边提示 (当前: ${outlineStatus})`,
        toggleOutlineHint,
        { id: OUTLINE_HINT_COMMAND_ID }
    );

    // 3. 仅在调试模式下，才注册语言切换相关的菜单
    if (isDebugMode) {
        const currentOverride = GM_getValue(OVERRIDE_LANG_KEY, '');

        // 添加一个分隔符式的标题，以组织菜单结构。
        GM_registerMenuCommand('--- 语言调试菜单 ---', () => { });

        // 遍历所有支持的语言，为每一种语言创建一个菜单项。
        SUPPORTED_LANGUAGES.forEach(lang => {
            const isCurrent = currentOverride === lang.code;
            // 在当前被强制的语言前添加 '✅' 标记，提供清晰的视觉指示。
            const menuText = `${isCurrent ? '✅' : '➡️'} 强制语言: ${lang.name}`;
            GM_registerMenuCommand(menuText, () => setOverrideLanguage(lang.code));
        });

        // 添加一个用于清除语言强制设置的选项。
        GM_registerMenuCommand('🔄 清除语言强制 (恢复默认)', clearOverrideLanguage);
    }
}


// --- 导出函数 ---

/**
 * @function initializeMenu
 * @description 初始化菜单模块。
 *              此函数是菜单功能的公共入口点，应在脚本启动时调用。
 */
export function initializeMenu() {
    // 在现代的 Tampermonkey (v4.11+) 中，再次使用相同的名称调用 GM_registerMenuCommand 会自动替换掉旧的命令，
    // 无需手动注销。因此，我们在这里直接调用注册函数来构建或刷新整个菜单，以确保其显示的状态始终是最新的。
    registerMenuCommands();
}
