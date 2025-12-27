// 导入简体中文翻译模块
import { zhCnTranslations } from './zh-cn/index.js';
// 导入繁体中文翻译模块
import { zhTwTranslations } from './zh-tw/index.js';

// 导出主翻译映射
export const masterTranslationMap = {
  // 简体中文
  ...zhCnTranslations,
  // 繁体中文
  ...zhTwTranslations,
};