/**
 * @file src/config/ui.js
 * @description 界面 (UI) 相关的常量配置。
 * 包含样式 ID、类名、文案前缀等与视觉展现相关的硬编码值。
 */

export const UI_CONFIG = {
    /**
     * @property {string} LOG_PREFIX
     * @description 控制台日志的统一前缀，便于在控制台筛选脚本日志。
     */
    LOG_PREFIX: '[WEB 汉化脚本]',

    /**
     * @property {string} MENU_COMMAND_ID
     * @description 油猴脚本菜单命令的唯一标识符。
     */
    MENU_COMMAND_ID: 'toggle_debug_log_command',

    /**
     * @property {string} OUTLINE_HINT_COMMAND_ID
     * @description “翻译描边提示”菜单命令的唯一标识符。
     */
    OUTLINE_HINT_COMMAND_ID: 'toggle_translation_outline_hint_command',

    /**
     * @property {object} outlineHint
     * @description 翻译描边提示功能专用的 DOM 标识符与样式。
     */
    outlineHint: {
        /** @property {string} STYLE_ID - 注入的 <style> 标签 ID */
        STYLE_ID: 'web-translate-outline-hint-style',
        /** @property {string} ATTRIBUTE - 标记被翻译元素的 data 属性名 */
        ATTRIBUTE: 'data-wts-translated',
        /** @property {string} CSS - 描边样式，使用 outline 不会影响页面布局 */
        CSS: '[data-wts-translated] { outline: 2px dashed rgba(255, 82, 82, 0.9) !important; outline-offset: 2px !important; }'
    },

    /**
     * @property {object} antiFlicker
     * @description 防闪烁模块专用的 DOM 标识符。
     */
    antiFlicker: {
        /** @property {string} STYLE_ID - 注入的 <style> 标签 ID */
        STYLE_ID: 'anti-flicker-style',
        /** @property {string} CLASS_IN_PROGRESS - 翻译进行时添加在 <html> 上的类名 */
        CLASS_IN_PROGRESS: 'translation-in-progress',
        /** @property {string} CLASS_COMPLETE - 翻译完成后添加在 <html> 上的类名 */
        CLASS_COMPLETE: 'translation-complete'
    }
};
