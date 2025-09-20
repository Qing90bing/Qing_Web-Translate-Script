/**
 * @file manager-ui/backend/core/build-core.js
 * @description 构建功能的核心逻辑模块(与inquirer解耦)
 */

import esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';

/**
 * 执行完整构建项目
 */
export async function buildProject(options = {}) {
  const { preserveFormatting = false } = options;

  try {
    // 使用 esbuild 执行打包
    const result = await esbuild.build({
      entryPoints: [path.resolve(process.cwd(), 'src/main.js')],
      bundle: true,
      write: false,
      charset: 'utf8',
      minify: false,
    });

    // 读取头部信息
    const header = await fs.readFile(path.resolve(process.cwd(), 'src/header.txt'), 'utf-8');

    // 从 esbuild 的打包结果中获取代码文本
    let bundledCode = result.outputFiles[0].text;
    let finalScript;

    if (preserveFormatting) {
      // 保留格式，直接使用 Prettier 格式化代码
      const formattedCode = await prettier.format(bundledCode, {
        parser: 'babel',
        semi: true,
        singleQuote: true,
        printWidth: 9999,
      });
      finalScript = `${header}\n\n${formattedCode}`;
    } else {
      // 不保留格式，移除注释和多余空行
      bundledCode = bundledCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
      let formattedCode = await prettier.format(bundledCode, {
        parser: 'babel', 
        semi: true, 
        singleQuote: true, 
        printWidth: 9999,
      });
      formattedCode = formattedCode.replace(/^\s*[\r\n]/gm, '');
      finalScript = `${header}\n\n${formattedCode}`;
    }

    // 确保 dist 目录存在
    const distDir = path.resolve(process.cwd(), 'dist');
    await fs.mkdir(distDir, { recursive: true });
    const outputPath = path.join(distDir, 'Web-Translate-Script.user.js');
    
    // 写入最终脚本
    await fs.writeFile(outputPath, finalScript);

    return {
      success: true,
      message: '构建成功！',
      outputPath,
      preserveFormatting
    };

  } catch (error) {
    // 处理 esbuild 错误
    if (error.errors && error.errors.length > 0) {
      return {
        success: false,
        message: 'esbuild 构建失败',
        errors: error.errors.map(e => ({
          text: e.text,
          location: e.location ? {
            file: e.location.file,
            line: e.location.line,
            column: e.location.column
          } : null
        }))
      };
    } else {
      return {
        success: false,
        message: '构建过程中发生未知错误',
        error: error.message
      };
    }
  }
}

/**
 * 对翻译文件进行排序
 */
export async function sortTranslations() {
  try {
    const translationsDir = path.resolve(process.cwd(), 'src', 'translations');
    const files = await fs.readdir(translationsDir);
    
    const translationFiles = files
      .filter(file => file.endsWith('.js') && file !== 'index.js');

    let totalSorted = 0;
    const results = [];

    for (const file of translationFiles) {
      const filePath = path.join(translationsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      
      const sortedContent = await sortFileRules(content);
      
      if (sortedContent !== content) {
        await fs.writeFile(filePath, sortedContent);
        totalSorted++;
        results.push({
          file,
          sorted: true,
          message: '已排序'
        });
      } else {
        results.push({
          file,
          sorted: false,
          message: '无需排序'
        });
      }
    }

    return {
      success: true,
      message: `排序完成，共处理 ${translationFiles.length} 个文件，其中 ${totalSorted} 个文件被排序`,
      totalFiles: translationFiles.length,
      sortedFiles: totalSorted,
      results
    };

  } catch (error) {
    return {
      success: false,
      message: '排序过程中发生错误',
      error: error.message
    };
  }
}

/**
 * 对单个文件的规则进行排序
 */
async function sortFileRules(content) {
  try {
    // 简化的排序逻辑，主要对 textRules 和 regexRules 数组进行排序
    // 实际实现可能需要更复杂的AST解析
    
    // 找到并排序 textRules
    const textRulesRegex = /(textRules:\s*\[)([\s\S]*?)(\n\s*\])/;
    const textRulesMatch = content.match(textRulesRegex);
    
    if (textRulesMatch) {
      const rulesContent = textRulesMatch[2];
      const sortedRules = sortRulesContent(rulesContent);
      content = content.replace(textRulesRegex, `$1${sortedRules}$3`);
    }

    // 找到并排序 regexRules
    const regexRulesRegex = /(regexRules:\s*\[)([\s\S]*?)(\n\s*\])/;
    const regexRulesMatch = content.match(regexRulesRegex);
    
    if (regexRulesMatch) {
      const rulesContent = regexRulesMatch[2];
      const sortedRules = sortRulesContent(rulesContent);
      content = content.replace(regexRulesRegex, `$1${sortedRules}$3`);
    }

    return content;
  } catch (error) {
    console.warn('排序文件时出错:', error);
    return content; // 如果排序失败，返回原内容
  }
}

/**
 * 对规则内容进行排序
 */
function sortRulesContent(rulesContent) {
  try {
    // 解析规则行
    const lines = rulesContent.split('\n');
    const rules = [];
    let currentRule = '';
    let inRule = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('[')) {
        if (currentRule) {
          rules.push(currentRule);
        }
        currentRule = line;
        inRule = true;
      } else if (inRule && trimmedLine.endsWith('],')) {
        currentRule += '\n' + line;
        rules.push(currentRule);
        currentRule = '';
        inRule = false;
      } else if (inRule) {
        currentRule += '\n' + line;
      } else if (trimmedLine === '' || trimmedLine.startsWith('//')) {
        // 保留空行和注释
        if (!inRule) {
          rules.push(line);
        }
      }
    }

    if (currentRule) {
      rules.push(currentRule);
    }

    // 分离注释/空行和实际规则
    const comments = [];
    const actualRules = [];

    for (const rule of rules) {
      if (rule.trim().startsWith('//') || rule.trim() === '') {
        comments.push(rule);
      } else if (rule.trim().startsWith('[')) {
        actualRules.push(rule);
      }
    }

    // 对实际规则按字母顺序排序
    actualRules.sort((a, b) => {
      const aText = extractFirstString(a);
      const bText = extractFirstString(b);
      return aText.localeCompare(bText, 'zh-CN');
    });

    // 重新组合：注释在前，然后是排序后的规则
    const result = [...comments, ...actualRules];
    
    return result.join('\n');
  } catch (error) {
    console.warn('解析规则内容时出错:', error);
    return rulesContent;
  }
}

/**
 * 从规则中提取第一个字符串用于排序
 */
function extractFirstString(rule) {
  try {
    const match = rule.match(/\[\s*["'`]([^"'`]+)["'`]/);
    return match ? match[1] : rule;
  } catch (error) {
    return rule;
  }
}