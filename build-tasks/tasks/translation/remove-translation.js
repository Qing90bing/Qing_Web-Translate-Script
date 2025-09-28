/**
 * @file build-tasks/tasks/translation/remove-translation.js
 * @description
 * 此任务脚本负责引导用户以交互方式移除一个现有的网站翻译配置文件。
 * 这是一个破坏性操作，涉及多个文件的修改和删除，因此需要谨慎处理。
 *
 * **核心工作流程**:
 * 1. **扫描文件**: 扫描 `src/translations` 下的所有语言目录，收集所有可移除的 `.js` 翻译文件。
 * 2. **分组与展示**: 将找到的文件按语言进行分组，并在交互式列表中清晰地展示给用户。
 * 3. **用户选择与确认**: 提示用户选择要移除的文件，并通过二次确认来防止误操作。
 * 4. **执行移除操作**:
 *    a. **删除翻译文件**: 删除用户选择的 `.js` 文件。
 *    b. **更新索引 (`index.js`)**: 使用正则表达式精确地移除对应的 `import` 语句和在 `masterTranslationMap` 中的注册条目。
 *    c. **更新脚本头 (`header.txt`)**:
 *       - **条件性移除**: 在移除 `@match` 指令前，会检查是否存在该网站的其他语言版本的翻译文件。
 *       - 只有当这是该网站最后一个被移除的翻译文件时，才会移除对应的 `@match` 指令。这确保了如果用户只想移除某个语言版本，脚本在该网站上的匹配功能不会被意外禁用。
 *
 * **重要风险提示**: 与“添加”任务不同，此任务**不具备**自动回滚功能。如果在操作中途（例如，在更新 `index.js` 后、更新 `header.txt` 前）发生错误，项目文件可能处于不一致状态，需要开发者手动修复。
 */

// 导入 Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../../lib/colors.js';
import { t } from '../../lib/terminal-i18n.js';
import { SUPPORTED_LANGUAGE_CODES } from '../../../src/config/languages.js';

// --- 辅助函数 ---

/**
 * @function toCamelCase
 * @description 将文件名（如 "example.com.js"）和语言代码转换为一个唯一的驼峰式命名（如 "exampleComZhCN"）。
 * 这个函数对于根据文件名反向推导出在 `index.js` 中使用的变量名至关重要。
 * @param {string} domain - 要转换的文件名（不含 .js 后缀）。
 * @param {string} [language=''] - 语言代码。
 * @returns {string} 转换后的驼峰式命名的字符串。
 */
function toCamelCase(domain, language = '') {
  let result = domain.replace(/\./g, ' ').replace(/(?:^|\s)\w/g, (match, index) => {
    return index === 0 ? match.toLowerCase().trim() : match.toUpperCase().trim();
  }).replace(/\s+/g, '');
  
  if (language) {
    const langParts = language.split('-');
    const langSuffix = langParts.map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join('');
    result += langSuffix;
  }
  
  return result;
}

/**
 * @function handleRemoveTranslation
 * @description 处理移除现有翻译文件的主要交互流程和文件操作。
 * @returns {Promise<void>}
 */
async function handleRemoveTranslation() {
  console.log(color.bold(color.cyan(t('manageTranslations.scanningFiles'))));

  const translationsDir = path.join(process.cwd(), 'src', 'translations');
  
  // --- 步骤 1: 扫描并列出所有可移除的翻译文件 ---
  let translationFiles = [];
  try {
    // 读取 `src/translations` 下的所有子目录，并筛选出在配置中支持的语言目录。
    const langDirs = fs.readdirSync(translationsDir).filter(file => 
      fs.statSync(path.join(translationsDir, file)).isDirectory() && 
      SUPPORTED_LANGUAGE_CODES.includes(file)
    );
    
    // 遍历每个语言目录，收集其中的 `.js` 文件。
    for (const langDir of langDirs) {
      const langPath = path.join(translationsDir, langDir);
      const files = fs.readdirSync(langPath).filter(file => file.endsWith('.js'));
      // 将文件及其所属的语言目录作为一个对象存入数组。
      translationFiles.push(...files.map(file => ({ file, langDir })));
    }
  } catch (error) {
    console.error(color.red(t('manageTranslations.readingDirError')), error);
    return;
  }

  if (translationFiles.length === 0) {
    console.log(color.yellow(t('manageTranslations.noFilesToRemove')));
    return;
  }

  // --- 步骤 2: 按语言对文件进行分组，以便在列表中清晰地展示 ---
  const filesByLanguage = {};
  translationFiles.forEach(({ file, langDir }) => {
    if (!filesByLanguage[langDir]) {
      filesByLanguage[langDir] = [];
    }
    filesByLanguage[langDir].push({ file, langDir });
  });
  
  // 创建 inquirer 的选项数组，包含语言分组的分隔符。
  const choices = [];
  Object.keys(filesByLanguage).sort().forEach(langDir => {
    choices.push(new inquirer.Separator(`--- ${langDir} ---`));
    filesByLanguage[langDir].forEach(({ file, langDir }) => {
      choices.push({
        name: `  ${file}`,
        value: { file, langDir } // 将文件和语言目录作为选项的值
      });
    });
  });
  
  // --- 步骤 3: 提示用户选择并确认 ---
  const { fileToRemove } = await inquirer.prompt([
    {
      type: 'list',
      name: 'fileToRemove',
      message: t('manageTranslations.selectFileToRemove'),
      choices: [
        ...choices,
        new inquirer.Separator(),
        { name: t('manageTranslationsMenu.back'), value: 'back' },
      ],
      prefix: '🗑️',
      pageSize: 20, // 增加 pageSize 选项以显示更多行
    },
  ]);

  if (fileToRemove === 'back') {
    console.log(color.dim(t('manageTranslations.operationCancelled')));
    return;
  }

  // 二次确认，防止用户误删。
  const { confirm } = await inquirer.prompt([
    {
      type: 'list',
      name: 'confirm',
      message: t('manageTranslations.confirmRemoval', color.yellow(fileToRemove.file)),
      choices: [
        { name: t('manageTranslationsMenu.remove'), value: true },
        { name: t('manageTranslations.creationCancelled'), value: false }
      ],
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(color.yellow(t('manageTranslations.operationCancelled')));
    return;
  }

  // --- 步骤 4: 执行删除和文件更新操作 ---
  const domain = fileToRemove.file.replace(/\.js$/, '');
  // 根据文件名和语言目录反向生成对应的驼峰式变量名。
  const variableName = toCamelCase(domain, fileToRemove.langDir);
  const filePath = path.join(translationsDir, fileToRemove.langDir, fileToRemove.file);
  const indexJsPath = path.join(translationsDir, 'index.js');
  const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');

  try {
    // 4a. 删除翻译文件本身
    fs.unlinkSync(filePath);
    console.log(color.green(t('manageTranslations.fileRemoved', fileToRemove.langDir, fileToRemove.file)));

    // 4b. 更新 index.js
    let indexJsContent = fs.readFileSync(indexJsPath, 'utf-8');
    // 构建精确的正则表达式来移除 import 语句，匹配整行（包括换行符）以避免留下空行。
    // 使用 'm' (multiline) 标志，使 '^' 能够匹配一行的开头。
    const importRegex = new RegExp(`^import\\s+\\{\\s*${variableName}\\s*\\}\\s+from\\s+'\\.\\/${fileToRemove.langDir}/${fileToRemove.file}';?\\s*\\r?\\n?`, 'm');
    indexJsContent = indexJsContent.replace(importRegex, '');

    // 构建精确的正则表达式来移除在 masterTranslationMap 中的注册条目。
    const mapEntryRegex = new RegExp(`^\\s*"${domain}#${fileToRemove.langDir}":\\s*${variableName},?\\s*\\r?\\n?`, 'm');
    indexJsContent = indexJsContent.replace(mapEntryRegex, '');

    fs.writeFileSync(indexJsPath, indexJsContent);
    console.log(color.green(t('manageTranslations.indexJsUpdated')));

    // 4c. 条件性地更新 header.txt
    // 在移除 @match 指令前，先检查是否还存在该网站的其他语言版本的翻译文件。
    let hasOtherLanguageFiles = false;
    try {
      const allLangDirs = fs.readdirSync(translationsDir).filter(file =>
        fs.statSync(path.join(translationsDir, file)).isDirectory() && 
        SUPPORTED_LANGUAGE_CODES.includes(file)
      );
      
      for (const langDir of allLangDirs) {
        const otherLangPath = path.join(translationsDir, langDir, fileToRemove.file);
        if (fs.existsSync(otherLangPath)) {
          hasOtherLanguageFiles = true;
          break; // 找到一个就足够了，可以立即中断检查。
        }
      }
    } catch (checkError) {
      console.warn(color.yellow(t('sortTranslations.readingDirError', checkError.message)));
    }
    
    // 只有当这是该网站的最后一个翻译文件时，才移除 @match 指令。
    if (!hasOtherLanguageFiles) {
      let headerTxtContent = fs.readFileSync(headerTxtPath, 'utf-8');
      const matchRegex = new RegExp(`^// @match\\s+\\*://${domain}/\\*\\s*\\r?\\n`, 'm');
      headerTxtContent = headerTxtContent.replace(matchRegex, '');

      fs.writeFileSync(headerTxtPath, headerTxtContent);
      console.log(color.green(t('manageTranslations.headerTxtUpdated')));
    } else {
      console.log(color.yellow(t('manageTranslations.headerNotRemoved', color.yellow(domain))));
    }

    console.log(color.bold(color.lightGreen(t('manageTranslations.removalSuccess'))));

  } catch (error) {
    console.error(color.red(t('manageTranslations.removalError', error.message)));
    console.error(color.yellow(t('manageTranslations.inconsistentState')));
  }
}

export default handleRemoveTranslation;
