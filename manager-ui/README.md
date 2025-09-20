# 翻译管理器

浏览器端翻译管理工具，为 Qing Web Translate Script 项目提供可视化管理界面。

## 🌟 特性

- **双入口设计** - 保留原有终端工具，新增浏览器界面
- **完整的 CRUD** - 翻译文件的增删改查
- **可视化编辑** - 表格形式编辑翻译规则
- **检查与修复** - 集成原有的检查脚本
- **项目操作** - 构建和排序功能
- **帮助管理** - 图文帮助内容管理
- **响应式设计** - 支持桌面和移动设备
- **主题切换** - 日间/夜间模式

## 🏗️ 架构

```
manager-ui/
├── backend/          # Express.js 后端
│   ├── core/         # 核心逻辑模块
│   ├── routes/       # API 路由
│   └── server.js     # 服务器入口
├── frontend/         # Svelte 前端
│   └── src/
│       ├── components/   # 组件
│       ├── stores/       # 状态管理
│       ├── lib/          # 工具函数
│       └── routes/       # 路由
└── public/           # 静态资源
```

## 📦 技术栈

### 后端
- **Express.js** - Web 服务器框架
- **fs-extra** - 文件系统操作
- **multer** - 文件上传处理
- **cors** - 跨域资源共享

### 前端
- **Svelte** - 前端框架
- **SvelteKit** - 全栈框架
- **Vite** - 构建工具
- **Font Awesome** - 图标库

## 🚀 快速开始

### 1. 自动启动（推荐）

```bash
# 在项目根目录运行
node build.js
# 选择 "🌐 浏览器模式"
```

### 2. 手动启动

```bash
cd manager-ui
node setup.js
```

### 3. 访问管理界面

在浏览器中打开 http://localhost:5173

## 🔧 故障排除

### 常见问题

#### 1. "加载翻译文件失败"

**原因**：后端服务器工作目录不正确

**解决方案**：
```bash
# 运行诊断脚本
cd manager-ui
node diagnose.js

# 或者确保从正确的目录启动
cd /path/to/Qing_Web-Translate-Script
node build.js
```

#### 2. 控制台信息过多

**解决方案**：等待服务器启动完成，会显示清晰的访问地址

#### 3. 端口被占用

```bash
# 查找占用端口的进程
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# 停止进程或重启终端
```

### 诊断工具

```bash
# 运行完整诊断
cd manager-ui
node diagnose.js
```

这个命令会检查：
- 目录结构是否正确
- 依赖是否安装
- 翻译文件是否存在
- 配置是否正确

## 📋 API 接口

### 翻译文件管理
- `GET /api/translations` - 获取所有翻译文件
- `GET /api/translations/:filename` - 获取单个文件内容
- `POST /api/translations` - 创建新文件
- `PUT /api/translations/:filename` - 更新文件
- `DELETE /api/translations/:filename` - 删除文件

### 检查与修复
- `POST /api/checks/:type` - 运行指定检查
- `POST /api/checks/batch` - 批量运行检查
- `GET /api/checks/types` - 获取检查类型

### 项目操作
- `POST /api/operations/build` - 构建项目
- `POST /api/operations/sort` - 排序翻译
- `GET /api/operations/types` - 获取操作类型

### 帮助管理
- `GET /api/help` - 获取帮助内容
- `PUT /api/help/:section` - 更新帮助内容
- `POST /api/help/upload` - 上传图片

## 🔧 开发指南

### 目录结构说明

#### 后端核心模块 (`backend/core/`)
- `translation-core.js` - 翻译文件管理逻辑
- `validation-core.js` - 检查验证逻辑
- `build-core.js` - 构建操作逻辑

#### 前端组件 (`frontend/src/components/`)
- `Sidebar.svelte` - 左侧导航栏
- `FileList.svelte` - 文件列表管理
- `Editor.svelte` - 翻译规则编辑器
- `Actions.svelte` - 检查和操作界面
- `HelpManager.svelte` - 帮助内容管理

#### 状态管理 (`frontend/src/stores/`)
- `app.js` - 应用状态
- `theme.js` - 主题管理

### 添加新功能

1. **后端 API**：在 `backend/routes/` 添加路由
2. **前端组件**：在 `frontend/src/components/` 添加组件
3. **API 调用**：在 `frontend/src/lib/api.js` 添加接口函数

### 样式系统

使用 CSS 变量实现主题切换：

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1e293b;
  --accent-color: #3b82f6;
}

[data-theme="dark"] {
  --bg-primary: #0f172a;
  --text-primary: #f1f5f9;
  --accent-color: #60a5fa;
}
```

## 🛠️ 构建与部署

### 开发构建
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

ISC License