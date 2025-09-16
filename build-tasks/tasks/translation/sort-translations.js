// 导入 Node.js 内置模块
import fs from 'fs/promises';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../../lib/colors.js';
import { pressAnyKeyToContinue } from '../../lib/utils.js';

function visualLength(str) {
  let len = 0;
  for (const ch of str) {
    if (/[\u4e00-\u9fff]/.test(ch)) { len += 2; } else { len += 1; }
  }
  return len;
}

function sortTextRules(arr) {
  if (!Array.isArray(arr)) { return []; }
  const sortedArr = [...arr];
  sortedArr.sort((a, b) => {
    const aLen = visualLength(a[0]) + visualLength(a[1]);
    const bLen = visualLength(b[0]) + visualLength(b[1]);
    if (bLen !== aLen) return bLen - aLen;
    const enDiff = a[0].localeCompare(b[0]);
    if (enDiff !== 0) return enDiff;
    return a[1].localeCompare(b[1]);
  });
  return sortedArr;
}

function sortRegexRules(arr) {
  if (!Array.isArray(arr)) { return []; }
  const sortedArr = [...arr];
  sortedArr.sort((a, b) => {
    const aRegexStr = a[0].toString();
    const bRegexStr = b[0].toString();
    const aLen = visualLength(aRegexStr) + visualLength(a[1]);
    const bLen = visualLength(bRegexStr) + visualLength(b[1]);
    if (bLen !== aLen) { return bLen - aLen; }
    return aRegexStr.localeCompare(bRegexStr);
  });
  return sortedArr;
}

function formatArrayAsString(arr, keyType) {
  if (arr.length === 0) { return '[]'; }
  const items = arr.map(item => {
    if (!Array.isArray(item) || item.length !== 2) { return '    // 格式不正确的条目'; }
    const value = item[1]
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    let key;
    if (keyType === 'regexRules' && item[0] instanceof RegExp) {
      key = item[0].toString();
    } else {
      key = `"${item[0].replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }
    return `    [${key}, "${value}"]`;
  });
  return `[\n${items.join(',\n')}\n  ]`;
}

async function runSort(filePath, keyToSort) {
  console.log(color.cyan(`\n正在处理 ${color.yellow(keyToSort)}...`));
  try {
    const originalContent = await fs.readFile(filePath, 'utf-8');
    const searchString = `${keyToSort}: [`;
    const startIndex = originalContent.indexOf(searchString);
    if (startIndex === -1) { 
      // Not an error, the key just might not exist in this file.
      console.log(color.dim(`  - 在 ${path.basename(filePath)} 中未找到键 ${keyToSort}，已跳过。`));
      return true; 
    }
    const arrayStartIndex = startIndex + searchString.length - 1;

    let balance = 0;
    let endIndex = -1;
    for (let i = arrayStartIndex; i < originalContent.length; i++) {
      if (originalContent[i] === '[') balance++;
      else if (originalContent[i] === ']') balance--;
      if (balance === 0) {
        endIndex = i;
        break;
      }
    }
    if (endIndex === -1) { throw new Error('无法为数组找到匹配的闭括号。'); }

    const arrayString = originalContent.substring(arrayStartIndex, endIndex + 1);
    const originalArray = new Function(`return ${arrayString}`)();
    
    let sortedArray;
    if (keyToSort === 'textRules') {
      sortedArray = sortTextRules(originalArray);
    } else if (keyToSort === 'regexRules') {
      sortedArray = sortRegexRules(originalArray);
    } else {
      throw new Error(`未知的排序键类型: ${keyToSort}`);
    }

    const sortedArrayString = formatArrayAsString(sortedArray, keyToSort);
    const contentBefore = originalContent.substring(0, arrayStartIndex);
    const contentAfter = originalContent.substring(endIndex + 1);
    const updatedContent = contentBefore + sortedArrayString + contentAfter;
    
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    console.log(color.green(`  - ${color.yellow(keyToSort)} 排序成功！`));
    return true;
  } catch (error) {
    console.error(color.red(`\n❌ 处理 ${color.yellow(keyToSort)} 时发生错误: ${error.message}`));
    return false;
  }
}

async function handleSortTranslations() {
  const translationsDir = path.join(process.cwd(), 'src', 'translations');

  while (true) {
    console.clear();
    const title = color.bold(color.cyan('🗂️ 整理与排序翻译文件'));
    console.log(color.dim('================================='));
    console.log(title);
    console.log(color.dim('================================='));

    let files;
    try {
      files = (await fs.readdir(translationsDir)).filter(file => file.endsWith('.js') && file !== 'index.js');
    } catch (error) {
      console.error(color.red('❌ 读取翻译文件目录时出错:'), error);
      await pressAnyKeyToContinue();
      return;
    }
    if (files.length === 0) {
      console.log(color.yellow('目前没有可供排序的翻译文件。'));
      await pressAnyKeyToContinue();
      return;
    }

    const { fileToSort } = await inquirer.prompt([
      {
        type: 'list',
        name: 'fileToSort',
        message: '请选择您想要排序的网站翻译文件:',
        choices: [
          new inquirer.Separator('--- 全局操作 ---'),
          { name: '🌐 [全局] 整理所有文件的 regexRules', value: 'all_regex' },
          { name: '🌐 [全局] 整理所有文件的 textRules', value: 'all_text' },
          { name: '🌐 [全局] 整理所有文件的 全部规则', value: 'all_all' },
          new inquirer.Separator('--- 单个文件 ---'),
          ...files, 
          new inquirer.Separator(), 
          { name: '↩️ 返回主菜单', value: 'back' }
        ],
        prefix: '📂',
      },
    ]);
    if (fileToSort === 'back') { return; }

    if (fileToSort.startsWith('all_')) {
      console.log(color.bold(`\n即将执行全局排序任务...`));
      for (const file of files) {
        const filePath = path.join(translationsDir, file);
        console.log(color.cyan(`\n--- 正在处理文件: ${file} ---`));
        if (fileToSort === 'all_regex' || fileToSort === 'all_all') {
          await runSort(filePath, 'regexRules');
        }
        if (fileToSort === 'all_text' || fileToSort === 'all_all') {
          await runSort(filePath, 'textRules');
        }
      }
      console.log(color.green(color.bold('\n🎉 全局排序任务执行完毕！')));
    } else {
      const { keyToSort } = await inquirer.prompt([
        {
            type: 'list',
            name: 'keyToSort',
            message: `在 ${color.yellow(fileToSort)} 中，您想要对哪个键进行排序？`,
            choices: [
                { name: '正则表达式翻译规则 (regexRules)', value: 'regexRules' },
                { name: '纯文本翻译规则 (textRules)', value: 'textRules' },
                new inquirer.Separator(),
                { name: '✨ 全部执行 (先正则，后纯文本)', value: 'all' },
                new inquirer.Separator(),
                { name: '↩️ 返回上一步', value: 'back' },
            ],
            prefix: '🔑',
        }
      ]);

      if (keyToSort === 'back') {
        continue;
      }

      const filePath = path.join(translationsDir, fileToSort);
      
      if (keyToSort === 'all') {
        console.log(color.bold(`\n将对 ${color.yellow(fileToSort)} 进行全面排序...`));
        const successRegex = await runSort(filePath, 'regexRules');
        if (successRegex) {
          await runSort(filePath, 'textRules');
        }
      } else {
        await runSort(filePath, keyToSort);
      }
    }
    
    await pressAnyKeyToContinue();
  }
}

export default handleSortTranslations;
