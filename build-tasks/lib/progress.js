/**
 * @file build-tasks/lib/progress.js
 * @description
 * 一个高度可复用、配置灵活的终端进度条类。
 * 旨在为 CLI 工具提供美观、实时的进度反馈，支持自定义格式和样式。
 */

import readline from 'readline';
import { color } from './colors.js';
import { BUILD_UI_CONFIG } from '../config/ui.js';

export class ProgressBar {
    /**
     * 创建一个新的进度条实例。
     * @param {object} options - 配置选项
     * @param {number} [options.total=100] - 总任务数
     * @param {number} [options.width=30] - 进度条（条部分）的字符宽度
     * @param {string} [options.completeChar='█'] - 完成部分的字符
     * @param {string} [options.incompleteChar='░'] - 未完成部分的字符
     * @param {string} [options.format='{bar} {percentage}% | {value}/{total} | {text}'] - 显示格式
     *    支持的占位符:
     *    - {bar}: 进度条图形
     *    - {percentage}: 百分比 (0-100)
     *    - {value}: 当前值
     *    - {total}: 总值
     *    - {text}: 动态文本说明
     */
    constructor(options = {}) {
        this.total = options.total || 100;
        this.width = options.width || BUILD_UI_CONFIG.progressBar.width;
        this.completeChar = options.completeChar || '█';
        this.incompleteChar = options.incompleteChar || '░';
        this.format = options.format || '{bar} ' + color.green('{percentage}%') + ' | {value}/{total} | {text}';

        this.current = 0;
        this.startTime = 0;
        this.lastDrawTime = 0;
        this.isRendering = false;
    }

    /**
     * 启动进度条。
     * @param {number} total - 重置总任务数（可选）
     * @param {string} initialText - 初始显示的文本
     */
    start(total, initialText = '') {
        if (total) this.total = total;
        this.current = 0;
        this.startTime = Date.now();
        this.isRendering = true;

        // 隐藏光标，提升视觉体验
        process.stdout.write('\x1B[?25l');
        this.render(initialText);
    }

    /**
     * 更新进度条状态。
     * @param {number} current - 当前进度值
     * @param {string} text - 要显示的文本信息
     */
    update(current, text = '') {
        this.current = current;
        this.render(text);
    }

    /**
     * 增加进度值。
     * @param {number} amount - 增加的量
     * @param {string} text - 要显示的文本信息
     */
    increment(amount = 1, text = '') {
        this.update(this.current + amount, text);
    }

    /**
     * 停止进度条并恢复光标。
     * @param {boolean} clear - 是否在停止后清除进度条行
     */
    stop(clear = false) {
        if (!this.isRendering) return;

        // 如果需要清除，先清除当前行
        if (clear) {
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0);
        } else {
            // 否则换行，保留最后状态
            process.stdout.write('\n');
        }

        // 恢复光标
        process.stdout.write('\x1B[?25h');
        this.isRendering = false;
    }

    /**
     * 获取字符串的可视长度（去除 ANSI 颜色代码）
     * @param {string} str 
     * @returns {number}
     */
    getVisibleLength(str) {
        // 简单的 ANSI 转义序列匹配正则
        return str.replace(/\x1B\[\d+m/g, '').length;
    }

    /**
     * 内部渲染方法。
     * @param {string} text 
     */
    render(text) {
        if (!this.isRendering) return;

        // 防止过于频繁的渲染导致性能问题 (限制为 ~60fps)
        const now = Date.now();
        if (now - this.lastDrawTime < BUILD_UI_CONFIG.progressBar.renderThrottle && this.current < this.total) return;
        this.lastDrawTime = now;

        const ratio = Math.min(Math.max(this.current / this.total, 0), 1);
        const percent = Math.floor(ratio * 100);
        const columns = process.stdout.columns || 80;

        // 计算进度条图形
        const completeLength = Math.round(this.width * ratio);
        const incompleteLength = this.width - completeLength;
        const bar = color.green(this.completeChar.repeat(completeLength)) +
            color.dim(this.incompleteChar.repeat(incompleteLength));

        // 1. 构建不包含 text 的基础输出，计算其长度
        // 临时用空字符串代替 text 来计算基础长度
        let baseOutput = this.format
            .replace('{bar}', bar)
            .replace('{percentage}', percent)
            .replace('{value}', this.current)
            .replace('{total}', this.total)
            .replace('{text}', '');

        const baseLength = this.getVisibleLength(baseOutput);

        // 2. 计算留给 text 的剩余空间 (预留 1 个字符缓冲)
        const availableSpace = Math.max(0, columns - baseLength - 1);

        // 3. 如果 text 过长，进行截断
        let displayText = text;
        if (this.getVisibleLength(text) > availableSpace) {
            // 简单的截断，如果 text 有颜色可能会截断颜色代码导致显示错乱，
            // 简单起见，假设 text 主要是不带颜色的文件名，或者只在末尾有颜色。
            // 更严谨的做法是需要解析 ANSI。这里做简单处理:
            // 如果长度不够，只保留前 N 个字符 + "..."
            if (availableSpace > 3) {
                displayText = text.substring(0, availableSpace - 3) + '...';
            } else {
                displayText = ''; // 空间太小，不显示文本
            }
        }

        // 4. 生成最终输出
        let output = this.format
            .replace('{bar}', bar)
            .replace('{percentage}', percent)
            .replace('{value}', this.current)
            .replace('{total}', this.total)
            .replace('{text}', displayText);

        // 清除当前行并重写 (兼容性更好的做法)
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(output);
    }

    /**
     * 静态工厂方法，创建一个标准样式的任务进度条。
     * 旨在统一所有任务的视觉风格。
     * @param {object} options - 额外的配置选项 (可选)
     * @returns {ProgressBar}
     */
    static createTaskProgressBar(options = {}) {
        return new ProgressBar({
            // 统一使用绿色百分比和 30 宽度的条
            format: options.format || '{bar} ' + color.green('{percentage}%') + ' | {value}/{total} | {text}',
            width: options.width || BUILD_UI_CONFIG.progressBar.width,
            ...options
        });
    }

    /**
     * 完成进度条流程的快捷方法。
     * 将进度更新为总数（100%），显示完成文本，并停止进度条（保留在屏幕上）。
     * @param {string} text - 完成时显示的文本
     */
    finish(text) {
        this.update(this.total, text);
        this.stop();
    }
}
