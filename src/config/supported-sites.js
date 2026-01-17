/**
 * @file src/config/supported-sites.js
 * @description
 * 支持翻译的网站列表，按语言区分。
 * 此文件由构建脚本自动生成，请勿手动编辑。
 *
 * 用于 CDN 版本的 @require 预加载，使脚本能快速判断当前网站是否有翻译，
 * 避免对无翻译网站发起不必要的网络请求。
 */

// eslint-disable-next-line no-unused-vars
var SUPPORTED_SITES = {
    'zh-cn': [
        'aistudio.google.com',
        'claude.ai',
        'claude.com',
        'gemini.google.com',
        'github.com',
        'huggingface.co',
        'jules.google.com',
        'lmarena.ai',
        'modrinth.com',
        'opal.google',
        'platform.claude.com',
        'sso.curseforge.com',
        'status.claude.com',
        'status.huggingface.co',
        'status.modrinth.com',
        'wplace.live',
        'www.avogado6.com',
        'www.curseforge.com',
    ],
    'zh-tw': [
        'aistudio.google.com',
        'claude.ai',
    ],
};
