// 导入 Node.js 内置模块
import fs from 'fs/promises';
import path from 'path';

// 导入本地模块
import { color } from '../../lib/colors.js';

/**
 * @file build-tasks/tasks/translation/update-translation-files.js
 * @description
 * 此任务负责为所有现有的翻译文件添加新的属性（description、testUrl、createdAt）。
 */

/**
 * @function updateTranslationFiles
 * @description 为所有现有的翻译文件添加新的属性
 * @returns {Promise<void>}
 */
async function updateTranslationFiles() {
  console.log(color.bold(color.cyan('🔄 开始更新翻译文件...')));
  
  const translationsDir = path.join(process.cwd(), 'src', 'translations');
  
  try {
    // 获取所有翻译文件
    const files = (await fs.readdir(translationsDir)).filter(file => 
      file.endsWith('.js') && file !== 'index.js'
    );
    
    let updatedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(translationsDir, file);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        // 提取域名（从文件名中）
        const domain = file.replace('.js', '');
        
        // 检查是否已经包含新属性
        if (content.includes('description:') && content.includes('testUrl:') && content.includes('createdAt:')) {
          console.log(color.dim(`  -> ${file} 已包含新属性，跳过`));
          continue;
        }
        
        // 解析文件内容，提取导出的变量名
        const exportMatch = content.match(/export\s+const\s+(\w+)\s*=/);
        if (!exportMatch) {
          console.log(color.yellow(`  -> ${file} 未找到导出变量，跳过`));
          continue;
        }
        const variableName = exportMatch[1];
        
        // 生成新属性
        const newProperties = `  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 ${domain} 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: '',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-09-21',`;
        
        // 在导出对象的开始位置插入新属性
        const updatedContent = content.replace(
          /export\s+const\s+\w+\s*=\s*{/,
          `export const ${variableName} = {
${newProperties}`
        );
        
        // 写入更新后的内容
        await fs.writeFile(filePath, updatedContent, 'utf-8');
        console.log(color.green(`  -> ${file} 更新成功`));
        updatedCount++;
      } catch (error) {
        console.error(color.red(`  -> 更新 ${file} 时出错: ${error.message}`));
      }
    }
    
    console.log(color.bold(color.green(`\n✅ 完成！共更新了 ${updatedCount} 个翻译文件。`)));
  } catch (error) {
    console.error(color.red('❌ 更新翻译文件时出错:'), error);
  }
}

export default updateTranslationFiles;