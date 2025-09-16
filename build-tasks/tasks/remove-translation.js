// 导入 Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../lib/colors.js';

// --- 辅助函数 ---

/**
 * 将域名转换为驼峰式命名。
 * @param {string} domain - 要转换的域名 (例如 "example.com.js")。
 * @returns {string} 驼峰式命名的字符串 (例如 "exampleCom")。
 */
function toCamelCase(domain) {
  // 移除 .js 后缀
  const domainWithoutExt = domain.replace(/\.js$/, '');
  return domainWithoutExt.replace(/\./g, ' ').replace(/(?:^|\s)\w/g, (match, index) => {
    return index === 0 ? match.toLowerCase().trim() : match.toUpperCase().trim();
  }).replace(/\s+/g, '');
}

// --- 主函数 ---

/**
 * 处理移除现有翻译文件的主要函数。
 */
async function handleRemoveTranslation() {
  console.log(color.bold(color.cyan('🔍 开始扫描可移除的翻译文件...')));

  const translationsDir = path.join(process.cwd(), 'src', 'translations');
  
  // 1. 读取所有翻译文件
  let files;
  try {
    files = fs.readdirSync(translationsDir).filter(file => file.endsWith('.js') && file !== 'index.js');
  } catch (error) {
    console.error(color.red('❌ 读取翻译文件目录时出错:'), error);
    return;
  }

  if (files.length === 0) {
    console.log(color.yellow('目前没有可供移除的翻译文件。'));
    return;
  }

  // 2. 使用 inquirer 让用户选择要移除的文件
  const { fileToRemove } = await inquirer.prompt([
    {
      type: 'list',
      name: 'fileToRemove',
      message: '请选择您想要移除的网站翻译文件:',
      choices: [
        ...files,
        new inquirer.Separator(),
        { name: '↩️ 返回上一级菜单', value: 'back' },
      ],
      prefix: '🗑️',
    },
  ]);

  if (fileToRemove === 'back') {
    console.log(color.dim('操作已取消。'));
    return;
  }

  // 3. 最终确认
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `您确定要移除与 ${color.yellow(fileToRemove)} 相关的所有文件和配置吗？此操作无法撤销。`,
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(color.yellow('操作已取消。'));
    return;
  }

  // 4. 执行删除操作
  const domain = fileToRemove.replace(/\.js$/, '');
  const variableName = toCamelCase(fileToRemove);
  const filePath = path.join(translationsDir, fileToRemove);
  const indexJsPath = path.join(translationsDir, 'index.js');
  const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');

  try {
    // a. 删除 .js 文件
    fs.unlinkSync(filePath);
    console.log(color.green(`✅ 已删除文件: ${fileToRemove}`));

    // b. 更新 index.js (使用行操作)
    let indexJsLines = fs.readFileSync(indexJsPath, 'utf-8').split('\n');
    indexJsLines = indexJsLines.filter(line => !line.includes(`from './${fileToRemove}';`));
    indexJsLines = indexJsLines.filter(line => !line.includes(`"${domain}": ${variableName}`));
    fs.writeFileSync(indexJsPath, indexJsLines.join('\n'));
    console.log(color.green(`✅ 已更新: index.js`));

    // c. 更新 header.txt (使用行操作)
    let headerTxtLines = fs.readFileSync(headerTxtPath, 'utf-8').split('\n');
    headerTxtLines = headerTxtLines.filter(line => !line.includes(`*://${domain}/*`));
    fs.writeFileSync(headerTxtPath, headerTxtLines.join('\n'));
    console.log(color.green(`✅ 已更新: header.txt`));

    console.log(color.bold(color.lightGreen('\n🎉 所有相关内容均已成功移除！')));

  } catch (error) {
    console.error(color.red(`❌ 在移除过程中发生错误: ${error.message}`));
    console.error(color.yellow('请注意：项目文件可能处于不一致状态。建议使用 git status 检查更改，并手动恢复未完成的修改。'));
  }
}

export default handleRemoveTranslation;
