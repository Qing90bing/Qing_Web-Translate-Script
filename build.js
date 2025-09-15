/**
 * @file build.js
 * @description
 * “网页翻译”油猴脚本项目的构建与校验工具。
 *
 * 这个脚本作为一个总控制器，提供一个命令行菜单，用于调用位于 `build-tasks` 目录下的各个独立功能模块。
 * 
 * ---
 * 如何使用:
 * 1. 确保你已经安装了 Node.js 和 npm。
 * 2. 在终端里进入这个项目所在的文件夹。
 * 3. 运行 `npm install` 来安装依赖。
 * 4. 运行 `node build.js` 来执行此脚本。
 * ---
 */

import inquirer from 'inquirer';
import { pressAnyKeyToContinue } from './build-tasks/utils.js';
import handleCommaCheck from './build-tasks/check-comma.js';
import handleDuplicatesCheck from './build-tasks/check-duplicates.js';
import handleEmptyCheck from './build-tasks/check-empty.js';
import handleIdenticalCheck from './build-tasks/check-identical.js';
import handleFullBuild from './build-tasks/build-project.js';

/**
 * 显示主菜单并处理用户输入。
 */
async function main() {
  while (true) {
    console.clear();
    console.log('=======================================');
    console.log('    构建工具 & 翻译文件校验工具');
    console.log('=======================================');
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: ' 请选择要执行的操作：(推荐流程: 先检查并修复所有问题，最后再完整构建项目)\n',
        prefix: '⚙️',
        choices: [
          new inquirer.Separator('--- 检查与修复 ---'),
          { name: '1. 🔧 检查“遗漏逗号”问题', value: 'checkMissingComma' },
          { name: '2. 🔧 检查“空翻译”问题', value: 'checkEmpty' },
          { name: '3. 🔧 检查“重复原文”问题', value: 'checkDuplicates' },
          { name: '4. 🔧 检查“原文和译文相同”问题', value: 'checkIdentical' },
          new inquirer.Separator('--- 项目操作 ---'),
          { name: '5. 👟 完整构建项目（不包含检查）', value: 'fullBuild' },
          { name: '6. 🚪 退出', value: 'exit' },
        ],
      },
    ]);

    let shouldPause = true;

    switch (action) {
      case 'checkMissingComma':
        await handleCommaCheck();
        break;
      case 'checkEmpty':
        await handleEmptyCheck();
        break;
      case 'checkDuplicates':
        await handleDuplicatesCheck();
        break;
      case 'checkIdentical':
        await handleIdenticalCheck();
        break;
      case 'fullBuild':
        await handleFullBuild();
        break;
      case 'exit':
        console.log('👋 再见！');
        shouldPause = false;
        return; // Exit the main function and the script
    }

    if (shouldPause) {
      await pressAnyKeyToContinue();
    }
  }
}

// 执行主菜单流程
main();