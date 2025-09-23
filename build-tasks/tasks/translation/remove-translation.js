// 导入 Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../../lib/colors.js';
import { t } from '../../lib/terminal-i18n.js';
import { SUPPORTED_LANGUAGE_CODES } from '../../../src/config/languages.js';

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
 * @param {string} language - 语言标识，用于生成唯一变量名。
 * @returns {string} 转换后的驼峰式命名的字符串。
 */
function toCamelCase(domain, language = '') {
  let result = domain.replace(/\./g, ' ').replace(/(?:^|\s)\w/g, (match, index) => {
    return index === 0 ? match.toLowerCase().trim() : match.toUpperCase().trim();
  }).replace(/\s+/g, '');
  
  // 如果提供了语言标识，则添加到变量名中以确保唯一性
  if (language) {
    // 将语言标识转换为首字母大写的驼峰式命名
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
 * @description 处理移除现有翻译文件的主要函数。
 * @returns {Promise<void>}
 */
async function handleRemoveTranslation() {
  console.log(color.bold(color.cyan(t('manageTranslations.scanningFiles'))));

  const translationsDir = path.join(process.cwd(), 'src', 'translations');
  
  // --- 步骤 1: 扫描并列出所有可移除的翻译文件 ---
  let translationFiles = [];
  try {
    // 获取所有语言目录
    const langDirs = fs.readdirSync(translationsDir).filter(file => 
      fs.statSync(path.join(translationsDir, file)).isDirectory() && 
      SUPPORTED_LANGUAGE_CODES.includes(file)
    );
    
    // 收集所有语言目录下的翻译文件
    for (const langDir of langDirs) {
      const langPath = path.join(translationsDir, langDir);
      const files = fs.readdirSync(langPath).filter(file => file.endsWith('.js'));
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

  // --- 步骤 2: 提示用户选择要移除的文件 ---
  // 按语言分组文件以便显示
  const filesByLanguage = {};
  
  translationFiles.forEach(({ file, langDir }) => {
    if (!filesByLanguage[langDir]) {
      filesByLanguage[langDir] = [];
    }
    filesByLanguage[langDir].push({ file, langDir });
  });
  
  // 创建带语言标识的选项
  const choices = [];
  Object.keys(filesByLanguage).sort().forEach(langDir => {
    choices.push(new inquirer.Separator(`--- ${langDir} ---`));
    filesByLanguage[langDir].forEach(({ file, langDir }) => {
      choices.push({
        name: `  ${file}`,
        value: { file, langDir }
      });
    });
  });
  
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

  // --- 步骤 3: 要求用户最终确认 ---
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
  // 使用语言标识生成正确的变量名
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
    // 构建更精确的正则表达式，以匹配并移除整行（包括换行符），从而避免留下空行。
    // 使用 'm' (multiline) 标志，使 '^' 匹配行的开头。
    const importRegex = new RegExp(`^import\\s+\\{\\s*${variableName}\\s*\\}\\s+from\\s+'\\.\\/${fileToRemove.langDir}/${fileToRemove.file}';?\\s*\\r?\\n?`, 'm');
    indexJsContent = indexJsContent.replace(importRegex, '');

    // 在域名后添加语言标识以匹配正确的映射条目
    // 修改正则表达式以正确处理可能没有换行符的情况
    const mapEntryRegex = new RegExp(`^\\s*"${domain}#${fileToRemove.langDir}":\\s*${variableName},?\\s*\\r?\\n?`, 'm');
    indexJsContent = indexJsContent.replace(mapEntryRegex, '');

    fs.writeFileSync(indexJsPath, indexJsContent);
    console.log(color.green(t('manageTranslations.indexJsUpdated')));

    // 4c. 更新 header.txt
    // 检查是否还有其他语言的同名翻译文件
    let hasOtherLanguageFiles = false;
    try {
      // 获取所有语言目录
      const langDirs = fs.readdirSync(translationsDir).filter(file => 
        fs.statSync(path.join(translationsDir, file)).isDirectory() && 
        SUPPORTED_LANGUAGE_CODES.includes(file)
      );
      
      // 检查其他语言目录中是否还有同名文件
      for (const langDir of langDirs) {
        if (langDir !== fileToRemove.langDir) {
          const otherLangPath = path.join(translationsDir, langDir, fileToRemove.file);
          if (fs.existsSync(otherLangPath)) {
            hasOtherLanguageFiles = true;
            break;
          }
        }
      }
    } catch (checkError) {
      console.warn(color.yellow(t('sortTranslations.readingDirError', checkError.message)));
    }
    
    // 只有当没有其他语言的同名翻译文件时，才移除@match指令
    if (!hasOtherLanguageFiles) {
      let headerTxtContent = fs.readFileSync(headerTxtPath, 'utf-8');
      const matchRegex = new RegExp(`^// @match\\s+\\*://${domain}/\\*\\s*\\r?\\n`, 'm');
      headerTxtContent = headerTxtContent.replace(matchRegex, '');

      fs.writeFileSync(headerTxtPath, headerTxtContent);
      console.log(color.green(t('manageTranslations.headerTxtUpdated')));
    } else {
      console.log(color.yellow(t('manageTranslations.headerAlreadyExists', color.yellow(domain))));
    }

    console.log(color.bold(color.lightGreen(t('manageTranslations.removalSuccess'))));

  } catch (error) {
    console.error(color.red(t('manageTranslations.removalError', error.message)));
    console.error(color.yellow(t('manageTranslations.inconsistentState')));
  }
}

export default handleRemoveTranslation;
