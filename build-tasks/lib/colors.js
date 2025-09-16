/**
 * @file build-tasks/lib/colors.js
 * @description
 * 这个文件提供了一套用于在终端中为文本添加颜色的工具函数。
 * 它封装了标准的 ANSI 转义码，使得在项目的其他地方可以方便地、
 * 以可读性高的方式使用颜色，而无需直接处理原始的转义码字符串。
 *
 * @example
 * import { color } from './colors.js';
 * console.log(`Status: ${color.green('Success')}`);
 * console.log(`Warning: ${color.yellow('File not found')}`);
 */

// 定义 ANSI 颜色和样式代码，用于在终端输出中控制文本格式。
const styles = {
  reset: '\x1b[0m', // 重置所有样式
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  // 基础颜色
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  // 高亮（明亮）颜色
  lightRed: '\x1b[91m',
  lightGreen: '\x1b[92m',
  lightYellow: '\x1b[93m',
  lightCyan: '\x1b[96m',
};

/**
 * 创建一个颜色函数生成器。
 * @param {string} code - ANSI 转义码。
 * @returns {(text: string) => string} - 一个接收文本并返回带颜色编码的字符串的函数。
 */
const createColorFunc = (code) => (text) => `${code}${text}${styles.reset}`;

/**
 * @namespace color
 * @description
 * 一个包含所有可用颜色和样式函数的对象。
 * 每个函数接收一个字符串，并返回一个包裹了相应 ANSI 颜色代码的新字符串。
 */
export const color = {
  red: createColorFunc(styles.red),
  green: createColorFunc(styles.green),
  yellow: createColorFunc(styles.yellow),
  blue: createColorFunc(styles.blue),
  magenta: createColorFunc(styles.magenta),
  cyan: createColorFunc(styles.cyan),
  white: createColorFunc(styles.white),
  lightRed: createColorFunc(styles.lightRed),
  lightGreen: createColorFunc(styles.lightGreen),
  lightYellow: createColorFunc(styles.lightYellow),
  lightCyan: createColorFunc(styles.lightCyan),
  // 样式
  bold: createColorFunc(styles.bold),
  dim: createColorFunc(styles.dim),
  italic: createColorFunc(styles.italic),
  underline: createColorFunc(styles.underline),
};
