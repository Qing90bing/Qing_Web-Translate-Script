// 导入 Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../lib/colors.js';

/**
 * 将域名转换为驼峰式命名。
 * @param {string} domain - 要转换的域名 (例如 "example.com")。
 * @returns {string} 驼峰式命名的字符串 (例如 "exampleCom")。
 */
function toCamelCase(domain) {
  return domain.replace(/\./g, ' ').replace(/(?:^|\s)\w/g, (match, index) => {
    return index === 0 ? match.toLowerCase().trim() : match.toUpperCase().trim();
  }).replace(/\s+/g, '');
}

/**
 * 处理添加新翻译文件的主要函数。
 */
async function handleAddNewTranslation() {
  console.log(color.bold(color.cyan('✨ 开始添加新的网站翻译文件...')));
  
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

  // --- 1. 创建新的翻译文件 ---
  const filePath = path.join(process.cwd(), 'src', 'translations', fileName);
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
  
  // --- 2. 更新 index.js 和 header.txt ---
  const indexJsPath = path.join(process.cwd(), 'src', 'translations', 'index.js');
  const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');
  let originalIndexJsContent, originalHeaderTxtContent;

  try {
    // 读取原始文件内容以备回滚
    originalIndexJsContent = fs.readFileSync(indexJsPath, 'utf-8');
    originalHeaderTxtContent = fs.readFileSync(headerTxtPath, 'utf-8');
    
    // --- 更新 index.js ---
    let indexJsContent = originalIndexJsContent;
    // 插入 import 语句
    const importStatement = `import { ${variableName} } from './${fileName}';\n`;
    const lastImportIndex = indexJsContent.lastIndexOf('import');
    const nextLineIndexAfterLastImport = indexJsContent.indexOf('\n', lastImportIndex);
    indexJsContent = 
      indexJsContent.slice(0, nextLineIndexAfterLastImport + 1) + 
      importStatement + 
      indexJsContent.slice(nextLineIndexAfterLastImport + 1);

    // 插入 masterTranslationMap 条目
    const lastBraceIndex = indexJsContent.lastIndexOf('}');
    if (lastBraceIndex === -1) {
        throw new Error('在 index.js 中找不到 masterTranslationMap 的结束括号 "}"');
    }
    // 检查右花括号前是否有换行符，如果没有则添加，以确保格式正确
    const precedingChar = indexJsContent.substring(lastBraceIndex - 1, lastBraceIndex).trim();
    const needsNewline = precedingChar === ',';
    const mapEntry = `${needsNewline ? '\n' : ''}  "${trimmedDomain}": ${variableName},\n`;
    
    indexJsContent = 
        indexJsContent.slice(0, lastBraceIndex) +
        mapEntry +
        indexJsContent.slice(lastBraceIndex);

    fs.writeFileSync(indexJsPath, indexJsContent);
    console.log(color.green(`✅ 成功更新索引文件: ${color.yellow(indexJsPath)}`));

    // --- 更新 header.txt ---
    let headerTxtContent = originalHeaderTxtContent;
    const matchDirective = `// @match        *://${trimmedDomain}/*\n`;
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
    
    // --- 回滚所有更改 ---
    console.log(color.yellow('正在尝试回滚所有更改...'));
    if (originalIndexJsContent) {
      fs.writeFileSync(indexJsPath, originalIndexJsContent);
      console.log(color.yellow(`  -> 已恢复: ${indexJsPath}`));
    }
    if (originalHeaderTxtContent) {
      fs.writeFileSync(headerTxtPath, originalHeaderTxtContent);
      console.log(color.yellow(`  -> 已恢复: ${headerTxtPath}`));
    }
    fs.unlinkSync(filePath); 
    console.log(color.yellow(`  -> 已删除: ${fileName}`));
    return;
  }
}

export default handleAddNewTranslation;
