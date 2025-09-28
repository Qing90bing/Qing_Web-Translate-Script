// 导入 Node.js 内置模块
import fs from 'fs/promises';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer';
import { parse } from 'acorn';

// 导入本地模块
import { color } from '../../lib/colors.js';
import { t } from '../../lib/terminal-i18n.js';
import { getLiteralValue } from '../../lib/validation.js';
import { pressAnyKeyToContinue } from '../../lib/utils.js';
import { SUPPORTED_LANGUAGE_CODES } from '../../../src/config/languages.js';


function visualLength(str) {
  let len = 0;
  for (const ch of str) {
    // 检查字符是否为中文字符
    if (/[\u4e00-\u9fff]/.test(ch)) { 
      len += 2; // 中文字符计为2个单位长度
    } else { 
      len += 1; // 其他字符计为1个单位长度
    }
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
    if (!Array.isArray(item) || item.length !== 2) { return t('sortTranslations.invalidFormat'); }
    const value = item[1]
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    let key;
    if (keyType === 'regexRules' && item[0] instanceof RegExp) {
      key = item[0].toString();
    } else {
      key = `"${item[0]
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')}"`;
    }
    return `    [${key}, "${value}"]`;
  });
  return `[\n${items.join(',\n')}\n  ]`;
}

/**
 * @function runSort (Refactored)
 * @description Uses an AST-based approach to safely sort translation rules.
 */
async function runSort(filePath, keyToSort) {
  console.log(color.cyan(t('sortTranslations.processingKey', color.yellow(keyToSort))));
  try {
    const originalContent = await fs.readFile(filePath, 'utf-8');
    let ast;

    // 1. Parse the file content into an AST
    try {
      ast = parse(originalContent, { ecmaVersion: 'latest', sourceType: 'module', ranges: true });
    } catch (e) {
      throw new Error(t('sortTranslations.fileParseError', e.message));
    }

    // 2. Find the translation object and the target array node
    let translationObjectNode = null;
    for (const node of ast.body) {
      if (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.declarations) {
        translationObjectNode = node.declaration.declarations[0]?.init;
        break;
      }
    }
    if (!translationObjectNode || translationObjectNode.type !== 'ObjectExpression') {
      throw new Error(t('sortTranslations.exportNotFound'));
    }

    const targetProperty = translationObjectNode.properties.find(p => p.key.name === keyToSort);
    if (!targetProperty) {
      console.log(color.dim(t('sortTranslations.keyNotFound', path.basename(filePath), keyToSort)));
      return true;
    }

    const arrayNode = targetProperty.value;
    if (arrayNode.type !== 'ArrayExpression') {
      throw new Error(t('sortTranslations.notArray', keyToSort));
    }

    // 3. Convert AST array elements to a standard JS array
    const originalArray = arrayNode.elements.map(element => {
        if (element.type !== 'ArrayExpression' || element.elements.length !== 2) {
            return null; // Invalid format
        }
        const keyNode = element.elements[0];
        const valueNode = element.elements[1];

        let key;
        if (keyNode.type === 'RegExpLiteral') {
            // Re-construct the RegExp object from the AST node
            key = new RegExp(keyNode.pattern, keyNode.flags);
        } else {
            key = getLiteralValue(keyNode);
        }

        const value = getLiteralValue(valueNode);

        if (key === null || value === null) return null;
        return [key, value];
    }).filter(Boolean); // Filter out any null (invalid) entries

    // 4. Sort the array
    let sortedArray;
    if (keyToSort === 'textRules') {
      sortedArray = sortTextRules(originalArray);
    } else if (keyToSort === 'regexRules') {
      sortedArray = sortRegexRules(originalArray);
    } else {
      // This case should not be hit due to the interactive menu constraints
      throw new Error(t('sortTranslations.unknownSortKeyType', keyToSort) || `未知的排序键类型: ${keyToSort}`);
    }

    // 5. Format the sorted array back to a string
    const sortedArrayString = formatArrayAsString(sortedArray, keyToSort);

    // 6. Replace the old array string with the new one in the original content
    const contentBefore = originalContent.substring(0, arrayNode.range[0]);
    const contentAfter = originalContent.substring(arrayNode.range[1]);
    const updatedContent = contentBefore + sortedArrayString + contentAfter;
    
    await fs.writeFile(filePath, updatedContent, 'utf-8');
    console.log(color.green(t('sortTranslations.sortSuccess', color.yellow(keyToSort))));
    return true;
  } catch (error) {
    console.error(color.red(t('sortTranslations.processingError', color.yellow(keyToSort), path.basename(filePath), error.message)));
    return false;
  }
}


async function handleSortTranslations() {
  const translationsDir = path.join(process.cwd(), 'src', 'translations');

  while (true) {
    console.clear();
    const title = color.bold(color.cyan(t('sortTranslations.title')));
    console.log(color.dim(t('sortTranslations.separator')));
    console.log(title);
    console.log(color.dim(t('sortTranslations.separator')));

    // 获取所有语言目录下的翻译文件
    let allFiles = [];
    try {
      // 获取所有语言目录
      const langDirs = (await fs.readdir(translationsDir)).filter(file => 
        SUPPORTED_LANGUAGE_CODES.includes(file)
      );
      
      // 收集所有语言目录下的翻译文件
      for (const langDir of langDirs) {
        const langPath = path.join(translationsDir, langDir);
        const files = (await fs.readdir(langPath)).filter(file => file.endsWith('.js'));
        allFiles.push(...files.map(file => ({ file, langDir })));
      }
    } catch (error) {
      console.error(color.red(t('sortTranslations.readingDirError')), error);
      await pressAnyKeyToContinue();
      return;
    }
    
    if (allFiles.length === 0) {
      console.log(color.yellow(t('sortTranslations.noFilesToSort')));
      await pressAnyKeyToContinue();
      return;
    }

    // 创建带语言标识的选项，按语言分组显示
    const fileChoices = [];
    const filesByLanguage = {};
    
    // 按语言分组文件
    allFiles.forEach(({ file, langDir }) => {
      if (!filesByLanguage[langDir]) {
        filesByLanguage[langDir] = [];
      }
      filesByLanguage[langDir].push({ file, langDir });
    });
    
    // 为每个语言创建分隔符和文件选项
    Object.keys(filesByLanguage).sort().forEach(langDir => {
      fileChoices.push(new inquirer.Separator(`--- ${langDir} ---`));
      filesByLanguage[langDir].forEach(({ file, langDir }) => {
        fileChoices.push({
          name: `  ${file}`,
          value: { file, langDir }
        });
      });
    });

    const { fileToSort } = await inquirer.prompt([
      {
        type: 'list',
        name: 'fileToSort',
        message: t('sortTranslations.selectFile'),
        choices: [
          ...fileChoices, 
          new inquirer.Separator(t('sortTranslations.globalOperation')),
          { name: t('sortTranslations.sortAllRegex'), value: 'all_regex' },
          { name: t('sortTranslations.sortAllText'), value: 'all_text' },
          { name: t('sortTranslations.sortAll'), value: 'all_all' }, 
          new inquirer.Separator(),
          { name: t('sortTranslations.backToMenu'), value: 'back' }
        ],
        prefix: '📂',
        pageSize: 20, // 增加 pageSize 选项以显示更多行
      },
    ]);
    if (fileToSort === 'back') { return; }

    // 检查 fileToSort 是字符串还是对象
    const isGlobalOperation = typeof fileToSort === 'string' && fileToSort.startsWith('all_');
    
    if (isGlobalOperation) {
      console.log(color.bold(t('sortTranslations.executingGlobalTask')));
      for (const { file, langDir } of allFiles) {
        const filePath = path.join(translationsDir, langDir, file);
        console.log(color.cyan(t('sortTranslations.processingFile', file, langDir)));
        if (fileToSort === 'all_regex' || fileToSort === 'all_all') {
          await runSort(filePath, 'regexRules');
        }
        if (fileToSort === 'all_text' || fileToSort === 'all_all') {
          await runSort(filePath, 'textRules');
        }
      }
      console.log(color.green(color.bold(t('sortTranslations.globalTaskComplete'))));
      await pressAnyKeyToContinue();
    } else {
      // 确保 fileToSort 是一个对象
      if (typeof fileToSort !== 'object' || !fileToSort.file || !fileToSort.langDir) {
        console.error(color.red(t('sortTranslations.invalidFileSelection')));
        await pressAnyKeyToContinue();
        continue;
      }
      
      const { keyToSort } = await inquirer.prompt([
        {
            type: 'list',
            name: 'keyToSort',
            message: t('sortTranslations.selectKey', color.yellow(fileToSort.file), fileToSort.langDir),
            choices: [
                { name: t('sortTranslations.regexRules'), value: 'regexRules' },
                { name: t('sortTranslations.textRules'), value: 'textRules' },
                new inquirer.Separator(),
                { name: t('sortTranslations.executeAll'), value: 'all' },
                new inquirer.Separator(),
                { name: t('sortTranslations.back'), value: 'back' },
            ],
            prefix: '🔑',
            pageSize: 20, // 增加 pageSize 选项以显示更多行
        }
      ]);

      if (keyToSort === 'back') {
        continue;
      }

      const filePath = path.join(translationsDir, fileToSort.langDir, fileToSort.file);
      
      if (keyToSort === 'all') {
        console.log(color.bold(t('sortTranslations.comprehensiveSort', color.yellow(fileToSort.file), fileToSort.langDir)));
        const successRegex = await runSort(filePath, 'regexRules');
        if (successRegex) {
          await runSort(filePath, 'textRules');
        }
      } else {
        await runSort(filePath, keyToSort);
      }
      await pressAnyKeyToContinue();
    }
    
    // 移动到循环外部
  }
}

export default handleSortTranslations;
