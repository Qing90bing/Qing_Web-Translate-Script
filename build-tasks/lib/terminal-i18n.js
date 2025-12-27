/**
 * @file build-tasks/lib/terminal-i18n.js
 * @description
 * 终端国际化（i18n）模块。
 * 该模块负责管理和提供在命令行界面中显示的所有文本的翻译。
 * 它从 `locales/terminal` 目录加载语言配置和语言包，并提供一个核心的 `t` 函数
 * 用于根据键名获取对应的翻译文本。
 *
 * @module terminal-i18n
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的目录路径，这是 ES Modules 中获取 __dirname 的标准方式。
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 路径定义 ---
// 定义语言包的根目录
const LOCALES_DIR = path.join(__dirname, '../tasks/terminal/locales');
// 定义存放具体语言文件（如 en-US.json）的目录
const LANGUAGES_DIR = path.join(LOCALES_DIR, 'languages');
// 定义语言配置文件的完整路径
const CONFIG_FILE = path.join(LOCALES_DIR, 'config.json');

// --- 缓存变量 ---
// 用于缓存当前加载的语言包，避免重复读取文件，提高性能。
let currentLanguagePack = null;
// 用于缓存当前语言的编码，以判断是否需要重新加载语言包。
let currentLanguageCode = null;

/**
 * 获取并解析语言配置文件（config.json）。
 * 该文件存储了当前使用的语言和所有支持的语言列表。
 * @returns {object} 返回一个包含语言配置的对象。如果读取失败，则返回一个默认的英文配置。
 * @property {string} currentLanguage - 当前激活的语言代码 (例如 'en-US')。
 * @property {Array<object>} supportedLanguages - 支持的语言列表，每个对象包含 code 和 name。
 */
export function getLanguageConfig() {
  try {
    // 同步读取配置文件内容
    const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    // 解析 JSON 字符串为对象
    return JSON.parse(configContent);
  } catch (error) {
    // 如果读取或解析失败，在控制台打印错误信息，并返回一个安全的默认配置。
    console.error(t('terminalLanguage.failedToReadConfig') || 'Failed to read language config:', error);
    // 返回默认配置
    return {
      currentLanguage: 'en-US',
      supportedLanguages: [
        { code: 'zh-CN', name: t('language.chineseSimplified') || '简体中文' },
        { code: 'en-US', name: t('language.english') || 'English' },
      ]
    };
  }
}

/**
 * 设置并持久化当前使用的语言。
 * @param {string} languageCode - 要设置的语言代码，例如 'zh-CN'。
 */
export function setCurrentLanguage(languageCode) {
  try {
    const config = getLanguageConfig();
    // 验证传入的语言代码是否在支持列表中。
    const isSupported = config.supportedLanguages.some(lang => lang.code === languageCode);
    if (!isSupported) {
      throw new Error(t('terminalLanguage.unsupportedLanguage', languageCode) || `Unsupported language: ${languageCode}`);
    }

    // 更新配置对象中的当前语言
    config.currentLanguage = languageCode;
    // 将更新后的配置写回 config.json 文件，`null, 2` 用于格式化输出，使其具有缩进，易于阅读。
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');

    // 成功设置新语言后，清除缓存，以便下次调用 `t` 函数时能加载新的语言包。
    currentLanguagePack = null;
    currentLanguageCode = null;
  } catch (error) {
    console.error(t('terminalLanguage.failedToSetLanguage') || 'Failed to set current language:', error);
  }
}

/**
 * 根据语言代码加载对应的语言包文件。
 * @param {string} languageCode - 要加载的语言包的语言代码。
 * @returns {object} 返回解析后的语言包对象。如果失败，则返回一个空对象作为后备。
 */
export function loadLanguagePack(languageCode) {
  try {
    // 构建语言包文件的完整路径
    const languageFile = path.join(LANGUAGES_DIR, `${languageCode}.json`);
    // 同步读取文件内容
    const content = fs.readFileSync(languageFile, 'utf8');
    // 解析 JSON 内容并返回
    return JSON.parse(content);
  } catch (error) {
    console.error(t('terminalLanguage.failedToLoadPack', languageCode) || `Failed to load language pack for ${languageCode}:`, error);
    // 在加载失败时返回一个空对象，这样调用 `t` 函数时不会因 `null` 或 `undefined` 出错，而是会返回键名。
    return {};
  }
}

/**
 * 获取当前配置的语言包，并利用缓存机制避免不必要的文件读取。
 * @returns {object} 当前语言包对象。
 */
export function getCurrentLanguagePack() {
  const config = getLanguageConfig();

  // 检查缓存是否有效：缓存存在且语言代码与当前配置一致。
  if (currentLanguagePack && currentLanguageCode === config.currentLanguage) {
    return currentLanguagePack;
  }

  // 如果缓存无效，则加载新的语言包
  currentLanguagePack = loadLanguagePack(config.currentLanguage);
  // 更新缓存中的语言代码
  currentLanguageCode = config.currentLanguage;
  return currentLanguagePack;
}

/**
 * 核心翻译函数。
 * 根据给定的键名，从当前语言包中查找并返回对应的翻译文本。
 * 支持使用点号（.）来访问嵌套的 JSON 对象。
 * 支持传入参数替换文本中的占位符（例如 {0}, {1}）。
 * @param {string} key - 翻译键，使用点号分隔（例如 'menu.title'）。
 * @param {...any} args - 用于替换字符串中占位符的参数列表。
 * @returns {string} 返回翻译后的文本。如果找不到键，则返回键本身作为后备。
 */
export function t(key, ...args) {
  const languagePack = getCurrentLanguagePack();

  // 通过点号分隔的键路径获取嵌套的对象值
  const keys = key.split('.');
  let value = languagePack;

  for (const k of keys) {
    // 逐级深入对象，查找最终的值
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 如果在任何一级找不到对应的键，说明翻译不存在，直接返回原始键名。
      return key;
    }
  }

  // 如果最终找到的值是字符串，并且有替换参数，则进行占位符替换。
  // 正则表达式 `/{(\d+)}/g` 匹配所有像 {0}, {1} 这样的占位符。
  if (args.length > 0 && typeof value === 'string') {
    return value.replace(/{(\d+)}/g, (match, index) => {
      // `match` 是匹配到的整个字符串 (如 "{0}")，`index` 是捕获组的内容 (如 "0")。
      // 如果 `args` 中有对应索引的参数，则用它替换占位符，否则保留原样。
      return args[index] !== undefined ? args[index] : match;
    });
  }

  // 如果没有参数或找到的值不是字符串，直接返回值。
  return value;
}

/**
 * 获取支持的语言列表。
 * @returns {Array<object>} 返回支持的语言列表数组，每个元素是 { code, name }。
 */
export function getSupportedLanguages() {
  const config = getLanguageConfig();
  return config.supportedLanguages || [];
}

/**
 * 获取当前设置的语言代码。
 * @returns {string} 当前语言代码，例如 'en-US'。
 */
export function getCurrentLanguageCode() {
  const config = getLanguageConfig();
  return config.currentLanguage;
}

/**
 * 添加一种新的语言支持。
 * 这会更新配置文件，并基于英文语言包创建一个新的语言文件模板。
 * @param {string} languageCode - 新语言的代码 (例如 'fr-FR')。
 * @param {string} languageName - 新语言的名称 (例如 'Français')。
 * @returns {boolean} 如果添加成功返回 true，否则返回 false。
 */
export function addLanguage(languageCode, languageName) {
  try {
    const config = getLanguageConfig();

    // 检查该语言是否已经存在，避免重复添加。
    const exists = config.supportedLanguages.some(lang => lang.code === languageCode);
    if (exists) {
      console.warn(t('terminalLanguage.languageAlreadyExists', languageCode) || `Language ${languageCode} already exists`);
      return false;
    }

    // 在支持语言列表中添加新语言
    config.supportedLanguages.push({ code: languageCode, name: languageName });

    // 更新配置文件
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');

    // 以英文语言包为模板，创建新的语言文件。
    // 这样做可以确保新语言文件包含所有必需的键。
    const englishPack = loadLanguagePack('en-US');
    const newLanguagePack = {
      ...englishPack,
      "language": languageName // 将新语言的名称写入语言包
    };

    const languageFile = path.join(LANGUAGES_DIR, `${languageCode}.json`);
    fs.writeFileSync(languageFile, JSON.stringify(newLanguagePack, null, 2), 'utf8');

    console.log(t('terminalLanguage.successfullyAdded', languageCode, languageName) || `Successfully added language: ${languageCode} (${languageName})`);
    return true;
  } catch (error) {
    console.error(t('terminalLanguage.failedToAddLanguage') || 'Failed to add new language:', error);
    return false;
  }
}

/**
 * 更新指定语言包的内容。
 * @param {string} languageCode - 要更新的语言代码。
 * @param {object} translations - 一个包含新翻译键值对的对象。
 * @returns {boolean} 如果更新成功返回 true，否则返回 false。
 */
export function updateLanguagePack(languageCode, translations) {
  try {
    const languageFile = path.join(LANGUAGES_DIR, `${languageCode}.json`);

    // 先读取现有的语言包内容
    let existingContent = {};
    try {
      const content = fs.readFileSync(languageFile, 'utf8');
      existingContent = JSON.parse(content);
    } catch (error) {
      // 如果文件不存在或无法解析，则警告用户并从一个空对象开始。
      console.warn(t('terminalLanguage.languageFileNotFound', languageCode) || `Language file for ${languageCode} not found or invalid, creating new one.`);
    }

    // 将新旧内容合并，新内容会覆盖旧内容中相同的键。
    const updatedContent = { ...existingContent, ...translations };

    // 将合并后的内容写回文件。
    fs.writeFileSync(languageFile, JSON.stringify(updatedContent, null, 2), 'utf8');

    console.log(t('terminalLanguage.successfullyUpdatedPack', languageCode) || `Successfully updated language pack for: ${languageCode}`);
    return true;
  } catch (error) {
    console.error(t('terminalLanguage.failedToUpdatePack', languageCode) || `Failed to update language pack for ${languageCode}:`, error);
    return false;
  }
}