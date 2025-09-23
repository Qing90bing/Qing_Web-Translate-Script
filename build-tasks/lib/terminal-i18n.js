import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前模块的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 语言包目录
const LOCALES_DIR = path.join(__dirname, '../../locales/terminal');
const LANGUAGES_DIR = path.join(LOCALES_DIR, 'languages');

// 语言配置文件路径
const CONFIG_FILE = path.join(LOCALES_DIR, 'config.json');

// 缓存当前语言包
let currentLanguagePack = null;
let currentLanguageCode = null;

/**
 * 获取语言配置
 * @returns {Object} 语言配置对象
 */
export function getLanguageConfig() {
  try {
    const configContent = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(configContent);
  } catch (error) {
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
 * 设置当前语言
 * @param {string} languageCode 语言代码
 */
export function setCurrentLanguage(languageCode) {
  try {
    const config = getLanguageConfig();
    // 验证语言代码是否受支持
    const isSupported = config.supportedLanguages.some(lang => lang.code === languageCode);
    if (!isSupported) {
      throw new Error(t('terminalLanguage.unsupportedLanguage', languageCode) || `Unsupported language: ${languageCode}`);
    }
    
    config.currentLanguage = languageCode;
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    
    // 清除缓存，以便下次获取新的语言包
    currentLanguagePack = null;
    currentLanguageCode = null;
  } catch (error) {
    console.error(t('terminalLanguage.failedToSetLanguage') || 'Failed to set current language:', error);
  }
}

/**
 * 加载语言包
 * @param {string} languageCode 语言代码
 * @returns {Object} 语言包对象
 */
export function loadLanguagePack(languageCode) {
  try {
    const languageFile = path.join(LANGUAGES_DIR, `${languageCode}.json`);
    const content = fs.readFileSync(languageFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(t('terminalLanguage.failedToLoadPack', languageCode) || `Failed to load language pack for ${languageCode}:`, error);
    // 返回空对象作为后备
    return {};
  }
}

/**
 * 获取当前语言包
 * @returns {Object} 当前语言包对象
 */
export function getCurrentLanguagePack() {
  const config = getLanguageConfig();
  
  // 如果已经缓存了当前语言包且语言代码未改变，则直接返回缓存
  if (currentLanguagePack && currentLanguageCode === config.currentLanguage) {
    return currentLanguagePack;
  }
  
  // 否则加载新的语言包并缓存
  currentLanguagePack = loadLanguagePack(config.currentLanguage);
  currentLanguageCode = config.currentLanguage;
  return currentLanguagePack;
}

/**
 * 获取翻译文本
 * @param {string} key 翻译键，使用点号分隔（如 'menu.title'）
 * @param {...any} args 替换参数
 * @returns {string} 翻译后的文本
 */
export function t(key, ...args) {
  const languagePack = getCurrentLanguagePack();
  
  // 通过点号分隔的键路径获取嵌套的对象值
  const keys = key.split('.');
  let value = languagePack;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 如果找不到对应的键，返回键本身作为后备
      return key;
    }
  }
  
  // 如果有参数，进行替换
  if (args.length > 0 && typeof value === 'string') {
    return value.replace(/{(\d+)}/g, (match, index) => {
      return args[index] !== undefined ? args[index] : match;
    });
  }
  
  return value;
}

/**
 * 获取支持的语言列表
 * @returns {Array} 支持的语言列表
 */
export function getSupportedLanguages() {
  const config = getLanguageConfig();
  return config.supportedLanguages || [];
}

/**
 * 获取当前语言代码
 * @returns {string} 当前语言代码
 */
export function getCurrentLanguageCode() {
  const config = getLanguageConfig();
  return config.currentLanguage;
}

/**
 * 添加新语言支持
 * @param {string} languageCode 语言代码
 * @param {string} languageName 语言名称
 * @returns {boolean} 是否添加成功
 */
export function addLanguage(languageCode, languageName) {
  try {
    const config = getLanguageConfig();
    
    // 检查语言是否已存在
    const exists = config.supportedLanguages.some(lang => lang.code === languageCode);
    if (exists) {
      console.warn(t('terminalLanguage.languageAlreadyExists', languageCode) || `Language ${languageCode} already exists`);
      return false;
    }
    
    // 添加新语言到配置
    config.supportedLanguages.push({ code: languageCode, name: languageName });
    
    // 更新配置文件
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    
    // 创建基于英文语言包的新语言包文件
    const englishPack = loadLanguagePack('en-US');
    const newLanguagePack = {
      ...englishPack,
      "language": languageName
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
 * 更新语言包内容
 * @param {string} languageCode 语言代码
 * @param {Object} translations 翻译内容
 * @returns {boolean} 是否更新成功
 */
export function updateLanguagePack(languageCode, translations) {
  try {
    const languageFile = path.join(LANGUAGES_DIR, `${languageCode}.json`);
    
    // 读取现有内容
    let existingContent = {};
    try {
      const content = fs.readFileSync(languageFile, 'utf8');
      existingContent = JSON.parse(content);
    } catch (error) {
      // 如果文件不存在或解析失败，使用空对象
      console.warn(t('terminalLanguage.languageFileNotFound', languageCode) || `Language file for ${languageCode} not found or invalid, creating new one.`);
    }
    
    // 合并新内容
    const updatedContent = { ...existingContent, ...translations };
    
    // 写入更新后的内容
    fs.writeFileSync(languageFile, JSON.stringify(updatedContent, null, 2), 'utf8');
    
    console.log(t('terminalLanguage.successfullyUpdatedPack', languageCode) || `Successfully updated language pack for: ${languageCode}`);
    return true;
  } catch (error) {
    console.error(t('terminalLanguage.failedToUpdatePack', languageCode) || `Failed to update language pack for ${languageCode}:`, error);
    return false;
  }
}