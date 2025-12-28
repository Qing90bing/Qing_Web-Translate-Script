// 导入第三方库
import inquirer from 'inquirer';

// 导入本地模块
import { color } from '../../lib/colors.js';
import { t, setCurrentLanguage, getSupportedLanguages, getCurrentLanguageCode, addLanguage } from '../../lib/terminal-i18n.js';

/**
 * @file build-tasks/tasks/terminal-language.js
 * @description
 * 此任务提供一个交互式的子菜单，专门用于管理终端工具的语言设置。
 * 用户可以从中选择切换当前语言或添加新的语言支持。
 */

/**
 * @function handleTerminalLanguage
 * @description 显示并处理"终端工具语言设置"的子菜单。
 * @returns {Promise<void>}
 */
async function handleTerminalLanguage() {
  // 进入一个无限循环，以保持子菜单的持续显示，直到用户选择退出。
  while (true) {
    console.clear();
    const title = color.bold(color.cyan(t('terminalLanguage.title')));
    const separator = color.dim(t('terminalLanguage.separator'));
    console.log(separator);
    console.log(title);
    console.log(separator);

    // 获取当前语言和所有支持的语言
    const currentLanguageCode = getCurrentLanguageCode();
    const supportedLanguages = getSupportedLanguages();

    // 获取当前语言的详细信息
    const currentLanguage = supportedLanguages.find(lang => lang.code === currentLanguageCode);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: t('terminalLanguage.selectAction'),
        prefix: '✨',
        choices: [
          new inquirer.Separator(currentLanguage ? t('terminalLanguage.currentLanguage', `${currentLanguage.name} (${currentLanguage.code})`) : t('terminalLanguage.currentLanguage', currentLanguageCode)),
          new inquirer.Separator('──────────────────────────────────────────────'),
          { name: t('terminalLanguage.switch'), value: 'switch' },
          { name: t('terminalLanguage.add'), value: 'add' },
          { name: t('terminalLanguage.list'), value: 'list' },
          new inquirer.Separator('──────────────────────────────────────────────'),
          { name: t('terminalLanguage.back'), value: 'back' },
        ],
        pageSize: 20, // 增加 pageSize 选项以显示更多行
      },
    ]);

    // 根据用户的选择，执行相应的操作。
    switch (action) {
      case 'switch':
        await handleSwitchLanguage();
        break;
      case 'add':
        await handleAddLanguage();
        break;
      case 'list':
        await handleListLanguages();
        break;
      case 'back':
        // 如果用户选择返回，则通过 return 语句退出无限循环，从而回到 build.js 的主菜单。
        return;
    }
  }
}

/**
 * @function handleSwitchLanguage
 * @description 处理语言切换操作
 * @returns {Promise<void>}
 */
async function handleSwitchLanguage() {
  const supportedLanguages = getSupportedLanguages();
  const currentLanguageCode = getCurrentLanguageCode();

  // 创建语言选择列表 - 只在当前语言显示对勾，其他语言不显示图标
  const languageChoices = supportedLanguages.map(lang => ({
    name: `${lang.code === currentLanguageCode ? '✅' : '  '} ${lang.name} (${lang.code})`,
    value: lang.code
  }));

  languageChoices.push(new inquirer.Separator('──────────────────────────────────────────────'));
  languageChoices.push({ name: t('terminalLanguage.back'), value: 'back' });

  const { languageCode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'languageCode',
      message: t('terminalLanguage.selectLanguage'),
      prefix: '🌍',
      choices: languageChoices,
      pageSize: 20,
    },
  ]);

  if (languageCode !== 'back') {
    setCurrentLanguage(languageCode);
    console.log(color.green(t('terminalLanguage.languageSwitched', languageCode)));

    // 还原"请选择操作:"提示
    await inquirer.prompt([
      {
        type: 'list',
        name: 'back',
        message: t('terminalLanguage.selectAction'),
        choices: [
          { name: t('terminalLanguage.back'), value: 'back' },
        ],
      },
    ]);
  }
}

/**
 * @function handleAddLanguage
 * @description 处理添加新语言操作
 * @returns {Promise<void>}
 */
async function handleAddLanguage() {
  console.log(color.cyan(t('terminalLanguage.enterLanguageCode')));

  const { languageCode } = await inquirer.prompt([
    {
      type: 'input',
      name: 'languageCode',
      message: t('terminalLanguage.promptLanguageCode'),
      prefix: '🔤',
      validate: (input) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return t('terminalLanguage.languageCodeCannotBeEmpty');
        }
        if (trimmed.length < 2) {
          return t('terminalLanguage.languageCodeTooShort');
        }
        return true;
      },
    },
  ]);

  const { languageName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'languageName',
      message: t('terminalLanguage.promptLanguageName'),
      prefix: '🏷️',
      validate: (input) => {
        const trimmed = input.trim();
        if (!trimmed) {
          return t('terminalLanguage.languageNameCannotBeEmpty');
        }
        if (trimmed.length < 2) {
          return t('terminalLanguage.languageNameTooShort');
        }
        return true;
      },
    },
  ]);

  const code = languageCode.trim();
  const name = languageName.trim();

  // 确认添加
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: t('terminalLanguage.confirmAddLanguage', name, code),
      prefix: '❓',
      default: true,
    },
  ]);

  if (confirm) {
    if (addLanguage(code, name)) {
      console.log(color.green(t('terminalLanguage.languageAdded', name, code)));
      console.log(color.cyan(t('terminalLanguage.nextStep')));
      console.log(color.cyan(t('terminalLanguage.filePath', code)));
    } else {
      console.log(color.red(t('terminalLanguage.languageAddFailed')));
    }

    // 还原"请选择操作:"提示
    await inquirer.prompt([
      {
        type: 'list',
        name: 'back',
        message: t('terminalLanguage.selectAction'),
        choices: [
          new inquirer.Separator('──────────────────────────────────────────────'),
          { name: t('terminalLanguage.back'), value: 'back' },
        ],
      },
    ]);
  }
}

/**
 * @function handleListLanguages
 * @description 显示所有支持的语言列表
 * @returns {Promise<void>}
 */
async function handleListLanguages() {
  const supportedLanguages = getSupportedLanguages();
  const currentLanguageCode = getCurrentLanguageCode();

  console.clear();
  const title = color.bold(color.cyan(t('terminalLanguage.allLanguagesTitle')));
  const separator = color.dim(t('terminalLanguage.separator'));
  console.log(separator);
  console.log(title);
  console.log(separator);

  console.log(`\n${t('terminalLanguage.currentLanguageIndicator', color.green(currentLanguageCode))}\n`);

  console.log(t('terminalLanguage.languageList'));
  supportedLanguages.forEach((lang, index) => {
    const isCurrent = lang.code === currentLanguageCode;
    // 所有语言都显示地球图标
    console.log(t('terminalLanguage.languageItem', index + 1, lang.name, lang.code, isCurrent ? t('terminalLanguage.currentIndicator') : ''));
  });

  // 还原"请选择操作:"提示
  await inquirer.prompt([
    {
      type: 'list',
      name: 'back',
      message: t('terminalLanguage.selectAction'),
      choices: [
        new inquirer.Separator('──────────────────────────────────────────────'),
        { name: t('terminalLanguage.back'), value: 'back' },
      ],
    },
  ]);
}

export default handleTerminalLanguage;