import inquirer from 'inquirer';

/**
 * 暂停执行，等待用户按下任意键继续。
 */
export async function pressAnyKeyToContinue() {
  console.log('\n');
  await inquirer.prompt({
    type: 'input',
    name: 'key',
    message: '✅ 操作完成。按回车键返回主菜单...',
  });
}
