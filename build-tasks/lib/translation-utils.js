/**
 * @file build-tasks/lib/translation-utils.js
 * @description
 * 翻译管理任务的共享工具函数集合。
 * 用于消除 add/modify/remove-translation.js 中的重复逻辑。
 */

import fs from 'fs';
import prettier from 'prettier';
import { color } from './colors.js';
import { t } from './terminal-i18n.js';

/**
 * @function toCamelCase
 * @description 将域名字符串（如 "example.com"）和语言代码（如 "zh-CN"）转换为一个唯一的驼峰式命名（如 "exampleComZhCN"）。
 * 这个函数确保生成的名称是有效的 JavaScript 变量名，并且通过附加语言标识来避免不同语言版本下的命名冲突。
 * @param {string} domain - 要转换的域名。
 * @param {string} [language=''] - 语言代码，可选。
 * @returns {string} 转换后的驼峰式命名的字符串。
 */
export function toCamelCase(domain, language = '') {
    // 将域名中的 `.` 替换为空格，然后利用正则表达式和回调函数将每个单词的首字母大写（除了第一个单词）。
    let result = domain.replace(/\./g, ' ').replace(/(?:^|\s)\w/g, (match, index) => {
        return index === 0 ? match.toLowerCase().trim() : match.toUpperCase().trim();
    }).replace(/\s+/g, ''); // 移除所有空格

    // 如果提供了语言标识，则将其附加到变量名后面以确保唯一性。
    if (language) {
        // 将语言标识（如 "zh-CN"）也转换为驼峰式命名的大写后缀（如 "ZhCn"）。
        const langParts = language.split('-');
        const langSuffix = langParts.map(part =>
            part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        ).join('');
        result += langSuffix;
    }

    return result;
}

/**
 * @function isValidDomain
 * @description 验证域名格式是否正确。
 * @param {string} domain - 要验证的域名字符串。
 * @returns {boolean} 如果格式正确返回 true，否则返回 false。
 */
export function isValidDomain(domain) {
    // 使用正则表达式对域名格式进行简单校验。
    // 匹配 example.com, sub.example.co.uk 等格式
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
}

/**
 * @function formatAndSaveIndex
 * @description 统一格式化并保存 index.js 文件。
 * 封装了 Prettier 格式化和特殊的双引号 Key 处理逻辑。
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @returns {Promise<void>}
 */
export async function formatAndSaveIndex(filePath, content) {
    try {
        // 第一步：Prettier 统一使用单引号
        const formattedContent = await prettier.format(content, {
            singleQuote: true,
            tabWidth: 4,
            filepath: filePath,
        });

        // 第二步：使用正则将对象的键（key）强制保留为双引号
        // 匹配模式：'domain#lang':
        // 替换为："domain#lang":
        const finalMixedContent = formattedContent.replace(/'([\w.-]+#[\w-]+)'\s*:/g, '"$1":');

        fs.writeFileSync(filePath, finalMixedContent);
    } catch (error) {
        console.error(color.red(t('manageTranslations.indexJsUpdateError', error.message)));
        throw error; // 向上抛出，以便调用者处理事务回滚
    }
}
