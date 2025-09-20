#!/usr/bin/env node

/**
 * 诊断脚本 - 检查管理界面设置
 */

import fs from 'fs/promises';
import path from 'path';

const projectRoot = process.cwd();
const managerUIPath = path.join(projectRoot, 'manager-ui');
const translationsPath = path.join(projectRoot, 'src', 'translations');

console.log('🔍 诊断管理界面设置...\n');

async function diagnose() {
  const checks = [
    {
      name: '项目根目录',
      path: projectRoot,
      expected: 'Qing_Web-Translate-Script 目录'
    },
    {
      name: '管理界面目录',
      path: managerUIPath,
      expected: 'manager-ui 目录'
    },
    {
      name: '翻译文件目录',
      path: translationsPath,
      expected: 'src/translations 目录'
    },
    {
      name: '后端服务器文件',
      path: path.join(managerUIPath, 'backend', 'server.js'),
      expected: 'server.js 文件'
    },
    {
      name: '前端源码目录',
      path: path.join(managerUIPath, 'frontend', 'src'),
      expected: 'frontend/src 目录'
    }
  ];

  let allPassed = true;

  for (const check of checks) {
    try {
      await fs.access(check.path);
      console.log(`✅ ${check.name}: ${check.path}`);
    } catch (error) {
      console.log(`❌ ${check.name}: ${check.path} (未找到)`);
      allPassed = false;
    }
  }

  console.log('\n📊 依赖检查:');
  
  // 检查后端依赖
  const backendNodeModules = path.join(managerUIPath, 'node_modules');
  try {
    await fs.access(backendNodeModules);
    console.log('✅ 后端依赖已安装');
  } catch {
    console.log('❌ 后端依赖未安装 (运行: cd manager-ui && npm install)');
    allPassed = false;
  }

  // 检查前端依赖
  const frontendNodeModules = path.join(managerUIPath, 'frontend', 'node_modules');
  try {
    await fs.access(frontendNodeModules);
    console.log('✅ 前端依赖已安装');
  } catch {
    console.log('❌ 前端依赖未安装 (运行: cd manager-ui/frontend && npm install)');
    allPassed = false;
  }

  console.log('\n🎯 翻译文件检查:');
  try {
    const files = await fs.readdir(translationsPath);
    const jsFiles = files.filter(f => f.endsWith('.js'));
    console.log(`✅ 找到 ${jsFiles.length} 个翻译文件:`);
    jsFiles.forEach(file => console.log(`   - ${file}`));
  } catch (error) {
    console.log('❌ 无法读取翻译文件目录');
    allPassed = false;
  }

  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 所有检查通过！可以启动管理界面');
    console.log('\n启动命令:');
    console.log('  node build.js  (然后选择浏览器模式)');
    console.log('  或');
    console.log('  cd manager-ui && node setup.js');
  } else {
    console.log('⚠️  发现问题，请根据上述提示修复后重试');
  }
}

diagnose().catch(console.error);