/**
 * @file build-tasks/lib/utils.js
 * @description
 * 提供一系列通用的辅助函数，用于支持构建任务中的各种常见操作。
 * 这些函数通常是独立的、可重用的，不与特定的业务逻辑（如验证或修复）紧密耦合。
 *
 * @module utils
 */

// 导入第三方库 `inquirer`，用于创建交互式的命令行界面。
import inquirer from 'inquirer';
// 从本地模块导入颜色和国际化工具
import { color } from './colors.js';
import { t } from './terminal-i18n.js';
import fs from 'fs';
import fsp from 'fs/promises';

/**
 * @function normalizeEolToSource
 * @description 将新内容的换行符统一为源文件的换行符（CRLF 或 LF），避免同一文件内出现混合换行。
 * 混合换行会导致 Git 在 `git status` 中显示文件已修改，但 `git diff` 却没有内容差异（“幽灵修改”）。
 * @param {string} newContent - 将要写入的新内容。
 * @param {string} sourceContent - 从磁盘读出的原始内容，用于检测换行符风格。
 * @returns {string} 换行符已统一的新内容。
 */
export function normalizeEolToSource(newContent, sourceContent) {
  if (sourceContent.includes('\r\n')) {
    // 源文件是 CRLF：仅转换独立的 LF（未被 CR 前缀的 \n），保留已有的 CRLF。
    return newContent.replace(/(?<!\r)\n/g, '\r\n');
  }
  // 源文件是 LF：将所有 CRLF 统一为 LF。
  return newContent.replace(/\r\n/g, '\n');
}

/**
 * @function writeFilePreservingEol
 * @description 异步写入文件：先统一换行符，若内容与原文一致（忽略换行符差异后）则不写入。
 * @param {string} filePath - 文件路径。
 * @param {string} sourceContent - 从磁盘读出的原始内容。
 * @param {string} newContent - 将要写入的新内容。
 * @returns {Promise<boolean>} 实际写入返回 true，内容无变化返回 false。
 */
export async function writeFilePreservingEol(filePath, sourceContent, newContent) {
  const finalContent = normalizeEolToSource(newContent, sourceContent);
  if (finalContent === sourceContent) {
    return false;
  }
  await fsp.writeFile(filePath, finalContent, 'utf-8');
  return true;
}

/**
 * @function writeFilePreservingEolSync
 * @description 同步写入文件：先统一换行符，若内容与原文一致（忽略换行符差异后）则不写入。
 * @param {string} filePath - 文件路径。
 * @param {string} sourceContent - 从磁盘读出的原始内容。
 * @param {string} newContent - 将要写入的新内容。
 * @returns {boolean} 实际写入返回 true，内容无变化返回 false。
 */
export function writeFilePreservingEolSync(filePath, sourceContent, newContent) {
  const finalContent = normalizeEolToSource(newContent, sourceContent);
  if (finalContent === sourceContent) {
    return false;
  }
  fs.writeFileSync(filePath, finalContent, 'utf-8');
  return true;
}

/**
 * @function pressAnyKeyToContinue
 * @description 暂停脚本执行，并提示用户按任意键（实际上是回车键）继续。
 *
 * 这个函数主要用于在命令行工具的某个操作（如显示错误报告）执行完毕后，
 * 给用户一个查看输出信息的机会，而不是让程序立即继续执行或返回主菜单。
 * 它通过显示一个输入提示并等待用户按下回车键来实现流程的暂停。
 *
 * @returns {Promise<void>} 当用户按下回车键后，Promise 将会 resolve。
 */
export async function pressAnyKeyToContinue() {
  // 打印一个空行，用于在视觉上将此提示与前面的输出内容隔开，使界面更清晰。
  console.log('\n');
  // 使用 inquirer 创建一个 "input" 类型的提示。
  // 虽然是 "input"，但我们不关心用户的具体输入内容，仅用其来暂停执行。
  await inquirer.prompt({
    type: 'input', // 提示类型
    name: 'key',   // 结果的键名（在这里该值被忽略）
    message: color.cyan(t('messages.operationComplete') || 'Press any key to continue...'), // 显示给用户的消息，使用 t 函数进行国际化。
  });
}
