/**
 * @file build-tasks/tasks/translation/manage-translations.js
 * @description
 * 此任务脚本提供一个交互式的子菜单，专门用于管理网站的翻译配置文件。
 * 它本身不执行复杂的文件操作，而是作为一个“路由器”或“调度器”，
 * 根据用户的选择调用其他更具体的任务脚本（如 `add-translation.js`）。
 *
 * **核心工作流程**:
 * 1. **无限循环**: 脚本进入一个 `while (true)` 循环，以持续显示菜单，直到用户明确选择返回。
 * 2. **显示菜单**: 在每次循环开始时，清空控制台并使用 `inquirer` 显示一个包含“添加”、“移除”和“返回”选项的列表。
 * 3. **调度任务**: 根据用户的选择，`await` 调用相应的处理函数（`handleAddNewTranslation` 或 `handleRemoveTranslation`）。
 * 4. **暂停与反馈**: 在子任务执行完毕后，脚本会暂停并提示用户按任意键继续。这为用户提供了查看子任务输出（如成功信息或错误报告）的时间，显著改善了用户体验。
 * 5. **退出循环**: 如果用户选择“返回主菜单”，函数会执行 `return` 语句，从而优雅地退出无限循环，并将控制权交还给调用它的主构建脚本（`build.js`）。
 */

// 导入第三方库 `inquirer` 用于创建交互式菜单。
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../../../lib/colors.js'; // 颜色工具
import { t } from '../../../lib/terminal-i18n.js'; // 国际化函数
import handleAddNewTranslation from './add-translation.js'; // 导入“添加翻译”任务处理器
import handleModifyTranslation from './modify-translation.js'; // 导入“修改翻译”任务处理器
import handleRemoveTranslation from './remove-translation.js'; // 导入“移除翻译”任务处理器

/**
 * @function handleManageTranslations
 * @description 显示并处理“管理网站翻译文件”的子菜单。
 * @returns {Promise<void>}
 */
async function handleManageTranslations() {
  // 使用一个无限循环来保持子菜单的持续显示，直到用户选择退出。
  // 这是实现持久化菜单界面的标准模式。
  while (true) {
    // 每次循环开始时清空控制台，以提供一个干净整洁的界面。
    console.clear();
    const title = color.bold(color.cyan(t('manageTranslationsMenu.title')));
    const separator = color.dim(t('manageTranslationsMenu.separator'));
    console.log(separator);
    console.log(title);
    console.log(separator);

    // 使用 inquirer 弹出交互式列表，并等待用户做出选择。
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: t('manageTranslationsMenu.promptMessage'),
        prefix: '✨',
        choices: [
          { name: t('manageTranslationsMenu.add'), value: 'add' },
          { name: t('manageTranslationsMenu.modify'), value: 'modify' },
          { name: t('manageTranslationsMenu.remove'), value: 'remove' },
          new inquirer.Separator('──────────────────────────────────────────────'),
          { name: t('manageTranslationsMenu.back'), value: 'back' },
        ],
        pageSize: 20, // 增加 pageSize 选项以显示更多行，避免滚动
      },
    ]);

    // 根据用户的选择，执行相应的操作。
    switch (action) {
      case 'add':
        // 调用“添加新翻译文件”的任务处理器。
        await handleAddNewTranslation();
        // **体验优化**: 在子任务完成后，暂停执行并等待用户按键。
        // 这可以防止子任务的输出被主菜单瞬间清空，让用户有时间阅读结果。
        console.log('\n');
        await inquirer.prompt({ type: 'input', name: 'key', message: color.cyan(t('manageTranslationsMenu.operationComplete')), });
        break;
      case 'modify':
        // 调用“修改网站网址”的任务处理器。
        await handleModifyTranslation();
        console.log('\n');
        await inquirer.prompt({ type: 'input', name: 'key', message: color.cyan(t('manageTranslationsMenu.operationComplete')), });
        break;
      case 'remove':
        // 调用“移除现有翻译文件”的任务处理器。
        await handleRemoveTranslation();
        // 同样，在任务后暂停以改善用户体验。
        console.log('\n');
        await inquirer.prompt({ type: 'input', name: 'key', message: color.cyan(t('manageTranslationsMenu.operationComplete')), });
        break;
      case 'back':
        // 如果用户选择返回，则通过 return 语句退出无限循环。
        // 这是从 `while(true)` 循环中干净退出的标准方式。
        return;
    }
  }
}

export default handleManageTranslations;