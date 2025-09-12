// 定义两种不可翻译的标签集合，以实现更精细的控制
// 1. 完全阻塞型：这些标签内部的任何内容（包括子孙的文本和属性）都不会被翻译
export const BLOCKS_ALL_TRANSLATION = new Set(['script', 'style', 'pre', 'code']);

// 2. 内容阻塞型：这些标签的文本内容不翻译，但placeholder等属性可以翻译
export const BLOCKS_CONTENT_ONLY = new Set(['textarea', 'input']);

// 合并两者，用于需要检查所有不可翻译文本内容的场景
export const ALL_UNTRANSLATABLE_TAGS = new Set([...BLOCKS_ALL_TRANSLATION, ...BLOCKS_CONTENT_ONLY]);

// 需要翻译的属性列表
export const attributesToTranslate = ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'];
