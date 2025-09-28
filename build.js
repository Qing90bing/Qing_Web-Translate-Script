/**
 * @file build.js
 * @description
 * “网页翻译”油猴脚本项目的构建与校验工具总入口。
 *
 * 这个脚本是项目的“指挥中心”，它通过一个交互式的命令行菜单，
 * 将 `build-tasks` 目录下的所有构建、检查和管理脚本整合在一起，
 * 为开发者提供了一个统一、易用的操作界面。
 *
 * ---
 * **如何使用**:
 * 1. 确保已安装 Node.js 和 npm。
 * 2. 在项目根目录下运行 `npm install` 来安装所有依赖项 (如 `inquirer`)。
 * 3. 运行 `node build.js` 来启动此交互式工具。
 * ---
 */

// 导入第三方库 `inquirer`，用于创建交互式的命令行界面。
import inquirer from 'inquirer';

// --- 导入本地模块 ---
// 从 `lib` 目录导入核心辅助工具。
import { color } from './build-tasks/lib/colors.js';
import { pressAnyKeyToContinue } from './build-tasks/lib/utils.js';
import { promptToPreserveFormatting } from './build-tasks/lib/prompting.js';
// 导入终端国际化模块，用于显示多语言菜单。
import { t, getSupportedLanguages, getCurrentLanguageCode } from './build-tasks/lib/terminal-i18n.js';
// 从 `tasks` 目录导入所有具体的任务处理器。
import handleTerminalLanguage from './build-tasks/tasks/terminal-language.js';
import handleCommaCheck from './build-tasks/tasks/check/check-comma.js';
import handleDuplicatesCheck from './build-tasks/tasks/check/check-duplicates.js';
import handleEmptyCheck from './build-tasks/tasks/check/check-empty.js';
import handleIdenticalCheck from './build-tasks/tasks/check/check-identical.js';
import handleSourceDuplicatesCheck from './build-tasks/tasks/check/check-source-duplicates.js';
import handleFullBuild from './build-tasks/tasks/build-project.js';
import handleCdnBuild from './build-tasks/tasks/build-cdn.js';
import handleManageTranslations from './build-tasks/tasks/translation/manage-translations.js';
import handleSortTranslations from './build-tasks/tasks/translation/sort-translations.js';


/**
 * @async
 * @function main
 * @description 主函数，负责显示主菜单并根据用户输入调度执行相应任务。
 *              这是一个无限循环，每次循环都会重新渲染菜单，直到用户选择退出。
 */
async function main() {
  // 使用 `while (true)` 创建一个持久化的菜单循环。
  while (true) {
    // 清空控制台，为每次菜单显示提供一个干净的界面。
    console.clear();
    const title = color.bold(color.cyan(t('menu.title')));
    const separator = color.dim(t('menu.separator'));
    console.log(separator);
    console.log(title);
    console.log(separator);
    
    // 获取当前终端语言信息，用于在菜单中动态显示。
    const currentLanguageCode = getCurrentLanguageCode();
    const supportedLanguages = getSupportedLanguages();
    const currentLanguage = supportedLanguages.find(lang => lang.code === currentLanguageCode);

    // 使用 inquirer 库创建一个交互式列表菜单。
    const { action } = await inquirer.prompt([
      {
        type: 'list', // 菜单类型为列表。
        name: 'action', // 用户选择的结果将存储在返回对象的 `action` 属性中。
        message: t('menu.promptMessage'), // 提示信息。
        prefix: '✨', // 在问题前的装饰性前缀。
        choices: [ // 定义菜单选项。
          new inquirer.Separator(color.dim(t('menu.checkAndFixSeparator'))),
          { name: `1. ${color.yellow(t('actions.checkMissingComma'))}`, value: 'checkMissingComma' },
          { name: `2. ${color.yellow(t('actions.checkEmpty'))}`, value: 'checkEmpty' },
          { name: `3. ${color.yellow(t('actions.checkDuplicates'))}`, value: 'checkDuplicates' },
          { name: `4. ${color.yellow(t('actions.checkIdentical'))}`, value: 'checkIdentical' },
          { name: `5. ${color.yellow(t('actions.checkSourceDuplicates'))}`, value: 'checkSourceDuplicates' },
          new inquirer.Separator(color.dim(t('menu.projectOperationSeparator'))),
          { name: `6. ${color.lightGreen(t('actions.fullBuild'))}`, value: 'fullBuild' },
          { name: `7. ${color.cyan(t('actions.manageTranslations'))}`, value: 'manageTranslations' },
          { name: `8. ${color.magenta(t('actions.sortTranslations'))}`, value: 'sortTranslations' },
          new inquirer.Separator(color.dim(t('menu.terminalToolsSeparator'))),
          { name: `🌐 ${t('menu.languageSetting')} ${currentLanguage ? `(${currentLanguage.name})` : `(${currentLanguageCode})`}`, value: 'terminalLanguage' },
          new inquirer.Separator(),
          { name: `9. ${color.cyan(t('menu.exit'))}`, value: 'exit' },
        ],
        pageSize: 20, // 增加列表显示行数，避免滚动。
      },
    ]);

    // 默认情况下，每次操作后都应暂停，等待用户确认，以方便查看任务输出。
    let shouldPause = true;

    // 使用 switch 语句将用户的选择分发到对应的任务处理器。
    switch (action) {
      case 'checkMissingComma': await handleCommaCheck(); break;
      case 'checkEmpty': await handleEmptyCheck(); break;
      case 'checkDuplicates': await handleDuplicatesCheck(); break;
      case 'checkIdentical': await handleIdenticalCheck(); break;
      case 'checkSourceDuplicates': await handleSourceDuplicatesCheck(); break;
      case 'fullBuild':
        {
          console.log(color.cyan(t('buildProject.startingBuild')));
          // 首先询问用户构建类型（标准、调试或 CDN）。
          const buildType = await promptToPreserveFormatting();

          if (buildType === null) { // 用户取消
            console.log(color.yellow(t('buildProject.buildCancelled')));
          } else if (buildType === 'cdn') { // CDN 构建
            await handleCdnBuild();
          } else { // 标准或调试构建
            const preserveFormatting = buildType === 'preserve';
            await handleFullBuild(preserveFormatting);
          }
        }
        break;
      case 'manageTranslations':
        await handleManageTranslations();
        // 子菜单（如管理翻译）通常有自己的循环和暂停逻辑，因此主循环在此处不应暂停。
        shouldPause = false;
        break;
      case 'sortTranslations':
        await handleSortTranslations();
        shouldPause = false; // 排序任务也有自己的暂停逻辑。
        break;
      case 'terminalLanguage':
        await handleTerminalLanguage();
        shouldPause = false; // 语言设置是独立的子菜单。
        break;
      case 'exit':
        console.log(color.cyan(t('messages.goodbye')));
        shouldPause = false; // 退出时无需暂停。
        return; // 通过 return 终止 main 函数的执行，从而结束 `while (true)` 循环并退出脚本。
    }

    // 如果当前任务需要暂停，则调用 `pressAnyKeyToContinue` 函数。
    if (shouldPause) {
      await pressAnyKeyToContinue();
    }
  }
}

// --- 脚本执行入口 ---
// 调用 main 函数，开始执行主菜单流程。
main();