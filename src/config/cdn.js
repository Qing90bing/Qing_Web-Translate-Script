/**
 * @file src/config/cdn.js
 * @description
 * CDN 加载相关配置，集中管理所有网络请求参数和 CDN 源信息。
 * 将配置与逻辑代码分离，便于调试和维护。
 */

// ============================================================================
// 网络请求配置
// ============================================================================

/**
 * @const {number} CDN_TIMEOUT_MS
 * @description 单次 HTTP 请求的超时时间（毫秒）。
 * 超过此时间后请求将被中止，并尝试下一个 CDN 源或重试。
 */
export const CDN_TIMEOUT_MS = 5000;

/**
 * @const {number} CDN_MAX_RETRIES
 * @description 每个 CDN URL 的最大重试次数。
 * 当网络请求失败时（超时、网络错误等），会在同一 URL 上重试指定次数后再切换到备用源。
 */
export const CDN_MAX_RETRIES = 2;

/**
 * @const {number} CDN_RETRY_DELAY_MS
 * @description 重试前的等待时间（毫秒）。
 * 给予网络短暂的恢复时间，避免立即重试时再次失败。
 */
export const CDN_RETRY_DELAY_MS = 500;

/**
 * @const {number} CDN_CACHE_DURATION_MS
 * @description 缓存刷新周期（毫秒），默认 1 小时。
 * 用于生成 URL 缓存破坏参数，确保用户在合理时间内获取到最新翻译。
 */
export const CDN_CACHE_DURATION_MS = 1000 * 60 * 60;

// ============================================================================
// 仓库信息配置
// ============================================================================

/**
 * @const {string} REPO_USER
 * @description GitHub 用户名
 */
export const REPO_USER = 'qing90bing';

/**
 * @const {string} REPO_NAME
 * @description GitHub 仓库名
 */
export const REPO_NAME = 'qing_web-translate-script';

/**
 * @const {string} REPO_BRANCH
 * @description 默认分支名
 */
export const REPO_BRANCH = 'main';

// ============================================================================
// CDN 源 URL 生成
// ============================================================================

/**
 * @function getCdnUrls
 * @description 生成 CDN URL 列表，按优先级排序。
 * 主源使用 jsDelivr（全球 CDN 加速，响应更快），备用源使用 GitHub Raw。
 *
 * @param {string} userLang - 用户语言代码（如 'zh-cn', 'en-us'）
 * @param {string} hostname - 目标网站域名（如 'claude.ai'）
 * @returns {string[]} CDN URL 数组，按优先级从高到低排列
 */
export function getCdnUrls(userLang, hostname) {
    // 基于缓存周期生成缓存破坏参数，确保在刷新周期内使用缓存
    const cacheVersion = Math.floor(Date.now() / CDN_CACHE_DURATION_MS);
    const cacheBuster = `?v=${cacheVersion}`;
    const filePath = `src/translations/${userLang}/sites/${hostname}.js`;

    return [
        // 主源：jsDelivr - 全球 CDN 加速，响应速度快
        `https://cdn.jsdelivr.net/gh/${REPO_USER}/${REPO_NAME}@latest/${filePath}${cacheBuster}`,
        // 备用源：GitHub Raw - 直接从源获取，无 CDN 缓存延迟
        `https://raw.githubusercontent.com/${REPO_USER}/${REPO_NAME}/${REPO_BRANCH}/${filePath}${cacheBuster}`,
    ];
}
