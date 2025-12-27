/**
 * @file build-tasks/tasks/statistics.js
 * @description
 * 负责生成和显示项目翻译统计数据的功能模块。
 * 该模块会扫描所有翻译文件，聚合数据，并提供一个三层交互式菜单
 * 来展示按语言分类的全局统计和按网站分类的详细统计。
 *
 * @module statistics
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import { color } from '../../lib/colors.js';
import { t } from '../../lib/terminal-i18n.js';
import { getSupportedLanguages } from '../../lib/terminal-i18n.js';
import { pressAnyKeyToContinue } from '../../lib/utils.js';

// 获取当前模块的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TRANSLATIONS_DIR = path.resolve(__dirname, '../../../src/translations');

/**
 * @async
 * @function calculateStatistics
 * @description 扫描所有翻译文件并计算统计数据。
 * @returns {Promise<object>} 一个包含所有统计数据的对象。
 */
async function calculateStatistics() {
  const stats = {};
  try {
    const languageDirs = await fs.readdir(TRANSLATIONS_DIR, { withFileTypes: true });
    for (const langDir of languageDirs) {
      if (langDir.isDirectory()) {
        const langCode = langDir.name;
        stats[langCode] = { totalRules: 0, totalConfigs: 0, totalWebsites: 0, websites: {} };
        const langPath = path.join(TRANSLATIONS_DIR, langCode, 'sites');
        let websiteFiles = [];
        try {
          websiteFiles = await fs.readdir(langPath);
        } catch (e) {
          // 如果 sites 目录不存在，忽略
          continue;
        }
        for (const file of websiteFiles) {
          if (file.endsWith('.js')) {
            const websiteName = file.replace('.js', '');
            try {
              const modulePath = `file://${path.join(langPath, file)}?v=${Date.now()}`;
              const translationModule = await import(modulePath);
              const translationData = Object.values(translationModule)[0];
              if (translationData && typeof translationData === 'object') {
                const textRulesCount = translationData.textRules?.length || 0;
                const regexRulesCount = translationData.regexRules?.length || 0;
                const customAttributesCount = translationData.customAttributes?.length || 0;
                const blockedElementsCount = translationData.blockedElements?.length || 0;
                const blockedAttributesCount = translationData.blockedAttributes?.length || 0;
                const extendedElementsCount = translationData.extendedElements?.length || 0;

                const totalRules = textRulesCount + regexRulesCount;
                const totalConfigs = customAttributesCount + blockedElementsCount + blockedAttributesCount + extendedElementsCount;

                stats[langCode].websites[websiteName] = {
                  textRules: textRulesCount,
                  regexRules: regexRulesCount,
                  customAttributes: customAttributesCount,
                  blockedElements: blockedElementsCount,
                  blockedAttributes: blockedAttributesCount,
                  extendedElements: extendedElementsCount,
                  totalRules: totalRules,
                  totalConfigs: totalConfigs,
                };
                stats[langCode].totalRules += totalRules;
                stats[langCode].totalConfigs += totalConfigs;
                stats[langCode].totalWebsites += 1;
              }
            } catch (error) {
              console.error(color.red(t('statistics.errorProcessingFile', file)), error);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(color.red(t('statistics.errorReadingDir')), error);
  }
  return stats;
}

/**
 * @function formatLanguageChoice
 * @description 格式化第一层（语言选择）的菜单项文本，确保对齐。
 */
function formatLanguageChoice(langCode, langStats, langName, maxWebsiteWidth, maxRulesWidth, maxConfigsWidth) {
  const name = langName ? `${langName} (${langCode})` : langCode;
  const websiteText = t('statistics.websiteCount', langStats.totalWebsites).padEnd(maxWebsiteWidth);
  const rulesText = t('statistics.totalRules', langStats.totalRules).padEnd(maxRulesWidth);
  const configsText = t('statistics.totalConfigs', langStats.totalConfigs).padEnd(maxConfigsWidth);
  return `🌐 ${name.padEnd(20)} · ${websiteText} · ${rulesText} · ${configsText}`;
}

/**
 * @function formatWebsiteChoice
 * @description 格式化第二层（网站选择）的菜单项文本，确保对齐。
 */
function formatWebsiteChoice(websiteName, websiteStats, maxRulesWidth, maxConfigsWidth) {
  const rulesText = t('statistics.totalRules', websiteStats.totalRules).padEnd(maxRulesWidth);
  const configsText = t('statistics.totalConfigs', websiteStats.totalConfigs).padEnd(maxConfigsWidth);
  return `📁 ${websiteName.padEnd(25)} · ${rulesText} · ${configsText}`;
}


/**
 * 计算字符串在终端中的显示宽度。
 * CJK (中日韩) 字符通常占用2个单元格宽度，而拉丁字符等占用1个。
 * @param {string} str - 需要计算宽度的字符串。
 * @returns {number} 字符串的显示宽度。
 */
function getDisplayWidth(str) {
  let width = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // CJK字符范围 + 全角字符范围
    if (
      (charCode >= 0x4e00 && charCode <= 0x9fff) ||
      (charCode >= 0x3000 && charCode <= 0x303f) ||
      (charCode >= 0xff00 && charCode <= 0xffef)
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}


/**
 * @async
 * @function handleLanguageSelection
 * @description 处理第二层菜单：选择网站。
 */
async function handleLanguageSelection(langCode, langStats, langName) {
  while (true) {
    console.clear();
    const websites = Object.entries(langStats.websites);
    const maxRulesWidth = Math.max(...websites.map(([, stats]) => t('statistics.totalRules', stats.totalRules).length));
    const maxConfigsWidth = Math.max(...websites.map(([, stats]) => t('statistics.totalConfigs', stats.totalConfigs).length));

    const { website } = await inquirer.prompt([{
      type: 'list',
      name: 'website',
      message: t('statistics.selectWebsite', langName),
      prefix: '✨',
      choices: [
        ...websites.map(([name, stats]) => ({
          name: formatWebsiteChoice(name, stats, maxRulesWidth, maxConfigsWidth),
          value: name,
        })),
        new inquirer.Separator('---------------------------'),
        { name: t('statistics.back'), value: '__back__' },
      ],
      pageSize: 25,
    }]);

    if (website === '__back__') return;

    await handleWebsiteSelection(website, langStats.websites[website], langName);
  }
}

/**
 * @async
 * @function handleWebsiteSelection
 * @description 处理第三层：显示详细信息，并确保文本对齐。
 */
async function handleWebsiteSelection(websiteName, websiteStats, langName) {
  console.clear();
  const title = color.bold(color.cyan(`📊 [${t('statistics.details')}] ${websiteName} - ${langName}`));
  console.log(title);
  console.log(color.dim('--------------------------------------------------'));

  const statsToDisplay = [
    { label: t('statistics.textRules'), value: websiteStats.textRules, unit: t('statistics.rulesUnit') },
    { label: t('statistics.regexRules'), value: websiteStats.regexRules, unit: t('statistics.rulesUnit') },
    { label: t('statistics.customAttributes'), value: websiteStats.customAttributes, unit: t('statistics.configUnit') },
    { label: t('statistics.blockedElements'), value: websiteStats.blockedElements, unit: t('statistics.configUnit') },
    { label: t('statistics.blockedAttributes'), value: websiteStats.blockedAttributes, unit: t('statistics.configUnit') },
    { label: t('statistics.extendedElements'), value: websiteStats.extendedElements, unit: t('statistics.configUnit') },
  ];

  // 分组
  const ruleStats = statsToDisplay.slice(0, 2);
  const configStats = statsToDisplay.slice(2);

  // 计算最大标签宽度以实现对齐
  const maxLabelWidth = Math.max(...statsToDisplay.map(stat => getDisplayWidth(stat.label)));

  console.log(`- ${t('statistics.rulesTitle')}:`);
  ruleStats.forEach(stat => {
    const padding = ' '.repeat(maxLabelWidth - getDisplayWidth(stat.label));
    console.log(`    ${stat.label}${padding}: ${stat.value} ${stat.unit}`);
  });

  console.log(`- ${t('statistics.configTitle')}:`);
  configStats.forEach(stat => {
    const padding = ' '.repeat(maxLabelWidth - getDisplayWidth(stat.label));
    console.log(`    ${stat.label}${padding}: ${stat.value} ${stat.unit}`);
  });

  await pressAnyKeyToContinue();
}


/**
 * @async
 * @function handleStatistics
 * @description 主函数，启动并管理统计信息的交互式菜单。
 */
export default async function handleStatistics() {
  const stats = await calculateStatistics();
  const supportedLanguages = getSupportedLanguages();

  while (true) {
    console.clear();
    const languages = Object.entries(stats);
    if (languages.length === 0) {
      console.log(color.yellow(t('statistics.noData')));
      await pressAnyKeyToContinue();
      return;
    }

    const maxWebsiteWidth = Math.max(...languages.map(([, stats]) => t('statistics.websiteCount', stats.totalWebsites).length));
    const maxRulesWidth = Math.max(...languages.map(([, stats]) => t('statistics.totalRules', stats.totalRules).length));
    const maxConfigsWidth = Math.max(...languages.map(([, stats]) => t('statistics.totalConfigs', stats.totalConfigs).length));

    const { language } = await inquirer.prompt([{
      type: 'list',
      name: 'language',
      message: t('statistics.selectLanguage'),
      prefix: '✨',
      choices: [
        ...languages.map(([code, langStats]) => {
          const langInfo = supportedLanguages.find(l => l.code === code);
          return {
            name: formatLanguageChoice(code, langStats, langInfo?.name, maxWebsiteWidth, maxRulesWidth, maxConfigsWidth),
            value: code,
          };
        }),
        new inquirer.Separator('--------------------------------------------------'),
        { name: t('menu.exit'), value: '__exit__' },
      ],
      pageSize: 25,
    }]);

    if (language === '__exit__') return;

    const langInfo = supportedLanguages.find(l => l.code === language);
    await handleLanguageSelection(language, stats[language], langInfo?.name || language);
  }
}
