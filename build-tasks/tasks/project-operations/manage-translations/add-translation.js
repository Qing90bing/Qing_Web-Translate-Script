/**
 * @file build-tasks/tasks/translation/add-translation.js
 * @description
 * 此任务脚本负责引导用户以交互方式添加一个新的网站翻译配置文件。
 * 这是一个具有事务性的复杂操作，旨在确保操作的原子性（要么全部成功，要么全部回滚）。
 *
 * **核心工作流程**:
 * 1. **选择语言**: 提示用户从支持的语言列表中选择要为哪个语言版本添加翻译。
 * 2. **输入域名**: 提示用户输入目标网站的域名，并进行有效性验证（格式检查、是否已存在对应的翻译文件）。
 * 3. **生成配置**: 根据域名和语言生成一个符合JS变量命名规范的驼峰式名称（例如 `google.com` 在 `zh-CN` 下会生成 `googleComZhCN`）。
 * 4. **创建翻译文件**: 基于所选语言的模板（如果存在）或默认的英文模板，在 `src/translations/{语言代码}/` 目录下创建一个新的翻译文件（`.js`）。
 * 5. **自动更新索引**: 自动修改 `src/translations/index.js` 文件，添加 `import` 语句以导入新的翻译模块，并在主映射中注册它。
 * 6. **自动更新脚本头**: 自动修改 `src/header.txt` 文件，为油猴脚本添加一个新的 `@match` 指令，使脚本能在新网站上运行。
 * 7. **具备回滚能力**: 整个过程（从创建文件到修改索引和脚本头）被设计成一个事务。如果在任何一步发生错误，脚本会自动撤销所有已做的更改（删除新创建的文件，恢复被修改文件的原始内容），以保证项目状态的完整性和一致性。
 */

// 导入 Node.js 内置的文件系统和路径处理模块
import fs from 'fs';
import path from 'path';

// 导入第三方库 `inquirer`，用于创建交互式的命令行界面。
import inquirer from 'inquirer';

// 导入本地的辅助模块和配置
import { color } from '../../../lib/colors.js'; // 用于在终端输出带颜色的文本
import { t } from '../../../lib/terminal-i18n.js'; // 国际化函数，用于显示多语言文本
import { SUPPORTED_LANGUAGES } from '../../../../src/config/languages.js'; // 支持的语言列表

/**
 * @function toCamelCase
 * @description 将域名字符串（如 "example.com"）和语言代码（如 "zh-CN"）转换为一个唯一的驼峰式命名（如 "exampleComZhCN"）。
 * 这个函数确保生成的名称是有效的 JavaScript 变量名，并且通过附加语言标识来避免不同语言版本下的命名冲突。
 * @param {string} domain - 要转换的域名。
 * @param {string} [language=''] - 语言代码，可选。
 * @returns {string} 转换后的驼峰式命名的字符串。
 */
function toCamelCase(domain, language = '') {
  // 将域名中的 `.` 替换为空格，然后利用正则表达式和回调函数将每个单词的首字母大写（除了第一个单词）。
  let result = domain.replace(/\./g, ' ').replace(/(?:^|\s)\w/g, (match, index) => {
    return index === 0 ? match.toLowerCase().trim() : match.toUpperCase().trim();
  }).replace(/\s+/g, ''); // 移除所有空格

  // 如果提供了语言标识，则将其附加到变量名后面以确保唯一性。
  if (language) {
    // 将语言标识（如 "zh-CN"）也转换为驼峰式命名的大写后缀（如 "ZhCn"）。
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
 * @description 处理添加新翻译文件的主要交互流程和文件操作。
 * @returns {Promise<void>}
 */
async function handleAddNewTranslation() {
  // --- 步骤 1: 提示用户选择语言 ---
  // 根据配置文件动态生成语言选择列表，包含国旗以增强可读性。
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
        new inquirer.Separator(), // 添加分隔线
        { name: t('manageTranslationsMenu.back'), value: 'back' } // 提供返回选项
      ]
    }
  ]);

  // 如果用户选择返回，则取消操作并退出。
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
      // `validate` 函数在用户输入时实时执行，提供即时反馈。
      validate: (input) => {
        const trimmedInput = input.trim();
        if (!trimmedInput) {
          return t('manageTranslations.domainCannotBeEmpty');
        }

        // 检查对应的翻译文件是否已存在。
        const fileName = `${trimmedInput}.js`;
        // 修改：检查 sites 子目录
        const filePath = path.join(process.cwd(), 'src', 'translations', language, 'sites', fileName);

        if (fs.existsSync(filePath)) {
          return t('manageTranslations.fileAlreadyExists', color.yellow(fileName));
        }

        // 使用正则表达式对域名格式进行简单校验。
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(trimmedInput)) {
          return t('manageTranslations.invalidDomainFormat');
        }

        return true; // 验证通过
      },
    },
  ]);

  // 如果用户在输入阶段取消（例如按 ESC），则退出。
  if (!domain || domain.toLowerCase() === 'back') {
    console.log(color.dim(t('manageTranslations.creationCancelled')));
    return;
  }

  const trimmedDomain = domain.trim();
  const fileName = `${trimmedDomain}.js`;
  // 根据域名和语言生成唯一的驼峰式变量名。
  const variableName = toCamelCase(trimmedDomain, language);

  console.log(t('manageTranslations.creatingFile', color.yellow(t('manageTranslations.languageLabel')), language, color.yellow(t('manageTranslations.fileNameLabel')), fileName, color.yellow(t('manageTranslations.variableNameLabel')), variableName));

  // 最终确认
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
  // 修改：文件路径指向 sites 子目录
  const sitesDir = path.join(process.cwd(), 'src', 'translations', language, 'sites');
  const filePath = path.join(sitesDir, fileName);
  const currentDate = new Date().toISOString().split('T')[0]; // 获取 YYYY-MM-DD 格式的当前日期

  // --- 动态加载模板 ---
  let template;
  try {
    // Node.js 的动态 import() 需要文件 URL 或绝对路径。
    // 我们将使用 path.resolve 来获取模板文件的绝对路径。
    const templateFileName = `${language}.js`;
    const templatePath = path.resolve(process.cwd(), 'build-tasks/tasks/project-operations/manage-translations/templates', templateFileName);
    const defaultTemplatePath = path.resolve(process.cwd(), 'build-tasks/tasks/project-operations/manage-translations/templates', 'en-us.js');

    let finalPath;
    // 检查是否存在特定语言的模板文件。
    if (fs.existsSync(templatePath)) {
      finalPath = templatePath;
    } else {
      // 如果不存在，则回退到默认的英文模板，并告知用户。
      console.log(color.dim(`未找到语言 "${language}" 的模板，将使用默认的 "en-us" 模板。`));
      finalPath = defaultTemplatePath;
    }

    // 动态导入模板模块。必须使用 'file://' 协议前缀来处理绝对路径。
    const templateModule = await import(`file://${finalPath}`);
    // 调用模板模块中的 `getTemplate` 函数来生成文件内容。
    template = templateModule.getTemplate(trimmedDomain, variableName, currentDate, language);

  } catch (error) {
    console.error(color.red(`加载模板时出错: ${error.message}`));
    return; // 如果模板加载失败，则中止操作
  }

  try {
    // 在写入文件前，确保目标语言的 sites 目录存在。
    if (!fs.existsSync(sitesDir)) {
      fs.mkdirSync(sitesDir, { recursive: true });
    }

    // 将生成的模板内容写入新文件。
    fs.writeFileSync(filePath, template);
    console.log(color.green(t('manageTranslations.fileCreated', color.yellow(filePath))));
  } catch (error) {
    console.error(color.red(t('manageTranslations.fileCreationError', error.message)));
    return;
  }

  // --- 步骤 4: 更新 index.js 和 header.txt (事务性操作) ---
  // 修改：只更新当前语言的 index.js
  const indexJsPath = path.join(process.cwd(), 'src', 'translations', language, 'index.js');
  const headerTxtPath = path.join(process.cwd(), 'src', 'header.txt');
  let originalIndexJsContent, originalHeaderTxtContent;

  try {
    // **事务开始**: 在修改前，先读取并缓存原始文件内容。
    // 这是实现回滚的关键步骤。
    if (fs.existsSync(indexJsPath)) {
      originalIndexJsContent = fs.readFileSync(indexJsPath, 'utf-8');
    } else {
      // 如果 index.js 不存在（这是可能的，如果是全新的语言），我们需要创建一个基础结构
      // 但这里简化处理，假设 index.js 应该已经由其它过程初始化，或者我们在下面处理
      console.error(color.red(`Error: Index file not found at ${indexJsPath}`));
      return;
    }

    originalHeaderTxtContent = fs.readFileSync(headerTxtPath, 'utf-8');

    // --- 4a. 更新 index.js ---
    let indexJsContent = originalIndexJsContent;
    // 构造新的 import 语句。修改：路径改为相对 sites 目录
    const importStatement = `import { ${variableName} } from './sites/${fileName}';\n`;

    // 找到最后一个 'import' 语句的位置，在其后插入新的 import，以保持代码整洁。
    const lastImportIndex = indexJsContent.lastIndexOf('import');

    if (lastImportIndex !== -1) {
      const nextLineIndexAfterLastImport = indexJsContent.indexOf('\n', lastImportIndex);
      indexJsContent =
        indexJsContent.slice(0, nextLineIndexAfterLastImport + 1) +
        importStatement +
        indexJsContent.slice(nextLineIndexAfterLastImport + 1);
    } else {
      // 如果没有 import，则在文件开头添加
      indexJsContent = importStatement + '\n' + indexJsContent;
    }

    // 找到 `export const xxxTranslations = {` 对象的结束括号 `}`
    // 注意：这里假设文件末尾只有一个主要的导出对象
    const lastBraceIndex = indexJsContent.lastIndexOf('}');
    if (lastBraceIndex === -1) {
      throw new Error(t('sortTranslations.exportNotFound'));
    }
    // 这是一个小技巧，用于判断是否需要在新条目前加一个换行符，以维持代码格式。
    const precedingChar = indexJsContent.substring(lastBraceIndex - 1, lastBraceIndex).trim();
    const needsNewline = precedingChar === ',';
    // 在主映射中使用 `域名#语言` 作为唯一键，以支持同一域名下的多语言版本。
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
    // 检查是否已存在相同的 @match 指令，避免重复添加。
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

    // --- **自动回滚** ---
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
      // 如果文件因某些原因本就未创建成功，删除会失败，这里忽略该错误。
    }
    return;
  }
}

export default handleAddNewTranslation;








