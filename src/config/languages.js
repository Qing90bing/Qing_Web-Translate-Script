// 语言配置文件
// 集中管理网站支持的语言
// 在 languages.js 的 SUPPORTED_LANGUAGES 中添加语言，在src/translations目录下创建语言文件夹，通过终端工具添加翻译文件，就完成了添加新语言的过程
export const SUPPORTED_LANGUAGES = [
  { code: 'zh-cn', name: '简体中文-大陆', flag: '🇨🇳' },
  { code: 'zh-hk', name: '繁體中文-香港', flag: '🇭🇰' },
  { code: 'zh-tw', name: '繁體中文-台湾', flag: '🇹🇼' },
];

// 获取语言代码列表
export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(lang => lang.code);

// 获取语言名称
export function getLanguageName(code) {
  const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  return language ? language.name : code;
}

// 添加新语言的函数
export function addLanguage(code, name, flag) {
  // 检查语言是否已存在
  if (SUPPORTED_LANGUAGE_CODES.includes(code)) {
    console.warn(`Language ${code} already exists`);
    return false;
  }
  
  // 添加新语言
  SUPPORTED_LANGUAGES.push({ code, name, flag });
  return true;
}