/**
 * @file build-tasks/lib/translation-utils.js
 * @description
 * 翻译管理任务的共享工具函数集合。
 * 用于消除 add/modify/remove-translation.js 中的重复逻辑。
 */

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import prettier from 'prettier';
import { color } from './colors.js';
import { t } from './terminal-i18n.js';
import { writeFilePreservingEolSync } from './utils.js';
import { SUPPORTED_LANGUAGES } from '../../src/config/languages.js';
import { SUPPORTED_LANGUAGE_CODES } from '../../src/modules/utils/language.js';

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

/**
 * @function selectLanguage
 * @description 提示用户选择语言。
 * @returns {Promise<string|null>} 返回语言代码，如果选择返回则返回 null。
 */
export async function selectLanguage() {
    const { language } = await inquirer.prompt([
        {
            type: 'list',
            name: 'language',
            message: t('manageTranslations.selectLanguage'),
            prefix: '🌐',
            choices: [
                ...SUPPORTED_LANGUAGES.map(lang => ({
                    name: `${lang.name} (${lang.code})`,
                    value: lang.code
                })),
                new inquirer.Separator('──────────────────────────────────────────────'),
                { name: t('manageTranslationsMenu.back'), value: 'back' }
            ]
        }
    ]);

    return language === 'back' ? null : language;
}

/**
 * @function scanTranslationFiles
 * @description 扫描指定语言目录下的翻译文件。
 * @param {string} language - 语言代码
 * @returns {Array<string>} 文件名列表
 */
export function scanTranslationFiles(language) {
    const sitesPath = path.join(process.cwd(), 'src', 'translations', language, 'sites');
    if (fs.existsSync(sitesPath)) {
        return fs.readdirSync(sitesPath).filter(file => file.endsWith('.js'));
    }
    return [];
}

/**
 * @function selectTranslationFile
 * @description 提示用户从列表中选择一个翻译文件。
 * @param {Array<string>} files - 文件列表
 * @param {string} message - 提示信息
 * @returns {Promise<string|null>} 返回文件名，如果选择返回则返回 null。
 */
export async function selectTranslationFile(files, message = t('manageTranslations.selectFileToModify')) {
    if (files.length === 0) {
        return null; // 这里由调用者处理空列表提示更灵活
    }

    const { fileName } = await inquirer.prompt([
        {
            type: 'list',
            name: 'fileName',
            message: message,
            prefix: '📄',
            pageSize: 20,
            choices: [
                ...files.sort(),
                new inquirer.Separator('──────────────────────────────────────────────'),
                { name: t('manageTranslationsMenu.back'), value: 'back' },
            ],
        },
    ]);

    return fileName === 'back' ? null : fileName;
}

/**
 * @function getTranslationFilePaths
 * @description 获取与翻译相关的所有文件路径。
 * @param {string} language - 语言代码
 * @param {string} fileName - 文件名 (例如 "google.com.js")
 * @returns {Object} 包含 sitesDir, filePath, indexJsPath
 */
export function getTranslationFilePaths(language, fileName) {
    const sitesDir = path.join(process.cwd(), 'src', 'translations', language, 'sites');
    const filePath = path.join(sitesDir, fileName);
    const indexJsPath = path.join(process.cwd(), 'src', 'translations', language, 'index.js');
    return { sitesDir, filePath, indexJsPath };
}

/**
 * @function addDomainToHeader
 * @description 向 header.txt 添加新的 @match 规则。
 * @param {string} domain
 */
export function addDomainToHeader(domain) {
    const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');
    if (!fs.existsSync(headerTxtPath)) return;

    const originalHeaderTxtContent = fs.readFileSync(headerTxtPath, 'utf-8');
    let headerTxtContent = originalHeaderTxtContent;
    const matchDirective = `// @match        *://${domain}/*\n`;

    if (!headerTxtContent.includes(matchDirective.trim())) {
        const lastMatchIndex = headerTxtContent.lastIndexOf('// @match');
        // 如果找不到 // @match，这可能是一个问题，但我们假设 header 总是包含至少一个 match 或者结构正确
        if (lastMatchIndex !== -1) {
            const nextLineIndexAfterLastMatch = headerTxtContent.indexOf('\n', lastMatchIndex);
            headerTxtContent =
                headerTxtContent.slice(0, nextLineIndexAfterLastMatch + 1) +
                matchDirective +
                headerTxtContent.slice(nextLineIndexAfterLastMatch + 1);
        } else {
            // 简单的 fallback，虽然不太可能发生
            headerTxtContent += matchDirective;
        }

        writeFilePreservingEolSync(headerTxtPath, originalHeaderTxtContent, headerTxtContent);
        console.log(color.green(t('manageTranslations.headerTxtUpdatedSuccess', color.yellow(headerTxtPath))));
    } else {
        console.log(color.yellow(t('manageTranslations.headerAlreadyExists', color.yellow(domain))));
    }
}

/**
 * @function updateDomainInHeader
 * @description 在 header.txt 中更新域名。
 * @param {string} oldDomain
 * @param {string} newDomain
 */
export function updateDomainInHeader(oldDomain, newDomain) {
    const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');
    if (!fs.existsSync(headerTxtPath)) return;

    let headerContent = fs.readFileSync(headerTxtPath, 'utf-8');
    const oldMatchRegex = new RegExp(`(// @match\\s+)\\*://${oldDomain.replace(/\./g, '\\.')}/\\*`, 'g');

    if (oldMatchRegex.test(headerContent)) {
        const newMatchLine = `$1*://${newDomain}/*`;
        headerContent = headerContent.replace(oldMatchRegex, newMatchLine);
        fs.writeFileSync(headerTxtPath, headerContent);
        console.log(color.green(t('modifyTranslation.headerTxtUpdated')));
        return true;
    } else {
        console.log(color.yellow(t('modifyTranslation.headerNotUpdated')));
        return false;
    }
}

/**
 * @function removeDomainFromHeader
 * @description 从 header.txt 中移除域名，前提是该域名没有被其他语言使用。
 * @param {string} domain
 * @param {string} currentLanguage - 当前正在移除的语言，用于排除检查
 */
export function removeDomainFromHeader(domain, currentLanguage) {
    const translationsDir = path.join(process.cwd(), 'src', 'translations');
    const fileName = `${domain}.js`;

    // 检查其他语言是否存在该文件
    let hasOtherLanguageFiles = false;
    try {
        const allLangDirs = fs.readdirSync(translationsDir).filter(file =>
            fs.statSync(path.join(translationsDir, file)).isDirectory() &&
            SUPPORTED_LANGUAGE_CODES.includes(file) &&
            file !== currentLanguage // 排除当前语言
        );

        for (const langDir of allLangDirs) {
            const otherLangPath = path.join(translationsDir, langDir, 'sites', fileName);
            if (fs.existsSync(otherLangPath)) {
                hasOtherLanguageFiles = true;
                break;
            }
        }
    } catch (checkError) {
        console.warn(color.yellow(`Error checking other languages: ${checkError.message}`));
    }

    if (!hasOtherLanguageFiles) {
        const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');
        if (fs.existsSync(headerTxtPath)) {
            let headerTxtContent = fs.readFileSync(headerTxtPath, 'utf-8');
            const matchRegex = new RegExp(`^// @match\\s+\\*://${domain.replace(/\./g, '\\.')}/\\*\\s*\\r?\\n`, 'm');
            headerTxtContent = headerTxtContent.replace(matchRegex, '');
            fs.writeFileSync(headerTxtPath, headerTxtContent);
            console.log(color.green(t('manageTranslations.headerTxtUpdated')));
        }
    } else {
        console.log(color.yellow(t('manageTranslations.headerNotRemoved', color.yellow(domain))));
    }
}
