// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../../lib/colors.js';
import handleAddNewTranslation from './add-translation.js';
import handleRemoveTranslation from './remove-translation.js';
import updateTranslationFiles from './update-translation-files.js';

/**
 * @file build-tasks/tasks/translation/manage-translations.js
 * @description
 * 此任务提供一个交互式的子菜单，专门用于管理网站的翻译文件。
 * 用户可以从中选择添加新的翻译文件或移除现有的翻译文件。
 *
 * **核心工作流程**:
 * 1. 进入一个无限循环 `while (true)` 来持续显示菜单，直到用户选择返回。
 * 2. 每次循环都清空控制台，并显示“添加”和“移除”翻译文件的选项。
 * 3. 根据用户的选择，调用相应的处理函数（`handleAddNewTranslation` 或 `handleRemoveTranslation`）。
 * 4. 在子任务执行完毕后，会暂停并等待用户按键确认，然后再次显示菜单。
 * 5. 如果用户选择“返回主菜单”，函数会通过 `return` 退出循环，从而回到 `build.js` 的主菜单。
 */


/**
 * @function handleManageTranslations
 * @description 显示并处理“管理网站翻译文件”的子菜单。
 * @returns {Promise<void>}
 */
async function handleManageTranslations() {
  // 进入一个无限循环，以保持子菜单的持续显示，直到用户选择退出。
  while (true) {
    console.clear();
    const title = color.bold(color.cyan('🗂️ 管理网站翻译文件'));
    const separator = color.dim('=================================');
    console.log(separator);
    console.log(title);
    console.log(separator);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '请选择要执行的操作:',
        prefix: '✨',
        choices: [
          { name: '➕ 添加新的网站翻译文件', value: 'add' },
          { name: '➖ 移除现有的网站翻译文件', value: 'remove' },
          { name: '🔄 更新现有翻译文件属性', value: 'update' },
          new inquirer.Separator(),
          { name: '↩️ 返回主菜单', value: 'back' },
        ],
      },
    ]);

    // 根据用户的选择，执行相应的操作。
    switch (action) {
      case 'add':
        // 调用添加新翻译文件的任务。
        await handleAddNewTranslation();
        // 在子任务后暂停，等待用户按键继续，以改善用户体验。
        console.log('\n');
        await inquirer.prompt({ type: 'input', name: 'key', message: color.cyan('✅ 操作完成。按回车键返回...'), });
        break;
      case 'remove':
        // 调用移除现有翻译文件的任务。
        await handleRemoveTranslation();
        console.log('\n');
        await inquirer.prompt({ type: 'input', name: 'key', message: color.cyan('✅ 操作完成。按回车键返回...'), });
        break;
      case 'update':
        // 调用更新现有翻译文件的任务。
        await updateTranslationFiles();
        console.log('\n');
        await inquirer.prompt({ type: 'input', name: 'key', message: color.cyan('✅ 操作完成。按回车键返回...'), });
        break;
      case 'back':
        // 如果用户选择返回，则通过 return 语句退出无限循环，从而回到 build.js 的主菜单。
        return;
    }
  }
}

export default handleManageTranslations;