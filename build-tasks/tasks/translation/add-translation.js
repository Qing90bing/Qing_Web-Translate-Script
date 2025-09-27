// 导入 Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../../lib/colors.js';
import { t } from '../../lib/terminal-i18n.js';
import { SUPPORTED_LANGUAGES } from '../../../src/config/languages.js';

/**
 * @file build-tasks/tasks/translation/add-translation.js
 * @description
 * 此任务负责引导用户添加一个新的网站翻译配置文件。
 * 这是一个具有事务性的复杂操作，包含多个步骤：
 * 1. 提示用户输入域名，并进行有效性验证（格式、是否已存在）。
 * 2. 根据域名生成一个包含标准模板的新翻译文件（`.js`）。
 * 3. 自动更新 `src/translations/index.js`，以导入并注册新的翻译模块。
 * 4. 自动更新 `src/header.txt`，为油猴脚本添加新的 `@match` 指令。
 * 5. **具备回滚能力**: 如果在更新 `index.js` 或 `header.txt` 的过程中发生任何错误，
 *    脚本会自动撤销所有已做的更改（删除新创建的文件，恢复被修改文件的原始内容），
 *    以确保项目状态的一致性。
 */

/**
 * @function toCamelCase
 * @description 将域名字符串（如 "example.com"）转换为驼峰式命名（如 "exampleCom"），
 * 以便用作有效的 JavaScript 变量名。
 * @param {string} domain - 要转换的域名。
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
 * @function handleAddNewTranslation
 * @description 处理添加新翻译文件的主要函数。
 * @returns {Promise<void>}
 */
async function handleAddNewTranslation() {
  // --- 步骤 1: 提示用户选择语言 ---
  // 动态生成语言选择列表
  const languageChoices = SUPPORTED_LANGUAGES.map(lang => ({
    name: `${lang.name} (${lang.code}) ${lang.flag}`, 
    value: lang.code
  }));
  
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: t('manageTranslations.selectLanguage'),
      prefix: '🌐',
      choices: [
        ...languageChoices,
        new inquirer.Separator(),
        { name: t('manageTranslationsMenu.back'), value: 'back' }
      ]
    }
  ]);
  
  // 如果用户选择返回，直接退出函数
  if (language === 'back') {
    console.log(color.dim(t('manageTranslations.creationCancelled')));
    return;
  }
  
  // --- 步骤 2: 提示用户输入并验证域名 ---
  const { domain } = await inquirer.prompt([
    {
      type: 'input',
      name: 'domain',
      message: t('manageTranslations.enterDomain'),
      prefix: '🌐',
      validate: (input) => {
        const trimmedInput = input.trim();
        if (!trimmedInput) {
          return t('manageTranslations.domainCannotBeEmpty');
        }

        const fileName = `${trimmedInput}.js`;
        const filePath = path.join(process.cwd(), 'src', 'translations', language, fileName);

        if (fs.existsSync(filePath)) {
          return t('manageTranslations.fileAlreadyExists', color.yellow(fileName));
        }
        
        // 简单的域名格式校验
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(trimmedInput)) {
          return t('manageTranslations.invalidDomainFormat');
        }

        return true;
      },
    },
  ]);

  // 如果用户按ESC或输入back并确认，直接退出函数
  if (!domain || domain.toLowerCase() === 'back') {
    console.log(color.dim(t('manageTranslations.creationCancelled')));
    return;
  }

  const trimmedDomain = domain.trim();
  const fileName = `${trimmedDomain}.js`;
  // 修改变量名生成方式，包含语言标识以确保唯一性
  const variableName = toCamelCase(trimmedDomain, language);

  console.log(t('manageTranslations.creatingFile', color.yellow(t('manageTranslations.languageLabel')), language, color.yellow(t('manageTranslations.fileNameLabel')), fileName, color.yellow(t('manageTranslations.variableNameLabel')), variableName));
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'list',
      name: 'confirm',
      message: t('manageTranslations.confirmCreation'),
      choices: [
        { name: t('manageTranslationsMenu.add'), value: true },
        { name: t('manageTranslations.creationCancelled'), value: false }
      ],
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(color.yellow(t('manageTranslations.creationCancelled')));
    return;
  }

  // --- 步骤 3: 创建新的翻译文件 ---
  const filePath = path.join(process.cwd(), 'src', 'translations', language, fileName);
  // 获取当前日期
  const currentDate = new Date().toISOString().split('T')[0];

  // --- 动态加载模板 ---
  let template;
  try {
    // Node.js 的动态 import() 需要文件 URL 或绝对路径。
    // 我们将使用 path.resolve 来获取模板文件的绝对路径。
    const templateFileName = `${language}.js`;
    const templatePath = path.resolve(process.cwd(), 'build-tasks/tasks/translation/templates', templateFileName);
    const defaultTemplatePath = path.resolve(process.cwd(), 'build-tasks/tasks/translation/templates', 'en.js');

    let finalPath;
    // 检查特定语言的模板是否存在
    if (fs.existsSync(templatePath)) {
      finalPath = templatePath;
    } else {
      // 如果不存在，则回退到默认的英文模板
      console.log(color.dim(`未找到语言 "${language}" 的模板，将使用默认的 "en" 模板。`));
      finalPath = defaultTemplatePath;
    }

    // 动态导入模板模块。必须使用 'file://' 协议前缀。
    const templateModule = await import(`file://${finalPath}`);
    template = templateModule.getTemplate(trimmedDomain, variableName, currentDate, language);

  } catch (error) {
    console.error(color.red(`加载模板时出错: ${error.message}`));
    return; // 如果模板加载失败，则中止操作
  }

  try {
    // 确保语言目录存在
    const langDir = path.join(process.cwd(), 'src', 'translations', language);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, template);
    console.log(color.green(t('manageTranslations.fileCreated', color.yellow(filePath))));
  } catch (error) {
    console.error(color.red(t('manageTranslations.fileCreationError', error.message)));
    return;
  }
  
  // --- 步骤 4: 更新 index.js 和 header.txt (事务性操作) ---
  const indexJsPath = path.join(process.cwd(), 'src', 'translations', 'index.js');
  const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');
  let originalIndexJsContent, originalHeaderTxtContent;

  try {
    // 在修改前，先读取并保存原始文件内容，以便在发生错误时能够回滚。
    originalIndexJsContent = fs.readFileSync(indexJsPath, 'utf-8');
    originalHeaderTxtContent = fs.readFileSync(headerTxtPath, 'utf-8');
    
    // --- 4a. 更新 index.js ---
    let indexJsContent = originalIndexJsContent;
    // 构造新的 import 语句，包含语言标识以确保唯一性。
    const importStatement = `import { ${variableName} } from './${language}/${fileName}';\n`;
    // 找到最后一个 'import' 语句的位置，在其后插入新的 import，以保持代码整洁。
    const lastImportIndex = indexJsContent.lastIndexOf('import');
    const nextLineIndexAfterLastImport = indexJsContent.indexOf('\n', lastImportIndex);
    indexJsContent = 
      indexJsContent.slice(0, nextLineIndexAfterLastImport + 1) + 
      importStatement + 
      indexJsContent.slice(nextLineIndexAfterLastImport + 1);

    // 找到 `masterTranslationMap` 对象的结束括号 `}`，在其前插入新的翻译条目。
    const lastBraceIndex = indexJsContent.lastIndexOf('}');
    if (lastBraceIndex === -1) {
        throw new Error(t('sortTranslations.exportNotFound'));
    }
    // 这是一个小技巧，用于判断是否需要在新条目前加一个换行符，以维持代码格式。
    const precedingChar = indexJsContent.substring(lastBraceIndex - 1, lastBraceIndex).trim();
    const needsNewline = precedingChar === ',';
    // 在域名后添加语言标识以确保唯一性
    const mapEntry = `${needsNewline ? '\n' : ''}  "${trimmedDomain}#${language}": ${variableName},\n`;
    
    indexJsContent = 
        indexJsContent.slice(0, lastBraceIndex) +
        mapEntry +
        indexJsContent.slice(lastBraceIndex);

    fs.writeFileSync(indexJsPath, indexJsContent);
    console.log(color.green(t('manageTranslations.indexJsUpdatedSuccess', color.yellow(indexJsPath))));

    // --- 4b. 更新 header.txt ---
    let headerTxtContent = originalHeaderTxtContent;
    // 构造新的 @match 指令。
    const matchDirective = `// @match        *://${trimmedDomain}/*\n`;
    // 检查是否已存在相同的@match指令
    if (!headerTxtContent.includes(matchDirective.trim())) {
      // 找到最后一个 '// @match' 指令，在其后插入新指令，以保持指令的分组。
      const lastMatchIndex = headerTxtContent.lastIndexOf('// @match');
      const nextLineIndexAfterLastMatch = headerTxtContent.indexOf('\n', lastMatchIndex);
      headerTxtContent = 
        headerTxtContent.slice(0, nextLineIndexAfterLastMatch + 1) +
        matchDirective +
        headerTxtContent.slice(nextLineIndexAfterLastMatch + 1);
        
      fs.writeFileSync(headerTxtPath, headerTxtContent);
      console.log(color.green(t('manageTranslations.headerTxtUpdatedSuccess', color.yellow(headerTxtPath))));
    } else {
      console.log(color.yellow(t('manageTranslations.headerAlreadyExists', color.yellow(trimmedDomain))));
    }
  } catch (error) {
    console.error(color.red(t('manageTranslations.indexJsUpdateError', error.message)));
    
    // --- 自动回滚 ---
    // 这是关键的容错机制。如果在 try 块中的任何文件操作失败，
    // catch 块会立即执行，将所有被修改的文件恢复到其原始状态，并删除新创建的文件。
    console.log(color.yellow(t('manageTranslations.rollingBack')));
    if (originalIndexJsContent) {
      fs.writeFileSync(indexJsPath, originalIndexJsContent);
      console.log(color.yellow(t('manageTranslations.fileRestored', indexJsPath)));
    }
    if (originalHeaderTxtContent) {
      fs.writeFileSync(headerTxtPath, originalHeaderTxtContent);
      console.log(color.yellow(t('manageTranslations.fileRestored', headerTxtPath)));
    }
    // 使用 unlinkSync 确保即使在错误处理中也能可靠地删除文件。
    try {
      fs.unlinkSync(filePath); 
      console.log(color.yellow(t('manageTranslations.fileDeleted', fileName)));
    } catch (unlinkError) {
      // 文件可能不存在，忽略错误
    }
    return;
  }
}

export default handleAddNewTranslation;








