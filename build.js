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
// 从 `lib` 目录导入通用工具函数。
import { pressAnyKeyToContinue } from './build-tasks/lib/utils.js';
// 从 `tasks` 目录导入各个具体的检查和构建任务。
import handleCommaCheck from './build-tasks/tasks/check-comma.js';
import handleDuplicatesCheck from './build-tasks/tasks/check-duplicates.js';
import handleEmptyCheck from './build-tasks/tasks/check-empty.js';
import handleIdenticalCheck from './build-tasks/tasks/check-identical.js';
import handleFullBuild from './build-tasks/tasks/build-project.js';

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
    console.log('=======================================');
    console.log('    构建工具 & 翻译文件校验工具');
    console.log('=======================================');
    
    // 使用 inquirer 显示一个列表选择器，让用户选择要执行的操作。
    const { action } = await inquirer.prompt([
      {
        type: 'list', // 菜单类型为列表
        name: 'action', // 用户选择的结果将存储在名为 `action` 的属性中
        message: ' 请选择要执行的操作：(推荐流程: 先检查"遗漏逗号"问题,再修复其他问题,最后再完整构建项目,才是最稳定的)\n',
        prefix: '⚙️', // 在问题前的缀饰符
        choices: [
          new inquirer.Separator('--- 检查与修复 ---'), // 分隔线，用于组织菜单选项
          // 菜单选项1: 检查翻译文件中的 JSON 对象是否缺少逗号
          { name: '1. 🔧 检查“遗漏逗号”问题', value: 'checkMissingComma' },
          // 菜单选项2: 检查是否存在空的翻译条目
          { name: '2. 🔧 检查“空翻译”问题', value: 'checkEmpty' },
          // 菜单选项3: 检查是否存在重复的原文 key
          { name: '3. 🔧 检查“重复原文”问题', value: 'checkDuplicates' },
          // 菜单选项4: 检查是否存在原文和译文完全相同的情况
          { name: '4. 🔧 检查“原文和译文相同”问题', value: 'checkIdentical' },
          new inquirer.Separator('--- 项目操作 ---'), // 分隔线
          // 菜单选项5: 执行完整的构建流程，生成最终的油猴脚本
          { name: '5. 👟 完整构建项目（不包含检查）', value: 'fullBuild' },
          // 菜单选项6: 退出脚本
          { name: '6. 🚪 退出', value: 'exit' },
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
        await handleDuplicatesCheck(); // 调用处理重复原文检查的函数
        break;
      case 'checkIdentical':
        await handleIdenticalCheck(); // 调用处理原文译文相同检查的函数
        break;
      case 'fullBuild':
        await handleFullBuild(); // 调用完整构建项目的函数
        break;
      case 'exit':
        console.log('👋 再见！');
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