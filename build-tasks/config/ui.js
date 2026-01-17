/**
 * @file build-tasks/config/ui.js
 * @description 构建工具 CLI 界面的配置参数。
 * 这些参数仅在运行 `npm run build` 等 Node.js 任务时生效。
 */

export const BUILD_UI_CONFIG = {
    /**
     * @property {object} progressBar
     * @description 终端进度条的视觉配置。
     */
    progressBar: {
        /** @property {number} width - 进度条（不含文字）的字符宽度 */
        width: 30,
        /** @property {number} renderThrottle - 渲染刷新间隔 (ms)，限制为 ~60fps 以防止终端闪烁 */
        renderThrottle: 16
    }
};
