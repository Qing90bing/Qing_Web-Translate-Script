/**
 * @file build-tasks/tasks/translation/remove-translation.js
 * @description
 * 此任务脚本负责引导用户以交互方式移除一个现有的网站翻译配置文件。
 */

import fs from 'fs';
import inquirer from 'inquirer';
import { color } from '../../../lib/colors.js';
import { t } from '../../../lib/terminal-i18n.js';
import {
  toCamelCase,
  formatAndSaveIndex,
  selectLanguage,
  scanTranslationFiles,
  selectTranslationFile,
  getTranslationFilePaths,
  removeDomainFromHeader
} from '../../../lib/translation-utils.js';


/**
 * @function handleRemoveTranslation
 * @description 处理移除现有翻译文件的主要交互流程和文件操作。
 * @returns {Promise<void>}
 */
async function handleRemoveTranslation() {
  console.log(color.bold(color.cyan(t('manageTranslations.scanningFiles'))));

  // --- 步骤 1: 选择语言 ---
  const selectedLanguage = await selectLanguage();
  if (!selectedLanguage) return;

  // --- 步骤 2: 扫描并列出该语言下的翻译文件 ---
  const translationFiles = scanTranslationFiles(selectedLanguage);

  if (translationFiles.length === 0) {
    console.log(color.yellow(t('manageTranslations.noFilesToRemove')));
    return;
  }

  // --- 步骤 3: 提示用户选择并确认 ---
  const fileToRemoveName = await selectTranslationFile(translationFiles, t('manageTranslations.selectFileToRemove'));
  if (!fileToRemoveName) {
    console.log(color.dim(t('manageTranslations.operationCancelled')));
    return;
  }

  // 二次确认，防止用户误删。
  const { confirm } = await inquirer.prompt([
    {
      type: 'list',
      name: 'confirm',
      message: t('manageTranslations.confirmRemoval', color.yellow(fileToRemoveName)), // 这里只显示文件名即可
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
  const domain = fileToRemoveName.replace(/\.js$/, '');
  const variableName = toCamelCase(domain, selectedLanguage);

  const { filePath, indexJsPath } = getTranslationFilePaths(selectedLanguage, fileToRemoveName);

  try {
    // 4a. 删除翻译文件本身
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(color.green(t('manageTranslations.fileRemoved', selectedLanguage, fileToRemoveName)));
    } else {
      console.warn(color.yellow(`File not found: ${filePath}`));
    }

    // 4b. 更新 index.js
    if (fs.existsSync(indexJsPath)) {
      let indexJsContent = fs.readFileSync(indexJsPath, 'utf-8');

      const escapedFileName = fileToRemoveName.replace(/\./g, '\\.');
      // 修复: 移除末尾的 \s* 改为 [ \t]*，以避免吞掉换行符，保留原有的空行结构
      const importRegex = new RegExp(`^\\s*import\\s+\\{\\s*${variableName}\\s*\\}\\s+from\\s+['"]\\./sites/${escapedFileName}['"];?[ \\t]*`, 'm');
      indexJsContent = indexJsContent.replace(importRegex, '');

      const mapEntryRegex = new RegExp(`^\\s*"${domain.replace(/\./g, '\\.')}#${selectedLanguage}":\\s*${variableName},?\\s*\\r?\\n?`, 'm');
      indexJsContent = indexJsContent.replace(mapEntryRegex, '');

      await formatAndSaveIndex(indexJsPath, indexJsContent);
      console.log(color.green(t('manageTranslations.indexJsUpdated')));
    } else {
      console.error(color.red(`Index file not found: ${indexJsPath}`));
    }

    // 4c. 更新 header.txt
    removeDomainFromHeader(domain, selectedLanguage);

    console.log(color.bold(color.lightGreen(t('manageTranslations.removalSuccess'))));

  } catch (error) {
    console.error(color.red(t('manageTranslations.removalError', error.message)));
    console.error(color.yellow(t('manageTranslations.inconsistentState')));
  }
}

export default handleRemoveTranslation;
