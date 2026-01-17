/**
 * @file build-tasks/config/embedded-sites.js
 * @description 定义在 CDN 构建模式下需要强制打包到脚本中的站点域名。
 * 这是一个纯构建时的配置，运行时脚本不需要知道这个列表（因为代码已经被打进去了）。
 */
export const embeddedSites = [
    'aistudio.google.com',
    'gemini.google.com'
];
