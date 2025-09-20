/**
 * @file manager-ui/backend/server.js
 * @description Express.js 后端服务器
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 导入路由
import translationRoutes from './routes/translations.js';
import checkRoutes from './routes/checks.js';
import operationRoutes from './routes/operations.js';
import helpRoutes from './routes/help.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 设置正确的工作目录
const projectRoot = process.env.PROJECT_ROOT || path.resolve(__dirname, '..', '..');
process.chdir(projectRoot);

console.log(`📍 项目根目录: ${projectRoot}`);
console.log(`📍 当前工作目录: ${process.cwd()}`);

const app = express();
const PORT = process.env.PORT || 3008; // 修改端口号为3008

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API 路由
app.use('/api/translations', translationRoutes);
app.use('/api/checks', checkRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/help', helpRoutes);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '翻译管理器后端运行正常',
    timestamp: new Date().toISOString()
  });
});

// 前端路由 - 为 SvelteKit 应用提供服务
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dist', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : '未知错误'
  });
});

// 启动服务器
app.listen(PORT, async () => {
  console.log(`🚀 翻译管理器后端服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 API 文档: http://localhost:${PORT}/api/health`);
  
  // 健康检查：验证翻译文件目录
  const translationsPath = path.join(process.cwd(), 'src', 'translations');
  try {
    const fs = await import('fs');
    await fs.promises.access(translationsPath);
    console.log(`✅ 翻译文件目录已找到: ${translationsPath}`);
  } catch (error) {
    console.warn(`⚠️  翻译文件目录未找到: ${translationsPath}`);
    console.warn('   这可能导致文件管理功能无法正常工作');
  }
});

export default app;