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
import { color } from '../../../lib/colors.js';
import { t } from '../../../lib/terminal-i18n.js';
import { getLiteralValue } from '../../../lib/validation.js';
import { pressAnyKeyToContinue } from '../../../lib/utils.js';
import { writeFilePreservingEol } from '../../../lib/utils.js';
import { ProgressBar } from '../../../lib/progress.js';
import { SUPPORTED_LANGUAGES } from '../../../../src/config/languages.js';
import { SUPPORTED_LANGUAGE_CODES } from '../../../../src/modules/utils/language.js';

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
async function runSort(filePath, keyToSort, options = {}) {
  const { silent = false } = options;
  if (!silent) {
    console.log(color.cyan(t('sortTranslations.processingKey', color.yellow(keyToSort))));
  }
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

    // 统一换行符；若排序后内容与原文一致则跳过写入，避免产生“幽灵修改”。
    await writeFilePreservingEol(filePath, originalContent, updatedContent);
    if (!silent) {
      console.log(color.green(t('sortTranslations.sortSuccess', color.yellow(keyToSort))));
    }
    return { success: true, sorted: true };
  } catch (error) {
    if (!silent) {
      console.error(color.red(t('sortTranslations.processingError', color.yellow(keyToSort), path.basename(filePath), error.message)));
    }
    return { success: false, sorted: false, error: error.message };
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

    // 动态扫描存在翻译文件的语言目录
    let existingLangDirs = [];
    try {
      existingLangDirs = (await fs.readdir(translationsDir)).filter(file =>
        SUPPORTED_LANGUAGE_CODES.includes(file)
      );
    } catch (error) {
      console.error(color.red(t('sortTranslations.readingDirError')), error);
      await pressAnyKeyToContinue();
      return;
    }

    // 第一层菜单：语言选择与全局操作
    const mainChoices = [];

    // --- 语言选择 ---
    if (existingLangDirs.length > 0) {
      mainChoices.push(new inquirer.Separator('─── 语言选择 ─── '));

      existingLangDirs.forEach(langCode => {
        const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
        const displayName = langInfo
          ? `${langInfo.name} (${langInfo.code})`
          : langCode;

        mainChoices.push({
          name: displayName,
          value: { type: 'language', langDir: langCode }
        });
      });
    }

    // --- 全局操作 ---
    mainChoices.push(new inquirer.Separator('─── 全局操作 ───'));
    mainChoices.push({ name: '🌐 [全局] 整理所有文件的 regexRules', value: { type: 'global', action: 'all_regex' } });
    mainChoices.push({ name: '🌐 [全局] 整理所有文件的 textRules', value: { type: 'global', action: 'all_text' } });
    mainChoices.push({ name: '🌐 [全局] 整理所有文件的 全部规则', value: { type: 'global', action: 'all_all' } });

    mainChoices.push(new inquirer.Separator('──────────────'));
    mainChoices.push({ name: '↩️ 返回主菜单', value: { type: 'back' } });

    const { mainSelection } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mainSelection',
        message: '📂 请选择您想要的操作:',
        choices: mainChoices,
        pageSize: 20,
      }
    ]);

    if (mainSelection.type === 'back') {
      return;
    }

    // 处理全局操作
    if (mainSelection.type === 'global') {
      const action = mainSelection.action;
      console.log(color.bold(t('sortTranslations.executingGlobalTask')));

      // 重新扫描所有文件
      let allFiles = [];
      console.log(t('sortTranslations.scanningFiles'));

      for (const langDir of existingLangDirs) {
        const sitesPath = path.join(translationsDir, langDir, 'sites');
        try {
          const files = (await fs.readdir(sitesPath)).filter(file => file.endsWith('.js'));
          allFiles.push(...files.map(file => ({ file, langDir, fullPath: path.join(sitesPath, file) })));
        } catch { continue; }
      }

      if (allFiles.length === 0) {
        console.log(color.yellow(t('sortTranslations.noFilesToSort')));
        await pressAnyKeyToContinue();
        continue;
      }

      // 初始化进度条
      const bar = ProgressBar.createTaskProgressBar();
      bar.start(allFiles.length, t('sortTranslations.progress', '...'));

      let successCount = 0;
      let failCount = 0;
      let errors = [];

      for (let i = 0; i < allFiles.length; i++) {
        const { file, langDir, fullPath } = allFiles[i];

        // 更新进度条文本
        bar.update(i, t('sortTranslations.progress', `${langDir}/${file}`));

        let fileResults = [];
        if (action === 'all_regex' || action === 'all_all') {
          fileResults.push(await runSort(fullPath, 'regexRules', { silent: true }));
        }
        if (action === 'all_text' || action === 'all_all') {
          fileResults.push(await runSort(fullPath, 'textRules', { silent: true }));
        }

        // 检查结果
        const failures = fileResults.filter(r => !r.success);
        if (failures.length > 0) {
          failCount++;
          errors.push({ file: `${langDir}/${file}`, messages: failures.map(f => f.error) });
        } else {
          successCount++;
        }
      }

      bar.finish(t('sortTranslations.done'));

      // 显示统计报告
      console.log('\n' + color.bold(t('sortTranslations.summaryTitle')));
      console.log(color.dim(t('sortTranslations.separator')));
      console.log(`  - ${t('sortTranslations.totalFiles')}: ${allFiles.length}`);
      console.log(`  - ${t('sortTranslations.successCount')}: ${color.green(successCount)}`);
      console.log(`  - ${t('sortTranslations.failCount')}: ${failCount > 0 ? color.red(failCount) : color.green(0)}`);

      if (errors.length > 0) {
        console.log('\n' + color.red(t('sortTranslations.errorList')));
        errors.forEach(err => {
          console.log(`  - ${err.file}: ${err.messages.join(', ')}`);
        });
      }

      console.log(color.green(color.bold(t('sortTranslations.globalTaskComplete'))));
      await pressAnyKeyToContinue();
      continue; // 返回主菜单
    }

    // 处理单个语言选择
    if (mainSelection.type === 'language') {
      const selectedLangDir = mainSelection.langDir;
      const sitesPath = path.join(translationsDir, selectedLangDir, 'sites');
      let siteFiles = [];
      try {
        siteFiles = (await fs.readdir(sitesPath)).filter(file => file.endsWith('.js'));
      } catch (e) {
        console.log(color.yellow(`  未找到 ${selectedLangDir} 的 sites 目录或目录为空`));
        await pressAnyKeyToContinue();
        continue;
      }

      if (siteFiles.length === 0) {
        console.log(color.yellow(`  ${selectedLangDir} 下没有可用的翻译文件`));
        await pressAnyKeyToContinue();
        continue;
      }

      // 循环显示文件列表，直到用户选择返回上一级
      while (true) {
        console.clear();
        console.log(color.cyan(`当前语言: ${selectedLangDir}`));

        const fileChoices = siteFiles.map(file => ({ name: file, value: file }));
        fileChoices.push(new inquirer.Separator('──────────────────────────────────────────────'));
        fileChoices.push({ name: '↩️ 返回上一级', value: 'back_to_main' });

        const { fileSelection } = await inquirer.prompt([
          {
            type: 'list',
            name: 'fileSelection',
            message: t('sortTranslations.selectFile'),
            choices: fileChoices,
            pageSize: 20,
          }
        ]);

        if (fileSelection === 'back_to_main') {
          break; // 跳出文件循环，回到主菜单
        }

        // 选择排序类型
        const { keyToSort } = await inquirer.prompt([
          {
            type: 'list',
            name: 'keyToSort',
            message: t('sortTranslations.selectKey', color.yellow(fileSelection), selectedLangDir),
            choices: [
              { name: t('sortTranslations.regexRules'), value: 'regexRules' },
              { name: t('sortTranslations.textRules'), value: 'textRules' },
              new inquirer.Separator('──────────────────────────────────────────────'),
              { name: t('sortTranslations.executeAll'), value: 'all' },
              new inquirer.Separator('──────────────────────────────────────────────'),
              { name: t('sortTranslations.back'), value: 'back' },
            ],
            prefix: '🔑',
            pageSize: 20,
          }
        ]);

        if (keyToSort === 'back') {
          continue; // 重新选择文件
        }

        const filePath = path.join(sitesPath, fileSelection);

        if (keyToSort === 'all') {
          console.log(color.bold(t('sortTranslations.comprehensiveSort', color.yellow(fileSelection), selectedLangDir)));

          // 初始化进度条 (2个任务)
          const bar = ProgressBar.createTaskProgressBar();
          bar.start(2, t('sortTranslations.progress', '...'));

          let results = [];

          bar.update(0, t('sortTranslations.progress', 'regexRules'));
          results.push(await runSort(filePath, 'regexRules', { silent: true }));

          bar.update(1, t('sortTranslations.progress', 'textRules'));
          results.push(await runSort(filePath, 'textRules', { silent: true }));

          bar.finish(t('sortTranslations.done'));

          // 显示简易报告
          const successCount = results.filter(r => r.success).length;
          const failCount = results.filter(r => !r.success).length;
          const errors = results.filter(r => !r.success).map(r => r.error);

          console.log('\n' + color.bold(t('sortTranslations.summaryTitle')));
          console.log(color.dim(t('sortTranslations.separator')));
          console.log(`  - ${t('sortTranslations.totalFiles')}: 1`); // 这里的 TotalFiles 指的是操作的文件数，虽然有些生硬，但保持一致
          console.log(`  - ${t('sortTranslations.successCount')}: ${color.green(successCount)}`);
          console.log(`  - ${t('sortTranslations.failCount')}: ${failCount > 0 ? color.red(failCount) : color.green(0)}`);

          if (errors.length > 0) {
            console.log('\n' + color.red(t('sortTranslations.errorList')));
            errors.forEach(err => console.log(`  - ${err}`));
          }
          console.log(''); // 空行

        } else {
          // 初始化进度条 (1个任务)
          const bar = ProgressBar.createTaskProgressBar();
          bar.start(1, t('sortTranslations.progress', keyToSort));

          const result = await runSort(filePath, keyToSort, { silent: true });

          bar.finish(t('sortTranslations.done'));

          // 显示完整报告
          console.log('\n' + color.bold(t('sortTranslations.summaryTitle')));
          console.log(color.dim(t('sortTranslations.separator')));
          console.log(`  - ${t('sortTranslations.totalFiles')}: 1`);
          console.log(`  - ${t('sortTranslations.successCount')}: ${result.success ? color.green(1) : color.green(0)}`);
          console.log(`  - ${t('sortTranslations.failCount')}: ${!result.success ? color.red(1) : color.green(0)}`);

          if (!result.success) {
            console.log('\n' + color.red(t('sortTranslations.errorList')));
            console.log(`  - ${result.error}`);
          }
          console.log(''); // 空行
        }
        await pressAnyKeyToContinue();
      }
    }
  }
}

export default handleSortTranslations;
