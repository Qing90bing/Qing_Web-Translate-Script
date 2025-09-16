// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../lib/colors.js';
import handleAddNewTranslation from './add-translation.js';
import handleRemoveTranslation from './remove-translation.js';

/**
 * 显示并处理“管理网站翻译文件”的子菜单。
 */
async function handleManageTranslations() {
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
          new inquirer.Separator(),
          { name: '↩️ 返回主菜单', value: 'back' },
        ],
      },
    ]);

    switch (action) {
      case 'add':
        await handleAddNewTranslation();
        // 在子任务后暂停，等待用户按键继续
        console.log('\n');
        await inquirer.prompt({ type: 'input', name: 'key', message: color.cyan('✅ 操作完成。按回车键返回...'), });
        break;
      case 'remove':
        await handleRemoveTranslation();
        console.log('\n');
        await inquirer.prompt({ type: 'input', name: 'key', message: color.cyan('✅ 操作完成。按回车键返回...'), });
        break;
      case 'back':
        return; // 返回到 build.js 的主循环
    }
  }
}

export default handleManageTranslations;
