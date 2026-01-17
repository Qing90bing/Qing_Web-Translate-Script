/**
 * @file src/config/optimization.js
 * @description 性能优化与体验微调参数。
 * 此文件集中管理所有涉及时间、缓存和性能阈值的“魔法数字”。
 * 调整这些参数可以在“翻译速度”和“页面流畅度”之间寻找平衡。
 */

export const PERFORMANCE_CONFIG = {
    /**
     * @property {number} FRAME_BUDGET
     * @description
     * 每帧留给翻译任务的最大执行时间（毫秒）。
     * 目标是保持 60fps (16.6ms/帧)。预留约 4ms 给浏览器渲染，剩余 12ms 用于脚本执行。
     * - **影响**:
     *   - ⬆️ 调大: 翻译速度加快，但可能导致页面滚动卡顿 (丢帧)。
     *   - ⬇️ 调小: 页面极其流畅，但大页面完全翻译需要更长时间。
     * @default 12
     */
    FRAME_BUDGET: 12,

    /**
     * @property {number} PAGE_LOAD_DELAY
     * @description
     * SPA (单页应用) 路由跳转后的等待延迟（毫秒）。
     * 在检测到 URL 变化后，脚本会等待这段时间再开始扫描新内容。
     * - **影响**:
     *   - ⬆️ 调大: 确保动态内容加载完毕后再翻译，减少漏翻。
     *   - ⬇️ 调小: 页面切换后更快看到中文，但可能遗漏尚未渲染的组件。
     * @default 300
     */
    PAGE_LOAD_DELAY: 300,

    /**
     * @property {number} MAX_CACHE_SIZE
     * @description
     * 翻译结果缓存的最大条目数。
     * 5000 条通常对应约 1-2MB 的内存占用。
     * - **影响**:
     *   - ⬆️ 调大: 减少重复翻译，提升长久运行的性能，但增加内存占用。
     *   - ⬇️ 调小: 节省内存，但可能导致频繁出现的词句被反复重新处理。
     * @default 5000
     */
    MAX_CACHE_SIZE: 5000,

    /**
     * @property {number} RETRY_DELAY
     * @description
     * 网络请求失败后的重试基础延迟（毫秒）。
     * 主要用于 CDN 模式下的资源加载。
     * - **影响**:
     *   - ⬆️ 调大: 减轻服务器压力，避免短时间频繁请求。
     *   - ⬇️ 调小: 网络恢复后能更快加载到词库，但可能加剧网络拥堵。
     * @default 500
     */
    RETRY_DELAY: 500,

    /**
     * @property {number} FADE_IN_DURATION
     * @description
     * 页面翻译完成后的淡入动画时长（毫秒）。
     * 配合 anti-flicker.js 使用。
     * - **影响**:
     *   - ⬆️ 调大: 过渡更柔和，但用户感到“显示慢”。
     *   - ⬇️ 调小: 响应更迅速，但可能感觉突兀。
     * @default 100
     */
    FADE_IN_DURATION: 100,

    /**
     * @property {number} HOVER_CHECK_DELAY
     * @description
     * 鼠标悬停 (Mouseover) 事件触发后的检测延迟（毫秒）。
     * 用于确保 :hover 样式（如 content 属性）已生效。
     * - **影响**:
     *   - ⬆️ 调大: 减少误触发，性能更好。
     *   - ⬇️ 调小: 伪元素翻译响应更快，但可能在样式未应用前就尝试翻译（无效）。
     * @default 50
     */
    HOVER_CHECK_DELAY: 50,

    /**
     * @property {number} PSEUDO_ANIM_DURATION
     * @description
     * 用于检测伪元素插入的 CSS 动画时长（秒）。
     * 这是一个 Hack 技巧。
     * - **影响**:
     *   - ⬆️ 调大: 理论上无影响，但必须极短以确保不被肉眼察觉。
     *   - ⬇️ 调小: 必须大于 0，否则 `animationstart` 不会触发。
     * @default 0.001
     */
    PSEUDO_ANIM_DURATION: 0.001,

    /**
     * @property {number} PERF_LOG_THRESHOLD
     * @description
     * 性能日志记录的阈值（毫秒）。
     * - **影响**:
     *   - ⬆️ 调大: 仅记录严重耗时的操作，控制台更干净。
     *   - ⬇️ 调小: 记录更多性能细节，但会产生大量日志噪音。
     * @default 5
     */
    PERF_LOG_THRESHOLD: 5
};
