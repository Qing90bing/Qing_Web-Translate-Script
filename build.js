/**
 * @file build.js
 * @description
 * “网页翻译”油猴脚本项目的构建与校验工具。
 *
 * 这个脚本是项目的总入口和控制器，它通过一个交互式的命令行菜单，
 * 允许用户调用位于 `build-tasks` 目录下的各种构建和检查脚本。
 * 它的主要目的是简化开发流程，整合所有必要的工具，如问题检查、自动修复和最终打包。
 *
 * ---
 * 如何使用:
 * 1. 确保你已经安装了 Node.js 和 npm。
 * 2. 在终端里进入这个项目所在的文件夹。
 * 3. 运行 `npm install` 来安装项目依赖 (例如 inquirer)。
 * 4. 运行 `node build.js` 来启动此工具。
 * ---
 */

// 导入第三方库 `inquirer`，用于创建交互式的命令行界面。
import inquirer from 'inquirer';

// --- 导入本地模块 ---
// 从 `lib` 目录导入颜色和通用工具函数。
import { color } from './build-tasks/lib/colors.js';
import { pressAnyKeyToContinue } from './build-tasks/lib/utils.js';
// 从 `tasks` 目录导入各个具体的检查和构建任务。
import handleCommaCheck from './build-tasks/tasks/check/check-comma.js';
import handleDuplicatesCheck from './build-tasks/tasks/check/check-duplicates.js';
import handleEmptyCheck from './build-tasks/tasks/check/check-empty.js';
import handleIdenticalCheck from './build-tasks/tasks/check/check-identical.js';
import handleFullBuild from './build-tasks/tasks/build-project.js';
import handleManageTranslations from './build-tasks/tasks/translation/manage-translations.js';
import handleSortTranslations from './build-tasks/tasks/translation/sort-translations.js';

/**
 * 主函数，负责显示主菜单并根据用户输入执行相应操作。
 * @description
 * 这是一个无限循环，每次循环都会：
 * 1. 清空控制台，以保持界面整洁。
 * 2. 显示一个包含所有可用操作的列表菜单。
 * 3. 等待用户选择一个操作。
 * 4. 使用 `switch` 语句调用与用户选择相对应的处理函数。
 * 5. 在大多数操作执行完毕后，会暂停并等待用户按键，然后返回主菜单。
 */
async function main() {
  // 使用 `while (true)` 创建一个永久循环，直到用户选择退出，脚本才会终止。
  while (true) {
    // 清空控制台，提供一个干净的用户界面。
    console.clear();
    const title = color.bold(color.cyan('🛠️ 构建工具 & 翻译文件校验工具 🛠️'));
    const separator = color.dim('==============================================');
    console.log(separator);
    console.log(title);
    console.log(separator);
    
    // 使用 inquirer 显示一个列表选择器，让用户选择要执行的操作。
    const { action } = await inquirer.prompt([
      {
        type: 'list', // 菜单类型为列表
        name: 'action', // 用户选择的结果将存储在名为 `action` 的属性中
        message: `请选择要执行的操作：\n${color.dim('(推荐流程: 1 -> 2/3/4 -> 5)')}\n`,
        prefix: '✨', // 在问题前的缀饰符
        choices: [
          new inquirer.Separator(color.dim('--- 检查与修复 ---')), // 分隔线
          { name: `1. ${color.yellow('🔧 检查“遗漏逗号”问题')}`, value: 'checkMissingComma' },
          { name: `2. ${color.yellow('🔧 检查“空翻译”问题')}`, value: 'checkEmpty' },
          { name: `3. ${color.yellow('🔧 检查“重复的翻译”问题')}`, value: 'checkDuplicates' },
          { name: `4. ${color.yellow('🔧 检查“原文和译文相同”问题')}`, value: 'checkIdentical' },
          new inquirer.Separator(color.dim('--- 项目操作 ---')), // 分隔线
          { name: `5. ${color.lightGreen('🚀 完整构建项目 (不包含检查)')}`, value: 'fullBuild' },
          { name: `6. ${color.cyan('🗂️ 管理网站翻译文件')}`, value: 'manageTranslations' },
          { name: `7. ${color.magenta('✨ 整理与排序翻译文件')}`, value: 'sortTranslations' },
          new inquirer.Separator(),
          { name: `8. ${color.cyan('🚪 退出')}`, value: 'exit' },
        ],
      },
    ]);

    // 默认情况下，每次操作后都应暂停，等待用户确认
    let shouldPause = true;

    // 根据用户的选择，执行相应的操作
    switch (action) {
      case 'checkMissingComma':
        await handleCommaCheck(); // 调用处理逗号检查的函数
        break;
      case 'checkEmpty':
        await handleEmptyCheck(); // 调用处理空翻译检查的函数
        break;
      case 'checkDuplicates':
        await handleDuplicatesCheck(); // 调用处理重复的翻译检查的函数
        break;
      case 'checkIdentical':
        await handleIdenticalCheck(); // 调用处理原文译文相同检查的函数
        break;
      case 'fullBuild':
        await handleFullBuild(); // 调用完整构建项目的函数
        break;
      case 'manageTranslations':
        await handleManageTranslations(); // 调用管理子菜单
        // 子菜单自己处理暂停，所以这里不需要暂停
        shouldPause = false;
        break;
      case 'sortTranslations':
        await handleSortTranslations(); // 调用排序任务
        shouldPause = false; // 假设该任务也会自己处理暂停
        break;
      case 'exit':
        console.log(color.cyan('👋 再见！'));
        shouldPause = false; // 当用户选择退出时，不需要暂停
        return; // 通过 return 终止 main 函数的执行，从而退出脚本
    }

    // 如果需要暂停，则调用 pressAnyKeyToContinue 函数，等待用户按键
    if (shouldPause) {
      await pressAnyKeyToContinue();
    }
  }
}

// --- 脚本执行入口 ---
// 调用 main 函数，开始执行主菜单流程。
main();