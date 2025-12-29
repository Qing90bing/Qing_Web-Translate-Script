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
