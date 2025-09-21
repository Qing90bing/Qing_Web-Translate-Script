// 导入 Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 导入本地模块
import { color } from '../../lib/colors.js';

/**
 * @file build-tasks/tasks/translation/update-translation-files.js
 * @description
 * 此任务负责为所有现有的翻译文件添加 enabled 属性。
 */

/**
 * @function updateTranslationFiles
 * @description 为所有翻译文件添加 enabled 属性
 * @returns {Promise<void>}
 */
async function updateTranslationFiles() {
  console.log(color.bold(color.cyan('✨ 开始更新翻译文件...')));
  
  const translationsDir = path.join(process.cwd(), 'src', 'translations');
  
  // 获取所有翻译文件（排除 index.js）
  let files;
  try {
    files = fs.readdirSync(translationsDir).filter(file => file.endsWith('.js') && file !== 'index.js');
  } catch (error) {
    console.error(color.red('❌ 读取翻译文件目录时出错:'), error);
    return;
  }

  if (files.length === 0) {
    console.log(color.yellow('目前没有可更新的翻译文件。'));
    return;
  }

  let updatedCount = 0;
  
  // 遍历所有翻译文件
  for (const file of files) {
    const filePath = path.join(translationsDir, file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // 检查是否已经包含 enabled 属性
      if (content.includes('enabled:')) {
        console.log(color.dim(`  -> ${file} 已包含 enabled 属性，跳过`));
        continue;
      }
      
      // 在 createdAt 属性后添加 enabled 属性
      const enabledProperty = '\n  // 启用状态：控制此翻译配置是否启用\n  enabled: true,';
      content = content.replace(/(createdAt:\s*'[^']*',?)/, `$1${enabledProperty}`);
      
      // 写入更新后的内容
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(color.green(`  -> ✅ 已更新: ${file}`));
      updatedCount++;
    } catch (error) {
      console.error(color.red(`  -> ❌ 更新文件 ${file} 时出错: ${error.message}`));
    }
  }
  
  console.log(color.bold(color.lightGreen(`\n🎉 更新完成！共更新了 ${updatedCount} 个翻译文件。`)));
}

export default updateTranslationFiles;