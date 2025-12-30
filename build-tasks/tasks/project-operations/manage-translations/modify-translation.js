/**
 * @file build-tasks/tasks/project-operations/manage-translations/modify-translation.js
 * @description
 * 此任务脚本负责引导用户以交互方式修改（重命名）一个现有的网站翻译配置文件。
 * 它会自动处理文件重命名、更新索引文件中的引用以及更新 header.txt 中的匹配规则。
 */

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { color } from '../../../lib/colors.js';
import { t } from '../../../lib/terminal-i18n.js';
import { SUPPORTED_LANGUAGE_CODES } from '../../../../src/modules/utils/language.js';
import {
    toCamelCase,
    isValidDomain,
    formatAndSaveIndex,
    selectLanguage,
    scanTranslationFiles,
    selectTranslationFile,
    getTranslationFilePaths,
    updateDomainInHeader
} from '../../../lib/translation-utils.js';


/**
 * @function handleModifyTranslation
 * @description 处理修改翻译文件的主逻辑
 */
async function handleModifyTranslation() {
    console.log(color.bold(color.cyan(t('modifyTranslation.scanningFiles'))));

    const translationsDir = path.join(process.cwd(), 'src', 'translations');

    // --- 步骤 1: 选择语言 ---
    const selectedLanguage = await selectLanguage();
    if (!selectedLanguage) return;

    // --- 步骤 2: 选择要修改的文件 ---
    const translationFiles = scanTranslationFiles(selectedLanguage);

    if (translationFiles.length === 0) {
        console.log(color.yellow(t('modifyTranslation.noFilesToModify')));
        return;
    }

    const fileToModify = await selectTranslationFile(translationFiles);
    if (!fileToModify) return;

    const oldDomain = fileToModify.replace(/\.js$/, '');

    // --- 步骤 3: 输入新域名 ---
    const { newDomain } = await inquirer.prompt([
        {
            type: 'input',
            name: 'newDomain',
            message: t('modifyTranslation.enterNewDomain'),
            validate: (input) => {
                if (!input) return t('manageTranslations.domainCannotBeEmpty');
                if (!isValidDomain(input)) return t('modifyTranslation.invalidDomain');

                // 新域名不能与旧域名相同
                if (input === oldDomain) {
                    return t('modifyTranslation.domainCannotBeSame');
                }

                // 简单检查当前语言下是否存在
                if (translationFiles.includes(`${input}.js`)) {
                    return t('modifyTranslation.domainExists', input);
                }
                return true;
            },
        },
    ]);

    if (!newDomain) {
        console.log(color.yellow(t('modifyTranslation.operationCancelled')));
        return;
    }

    // --- 步骤 4: 预览变更 ---
    console.log(color.cyan(t('modifyTranslation.previewChanges')));

    // 收集受影响的文件信息
    const changes = [];
    // 依然需要遍历所有语言来查找同一域名下的文件
    const langDirs = fs.readdirSync(translationsDir).filter(file =>
        fs.statSync(path.join(translationsDir, file)).isDirectory() &&
        SUPPORTED_LANGUAGE_CODES.includes(file)
    );

    for (const langDir of langDirs) {
        const { filePath: oldFilePath } = getTranslationFilePaths(langDir, fileToModify);

        // 即使在某个语言下不存在该文件，只要在其他语言下存在，原则上我们只处理存在的
        if (fs.existsSync(oldFilePath)) {
            const newFileName = `${newDomain}.js`;
            const oldVariableName = toCamelCase(oldDomain, langDir);
            const newVariableName = toCamelCase(newDomain, langDir);

            changes.push({
                langDir,
                oldFileName: fileToModify,
                newFileName,
                oldVariableName,
                newVariableName
            });

            console.log(t('modifyTranslation.previewItem',
                color.yellow(langDir),
                fileToModify,
                color.green(newFileName),
                oldVariableName,
                color.green(newVariableName)
            ));
        }
    }

    if (changes.length === 0) {
        console.log(color.yellow(t('modifyTranslation.noFilesToModify'))); // 理论上不应该发生
        return;
    }

    // --- 步骤 5: 最终确认 ---
    const { confirmAction } = await inquirer.prompt([
        {
            type: 'list',
            name: 'confirmAction',
            message: t('modifyTranslation.confirmModification'),
            choices: [
                { name: t('modifyTranslation.actionConfirm'), value: true },
                { name: t('modifyTranslation.actionCancel'), value: false }
            ],
            prefix: '❓',
        },
    ]);

    if (!confirmAction) {
        console.log(color.yellow(t('modifyTranslation.operationCancelled')));
        return;
    }

    // --- 步骤 6: 执行修改 ---

    try {
        for (const change of changes) {
            const { langDir, oldFileName, newFileName, oldVariableName, newVariableName } = change;
            const { sitesDir, filePath: oldFilePath, indexJsPath } = getTranslationFilePaths(langDir, oldFileName);
            const newFilePath = path.join(sitesDir, newFileName);

            // 6a. 变量重命名 (在重命名文件之前读取内容)
            let fileContent = fs.readFileSync(oldFilePath, 'utf-8');
            // 简单正则替换导出变量
            // export const oldVar = { ... }
            const exportRegex = new RegExp(`export\\s+const\\s+${oldVariableName}\\s+=\\s+`, 'g');
            if (exportRegex.test(fileContent)) {
                fileContent = fileContent.replace(exportRegex, `export const ${newVariableName} = `);
            } else {
                console.warn(color.yellow(`Warning: Could not find export variable '${oldVariableName}' in ${oldFileName}. Skipping variable rename in file content.`));
            }

            // 6b. 写入新文件内容并重命名文件
            // 实际上是写入原路径，然后 rename. 为了安全起见，我们直接覆写原文件内容然后再重命名
            fs.writeFileSync(oldFilePath, fileContent);
            fs.renameSync(oldFilePath, newFilePath);
            console.log(color.green(t('modifyTranslation.fileRenamed', `${langDir}/${oldFileName}`, newFileName)));

            // 6c. 更新索引
            if (fs.existsSync(indexJsPath)) {
                let indexJsContent = fs.readFileSync(indexJsPath, 'utf-8');

                const escapedOldFile = oldFileName.replace(/\./g, '\\.');
                const importRegex = new RegExp(`import\\s+\\{\\s*${oldVariableName}\\s*\\}\\s+from\\s+['"]\\./sites/${escapedOldFile}['"];?`, 'g');
                const newImportStmt = `import { ${newVariableName} } from './sites/${newFileName}';`;
                indexJsContent = indexJsContent.replace(importRegex, newImportStmt);

                const mapKeyRegex = new RegExp(`["']${oldDomain.replace(/\./g, '\\.')}#${langDir}["']\\s*:\\s*${oldVariableName}`, 'g');
                const newMapEntry = `"${newDomain}#${langDir}": ${newVariableName}`;
                indexJsContent = indexJsContent.replace(mapKeyRegex, newMapEntry);

                await formatAndSaveIndex(indexJsPath, indexJsContent);
                console.log(color.green(t('modifyTranslation.indexJsUpdated', langDir)));
            }
        }

        // 更新 header.txt
        updateDomainInHeader(oldDomain, newDomain);

        console.log('\n' + color.bold(color.lightGreen(t('modifyTranslation.modificationSuccess'))));

    } catch (error) {
        console.error(color.red(t('modifyTranslation.modificationError', error.message)));
        console.warn(color.yellow(t('modifyTranslation.inconsistentState')));
    }
}

export default handleModifyTranslation;
