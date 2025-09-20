/**
 * @file manager-ui/backend/core/translation-core.js
 * @description 翻译文件管理的核心逻辑模块(与inquirer解耦)
 */

import fs from 'fs';
import path from 'path';

/**
 * 将域名转换为驼峰命名
 */
function toCamelCase(domain) {
  return domain.replace(/\./g, ' ').replace(/(?:^|\s)\w/g, (match, index) => {
    return index === 0 ? match.toLowerCase().trim() : match.toUpperCase().trim();
  }).replace(/\s+/g, '');
}

/**
 * 获取所有翻译文件列表（增强版，包含统计信息）
 */
export async function getTranslationFiles() {
  const translationsDir = path.join(process.cwd(), 'src', 'translations');
  const files = await fs.promises.readdir(translationsDir);
  
  const fileList = [];
  
  for (const file of files) {
    if (file.endsWith('.js') && file !== 'index.js') {
      const filePath = path.join(translationsDir, file);
      const stats = await fs.promises.stat(filePath);
      
      // 读取文件内容以计算规则数量
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const textRules = extractRules(content, 'textRules');
      const regexRules = extractRules(content, 'regexRules');
      
      fileList.push({
        name: file,
        domain: file.replace('.js', ''),
        path: filePath,
        size: stats.size,
        textRuleCount: textRules.length,
        regexRuleCount: regexRules.length,
        lastModified: stats.mtime
      });
    }
  }
  
  return fileList;
}

/**
 * 读取单个翻译文件内容（增强版，包含元数据）
 */
export async function getTranslationFile(filename) {
  const filePath = path.join(process.cwd(), 'src', 'translations', filename);
  
  console.log('尝试读取文件:', filePath);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`翻译文件 ${filename} 不存在`);
  }

  const content = await fs.promises.readFile(filePath, 'utf-8');
  console.log('文件内容长度:', content.length);
  
  // 解析文件内容并提取翻译规则
  const textRules = extractRules(content, 'textRules');
  const regexRules = extractRules(content, 'regexRules');
  const styles = extractRules(content, 'styles');
  const jsRules = extractRules(content, 'jsRules');
  
  // 提取元数据
  const description = extractMetadata(content, 'description') || `${filename.replace('.js', '')} 网站翻译配置`;
  const testUrl = extractMetadata(content, 'testUrl') || `https://${filename.replace('.js', '')}`;
  const creationDate = extractMetadata(content, 'creationDate') || '2024-01-01';
  
  console.log('解析结果:', {
    textRules: textRules.length,
    regexRules: regexRules.length,
    styles: styles.length,
    jsRules: jsRules.length,
    description,
    testUrl,
    creationDate
  });

  return {
    filename,
    domain: filename.replace('.js', ''),
    description,
    testUrl,
    creationDate,
    textRules,
    regexRules,
    styles,
    jsRules,
    rawContent: content
  };
}

/**
 * 从文件内容中提取特定规则
 */
function extractRules(content, ruleType) {
  try {
    // 使用正则表达式找到对应的规则部分
    const pattern = new RegExp(`${ruleType}\\s*:\\s*\\[(.*?)\\]`, 's');
    const match = content.match(pattern);
    
    if (!match || !match[1].trim()) {
      return [];
    }
    
    const rulesText = match[1].trim();
    
    // 如果只是注释，返回空数组
    if (rulesText.startsWith('//') || rulesText.includes('在这里添加')) {
      return [];
    }
    
    if (ruleType === 'textRules') {
      return parseTextRules(rulesText);
    } else if (ruleType === 'regexRules') {
      return parseRegexRules(rulesText);
    } else if (ruleType === 'styles') {
      return parseArrayRules(rulesText);
    } else if (ruleType === 'jsRules') {
      return parseArrayRules(rulesText);
    }
    
    return [];
  } catch (error) {
    console.error(`解析 ${ruleType} 时出错:`, error);
    return [];
  }
}

/**
 * 从文件内容中提取元数据字段
 */
function extractMetadata(content, fieldName) {
  try {
    // 匹配元数据字段，支持单引号和双引号
    const pattern = new RegExp(`${fieldName}\\s*:\\s*["']([^"']*)["']`, 'i');
    const match = content.match(pattern);
    return match ? match[1] : null;
  } catch (error) {
    console.error(`提取元数据 ${fieldName} 时出错:`, error);
    return null;
  }
}

/**
 * 解析纯文本规则
 */
function parseTextRules(rulesText) {
  const rules = [];
  // 匹配 ["source", "target"] 格式
  const rulePattern = /\[\s*["']([^"']+)["']\s*,\s*["']([^"']*)["']\s*\]/g;
  let match;
  
  while ((match = rulePattern.exec(rulesText)) !== null) {
    rules.push({
      source: match[1],
      target: match[2]
    });
  }
  
  return rules;
}

/**
 * 解析正则表达式规则
 */
function parseRegexRules(rulesText) {
  const rules = [];
  // 匹配 [/pattern/flags, "replacement"] 格式
  const rulePattern = /\[\s*\/([^\/]+)\/([gimuy]*)\s*,\s*["']([^"']*)["']\s*\]/g;
  let match;
  
  while ((match = rulePattern.exec(rulesText)) !== null) {
    rules.push({
      pattern: match[1],
      flags: match[2] || '',
      replacement: match[3]
    });
  }
  
  return rules;
}

/**
 * 解析数组规则（用于styles和jsRules）
 */
function parseArrayRules(rulesText) {
  const rules = [];
  // 匹配字符串数组元素
  const rulePattern = /["']([^"']*)["']/g;
  let match;
  
  while ((match = rulePattern.exec(rulesText)) !== null) {
    if (match[1].trim()) {
      rules.push(match[1]);
    }
  }
  
  return rules;
}

/**
 * 创建新的翻译文件
 */
export async function createTranslationFile(domain) {
  // 验证域名格式
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    throw new Error('请输入有效的域名格式');
  }

  const fileName = `${domain}.js`;
  const filePath = path.join(process.cwd(), 'src', 'translations', fileName);
  const variableName = toCamelCase(domain);

  // 检查文件是否已存在
  if (fs.existsSync(filePath)) {
    throw new Error(`翻译文件 ${fileName} 已存在`);
  }

  // 创建文件模板
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD格式
  const testUrl = `https://${domain}`; // 根据域名生成测试链接
  
  const template = `// 翻译目标网站: ${domain}

export const ${variableName} = {
  // === 文件元数据 ===
  // 文件描述
  description: "${domain} 网站翻译配置",
  
  // 测试链接 
  testUrl: "${testUrl}",
  
  // 创建日期
  creationDate: "${currentDate}",

  // === 翻译规则 ===
  // 样式 (CSS)
  styles: [],

  // 注入脚本 (JavaScript)
  jsRules: [],

  // 正则表达式翻译规则
  regexRules: [
    // 在这里添加正则表达式规则
  ],

  // 纯文本翻译规则
  textRules: [
    // 在这里添加纯文本规则
  ],
};
`;

  // 写入文件
  await fs.promises.writeFile(filePath, template);

  // 更新 index.js
  await updateIndexFile(domain, variableName, fileName);

  // 更新 header.txt
  await updateHeaderFile(domain);

  return { filename: fileName, domain, variableName };
}

/**
 * 更新翻译文件
 */
export async function updateTranslationFile(filename, data) {
  const filePath = path.join(process.cwd(), 'src', 'translations', filename);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`翻译文件 ${filename} 不存在`);
  }

  const domain = filename.replace('.js', '');
  const variableName = toCamelCase(domain);

  // 重新生成文件内容
  const newContent = generateFileContent(domain, variableName, data);
  
  await fs.promises.writeFile(filePath, newContent);
  
  return { success: true };
}

/**
 * 生成翻译文件内容（增强版，包含元数据）
 */
function generateFileContent(domain, variableName, data) {
  const { 
    textRules = [], 
    regexRules = [], 
    styles = [], 
    jsRules = [],
    description = `${domain} 网站翻译配置`,
    testUrl = `https://${domain}`,
    creationDate = new Date().toISOString().split('T')[0]
  } = data;

  // 生成 textRules 数组
  const textRulesStr = textRules.length > 0 
    ? textRules.map(rule => `    ["${rule.source}", "${rule.target}"]`).join(',\n')
    : '    // 在这里添加纯文本规则';

  // 生成 regexRules 数组
  const regexRulesStr = regexRules.length > 0
    ? regexRules.map(rule => `    [/${rule.pattern}/${rule.flags}, "${rule.replacement}"]`).join(',\n')
    : '    // 在这里添加正则表达式规则';

  // 生成 styles 数组
  const stylesStr = styles.length > 0
    ? styles.map(style => `    "${style}"`).join(',\n')
    : '';

  // 生成 jsRules 数组
  const jsRulesStr = jsRules.length > 0
    ? jsRules.map(rule => `    "${rule}"`).join(',\n')
    : '';

  return `// 翻译目标网站: ${domain}

export const ${variableName} = {
  // === 文件元数据 ===
  // 文件描述
  description: "${description}",
  
  // 测试链接 
  testUrl: "${testUrl}",
  
  // 创建日期
  creationDate: "${creationDate}",

  // === 翻译规则 ===
  // 样式 (CSS)
  styles: [
${stylesStr}
  ],

  // 注入脚本 (JavaScript)
  jsRules: [
${jsRulesStr}
  ],

  // 正则表达式翻译规则
  regexRules: [
${regexRulesStr}
  ],

  // 纯文本翻译规则
  textRules: [
${textRulesStr}
  ],
};
`;
}

/**
 * 删除翻译文件
 */
export async function deleteTranslationFile(filename) {
  const filePath = path.join(process.cwd(), 'src', 'translations', filename);
  const domain = filename.replace('.js', '');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`翻译文件 ${filename} 不存在`);
  }

  // 删除文件
  await fs.promises.unlink(filePath);

  // 从 index.js 中移除导入和映射
  await removeFromIndexFile(domain, filename);

  // 从 header.txt 中移除 @match 指令
  await removeFromHeaderFile(domain);

  return { success: true };
}

/**
 * 更新 index.js 文件
 */
async function updateIndexFile(domain, variableName, fileName) {
  const indexPath = path.join(process.cwd(), 'src', 'translations', 'index.js');
  let content = await fs.promises.readFile(indexPath, 'utf-8');

  // 添加 import 语句
  const importStatement = `import { ${variableName} } from './${fileName}';\n`;
  const lastImportIndex = content.lastIndexOf('import');
  const nextLineIndex = content.indexOf('\n', lastImportIndex);
  content = content.slice(0, nextLineIndex + 1) + importStatement + content.slice(nextLineIndex + 1);

  // 添加到 masterTranslationMap
  const lastBraceIndex = content.lastIndexOf('}');
  const mapEntry = `  "${domain}": ${variableName},\n`;
  content = content.slice(0, lastBraceIndex) + mapEntry + content.slice(lastBraceIndex);

  await fs.promises.writeFile(indexPath, content);
}

/**
 * 更新 header.txt 文件
 */
async function updateHeaderFile(domain) {
  const headerPath = path.join(process.cwd(), 'src', 'header.txt');
  let content = await fs.promises.readFile(headerPath, 'utf-8');

  // 添加 @match 指令
  const matchDirective = `// @match        *://${domain}/*\n`;
  const lastMatchIndex = content.lastIndexOf('// @match');
  const nextLineIndex = content.indexOf('\n', lastMatchIndex);
  content = content.slice(0, nextLineIndex + 1) + matchDirective + content.slice(nextLineIndex + 1);

  await fs.promises.writeFile(headerPath, content);
}

/**
 * 从 index.js 中移除条目
 */
async function removeFromIndexFile(domain, fileName) {
  const indexPath = path.join(process.cwd(), 'src', 'translations', 'index.js');
  let content = await fs.promises.readFile(indexPath, 'utf-8');

  // 移除 import 语句
  const importRegex = new RegExp(`import.*from\\s+['"]\\./${fileName.replace('.', '\\.')}['"];?\\n?`, 'g');
  content = content.replace(importRegex, '');

  // 移除映射条目
  const mapRegex = new RegExp(`\\s*["']${domain.replace('.', '\\.')}["']:\\s*\\w+,?\\n?`, 'g');
  content = content.replace(mapRegex, '');

  await fs.promises.writeFile(indexPath, content);
}

/**
 * 从 header.txt 中移除 @match 指令
 */
async function removeFromHeaderFile(domain) {
  const headerPath = path.join(process.cwd(), 'src', 'header.txt');
  let content = await fs.promises.readFile(headerPath, 'utf-8');

  // 移除对应的 @match 指令
  const matchRegex = new RegExp(`//\\s*@match\\s+\\*://${domain.replace('.', '\\.')}/*\\n?`, 'g');
  content = content.replace(matchRegex, '');

  await fs.promises.writeFile(headerPath, content);
}