// 导入 Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../../lib/colors.js';

/**
 * @file build-tasks/tasks/translation/remove-translation.js
 * @description
 * 此任务负责引导用户移除一个现有的网站翻译配置文件。
 * 这是一个破坏性操作，涉及多个步骤：
 * 1. 扫描 `src/translations` 目录，列出所有可移除的翻译文件。
 * 2. 提示用户选择要移除的文件。
 * 3. 要求用户进行最终确认，以防误操作。
 * 4. 删除对应的 `.js` 翻译文件。
 * 5. 从 `src/translations/index.js` 中移除相关的 `import` 语句和 `masterTranslationMap` 条目。
 * 6. 从 `src/header.txt` 中移除相关的 `// @match` 指令。
 *
 * **重要**: 与“添加”任务不同，此任务**不具备**自动回滚功能。如果在操作中途失败，
 * 项目文件可能处于不一致状态，需要开发者手动修复。
 */

// --- 辅助函数 ---

/**
 * @function toCamelCase
 * @description 将文件名（如 "example.com.js"）转换为驼峰式命名（如 "exampleCom"）。
 * @param {string} domain - 要转换的文件名。
 * @returns {string} 转换后的驼峰式命名的字符串。
 */
function toCamelCase(domain) {
  // 移除 .js 后缀
  const domainWithoutExt = domain.replace(/\.js$/, '');
  return domainWithoutExt.replace(/\./g, ' ').replace(/(?:^|\s)\w/g, (match, index) => {
    return index === 0 ? match.toLowerCase().trim() : match.toUpperCase().trim();
  }).replace(/\s+/g, '');
}

/**
 * @function aggressiveCleanup
 * @description 对文件内容进行积极的清理，主要用于移除因删除行而产生的多余空行。
 * @param {string} content - 要清理的原始文件内容。
 * @returns {string} 清理后的文件内容。
 */
function aggressiveCleanup(content) {
    // 将2个或更多的连续换行符（及其中间的空白）替换为单个换行符
    let cleanedContent = content.replace(/(?:(?:\r\n|\n)\s*){2,}/g, '\n');
    // 移除文件开头和结尾的空白
    cleanedContent = cleanedContent.trim();
    // 如果文件不为空，确保末尾有一个换行符
    if (cleanedContent) {
        return cleanedContent + '\n';
    }
    return '';
}


// --- 主函数 ---

/**
 * @function handleRemoveTranslation
 * @description 处理移除现有翻译文件的主要函数。
 * @returns {Promise<void>}
 */
async function handleRemoveTranslation() {
  console.log(color.bold(color.cyan('🔍 开始扫描可移除的翻译文件...')));

  const translationsDir = path.join(process.cwd(), 'src', 'translations');
  
  // --- 步骤 1: 扫描并列出所有可移除的翻译文件 ---
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

  // --- 步骤 2: 提示用户选择要移除的文件 ---
  const { fileToRemove } = await inquirer.prompt([
    {
      type: 'list',
      name: 'fileToRemove',
      message: ' 请选择您想要移除的网站翻译文件:',
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

  // --- 步骤 3: 要求用户最终确认 ---
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

  // --- 步骤 4: 执行删除和文件更新操作 ---
  const domain = fileToRemove.replace(/\.js$/, '');
  const variableName = toCamelCase(fileToRemove);
  const filePath = path.join(translationsDir, fileToRemove);
  const indexJsPath = path.join(translationsDir, 'index.js');
  const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');

  try {
    // 4a. 删除翻译文件本身
    fs.unlinkSync(filePath);
    console.log(color.green(`✅ 已删除文件: ${fileToRemove}`));

    // 4b. 更新 index.js
    let indexJsContent = fs.readFileSync(indexJsPath, 'utf-8');
    // 构建更精确的正则表达式，以匹配并移除整行（包括换行符），从而避免留下空行。
    // 使用 'm' (multiline) 标志，使 '^' 匹配行的开头。
    const importRegex = new RegExp(`^import\\s+\\{\\s*${variableName}\\s*\\}\\s+from\\s+'\\./${fileToRemove}';?\\s*\\r?\\n`, 'm');
    indexJsContent = indexJsContent.replace(importRegex, '');

    const mapEntryRegex = new RegExp(`^\\s*"${domain}":\\s*${variableName},?\\s*\\r?\\n`, 'm');
    indexJsContent = indexJsContent.replace(mapEntryRegex, '');

    fs.writeFileSync(indexJsPath, indexJsContent);
    console.log(color.green(`✅ 已更新: index.js`));

    // 4c. 更新 header.txt
    let headerTxtContent = fs.readFileSync(headerTxtPath, 'utf-8');
    const matchRegex = new RegExp(`^// @match\\s+\\*://${domain}/\\*\\s*\\r?\\n`, 'm');
    headerTxtContent = headerTxtContent.replace(matchRegex, '');

    fs.writeFileSync(headerTxtPath, headerTxtContent);
    console.log(color.green(`✅ 已更新: header.txt`));

    console.log(color.bold(color.lightGreen('\n🎉 所有相关内容均已成功移除！')));

  } catch (error) {
    console.error(color.red(`❌ 在移除过程中发生错误: ${error.message}`));
    console.error(color.yellow('请注意：项目文件可能处于不一致状态。建议使用 git status 检查更改，并手动恢复未完成的修改。'));
  }
}

export default handleRemoveTranslation;
