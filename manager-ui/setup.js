#!/usr/bin/env node

/**
 * 管理界面设置和启动脚本
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const managerUIPath = process.cwd();
const frontendPath = path.join(managerUIPath, 'frontend');
const projectRoot = path.dirname(managerUIPath); // 获取项目根目录

// 设置环境变量供后端使用
process.env.PROJECT_ROOT = projectRoot;

console.log('🚀 正在设置翻译管理器...\n');

async function setup() {
  try {
    // 检查是否已安装依赖
    const backendNodeModules = path.join(managerUIPath, 'node_modules');
    const frontendNodeModules = path.join(frontendPath, 'node_modules');
    
    const [backendExists, frontendExists] = await Promise.all([
      fs.access(backendNodeModules).then(() => true).catch(() => false),
      fs.access(frontendNodeModules).then(() => true).catch(() => false)
    ]);
    
    if (!backendExists) {
      console.log('📦 安装后端依赖...');
      await runCommand('npm', ['install'], managerUIPath);
      console.log('✅ 后端依赖安装完成\n');
    }
    
    if (!frontendExists) {
      console.log('📦 安装前端依赖...');
      await runCommand('npm', ['install'], frontendPath);
      console.log('✅ 前端依赖安装完成\n');
    }
    
    console.log('🎉 设置完成！正在启动开发服务器...\n');
    
    // 启动开发服务器，设置工作目录为项目根目录
    const child = spawn('npm', ['run', 'dev'], {
      cwd: managerUIPath,
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PROJECT_ROOT: projectRoot // 确保环境变量传递给子进程
      }
    });
    
    console.log('🌐 管理界面: http://localhost:5173');
    console.log('🔌 API服务: http://localhost:3001');
    console.log('\n按 Ctrl+C 停止服务器\n');
    
    // 处理进程退出
    process.on('SIGINT', () => {
      console.log('\n🛑 正在停止服务器...');
      child.kill('SIGINT');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ 设置失败:', error.message);
    process.exit(1);
  }
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`命令执行失败，退出码: ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

setup();