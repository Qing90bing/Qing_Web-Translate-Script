/**
 * @file build-tasks/tasks/translation/sort-translations.js
 * @description
 * 此任务脚本负责对翻译文件中的 `textRules` 和 `regexRules` 数组进行排序。
 * 排序的目的是保持翻译规则的一致性和可读性，并方便版本控制中的差异比较。
 *
 * **核心技术**:
 * 此脚本采用基于 AST (抽象语法树) 的方法来修改文件，而不是简单的文本替换。
 * 1. **解析**: 使用 `acorn` 库将整个 JavaScript 文件解析成一个 AST。
 * 2. **定位**: 在 AST 中精确找到 `textRules` 或 `regexRules` 数组节点。
 * 3. **提取与转换**: 将 AST 节点表示的数组元素转换成一个标准的 JavaScript 数组。
 * 4. **排序**: 使用自定义的排序逻辑对这个 JavaScript 数组进行排序。
 * 5. **格式化**: 将排序后的数组格式化回一个符合代码风格的字符串。
 * 6. **替换**: 用新生成的字符串精确地替换掉原始 AST 节点在源文件中的范围（range），从而在不影响文件其余部分（如注释、其他代码）的情况下完成排序。
 *
 * 这种方法比正则表达式或手动字符串操作更安全、更健壮。
 */

// 导入 Node.js 内置模块
import fs from 'fs/promises';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer'; // 用于创建交互式菜单
import { parse } from 'acorn'; // 用于将 JS 代码解析成 AST

// 导入本地模块
import { color } from '../../lib/colors.js';
import { t } from '../../lib/terminal-i18n.js';
import { getLiteralValue } from '../../lib/validation.js';
import { pressAnyKeyToContinue } from '../../lib/utils.js';
import { SUPPORTED_LANGUAGE_CODES } from '../../../src/config/languages.js';

/**
 * @function visualLength
 * @description 计算字符串的“视觉长度”。
 * 在这个计算中，一个中文字符被视为占据2个单位长度，而其他所有字符（如英文字母、数字、符号）则被视为1个单位长度。
 * 这个函数是排序逻辑的一部分，用于优先排列内容更“长”的规则。
 * @param {string} str - 要计算长度的字符串。
 * @returns {number} 字符串的视觉长度。
 */
function visualLength(str) {
  let len = 0;
  for (const ch of str) {
    if (/[^\x00-\xff]/.test(ch)) {
      len += 2; // 全角字符（多字节）计为2个单位长度
    } else {
      len += 1; // 半角字符（单字节）计为1个单位长度
    }
  }
  return len;
}

/**
 * @function sortTextRules
 * @description 对 `textRules` 数组进行排序。
 * **排序逻辑**:
 * 1. **主要排序键**: 按规则的“总视觉长度”（原文 + 译文）**降序**排列。总长度越长的规则排在越前面。
 * 2. **次要排序键**: 如果总长度相同，则按原文的字母顺序**升序**排列。
 * 3. **最终排序键**: 如果原文也相同，则按译文的字母顺序**升序**排列。
 * @param {Array<[string, string]>} arr - 要排序的 `textRules` 数组。
 * @returns {Array<[string, string]>} 排序后的新数组。
 */
function sortTextRules(arr) {
  if (!Array.isArray(arr)) { return []; }
  const sortedArr = [...arr]; // 创建副本以避免修改原数组
  sortedArr.sort((a, b) => {
    const aLen = visualLength(a[0]) + visualLength(a[1]);
    const bLen = visualLength(b[0]) + visualLength(b[1]);
    if (bLen !== aLen) return bLen - aLen; // 降序
    const enDiff = a[0].localeCompare(b[0]);
    if (enDiff !== 0) return enDiff; // 升序
    return a[1].localeCompare(b[1]); // 升序
  });
  return sortedArr;
}

/**
 * @function sortRegexRules
 * @description 对 `regexRules` 数组进行排序。
 * **排序逻辑**:
 * 1. **主要排序键**: 与 `textRules` 类似，按“总视觉长度”（正则表达式字符串 + 译文）**降序**排列。
 * 2. **次要排序键**: 如果总长度相同，则按正则表达式的字符串表示法进行字母顺序**升序**排列。
 * @param {Array<[RegExp, string]>} arr - 要排序的 `regexRules` 数组。
 * @returns {Array<[RegExp, string]>} 排序后的新数组。
 */
function sortRegexRules(arr) {
  if (!Array.isArray(arr)) { return []; }
  const sortedArr = [...arr];
  sortedArr.sort((a, b) => {
    const aRegexStr = a[0].toString();
    const bRegexStr = b[0].toString();
    const aLen = visualLength(aRegexStr) + visualLength(a[1]);
    const bLen = visualLength(bRegexStr) + visualLength(b[1]);
    if (bLen !== aLen) { return bLen - aLen; } // 降序
    return aRegexStr.localeCompare(bRegexStr); // 升序
  });
  return sortedArr;
}

/**
 * @function formatArrayAsString
 * @description 将一个 JavaScript 数组格式化成符合项目代码风格的多行字符串。
 * 这个函数负责将排序后的数组转换回可以写入文件的代码字符串，包括正确的缩进、换行和引号转义。
 * @param {Array} arr - 要格式化的数组。
 * @param {'textRules'|'regexRules'} keyType - 数组的类型，用于决定如何格式化键（普通字符串 vs 正则表达式）。
 * @returns {string} 格式化后的数组字符串。
 */
function formatArrayAsString(arr, keyType) {
  if (arr.length === 0) { return '[]'; }
  const items = arr.map(item => {
    if (!Array.isArray(item) || item.length !== 2) { return t('sortTranslations.invalidFormat'); }
    // 对值（译文）进行转义，以确保它是有效的 JSON 字符串内容。
    const value = item[1]
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    let key;
    // 根据类型处理键。正则表达式直接使用 `toString()`，而普通字符串需要添加引号并转义。
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
 * @function runSort
 * @description 使用基于 AST 的方法安全地对单个文件中的翻译规则数组进行排序。
 * @param {string} filePath - 要处理的文件的完整路径。
 * @param {'textRules'|'regexRules'} keyToSort - 要排序的数组的键名。
 * @returns {Promise<boolean>} 如果操作成功则返回 `true`，否则返回 `false`。
 */
async function runSort(filePath, keyToSort) {
  console.log(color.cyan(t('sortTranslations.processingKey', color.yellow(keyToSort))));
  try {
    const originalContent = await fs.readFile(filePath, 'utf-8');
    let ast;

    // 步骤 1: 将文件内容解析成 AST。如果失败，则说明文件有语法错误。
    try {
      ast = parse(originalContent, { ecmaVersion: 'latest', sourceType: 'module', ranges: true });
    } catch (e) {
      throw new Error(t('sortTranslations.fileParseError', e.message));
    }

    // 步骤 2: 在 AST 中找到导出的翻译对象和目标数组节点。
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
    // 如果文件中不存在要排序的键（例如，一个文件可能只有 `textRules`），则跳过。
    if (!targetProperty) {
      console.log(color.dim(t('sortTranslations.keyNotFound', path.basename(filePath), keyToSort)));
      return true;
    }

    const arrayNode = targetProperty.value;
    if (arrayNode.type !== 'ArrayExpression') {
      throw new Error(t('sortTranslations.notArray', keyToSort));
    }

    // 步骤 3: 将 AST 数组元素转换成一个标准的 JavaScript 数组，以便于排序。
    const originalArray = arrayNode.elements.map(element => {
        if (element.type !== 'ArrayExpression' || element.elements.length !== 2) {
            return null; // 忽略格式不正确的条目
        }
        const keyNode = element.elements[0];
        const valueNode = element.elements[1];

        let key;
        if (keyNode.type === 'RegExpLiteral') {
            // 从 AST 节点重新构造 RegExp 对象。
            key = new RegExp(keyNode.pattern, keyNode.flags);
        } else {
            key = getLiteralValue(keyNode); // 处理字符串字面量
        }

        const value = getLiteralValue(valueNode);

        if (key === null || value === null) return null;
        return [key, value];
    }).filter(Boolean); // 过滤掉所有格式不正确的条目

    // 步骤 4: 调用相应的排序函数对数组进行排序。
    let sortedArray;
    if (keyToSort === 'textRules') {
      sortedArray = sortTextRules(originalArray);
    } else if (keyToSort === 'regexRules') {
      sortedArray = sortRegexRules(originalArray);
    } else {
      throw new Error(t('sortTranslations.unknownSortKeyType', keyToSort) || `未知的排序键类型: ${keyToSort}`);
    }

    // 步骤 5: 将排序后的数组格式化回代码字符串。
    const sortedArrayString = formatArrayAsString(sortedArray, keyToSort);

    // 步骤 6: 使用 AST 节点提供的范围信息（range），精确地替换文件中的旧数组内容。
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

/**
 * @function handleSortTranslations
 * @description 显示交互式菜单，并根据用户的选择执行排序任务的主函数。
 */
async function handleSortTranslations() {
  const translationsDir = path.join(process.cwd(), 'src', 'translations');

  // 使用无限循环来保持菜单的持续显示，直到用户选择返回。
  while (true) {
    console.clear();
    const title = color.bold(color.cyan(t('sortTranslations.title')));
    console.log(color.dim(t('sortTranslations.separator')));
    console.log(title);
    console.log(color.dim(t('sortTranslations.separator')));

    // 动态扫描并列出所有可供排序的翻译文件。
    let allFiles = [];
    try {
      const langDirs = (await fs.readdir(translationsDir)).filter(file => 
        SUPPORTED_LANGUAGE_CODES.includes(file)
      );
      
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

    // 创建 inquirer 选项，按语言对文件进行分组显示，以提高可读性。
    const fileChoices = [];
    const filesByLanguage = {};
    
    allFiles.forEach(({ file, langDir }) => {
      if (!filesByLanguage[langDir]) {
        filesByLanguage[langDir] = [];
      }
      filesByLanguage[langDir].push({ file, langDir });
    });
    
    Object.keys(filesByLanguage).sort().forEach(langDir => {
      fileChoices.push(new inquirer.Separator(`--- ${langDir} ---`));
      filesByLanguage[langDir].forEach(({ file, langDir }) => {
        fileChoices.push({
          name: `  ${file}`,
          value: { file, langDir }
        });
      });
    });

    // 主菜单，提供对单个文件、所有文件或特定规则类型的批量操作。
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
        pageSize: 9999,
      },
    ]);
    if (fileToSort === 'back') { return; }

    const isGlobalOperation = typeof fileToSort === 'string' && fileToSort.startsWith('all_');
    
    // 处理全局批量操作
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
    } else { // 处理对单个文件的操作
      if (typeof fileToSort !== 'object' || !fileToSort.file || !fileToSort.langDir) {
        console.error(color.red(t('sortTranslations.invalidFileSelection')));
        await pressAnyKeyToContinue();
        continue;
      }
      
      // 询问用户要对该文件的哪个部分进行排序。
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
            pageSize: 20,
        }
      ]);

      if (keyToSort === 'back') {
        continue; // 返回文件选择菜单
      }

      const filePath = path.join(translationsDir, fileToSort.langDir, fileToSort.file);
      
      if (keyToSort === 'all') {
        console.log(color.bold(t('sortTranslations.comprehensiveSort', color.yellow(fileToSort.file), fileToSort.langDir)));
        const successRegex = await runSort(filePath, 'regexRules');
        if (successRegex) { // 只有在 regexRules 成功后才继续，以防文件已损坏
          await runSort(filePath, 'textRules');
        }
      } else {
        await runSort(filePath, keyToSort);
      }
      await pressAnyKeyToContinue();
    }
  }
}

export default handleSortTranslations;
