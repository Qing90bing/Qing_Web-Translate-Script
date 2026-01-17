/**
 * @file src/config/storage.js
 * @description 本地存储键名定义。
 * 集中管理所有用于 Tampermonkey/Greasemonkey 存储 (GM_setValue) 的 Key。
 * 确保 Key 的唯一性，防止不同功能模块间的命名冲突。
 */

export const STORAGE_KEYS = {
    /**
     * @property {string} LOG_KEY
     * @description
     * 用于存储“调试模式”开关状态的键名。
     * 值类型: boolean (true=开启调试日志, false=关闭)
     */
    LOG_KEY: 'web_translate_debug_mode',

    /**
     * @property {string} OVERRIDE_LANG_KEY
     * @description
     * 用于存储“语言强制覆盖”设置的键名。
     * 值类型: string (例如 'zh-cn', 'en-us')。若为空字符串则表示使用浏览器默认语言。
     */
    OVERRIDE_LANG_KEY: 'web-translate-language-override',
};
