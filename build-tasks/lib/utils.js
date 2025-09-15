// 导入第三方库 `inquirer`，用于创建交互式的命令行界面。
import inquirer from 'inquirer';

/**
 * @function pressAnyKeyToContinue
 * @description 暂停脚本执行，并提示用户按任意键继续。
 *
 * 这个函数主要用于在命令行工具的每个操作执行完毕后，给用户一个喘息的机会，
 * 让他们可以查看操作结果，而不是让程序直接返回主菜单。
 * 它通过显示一个输入提示并等待用户按下回车键来实现暂停。
 */
export async function pressAnyKeyToContinue() {
  // 打印一个空行，为了格式美观
  console.log('\n');
  // 使用 inquirer 创建一个 "input" 类型的提示
  await inquirer.prompt({
    type: 'input', // 提示类型
    name: 'key',   // 结果的键名（虽然在这里我们不关心用户输入了什么）
    message: '✅ 操作完成。按回车键返回主菜单...', // 显示给用户的消息
  });
}
