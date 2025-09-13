import inquirer from 'inquirer';
import path from 'path';

/**
 * @typedef {import('./validator.js').ValidationError} ValidationError
 * @description 从校验器模块导入错误对象的类型定义，以实现类型提示。
 */

/**
 * @typedef {Object} ManualFixDecision
 * @description 定义一个手动修复决策对象的结构。
 * @property {string} file - 发生错误的文件的路径。
 * @property {string} originalText - 重复的原文文本。
 * @property {number | 'skip'} lineToKeep - 用户选择保留的行号，或者'skip'表示跳过。
 * @property {Array<object>} allOccurrences - 该重复原文的所有出现位置的完整信息。
 */


/**
 * 当发现校验错误时，提示用户决定下一步操作。
 * @param {ValidationError[]} errors - 从校验器返回的错误对象数组。
 * @returns {Promise<'auto-fix' | 'manual-fix' | 'ignore' | 'cancel'>} 返回用户选择的操作标识符。
 */
export async function promptUserAboutErrors(errors) {
  const fixableErrorCount = errors.filter(e => e.type === 'multi-duplicate').length;

  const choices = [];
  if (fixableErrorCount > 0) {
    choices.push(
      {
        name: `✨ (自动) 保留第一个，快速修复 ${fixableErrorCount} 组重复条目`,
        value: 'auto-fix',
      },
      {
        name: `🔧 (手动) 逐个处理 ${fixableErrorCount} 组重复条目`,
        value: 'manual-fix',
      }
    );
  }
  choices.push(
    { name: '⚠️  (忽略) 忽略所有错误并继续构建', value: 'ignore' },
    { name: '❌ (取消) 取消构建', value: 'cancel' }
  );

  console.log('\n----------------------------------------');
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `构建前发现 ${errors.length} 个问题，您想怎么做？`,
      choices: choices,
    },
  ]);

  return action;
}


/**
 * 交互式地提示用户手动修复每一组重复项。
 * @param {ValidationError[]} duplicateErrors - `multi-duplicate`类型的错误对象数组。
 * @returns {Promise<ManualFixDecision[] | null>} 返回一个包含用户所有决策的数组；如果用户中途退出，则返回null。
 */
export async function promptForManualFix(duplicateErrors) {
  const decisions = [];
  let userExited = false;

  for (let i = 0; i < duplicateErrors.length; i++) {
    const error = duplicateErrors[i];
    const originalText = error.message.match(/"(.*?)"/)[1] || '未知原文';
    
    // 为每个重复项创建一个选项
    const choices = error.occurrences.map(occ => ({
      name: `✅ (保留) 第 ${occ.line} 行 -> ${occ.lineContent}`,
      value: occ.line,
    }));

    // 添加分隔符和额外操作选项
    choices.push(new inquirer.Separator());
    choices.push({ name: '➡️  (跳过) 暂时不处理此问题', value: 'skip' });
    choices.push({ name: '🛑 (退出) 放弃所有手动修复并退出', value: 'exit' });

    const { userChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'userChoice',
        message: `--[ 正在处理重复问题 ${i + 1} / ${duplicateErrors.length} ]--\n原文 "${originalText}" 被多次定义。请选择您想保留的版本：`,
        choices: choices,
      },
    ]);

    if (userChoice === 'exit') {
      // 如果用户选择退出，进行二次确认
      const { confirmExit } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmExit',
          message: '您确定要退出吗？所有在此次手动修复中所做的选择都将丢失。',
          prefix: '⚠️',
          default: false,
        }
      ]);
      if (confirmExit) {
        userExited = true;
        break; // 退出主循环
      } else {
        i--; // 如果用户取消退出，则停留在当前问题上重新提问
        continue;
      }
    }

    // 记录用户的决定
    decisions.push({
      file: error.file,
      originalText: originalText,
      lineToKeep: userChoice, // 可能是行号，也可能是 'skip'
      allOccurrences: error.occurrences,
    });
  }

  if (userExited) {
    return null; // 返回null以告知主流程用户已取消操作
  }

  return decisions;
}
