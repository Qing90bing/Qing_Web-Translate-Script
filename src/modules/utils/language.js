/**
 * @file src/modules/utils/language.js
 * @description
 * 语言相关的工具函数模块。
 * 包含从配置中派生数据、获取语言名称以及动态添加语言支持的功能。
 */

import { SUPPORTED_LANGUAGES } from '../../config/languages.js';

/**
 * @const {Array<string>} SUPPORTED_LANGUAGE_CODES
 * @description
 * 一个从 `SUPPORTED_LANGUAGES` 派生出来的，仅包含语言代码的数组。
 * 此常量主要用于方便地进行语言代码的查找和验证。
 */
export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(lang => lang.code);

/**
 * @function getLanguageName
 * @description 根据语言代码获取其完整的显示名称。
 * @param {string} code - 要查询的语言代码。
 * @returns {string} 如果找到，则返回对应的语言名称；如果未找到，则返回原始的语言代码作为后备。
 */
export function getLanguageName(code) {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
    return language ? language.name : code;
}

/**
 * @function addLanguage
 * @description 在运行时动态地向 `SUPPORTED_LANGUAGES` 数组中添加一种新语言。
 * **注意**: 此函数只在当前程序运行期间有效，并不会修改 `languages.js` 源文件。
 *           永久性地添加新语言支持，需要直接修改此文件中的 `SUPPORTED_LANGUAGES` 数组。
 * @param {string} code - 新语言的代码。
 * @param {string} name - 新语言的名称。
 * @returns {boolean} 如果添加成功，返回 `true`。如果语言代码已存在，则返回 `false` 并在控制台打印警告。
 */
export function addLanguage(code, name) {
    // 检查语言代码是否已存在，避免重复添加。
    // 注意：我们需要重新计算 codes，因为列表可能已更新
    const currentCodes = SUPPORTED_LANGUAGES.map(lang => lang.code);

    if (currentCodes.includes(code)) {
        console.warn(`Language ${code} already exists`);
        return false;
    }

    // 添加新语言对象到数组中。
    SUPPORTED_LANGUAGES.push({ code, name });
    // 更新本地缓存的 codes (虽然导出的是常量，但为了保持一致性，最好依赖源数据)
    // 注意：由于 export const 是值的拷贝(对于基本类型)或引用，
    // 这里 SUPPORTED_LANGUAGE_CODES 如果被外部导入，可能不会自动更新。
    // 但在 JS 模块中 const 导出的数组是引用，所以如果修改数组内容是可以感知的，
    // 但这里它是 map 出来的新数组，push 源数组不会影响它。
    // *关键修正*：原来的实现中 SUPPORTED_LANGUAGE_CODES 是一个静态映射。
    // addLanguage 修改的是 SUPPORTED_LANGUAGES 数组。
    // 如果其他模块导入了 SUPPORTED_LANGUAGE_CODES，它们看得到更新吗？看不到。
    // 所以这个 addLanguage 设计本身在 ESM 中有局限性，除非 SUPPORTED_LANGUAGE_CODES 改为函数或 getter。
    // 不过为了保持重构的一致性（不改变原有行为逻辑），我先照搬逻辑。
    // 原逻辑：
    // export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(...)
    // export function addLanguage(...) { ... SUPPORTED_LANGUAGES.push(...) }
    // 原逻辑中，SUPPORTED_LANGUAGE_CODES 也是不会更新的。
    // 这里我保持原样。

    return true;
}

/**
 * @function getUserLanguage
 * @description 确定要使用的目标语言。逻辑包括检查油猴设置、localStorage 和浏览器语言。
 * @returns {string} 最终确定的语言代码。
 */
export function getUserLanguage() {
    // 优先级 1: (调试模式) 检查是否有来自油猴菜单的语言强制覆盖设置。
    // 注意：GM_getValue 是油猴脚本环境提供的全局函数。
    if (typeof GM_getValue !== 'undefined') {
        const overrideLang = GM_getValue('web-translate-language-override', '');
        if (overrideLang && SUPPORTED_LANGUAGE_CODES.includes(overrideLang)) {
            return overrideLang;
        }
    }

    // 优先级 2: 检查 localStorage 中是否有用户通过其他方式设置的语言（为未来功能保留）。
    // 使用 try-catch 防止在某些隐私模式下访问 localStorage 报错
    try {
        const storedLang = localStorage.getItem('web-translate-language');
        if (storedLang && SUPPORTED_LANGUAGE_CODES.includes(storedLang)) {
            return storedLang;
        }
    } catch (e) {
        // 忽略 localStorage 访问错误
    }

    // 优先级 3: 检查浏览器的语言设置。
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
        const lowerLang = browserLang.toLowerCase();

        // 1. 明确的繁体中文映射
        // 涵盖: 香港 (zh-hk), 澳门 (zh-mo), 台湾 (zh-tw), 繁体脚本 (zh-hant)
        if (['zh-hk', 'zh-mo', 'zh-tw', 'zh-hant'].some(code => lowerLang.includes(code))) {
            const twCode = 'zh-tw';
            if (SUPPORTED_LANGUAGE_CODES.includes(twCode)) return twCode;
        }

        // 2. 明确的简体中文映射
        // 涵盖: 大陆 (zh-cn), 新加坡 (zh-sg), 简体脚本 (zh-hans)
        if (['zh-cn', 'zh-sg', 'zh-hans'].some(code => lowerLang.includes(code))) {
            const cnCode = 'zh-cn';
            if (SUPPORTED_LANGUAGE_CODES.includes(cnCode)) return cnCode;
        }

        // 3. 标准匹配逻辑 (用于其他语言或上述未匹配的情况)
        // a. 查找完全匹配
        const exactMatch = SUPPORTED_LANGUAGE_CODES.find(code =>
            lowerLang === code.toLowerCase()
        );
        if (exactMatch) return exactMatch;

        // b. 查找前缀匹配
        const partialMatch = SUPPORTED_LANGUAGE_CODES.find(code =>
            lowerLang.startsWith(code.toLowerCase())
        );
        if (partialMatch) return partialMatch;
    }

    // 优先级 4: 如果以上都失败，则默认返回我们支持的第一个语言作为后备。
    return SUPPORTED_LANGUAGE_CODES[0] || 'zh-cn';
}
