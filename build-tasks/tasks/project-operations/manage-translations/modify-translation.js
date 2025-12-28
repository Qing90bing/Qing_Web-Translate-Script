/**
 * @file build-tasks/tasks/project-operations/manage-translations/modify-translation.js
 * @description
 * 此任务脚本负责引导用户以交互方式修改（重命名）一个现有的网站翻译配置文件。
 * 它会自动处理文件重命名、更新索引文件中的引用以及更新 header.txt 中的匹配规则。
 *
 * **核心工作流程**:
 * 1. **选择语言**: 引导用户首先选择语言，以缩小查找范围。
 * 2. **选择文件**: 列出该语言下的文件供用户选择。
 * 3. **输入新域名**: 提示用户输入新的域名。
 * 4. **变更预览**: 显示详细的变更预览，包括所有受影响的语言版本的文件名和变量名变更。
 * 5. **确认执行**: 用户确认后，执行文件重命名和内容更新。
 */

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import prettier from 'prettier';
import { color } from '../../../lib/colors.js';
import { t } from '../../../lib/terminal-i18n.js';
import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGE_CODES } from '../../../../src/config/languages.js';

// --- 辅助函数 ---

/**
 * @function toCamelCase
 * @description 将文件名和语言代码转换为驼峰式变量名
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
 * @function isValidDomain
 * @description 简单的域名格式验证
 */
function isValidDomain(domain) {
    // 简单的正则，匹配 example.com 格式
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain);
}

/**
 * @function handleModifyTranslation
 * @description 处理修改翻译文件的主逻辑
 */
async function handleModifyTranslation() {
    console.log(color.bold(color.cyan(t('modifyTranslation.scanningFiles'))));

    const translationsDir = path.join(process.cwd(), 'src', 'translations');

    // --- 步骤 1: 选择语言 ---
    const { selectedLanguage } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedLanguage',
            message: t('modifyTranslation.selectLanguage'),
            choices: [
                ...SUPPORTED_LANGUAGES.map(lang => ({
                    name: `${lang.name} (${lang.code}) ${lang.flag || ''}`,
                    value: lang.code
                })),
                new inquirer.Separator(),
                { name: t('manageTranslationsMenu.back'), value: 'back' },
            ],
            prefix: '🌐',
        },
    ]);

    if (selectedLanguage === 'back') return;

    // --- 步骤 2: 选择要修改的文件 ---
    let translationFiles = [];
    try {
        const sitesPath = path.join(translationsDir, selectedLanguage, 'sites');
        if (fs.existsSync(sitesPath)) {
            translationFiles = fs.readdirSync(sitesPath).filter(file => file.endsWith('.js'));
        }
    } catch (error) {
        console.error(color.red(t('modifyTranslation.readingDirError', error.message)));
        return;
    }

    if (translationFiles.length === 0) {
        console.log(color.yellow(t('modifyTranslation.noFilesToModify')));
        return;
    }

    const { fileToModify } = await inquirer.prompt([
        {
            type: 'list',
            name: 'fileToModify',
            message: t('modifyTranslation.selectFileToModify'),
            choices: [
                ...translationFiles.sort(),
                new inquirer.Separator(),
                { name: t('manageTranslationsMenu.back'), value: 'back' },
            ],
            prefix: '📄',
            pageSize: 20,
        },
    ]);

    if (fileToModify === 'back') return;

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
                    return t('modifyTranslation.domainCannotBeSame'); // We need to add this key or just use a text for now, I'll use a hardcoded string if key missing, but better add key.
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
    const langDirs = fs.readdirSync(translationsDir).filter(file =>
        fs.statSync(path.join(translationsDir, file)).isDirectory() &&
        SUPPORTED_LANGUAGE_CODES.includes(file)
    );

    for (const langDir of langDirs) {
        const sitesPath = path.join(translationsDir, langDir, 'sites');
        const oldFilePath = path.join(sitesPath, fileToModify);

        // 即使在某个语言下不存在该文件，只要在其他语言下存在，原则上我们只处理存在的
        // 但为了保持一致性，“重命名”通常针对所有匹配的文件
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
            const sitesPath = path.join(translationsDir, langDir, 'sites');
            const oldFilePath = path.join(sitesPath, oldFileName);
            const newFilePath = path.join(sitesPath, newFileName);

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
            const indexJsPath = path.join(translationsDir, langDir, 'index.js');
            if (fs.existsSync(indexJsPath)) {
                let indexJsContent = fs.readFileSync(indexJsPath, 'utf-8');

                const escapedOldFile = oldFileName.replace(/\./g, '\\.');
                const importRegex = new RegExp(`import\\s+\\{\\s*${oldVariableName}\\s*\\}\\s+from\\s+['"]\\./sites/${escapedOldFile}['"];?`, 'g');
                const newImportStmt = `import { ${newVariableName} } from './sites/${newFileName}';`;
                indexJsContent = indexJsContent.replace(importRegex, newImportStmt);

                const mapKeyRegex = new RegExp(`["']${oldDomain.replace(/\./g, '\\.')}#${langDir}["']\\s*:\\s*${oldVariableName}`, 'g');
                const newMapEntry = `"${newDomain}#${langDir}": ${newVariableName}`;
                indexJsContent = indexJsContent.replace(mapKeyRegex, newMapEntry);

                const formattedContent = await prettier.format(indexJsContent, {
                    singleQuote: true,
                    tabWidth: 4,
                    filepath: indexJsPath,
                });
                const finalContent = formattedContent.replace(/'([\w.-]+#[\w-]+)'\s*:/g, '"$1":');

                fs.writeFileSync(indexJsPath, finalContent);
                console.log(color.green(t('modifyTranslation.indexJsUpdated', langDir)));
            }
        }

        // 更新 header.txt
        const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');
        if (fs.existsSync(headerTxtPath)) {
            let headerContent = fs.readFileSync(headerTxtPath, 'utf-8');
            // 修改正则以捕获原本的缩进/空格: (// @match\s+)
            const oldMatchRegex = new RegExp(`(// @match\\s+)\\*://${oldDomain.replace(/\./g, '\\.')}/\\*`, 'g');

            if (oldMatchRegex.test(headerContent)) {
                // 使用捕获组 $1 保持原本的这部分字符串 (包含 // @match 和后面的空格)
                const newMatchLine = `$1*://${newDomain}/*`;
                headerContent = headerContent.replace(oldMatchRegex, newMatchLine);
                fs.writeFileSync(headerTxtPath, headerContent);
                console.log(color.green(t('modifyTranslation.headerTxtUpdated')));
            } else {
                console.log(color.yellow(t('modifyTranslation.headerNotUpdated')));
            }
        }

        console.log('\n' + color.bold(color.lightGreen(t('modifyTranslation.modificationSuccess'))));

    } catch (error) {
        console.error(color.red(t('modifyTranslation.modificationError', error.message)));
        console.warn(color.yellow(t('modifyTranslation.inconsistentState')));
    }
}

export default handleModifyTranslation;
