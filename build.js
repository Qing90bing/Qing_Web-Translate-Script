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
// 导入终端国际化模块
import { t, getSupportedLanguages, getCurrentLanguageCode } from './build-tasks/lib/terminal-i18n.js';
// �导入新的语言管理任务
import handleTerminalLanguage from './build-tasks/tasks/terminal-language.js';
// 从 `tasks` 目录导入各个具体的检查和构建任务。
import handleCommaCheck from './build-tasks/tasks/check/check-comma.js';
import handleDuplicatesCheck from './build-tasks/tasks/check/check-duplicates.js';
import handleEmptyCheck from './build-tasks/tasks/check/check-empty.js';
import handleIdenticalCheck from './build-tasks/tasks/check/check-identical.js';
import handleSourceDuplicatesCheck from './build-tasks/tasks/check/check-source-duplicates.js';
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
    const title = color.bold(color.cyan(t('menu.title')));
    const separator = color.dim(t('menu.separator'));
    console.log(separator);
    console.log(title);
    console.log(separator);
    
    // 获取当前语言信息用于显示
    const currentLanguageCode = getCurrentLanguageCode();
    const supportedLanguages = getSupportedLanguages();
    const currentLanguage = supportedLanguages.find(lang => lang.code === currentLanguageCode);

    // 使用 inquirer 显示一个列表选择器，让用户选择要执行的操作。
    const { action } = await inquirer.prompt([
      {
        type: 'list', // 菜单类型为列表
        name: 'action', // 用户选择的结果将存储在名为 `action` 的属性中
        message: t('menu.promptMessage'),
        prefix: '✨', // 在问题前的缀饰符
        choices: [
          new inquirer.Separator(color.dim(t('menu.checkAndFixSeparator'))), // 分隔线
          { name: `1. ${color.yellow(t('actions.checkMissingComma'))}`, value: 'checkMissingComma' },
          { name: `2. ${color.yellow(t('actions.checkEmpty'))}`, value: 'checkEmpty' },
          { name: `3. ${color.yellow(t('actions.checkDuplicates'))}`, value: 'checkDuplicates' },
          { name: `4. ${color.yellow(t('actions.checkIdentical'))}`, value: 'checkIdentical' },
          { name: `5. ${color.yellow(t('actions.checkSourceDuplicates'))}`, value: 'checkSourceDuplicates' },
          new inquirer.Separator(color.dim(t('menu.projectOperationSeparator'))), // 分隔线
          { name: `6. ${color.lightGreen(t('actions.fullBuild'))}`, value: 'fullBuild' },
          { name: `7. ${color.cyan(t('actions.manageTranslations'))}`, value: 'manageTranslations' },
          { name: `8. ${color.magenta(t('actions.sortTranslations'))}`, value: 'sortTranslations' },
          new inquirer.Separator(color.dim(t('menu.terminalToolsSeparator'))), // 分隔线
          { name: `🌐 ${t('menu.languageSetting')} ${currentLanguage ? `(${currentLanguage.name})` : `(${currentLanguageCode})`}`, value: 'terminalLanguage' },
          new inquirer.Separator(),
          { name: `9. ${color.cyan(t('menu.exit'))}`, value: 'exit' },
        ],
        pageSize: 20, // 增加 pageSize 选项以显示更多行
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
      case 'checkSourceDuplicates':
        await handleSourceDuplicatesCheck(); // 调用处理原文重复检查的函数
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
      case 'terminalLanguage':
        await handleTerminalLanguage(); // 调用语言管理子菜单
        shouldPause = false; // 子菜单自己处理暂停
        break;
      case 'exit':
        console.log(color.cyan(t('messages.goodbye')));
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