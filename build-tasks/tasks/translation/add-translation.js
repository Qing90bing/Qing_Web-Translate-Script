// 导入 Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../../lib/colors.js';

/**
 * @file build-tasks/tasks/translation/add-translation.js
 * @description
 * 此任务负责引导用户添加一个新的网站翻译配置文件。
 * 这是一个具有事务性的复杂操作，包含多个步骤：
 * 1. 提示用户输入域名，并进行有效性验证（格式、是否已存在）。
 * 2. 根据域名生成一个包含标准模板的新翻译文件（`.js`）。
 * 3. 自动更新 `src/translations/index.js`，以导入并注册新的翻译模块。
 * 4. 自动更新 `src/header.txt`，为油猴脚本添加新的 `@match` 指令。
 * 5. **具备回滚能力**: 如果在更新 `index.js` 或 `header.txt` 的过程中发生任何错误，
 *    脚本会自动撤销所有已做的更改（删除新创建的文件，恢复被修改文件的原始内容），
 *    以确保项目状态的一致性。
 */

/**
 * @function toCamelCase
 * @description 将域名字符串（如 "example.com"）转换为驼峰式命名（如 "exampleCom"），
 * 以便用作有效的 JavaScript 变量名。
 * @param {string} domain - 要转换的域名。
 * @returns {string} 转换后的驼峰式命名的字符串。
 */
function toCamelCase(domain) {
  return domain.replace(/\./g, ' ').replace(/(?:^|\s)\w/g, (match, index) => {
    return index === 0 ? match.toLowerCase().trim() : match.toUpperCase().trim();
  }).replace(/\s+/g, '');
}

/**
 * @function handleAddNewTranslation
 * @description 处理添加新翻译文件的主要函数。
 * @returns {Promise<void>}
 */
async function handleAddNewTranslation() {
  console.log(color.bold(color.cyan('✨ 开始添加新的网站翻译文件...')));
  
  // --- 步骤 1: 提示用户输入并验证域名 ---
  const { domain } = await inquirer.prompt([
    {
      type: 'input',
      name: 'domain',
      message: '请输入新的网站域名 (例如: example.com):',
      prefix: '🌐',
      validate: (input) => {
        const trimmedInput = input.trim();
        if (!trimmedInput) {
          return '域名不能为空，请输入一个有效的域名。';
        }

        const fileName = `${trimmedInput}.js`;
        const filePath = path.join(process.cwd(), 'src', 'translations', fileName);

        if (fs.existsSync(filePath)) {
          return `错误：文件 ${color.yellow(fileName)} 已存在，请选择其他域名。`;
        }
        
        // 简单的域名格式校验
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(trimmedInput)) {
          return '请输入一个有效的域名格式 (例如: example.com, sub.example.co.uk)。';
        }

        return true;
      },
    },
  ]);

  const trimmedDomain = domain.trim();
  const fileName = `${trimmedDomain}.js`;
  const variableName = toCamelCase(trimmedDomain);

  console.log(`\n准备创建以下文件和变量:`);
  console.log(`  - ${color.yellow('文 件 名')}: ${fileName}`);
  console.log(`  - ${color.yellow('变 量 名')}: ${variableName}`);
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '是否继续？',
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(color.yellow('操作已取消。'));
    return;
  }

  // --- 步骤 2: 创建新的翻译文件 ---
  const filePath = path.join(process.cwd(), 'src', 'translations', fileName);
  // 定义新翻译文件的模板字符串，包含基本的结构和注释，方便用户直接填写。
  const template = `// 翻译目标网站: ${trimmedDomain}

export const ${variableName} = {
  // 样式 (CSS)
  // 在这里添加网站所需的自定义样式
  styles: [],

  // 正则表达式翻译规则
  // 规则会自动应用于匹配的文本
  // 格式: [/原始文本正则表达式/i, '翻译后的文本']
  // 使用 $1, $2, ... 来引用正则表达式中的捕获组
  // 示例: [/^您好 (\\w+)/, 'Hello $1']
  regexRules: [
    // 在这里添加正则表达式规则
  ],

  // 纯文本翻译规则
  // 规则会完全匹配整个文本
  // 格式: ['原始文本', '翻译后的文本']
  // 示例: ['登录', 'Login']
  textRules: [
    // 在这里添加纯文本规则
  ],
};
`;

  try {
    fs.writeFileSync(filePath, template);
    console.log(color.green(`✅ 成功创建翻译文件: ${color.yellow(filePath)}`));
  } catch (error) {
    console.error(color.red(`❌ 创建文件时出错: ${error.message}`));
    return;
  }
  
  // --- 步骤 3: 更新 index.js 和 header.txt (事务性操作) ---
  const indexJsPath = path.join(process.cwd(), 'src', 'translations', 'index.js');
  const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');
  let originalIndexJsContent, originalHeaderTxtContent;

  try {
    // 在修改前，先读取并保存原始文件内容，以便在发生错误时能够回滚。
    originalIndexJsContent = fs.readFileSync(indexJsPath, 'utf-8');
    originalHeaderTxtContent = fs.readFileSync(headerTxtPath, 'utf-8');
    
    // --- 3a. 更新 index.js ---
    let indexJsContent = originalIndexJsContent;
    // 构造新的 import 语句。
    const importStatement = `import { ${variableName} } from './${fileName}';\n`;
    // 找到最后一个 'import' 语句的位置，在其后插入新的 import，以保持代码整洁。
    const lastImportIndex = indexJsContent.lastIndexOf('import');
    const nextLineIndexAfterLastImport = indexJsContent.indexOf('\n', lastImportIndex);
    indexJsContent = 
      indexJsContent.slice(0, nextLineIndexAfterLastImport + 1) + 
      importStatement + 
      indexJsContent.slice(nextLineIndexAfterLastImport + 1);

    // 找到 `masterTranslationMap` 对象的结束括号 `}`，在其前插入新的翻译条目。
    const lastBraceIndex = indexJsContent.lastIndexOf('}');
    if (lastBraceIndex === -1) {
        throw new Error('在 index.js 中找不到 masterTranslationMap 的结束括号 "}"');
    }
    // 这是一个小技巧，用于判断是否需要在新条目前加一个换行符，以维持代码格式。
    const precedingChar = indexJsContent.substring(lastBraceIndex - 1, lastBraceIndex).trim();
    const needsNewline = precedingChar === ',';
    const mapEntry = `${needsNewline ? '\n' : ''}  "${trimmedDomain}": ${variableName},\n`;
    
    indexJsContent = 
        indexJsContent.slice(0, lastBraceIndex) +
        mapEntry +
        indexJsContent.slice(lastBraceIndex);

    fs.writeFileSync(indexJsPath, indexJsContent);
    console.log(color.green(`✅ 成功更新索引文件: ${color.yellow(indexJsPath)}`));

    // --- 3b. 更新 header.txt ---
    let headerTxtContent = originalHeaderTxtContent;
    // 构造新的 @match 指令。
    const matchDirective = `// @match        *://${trimmedDomain}/*\n`;
    // 找到最后一个 '// @match' 指令，在其后插入新指令，以保持指令的分组。
    const lastMatchIndex = headerTxtContent.lastIndexOf('// @match');
    const nextLineIndexAfterLastMatch = headerTxtContent.indexOf('\n', lastMatchIndex);
    headerTxtContent = 
      headerTxtContent.slice(0, nextLineIndexAfterLastMatch + 1) +
      matchDirective +
      headerTxtContent.slice(nextLineIndexAfterLastMatch + 1);
      
    fs.writeFileSync(headerTxtPath, headerTxtContent);
    console.log(color.green(`✅ 成功更新头部文件: ${color.yellow(headerTxtPath)}`));

  } catch (error) {
    console.error(color.red(`❌ 更新文件时出错: ${error.message}`));
    
    // --- 自动回滚 ---
    // 这是关键的容错机制。如果在 try 块中的任何文件操作失败，
    // catch 块会立即执行，将所有被修改的文件恢复到其原始状态，并删除新创建的文件。
    console.log(color.yellow('正在尝试回滚所有更改...'));
    if (originalIndexJsContent) {
      fs.writeFileSync(indexJsPath, originalIndexJsContent);
      console.log(color.yellow(`  -> 已恢复: ${indexJsPath}`));
    }
    if (originalHeaderTxtContent) {
      fs.writeFileSync(headerTxtPath, originalHeaderTxtContent);
      console.log(color.yellow(`  -> 已恢复: ${headerTxtPath}`));
    }
    // 使用 unlinkSync 确保即使在错误处理中也能可靠地删除文件。
    fs.unlinkSync(filePath); 
    console.log(color.yellow(`  -> 已删除: ${fileName}`));
    return;
  }
}

export default handleAddNewTranslation;
