# 翻译管理器技术文档

## 📋 目录
1. [项目概述](#项目概述)
2. [环境配置与安装](#环境配置与安装)
3. [系统架构详解](#系统架构详解)
4. [文件结构详解](#文件结构详解)
5. [主题系统配置](#主题系统配置)
6. [界面布局修改指南](#界面布局修改指南)
7. [组件定制指南](#组件定制指南)
8. [API接口文档](#api接口文档)
9. [翻译文件格式详解](#翻译文件格式详解)
10. [错误处理机制](#错误处理机制)
11. [性能优化指南](#性能优化指南)
12. [部署配置详解](#部署配置详解)
13. [代码规范与测试](#代码规范与测试)
14. [常见问题解决](#常见问题解决)
15. [开发调试指南](#开发调试指南)
16. [故障排除与日志分析](#故障排除与日志分析)

## 🛠️ 环境配置与安装

### 系统要求
- **Node.js**: >= 16.0.0
- **npm**: >= 8.0.0
- **操作系统**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 安装步骤

1. **克隆项目**:
```
git clone [repository-url]
cd Qing_Web-Translate-Script
```

2. **安装依赖**:
```bash
cd manager-ui
npm run install:all
```

3. **环境变量配置**:
创建 `.env` 文件（可选）:
``env
# 服务器配置
PORT=3001
NODE_ENV=development

# 前端配置
VITE_API_BASE_URL=http://localhost:3001/api

# 日志级别
LOG_LEVEL=debug
```

4. **启动开发服务器**:
```bash
# 方法一：使用自动化脚本（推荐）
npm run setup

# 方法二：手动启动
npm run dev

# 方法三：分别启动前后端
npm run dev:backend    # 端口 3001
npm run dev:frontend   # 端口 5173
```

### 验证安装

1. **检查后端服务**:
```bash
curl http://localhost:3001/api/health
# 预期响应: {"status":"ok","timestamp":"..."}
```

2. **检查前端服务**:
打开浏览器访问 `http://localhost:5173`

3. **检查翻译文件加载**:
点击“文件管理”，应该能看到现有的翻译文件列表

### 端口冲突解决

如果遇到 `EADDRINUSE` 错误：

```bash
# Windows
netstat -ano | findstr 3001
taskkill /F /PID <PID>

# macOS/Linux  
lsof -ti:3001 | xargs kill -9

# 或者修改端口
PORT=3002 npm run dev:backend
```

翻译管理器是一个基于浏览器的可视化翻译文件管理工具，支持：
- 翻译文件的CRUD操作
- 可视化编辑翻译规则
- 检查与修复功能
- 多主题支持
- 响应式设计

### 技术栈
- **前端**: Svelte + SvelteKit + Vite
- **后端**: Node.js + Express
- **样式**: 原生CSS + CSS变量
- **图标**: Font Awesome

## 🏗️ 系统架构

```
翻译管理器
├── 前端 (Svelte)
│   ├── 路由管理 (SvelteKit)
│   ├── 状态管理 (Svelte Stores)
│   └── 组件系统
└── 后端 (Express)
    ├── API路由
    ├── 文件解析
    └── 核心逻辑
```

## 📁 文件结构详解

### 前端文件结构
```
manager-ui/frontend/src/
├── routes/                    # 路由文件
│   ├── +layout.svelte        # 主布局
│   └── +page.svelte          # 主页面
├── components/               # 组件目录
│   ├── ui/                   # UI基础组件
│   │   ├── ThemeToggle.svelte    # 主题切换组件
│   │   └── NotificationCenter.svelte # 通知中心
│   ├── Sidebar.svelte        # 侧边栏
│   ├── MainContent.svelte    # 主内容区
│   ├── WelcomePage.svelte    # 欢迎页面
│   ├── FileList.svelte       # 文件列表
│   ├── Editor.svelte         # 编辑器
│   ├── Actions.svelte        # 操作页面
│   └── HelpManager.svelte    # 帮助管理
├── stores/                   # 状态管理
│   ├── app.js               # 应用状态
│   └── theme.js             # 主题状态
├── lib/                     # 工具库
│   └── api.js               # API接口
└── app.css                  # 全局样式
```

### 后端文件结构
```
manager-ui/backend/
├── routes/                   # API路由
│   ├── translations.js      # 翻译文件API
│   ├── checks.js            # 检查API
│   ├── operations.js        # 操作API
│   └── help.js              # 帮助API
├── core/                    # 核心逻辑
│   ├── translation-core.js  # 翻译文件处理
│   ├── check-core.js        # 检查逻辑
│   └── operation-core.js    # 操作逻辑
└── server.js                # 服务器入口
```

## 🎨 主题系统配置

### 主题变量定义
主题通过CSS变量实现，定义在各组件的JavaScript中：

```javascript
// 日间模式
root.style.setProperty('--bg-primary', '#ffffff');
root.style.setProperty('--bg-secondary', '#f8fafc');
root.style.setProperty('--text-primary', '#1e293b');
root.style.setProperty('--accent-color', '#2563eb'); // 活力蓝色

// 夜间模式  
root.style.setProperty('--bg-primary', '#1a1a1a');
root.style.setProperty('--bg-secondary', '#2d2d2d');
root.style.setProperty('--text-primary', '#ffffff');
root.style.setProperty('--accent-color', '#2563eb'); // 活力蓝色
```

### 修改主题色指南

1. **修改主题色**:
   - 文件位置: `src/components/ui/ThemeToggle.svelte`
   - 搜索: `--accent-color`
   - 替换为新颜色值

2. **添加新主题色**:
   ```javascript
   // 在 ThemeToggle.svelte 中添加
   root.style.setProperty('--custom-color', '#your-color');
   ```

3. **主题色使用位置**:
   - `ThemeToggle.svelte`: 主题切换逻辑
   - `Sidebar.svelte`: 侧边栏折叠按钮主题切换
   - `WelcomePage.svelte`: 欢迎页面渐变背景

## 🎛️ 界面布局修改指南

### 侧边栏宽度调整
**文件**: `src/components/Sidebar.svelte`
```css
.sidebar {
  width: 280px; /* 修改这里改变侧边栏宽度 */
}

.sidebar.collapsed {
  width: 80px;  /* 修改这里改变折叠后宽度 */
}
```

### 主内容区间距
**文件**: `src/components/Editor.svelte`
```css
.editor-content {
  padding: 2rem;        /* 修改内边距 */
  gap: 2.5rem;         /* 修改组件间距 */
}
```

### 表格列宽调整
**文件**: `src/components/Editor.svelte`
```
<!-- 纯文本规则表格 -->
<th width="40%">原文</th>     <!-- 调整原文列宽度 -->
<th width="40%">译文</th>     <!-- 调整译文列宽度 -->
<th width="20%">操作</th>     <!-- 调整操作列宽度 -->

<!-- 正则规则表格 -->
<th width="35%">正则模式</th>  <!-- 调整正则列宽度 -->
<th width="15%">标志</th>     <!-- 调整标志列宽度 -->
<th width="35%">替换文本</th>  <!-- 调整替换列宽度 -->
<th width="15%">操作</th>     <!-- 调整操作列宽度 -->
```

### 输入框样式调整
**文件**: `src/components/Editor.svelte`
```css
.table .input {
  min-width: 200px;    /* 最小宽度 */
  padding: 8px 12px;   /* 内边距 */
  border-radius: 4px;  /* 圆角 */
}
```

## 🧩 组件定制指南

### 1. 侧边栏菜单项修改

**文件**: `src/components/Sidebar.svelte`

```javascript
// 修改欢迎页面配置
const welcomeItem = {
  id: 'welcome',
  label: '欢迎页面',        // 修改显示文字
  icon: 'fas fa-home',     // 修改图标
  description: '开始使用', // 修改描述
  color: '#2563eb'        // 修改主题色
};

// 修改主要功能菜单
const menuItems = [
  {
    id: 'files',
    label: '文件管理',          // 修改显示文字
    icon: 'fas fa-folder-open', // 修改图标 
    description: '管理翻译文件', // 修改描述
    color: '#2563eb'           // 修改颜色
  }
  // ... 其他菜单项
];
```

### 2. 添加新菜单项

1. **在menuItems数组中添加**:
```javascript
{
  id: 'new-feature',           // 唯一ID
  label: '新功能',             // 显示名称
  icon: 'fas fa-star',         // Font Awesome图标
  description: '新功能描述',    // 描述文字
  color: '#10b981'            // 主题色
}
```

2. **在主页面添加对应组件**:
**文件**: `src/routes/+page.svelte`
```svelte
{#if activeView === 'new-feature'}
  <NewFeatureComponent />
{/if}
```

### 3. 折叠按钮位置调整

**文件**: `src/components/Sidebar.svelte`
```css
.collapse-btn {
  position: absolute;
  top: 20px;           /* 距离顶部距离 */
  right: -12px;        /* 距离右侧距离（负值表示突出） */
  width: 24px;         /* 按钮宽度 */
  height: 24px;        /* 按钮高度 */
}
```

### 4. 主题切换按钮样式

**文件**: `src/components/ui/ThemeToggle.svelte`
```css
.theme-button {
  padding: 8px 12px;        /* 内边距 */
  border-radius: 8px;       /* 圆角 */
  min-width: 140px;         /* 最小宽度 */
}

.dropdown-menu {
  border-radius: 12px;      /* 下拉菜单圆角 */
  margin-bottom: 4px;       /* 向上弹出的间距 */
}
```

## 🔍 翻译文件格式详解

### 支持的文件结构

```javascript
// 标准翻译文件格式
export const domainName = {
  // CSS 样式数组
  styles: [
    "body { color: red; }",
    ".class { background: blue; }"
  ],

  // JavaScript 脚本数组
  jsRules: [
    "console.log('Hello World');",
    "document.title = 'New Title';"
  ],

  // 正则表达式翻译规则
  regexRules: [
    [/Hello/i, "你好"],                    // 基本正则
    [/World/g, "世界"],                    // 全局匹配
    [/(\d+) days/gi, "$1 天"],              // 分组捕获
    [/Per person \/ month/i, "每人/月"]    // 复杂模式
  ],

  // 纯文本翻译规则  
  textRules: [
    ["Home", "首页"],
    ["About", "关于"],
    ["Contact", "联系我们"],
    ["Settings", "设置"]
  ]
};
```

### 解析器支持的格式变体

1. **引号支持**:
```javascript
textRules: [
  ['Home', '首页'],        // 单引号
  ["About", "关于"],       // 双引号
  ["Mixed", '混合']        // 混合使用
]
```

2. **多行格式**:
```javascript
regexRules: [
  [
    /very long pattern here/gi,
    "replacement text"
  ],
  [
    /another pattern/,
    "另一个替换"
  ]
]
```

3. **空值处理**:
```javascript
textRules: [
  ["", ""],           // 空值会被过滤
  ["Valid", "有效"]   // 正常值
]
```

### 文件解析逻辑

**解析流程**:
```
1. 读取文件内容
   ↓
2. 使用正则表达式提取各类型规则
   ↓
3. 根据类型使用不同解析器
   └── textRules → parseTextRules()
   └── regexRules → parseRegexRules()
   └── styles/jsRules → parseArrayRules()
   ↓
4. 返回结构化数据
```

**核心解析函数**:
```javascript
// 主解析函数
function extractRules(content, ruleType) {
  // 1. 使用正则找到对应规则区域
  const pattern = new RegExp(`${ruleType}\\s*:\\s*\\[(.*?)\\]`, 's');
  
  // 2. 过滤注释和空内容
  if (rulesText.startsWith('//') || rulesText.includes('在这里添加')) {
    return [];
  }
  
  // 3. 根据类型调用对应解析器
  switch(ruleType) {
    case 'textRules': return parseTextRules(rulesText);
    case 'regexRules': return parseRegexRules(rulesText);
    case 'styles':
    case 'jsRules': return parseArrayRules(rulesText);
  }
}

// 文本规则解析器
function parseTextRules(rulesText) {
  const rulePattern = /\[\s*["']([^"']+)["']\s*,\s*["']([^"']*)["']\s*\]/g;
  const rules = [];
  let match;
  
  while ((match = rulePattern.exec(rulesText)) !== null) {
    rules.push({ source: match[1], target: match[2] });
  }
  
  return rules;
}

// 正则规则解析器
function parseRegexRules(rulesText) {
  const rulePattern = /\[\s*\/([^\/]+)\/([gimuy]*)\s*,\s*["']([^"']*)["']\s*\]/g;
  const rules = [];
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
```

## 🔌 API接口文档

### 基础配置

**基础URL**: `http://localhost:3001/api`
**Content-Type**: `application/json`
**字符编码**: `UTF-8`

### 健康检查API

#### 检查服务状态
```http
GET /api/health
```

**响应示例**:
```
{
  "status": "ok",
  "timestamp": "2024-09-19T10:30:00.000Z",
  "version": "1.2.0",
  "uptime": 3600,
  "translationsDir": "/path/to/translations"
}
```

### 翻译文件管理API

#### 获取所有翻译文件
```http
GET /api/translations
```

**查询参数**:
- `domain` (可选): 过滤特定域名
- `format` (可选): 返回格式，默认为 `summary`

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "name": "claude.ai.js",
      "domain": "claude.ai",
      "path": "/src/translations/claude.ai.js",
      "size": 2048,
      "lastModified": "2024-09-19T08:15:30.000Z",
      "ruleCount": {
        "textRules": 15,
        "regexRules": 8,
        "styles": 3,
        "jsRules": 2
      }
    }
  ],
  "total": 1,
  "timestamp": "2024-09-19T10:30:00.000Z"
}
```

#### 获取单个翻译文件详情
```http
GET /api/translations/:filename
```

**路径参数**:
- `filename`: 文件名（需要URL编码）

**响应示例**:
```
{
  "success": true,
  "data": {
    "filename": "claude.ai.js",
    "domain": "claude.ai",
    "content": "// 完整文件内容...",
    "lastModified": "2024-09-19T08:15:30.000Z",
    "rules": {
      "textRules": [
        {
          "source": "Sign in",
          "target": "登录",
          "index": 0
        }
      ],
      "regexRules": [
        {
          "pattern": "\\b(\\d+)\\s+days?\\b",
          "flags": "gi",
          "replacement": "$1 天",
          "index": 0
        }
      ],
      "styles": [
        "body { font-family: 'Microsoft YaHei', sans-serif; }"
      ],
      "jsRules": [
        "console.log('Claude.ai 翻译脚本已加载');"
      ]
    }
  }
}
```

#### 更新翻译文件
```http
PUT /api/translations/:filename
```

**请求体**:
```json
{
  "textRules": [
    { "source": "Home", "target": "首页" },
    { "source": "About", "target": "关于" }
  ],
  "regexRules": [
    {
      "pattern": "\\b(\\d+)\\s+days?\\b",
      "flags": "gi",
      "replacement": "$1 天"
    }
  ],
  "styles": [
    "body { color: #333; }"
  ],
  "jsRules": [
    "document.title = 'Claude AI - 中文版';"
  ]
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "翻译文件更新成功",
  "data": {
    "filename": "claude.ai.js",
    "lastModified": "2024-09-19T10:35:00.000Z",
    "backup": "/backups/claude.ai.js.2024-09-19T10-35-00.bak"
  }
}
```

#### 创建新翻译文件
```http
POST /api/translations
```

**请求体**:
```json
{
  "filename": "example.com.js",
  "domain": "example.com",
  "textRules": [],
  "regexRules": [],
  "styles": [],
  "jsRules": []
}
```

#### 删除翻译文件
```http
DELETE /api/translations/:filename
```

**查询参数**:
- `backup` (可选): 是否创建备份，默认为 `true`

### 检查与修复API

#### 运行文件检查
```http
POST /api/check
```

**请求体**:
```json
{
  "files": ["claude.ai.js", "github.com.js"],
  "checks": ["syntax", "duplicates", "unused"],
  "options": {
    "strict": true,
    "autoFix": false
  }
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "file": "claude.ai.js",
        "status": "warning",
        "issues": [
          {
            "type": "duplicate",
            "severity": "warning",
            "message": "发现重复的翻译规则",
            "line": 15,
            "rule": { "source": "Home", "target": "首页" },
            "suggestions": ["移除重复项"]
          }
        ]
      }
    ],
    "summary": {
      "total": 1,
      "passed": 0,
      "warnings": 1,
      "errors": 0
    }
  }
}
```

#### 执行自动修复
```http
POST /api/fix
```

**请求体**:
```json
{
  "files": ["claude.ai.js"],
  "fixes": ["removeDuplicates", "formatCode"],
  "options": {
    "createBackup": true,
    "preview": false
  }
}
```

### 操作记录API

#### 获取操作历史
```http
GET /api/operations/history
```

**查询参数**:
- `limit`: 返回条数，默认50
- `offset`: 偏移量，默认0
- `type`: 操作类型过滤
- `file`: 文件名过滤

#### 回滚操作
```http
POST /api/operations/rollback
```

**请求体**:
```json
{
  "operationId": "op_1234567890",
  "targetFile": "claude.ai.js"
}
```

### 备份管理API

#### 获取备份列表
```http
GET /api/backups
```

#### 恢复备份
```http
POST /api/backups/restore
```

**请求体**:
```json
{
  "backupFile": "claude.ai.js.2024-09-19T10-35-00.bak",
  "targetFile": "claude.ai.js",
  "options": {
    "createBackup": true
  }
}
```

### 错误响应格式

所有API的错误响应遵循统一格式：

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": {
      "field": "filename",
      "issue": "文件名不能为空"
    }
  },
  "timestamp": "2024-09-19T10:30:00.000Z"
}
```

### 状态码说明

- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `409`: 资源冲突
- `422`: 请求格式正确但语义错误
- `500`: 服务器内部错误
- `503`: 服务不可用

### 文件解析逻辑

**文件**: `manager-ui/backend/core/translation-core.js`

解析器支持以下格式：

1. **纯文本规则**:
```javascript
textRules: [
  ["原文", "译文"],
  ["Hello", "你好"]
]
```

2. **正则规则**:
```javascript
regexRules: [
  [/pattern/flags, "replacement"],
  [/Hello/i, "你好"]
]
```

3. **样式和脚本**:
```javascript
styles: ["css代码"],
jsRules: ["javascript代码"]
```

## 🐛 常见问题解决

### 1. 编辑器显示"暂无规则"

**原因**: 文件解析失败
**解决方法**:
1. 检查后端日志中的解析结果
2. 确认翻译文件格式正确
3. 查看浏览器控制台的API响应

**调试步骤**:
```javascript
// 在 Editor.svelte 的 loadFileContent 函数中查看日志
console.log('API响应:', response);
console.log('解析到的数据:', data);
```

### 2. 后端服务器无法启动

**常见原因**:
- 端口3001被占用
- 项目根目录路径错误

**解决方法**:
```bash
# 查看端口占用
netstat -ano | findstr 3001

# 杀掉占用进程
taskkill /F /PID <PID>

# 重新启动
npm run dev:backend
```

### 3. 主题切换不生效

**原因**: CSS变量未正确设置
**解决方法**:
1. 检查 `ThemeToggle.svelte` 中的变量设置
2. 确认组件中使用了正确的CSS变量名
3. 查看浏览器开发者工具中的CSS变量值

### 4. 页面无法滚动

**原因**: 容器设置了 `overflow: hidden`
**解决方法**:
- 检查 `MainContent.svelte` 中的样式
- 确保设置了 `overflow-y: auto`

## 🔧 开发调试指南

### 启动开发环境

1. **启动完整开发环境**:
```bash
cd manager-ui
npm run dev
```

2. **分别启动前后端**:
```bash
# 启动后端
npm run dev:backend

# 启动前端  
npm run dev:frontend
```

### 调试技巧

1. **后端API调试**:
```javascript
// 在 translation-core.js 中添加日志
console.log('解析结果:', { textRules, regexRules });
```

2. **前端组件调试**:
```javascript
// 在 Editor.svelte 中添加日志
console.log('当前文件:', file);
console.log('加载的规则:', textRules);
```

3. **网络请求调试**:
- 打开浏览器开发者工具
- 查看 Network 标签页
- 检查API请求和响应

### 常用开发命令

```bash
# 安装依赖
npm run install:all

# 构建前端
npm run build

# 启动生产环境
npm start

# 代码格式化
npx prettier --write "**/*.{js,svelte,css,md}"
```

## 🚀 性能优化指南

### 前端性能优化

#### 1. 代码分割和懒加载
```javascript
// src/routes/+layout.js
export const load = async ({ url }) => {
  // 根据路由懒加载组件
  const components = {
    '/editor': () => import('../components/Editor.svelte'),
    '/settings': () => import('../components/Settings.svelte'),
    '/help': () => import('../components/HelpManager.svelte')
  };
  
  return {
    component: components[url.pathname]
  };
};
```

#### 2. 状态管理优化
```javascript
// src/lib/stores/translationStore.js
import { writable, derived } from 'svelte/store';

// 基础状态
export const translationFiles = writable([]);
export const selectedFile = writable(null);
export const searchQuery = writable('');

// 计算派生状态（避免不必要的重计算）
export const filteredFiles = derived(
  [translationFiles, searchQuery],
  ([$files, $query]) => {
    if (!$query) return $files;
    return $files.filter(file => 
      file.name.toLowerCase().includes($query.toLowerCase()) ||
      file.domain.toLowerCase().includes($query.toLowerCase())
    );
  }
);

// 缓存机制
const fileContentCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟

export function getCachedFileContent(filename) {
  const cached = fileContentCache.get(filename);
  
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return Promise.resolve(cached.data);
  }
  
  const promise = fetchFileContent(filename);
  fileContentCache.set(filename, {
    data: promise,
    timestamp: Date.now()
  });
  
  // 自动清理过期缓存
  setTimeout(() => {
    fileContentCache.delete(filename);
  }, CACHE_EXPIRY);
  
  return promise;
}

async function fetchFileContent(filename) {
  const response = await fetch(`/api/translations/${encodeURIComponent(filename)}`);
  return response.json();
}
```

#### 3. 虚拟滚动优化（用于大型文件列表）
```svelte
<!-- components/VirtualList.svelte -->
<script>
  export let items = [];
  export let itemHeight = 60;
  export let visibleCount = 15;
  
  let scrollTop = 0;
  let containerHeight = visibleCount * itemHeight;
  
  $: startIndex = Math.floor(scrollTop / itemHeight);
  $: endIndex = Math.min(startIndex + visibleCount + 5, items.length); // 预渲染5个额外项
  $: visibleItems = items.slice(startIndex, endIndex);
  $: offsetY = startIndex * itemHeight;
  $: totalHeight = items.length * itemHeight;
  
  function handleScroll(e) {
    scrollTop = e.target.scrollTop;
  }
</script>

<div 
  class="virtual-list" 
  style="height: {containerHeight}px; overflow-y: auto;"
  on:scroll={handleScroll}
>
  <div class="spacer" style="height: {totalHeight}px; position: relative;">
    <div class="visible-items" style="transform: translateY({offsetY}px);">
      {#each visibleItems as item, i (item.id || startIndex + i)}
        <div class="list-item" style="height: {itemHeight}px;">
          <slot {item} index={startIndex + i} />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .virtual-list {
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .spacer {
    position: relative;
  }
  
  .visible-items {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  
  .list-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
  }
</style>
```

#### 4. 防抖和节流优化
```javascript
// src/lib/utils/debounce.js
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用示例
// src/components/Editor.svelte
import { debounce } from '../lib/utils/debounce.js';

const debouncedSave = debounce(async (content) => {
  await saveFile(currentFile, content);
  addNotification('success', '文件已保存');
}, 1000);

// 在输入时调用
function handleInput(event) {
  const content = event.target.value;
  debouncedSave(content);
}
```

### 后端性能优化

#### 1. 文件系统缓存
```javascript
// backend/core/fileCache.js
class FileCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 5 * 60 * 1000; // 5分钟
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }
  
  async get(filePath) {
    const cached = this.cache.get(filePath);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      this.stats.hits++;
      return cached.data;
    }
    
    this.stats.misses++;
    
    // 读取文件并缓存
    try {
      const data = await fs.readFile(filePath, 'utf8');
      this.set(filePath, data);
      return data;
    } catch (error) {
      // 缓存错误结果（避免重复失败的文件读取）
      this.set(filePath, null, 30000); // 30秒错误缓存
      throw error;
    }
  }
  
  set(filePath, data, customTtl = null) {
    // LRU 清理：如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.stats.evictions++;
    }
    
    this.cache.set(filePath, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || this.ttl
    });
  }
  
  invalidate(filePath) {
    this.cache.delete(filePath);
  }
  
  clear() {
    this.cache.clear();
  }
  
  getStats() {
    const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses);
    return {
      ...this.stats,
      hitRate: isNaN(hitRate) ? 0 : hitRate,
      cacheSize: this.cache.size,
      maxSize: this.maxSize
    };
  }
}

export const fileCache = new FileCache({
  maxSize: 200,
  ttl: 10 * 60 * 1000 // 10分钟
});

// 使用文件监听器在文件改变时清理缓存
import chokidar from 'chokidar';

const watcher = chokidar.watch('../src/translations/**/*.js');
watcher.on('change', (filePath) => {
  fileCache.invalidate(filePath);
  console.log(`文件缓存已清理: ${filePath}`);
});
```

#### 2. 请求防抖和节流
```javascript
// backend/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// 不同API的不同限制策略
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000, // 每15分钟最多1000个请求
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: '请求过于频繁，请稍后再试'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: '请求过于频繁，请稍后再试',
        retryAfter: Math.round(req.rateLimit.resetTime / 1000)
      }
    });
  }
});

// 文件上传限制（更严格）
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 10, // 每分钟最多10次上传
  skipSuccessfulRequests: true, // 只计算失败的请求
  message: {
    success: false,
    error: {
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
      message: '上传过于频繁，请稍后再试'
    }
  }
});

// 健康检查API不限制
export const healthLimiter = rateLimit({
  windowMs: 1000, // 1秒
  max: 100, // 每秒100次（很宽松）
  skip: (req) => req.path === '/api/health'
});
```

#### 3. 响应压缩和缓存
```javascript
// backend/middleware/compression.js
import compression from 'compression';
import express from 'express';

// 响应压缩中间件
export const compressionMiddleware = compression({
  filter: (req, res) => {
    // 不压缩已经压缩的内容
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // 压缩所有可压缩的响应
    return compression.filter(req, res);
  },
  level: 6, // 压缩级别（1-9，6是平衡点）
  threshold: 1024, // 只压缩大于1KB的响应
});

// 静态资源缓存
export function staticCacheMiddleware(maxAge = '1d') {
  return express.static('frontend/dist', {
    maxAge,
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // 为不同类型的文件设置不同的缓存策略
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', `public, max-age=${60 * 60 * 24 * 30}`); // 30天
      }
    }
  });
}
```

#### 4. 数据库连接池优化（如果使用数据库）
```javascript
// backend/config/database.js
// 针对未来可能的数据库集成

const poolConfig = {
  // 连接池基本配置
  min: 2,                    // 最小连接数
  max: 20,                   // 最大连接数
  acquireTimeoutMillis: 60000,   // 获取连接超时时间
  idleTimeoutMillis: 600000,     // 空闲连接超时时间
  reapIntervalMillis: 1000,      // 清理空闲连接间隔
  createRetryIntervalMillis: 200, // 创建连接重试间隔
  
  // 性能优化
  propagateCreateError: false,    // 不传播创建错误
  
  // 监控和日志
  log: (message, logLevel) => {
    if (logLevel === 'error') {
      console.error('数据库连接池错误:', message);
    } else if (process.env.NODE_ENV === 'development') {
      console.log('数据库连接池:', message);
    }
  }
};

// 连接健康检查
export async function testConnection(pool) {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('数据库连接测试失败:', error);
    return false;
  }
}
```

### 监控和性能分析

#### 1. 前端性能监控
```javascript
// src/lib/performance.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: null,
      apiCalls: [],
      renderTimes: [],
      memoryUsage: []
    };
    
    this.startMonitoring();
  }
  
  startMonitoring() {
    // 页面加载性能
    window.addEventListener('load', () => {
      this.metrics.pageLoad = {
        domContentLoaded: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
        loadComplete: performance.getEntriesByType('navigation')[0].loadEventEnd,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime
      };
    });
    
    // 定期收集内存使用情况
    if ('memory' in performance) {
      setInterval(() => {
        this.metrics.memoryUsage.push({
          timestamp: Date.now(),
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        });
        
        // 只保留最近1小时的数据
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        this.metrics.memoryUsage = this.metrics.memoryUsage.filter(
          m => m.timestamp > oneHourAgo
        );
      }, 30000); // 每30秒收集一次
    }
  }
  
  recordApiCall(url, duration, success) {
    this.metrics.apiCalls.push({
      timestamp: Date.now(),
      url,
      duration,
      success
    });
    
    // 只保留最近1000个API调用记录
    if (this.metrics.apiCalls.length > 1000) {
      this.metrics.apiCalls = this.metrics.apiCalls.slice(-1000);
    }
  }
  
  recordRenderTime(component, duration) {
    this.metrics.renderTimes.push({
      timestamp: Date.now(),
      component,
      duration
    });
    
    // 只保留最近500个渲染记录
    if (this.metrics.renderTimes.length > 500) {
      this.metrics.renderTimes = this.metrics.renderTimes.slice(-500);
    }
  }
  
  getReport() {
    const apiCallsLast5Min = this.metrics.apiCalls.filter(
      call => Date.now() - call.timestamp < 5 * 60 * 1000
    );
    
    return {
      pageLoad: this.metrics.pageLoad,
      recentApiCalls: {
        count: apiCallsLast5Min.length,
        averageDuration: apiCallsLast5Min.reduce((sum, call) => sum + call.duration, 0) / apiCallsLast5Min.length,
        successRate: apiCallsLast5Min.filter(call => call.success).length / apiCallsLast5Min.length
      },
      currentMemory: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1],
      averageRenderTime: this.metrics.renderTimes.reduce((sum, render) => sum + render.duration, 0) / this.metrics.renderTimes.length
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

#### 2. 后端性能监控
```javascript
// backend/middleware/performanceMonitor.js
class BackendPerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: [],
      dbQueries: [],
      fileOperations: [],
      memoryUsage: []
    };
    
    this.startMonitoring();
  }
  
  requestMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        this.metrics.requests.push({
          timestamp: Date.now(),
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration,
          userAgent: req.get('User-Agent'),
          ip: req.ip
        });
        
        // 警告慢请求
        if (duration > 5000) {
          console.warn(`慢请求警告: ${req.method} ${req.url} 用时 ${duration}ms`);
        }
        
        // 清理老数据
        this.cleanupOldData();
      });
      
      next();
    };
  }
  
  recordFileOperation(operation, filePath, duration, success) {
    this.metrics.fileOperations.push({
      timestamp: Date.now(),
      operation,
      filePath,
      duration,
      success
    });
  }
  
  startMonitoring() {
    // 定期收集系统指标
    setInterval(() => {
      const memoryUsage = process.memoryUsage();
      this.metrics.memoryUsage.push({
        timestamp: Date.now(),
        rss: memoryUsage.rss,
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external
      });
    }, 60000); // 每分钟收集一次
  }
  
  cleanupOldData() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    this.metrics.requests = this.metrics.requests.filter(
      req => req.timestamp > oneHourAgo
    );
    
    this.metrics.fileOperations = this.metrics.fileOperations.filter(
      op => op.timestamp > oneHourAgo
    );
    
    this.metrics.memoryUsage = this.metrics.memoryUsage.filter(
      mem => mem.timestamp > oneHourAgo
    );
  }
  
  getMetrics() {
    const recentRequests = this.metrics.requests.filter(
      req => Date.now() - req.timestamp < 5 * 60 * 1000
    );
    
    return {
      requests: {
        total: recentRequests.length,
        averageResponseTime: recentRequests.reduce((sum, req) => sum + req.duration, 0) / recentRequests.length,
        errorRate: recentRequests.filter(req => req.statusCode >= 400).length / recentRequests.length,
        slowRequests: recentRequests.filter(req => req.duration > 1000).length
      },
      memory: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1],
      fileOperations: {
        total: this.metrics.fileOperations.length,
        averageDuration: this.metrics.fileOperations.reduce((sum, op) => sum + op.duration, 0) / this.metrics.fileOperations.length,
        successRate: this.metrics.fileOperations.filter(op => op.success).length / this.metrics.fileOperations.length
      }
    };
  }
}

export const performanceMonitor = new BackendPerformanceMonitor();
```

## 📝 版本更新日志

### v1.2.0 (当前版本)
- ✅ 修复了编辑器显示问题
- ✅ 优化了界面布局和滚动
- ✅ 将主题色改为活力蓝色
- ✅ 重构了侧边栏菜单结构
- ✅ 添加了欢迎页面独立菜单
- ✅ 改进了文件解析逻辑
- ✅ 优化了折叠按钮设计

### 下一版本计划
- 🔄 添加快捷键支持
- 🔄 实现拖拽排序功能
- 🔄 添加批量操作功能
- 🔄 优化移动端适配

## 🤝 贡献指南

如果需要修改或扩展功能，请按照以下步骤：

1. **了解组件结构**: 先阅读相关组件代码
2. **测试修改**: 在开发环境中测试所有修改
3. **检查兼容性**: 确保修改不会破坏现有功能
4. **更新文档**: 如有必要，更新此技术文档

---

*最后更新: 2024年9月*
*文档版本: v1.2.0*
```

## 🚀 部署配置详解

### 开发环境部署

#### 环境变量配置
创建 `.env` 文件：
```bash
# 开发环境配置
NODE_ENV=development
PORT=3001
FRONTEND_PORT=5173

# 项目路径配置
TRANSLATIONS_DIR=../src/translations
BACKUP_DIR=./backups
LOGS_DIR=./logs

# 调试配置
DEBUG=true
LOG_LEVEL=debug
VERBOSE_LOGGING=true

# CORS 配置
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With

# 文件上传配置
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=.js,.json,.txt,.md
UPLOAD_TIMEOUT=30000    # 30秒

# 性能配置
FILE_CACHE_SIZE=100
FILE_CACHE_TTL=300000   # 5分钟
REQUEST_TIMEOUT=10000   # 10秒
```

#### 开发服务器启动脚本
```json
// package.json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" --kill-others-on-fail",
    "dev:backend": "cross-env NODE_ENV=development nodemon backend/server.js",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:watch": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\" \"npm run dev:watch-files\"",
    "dev:watch-files": "chokidar \"../src/translations/**/*.js\" -c \"echo File changed: {path}\"",
    "setup": "npm run install:all && npm run dev",
    "install:all": "npm install && cd frontend && npm install && cd ..",
    "clean": "rimraf node_modules frontend/node_modules logs/*.log backups/*",
    "reset": "npm run clean && npm run install:all"
  },
  "devDependencies": {
    "concurrently": "^8.2.0",
    "cross-env": "^7.0.3",
    "nodemon": "^3.0.1",
    "chokidar-cli": "^3.0.0",
    "rimraf": "^5.0.1"
  }
}
```

### 生产环境部署

#### 生产环境配置
```bash
# .env.production
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# 安全配置
SESSION_SECRET=your-super-secret-session-key-here-change-this
JWT_SECRET=your-jwt-secret-key-here-change-this
HASH_SALT_ROUNDS=12
CSRF_SECRET=your-csrf-secret-here

# 数据库配置（如需要）
DB_HOST=localhost
DB_PORT=5432
DB_NAME=translation_manager_prod
DB_USER=prod_user
DB_PASSWORD=secure_database_password_here
DB_SSL=true
DB_POOL_MIN=2
DB_POOL_MAX=20

# Redis 缓存配置（如需要）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_here
REDIS_DB=0
REDIS_TTL=3600

# 日志配置
LOG_LEVEL=info
LOG_FILE=./logs/app.log
ERROR_LOG_FILE=./logs/error.log
ACCESS_LOG_FILE=./logs/access.log
LOG_MAX_SIZE=50m
LOG_MAX_FILES=10

# 监控配置
MONITORING_ENABLED=true
METRICS_PORT=9090
HEALTH_CHECK_INTERVAL=30000
PERFORMANCE_MONITORING=true

# 安全头配置
SECURITY_HEADERS=true
HSTS_MAX_AGE=31536000
CSP_POLICY="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com;"

# 速率限制
RATE_LIMIT_WINDOW=900000  # 15分钟
RATE_LIMIT_MAX=1000       # 每窗口最大请求数
UPLOAD_RATE_LIMIT=10      # 每分钟上传次数
```

#### Docker 部署配置
```dockerfile
# Dockerfile
# 多阶段构建，优化镜像大小
FROM node:18-alpine AS base

# 安装必要的系统包
RUN apk add --no-cache \
    ca-certificates \
    curl \
    tzdata

# 设置时区
ENV TZ=Asia/Shanghai

# 安装 pnpm以获得更快的包管理
RUN npm install -g pnpm

# 依赖安装阶段
FROM base AS dependencies

WORKDIR /app

# 复制 package.json 文件
COPY package*.json pnpm-lock.yaml* ./
COPY frontend/package*.json frontend/pnpm-lock.yaml* ./frontend/

# 安装依赖（利用Docker层缓存）
RUN pnpm install --frozen-lockfile --production=false

# 构建阶段
FROM dependencies AS builder

# 复制源代码
COPY . .

# 构建前端应用
RUN cd frontend && pnpm run build

# 清理开发依赖
RUN pnpm prune --production

# 生产阶段
FROM base AS production

# 创建非 root 用户以提高安全性
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# 设置工作目录
WORKDIR /app

# 复制构建产物
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/backend ./backend
COPY --from=builder --chown=nodejs:nodejs /app/frontend/dist ./frontend/dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# 创建必要的目录
RUN mkdir -p logs backups && \
    chown -R nodejs:nodejs /app

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 启动应用
CMD ["node", "backend/server.js"]
```

## 📝 代码规范与测试

### 代码规范

#### JavaScript/Svelte 编码规范
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:svelte/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    extraFileExtensions: ['.svelte']
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  rules: {
    // 代码质量
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    
    // 代码风格
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    
    // Svelte 特定规则
    'svelte/no-unused-svelte-ignore': 'error',
    'svelte/prefer-class-directive': 'error',
    'svelte/prefer-style-directive': 'error',
    'svelte/no-at-html-tags': 'warn',
    'svelte/no-target-blank': 'error'
  },
  env: {
    browser: true,
    node: true,
    es2022: true
  },
  globals: {
    // 全局变量定义
    globalThis: false
  }
};
```

#### CSS 编码规范
```json
// .stylelintrc.json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "indentation": 2,
    "string-quotes": "single",
    "declaration-colon-space-after": "always",
    "declaration-colon-space-before": "never",
    "function-comma-space-after": "always",
    "function-comma-space-before": "never",
    "length-zero-no-unit": true,
    "property-no-vendor-prefix": true,
    "value-no-vendor-prefix": true,
    "custom-property-pattern": "^[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$",
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$",
    "declaration-block-trailing-semicolon": "always",
    "rule-empty-line-before": ["always", {
      "except": ["first-nested"],
      "ignore": ["after-comment"]
    }]
  },
  "ignoreFiles": [
    "node_modules/**/*",
    "frontend/dist/**/*"
  ]
}
```

#### 提交信息规范
```bash
# .gitmessage 模板
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>

# Type 说明:
# feat: 新功能
# fix: 修复bug
# docs: 文档更新
# style: 代码格式调整（不影响代码运行的变动）
# refactor: 重构（既不是新增功能，也不是修改bug的代码变动）
# perf: 性能优化
# test: 测试相关
# build: 构建相关
# ci: CI/CD相关
# chore: 其他杂项
# revert: 回滚

# Scope 说明:
# frontend: 前端相关
# backend: 后端相关
# api: API相关
# ui: 用户界面
# core: 核心逻辑
# config: 配置相关
# docs: 文档相关

# 示例:
# feat(editor): 添加语法高亮功能
#
# - 集成 CodeMirror 编辑器
# - 支持 JavaScript 语法高亮
# - 添加主题切换功能
#
# Closes #123
```

#### Git Hooks 配置
```bash
#!/bin/sh
# .husky/pre-commit
# 预提交钩子，执行代码检查

echo "🔍 运行预提交检查..."

# 运行 ESLint
echo "📋 检查 JavaScript/Svelte 代码规范..."
npx eslint "**/*.{js,svelte}" --max-warnings 0
if [ $? -ne 0 ]; then
  echo "❌ ESLint 检查失败，请修复后再提交"
  exit 1
fi

# 运行 Stylelint
echo "🎨 检查 CSS 代码规范..."
npx stylelint "**/*.{css,svelte}"
if [ $? -ne 0 ]; then
  echo "❌ Stylelint 检查失败，请修复后再提交"
  exit 1
fi

# 运行 Prettier
echo "✨ 格式化代码..."
npx prettier --write "**/*.{js,svelte,css,md,json}"

# 运行测试
echo "🧪 运行测试..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ 测试失败，请修复后再提交"
  exit 1
fi

echo "✅ 预提交检查通过！"
```

### 测试指南

#### 单元测试配置
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.js'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-setup.js',
        '**/*.config.js'
      ]
    }
  }
});
```

```javascript
// src/test-setup.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch API
global.fetch = vi.fn();

// Mock console methods for clean test output
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
};

// Setup test environment
beforeEach(() => {
  vi.clearAllMocks();
});
```

#### 前端组件测试示例
```javascript
// src/components/__tests__/Editor.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { vi } from 'vitest';
import Editor from '../Editor.svelte';

// Mock API calls
vi.mock('../../lib/api.js', () => ({
  apiCall: vi.fn()
}));

describe('Editor 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('应该正确渲染编辑器', () => {
    render(Editor, {
      props: {
        file: { name: 'test.js', domain: 'test.com' }
      }
    });

    expect(screen.getByText('翻译规则编辑器')).toBeInTheDocument();
  });

  test('应该在文件加载失败时显示错误信息', async () => {
    const { apiCall } = await import('../../lib/api.js');
    apiCall.mockRejectedValue(new Error('加载失败'));

    render(Editor, {
      props: {
        file: { name: 'test.js', domain: 'test.com' }
      }
    });

    await waitFor(() => {
      expect(screen.getByText(/加载失败/)).toBeInTheDocument();
    });
  });

  test('应该能够添加新的翻译规则', async () => {
    const { apiCall } = await import('../../lib/api.js');
    apiCall.mockResolvedValue({
      success: true,
      data: { rules: { textRules: [], regexRules: [] } }
    });

    render(Editor, {
      props: {
        file: { name: 'test.js', domain: 'test.com' }
      }
    });

    const addButton = screen.getByText('添加规则');
    await fireEvent.click(addButton);

    expect(screen.getByPlaceholderText('原文')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('译文')).toBeInTheDocument();
  });

  test('应该能够保存翻译规则', async () => {
    const { apiCall } = await import('../../lib/api.js');
    apiCall.mockResolvedValue({ success: true });

    render(Editor, {
      props: {
        file: { name: 'test.js', domain: 'test.com' }
      }
    });

    const saveButton = screen.getByText('保存');
    await fireEvent.click(saveButton);

    expect(apiCall).toHaveBeenCalledWith(
      expect.stringContaining('/api/translations/'),
      expect.objectContaining({
        method: 'PUT'
      })
    );
  });
});
```

#### 后端API测试示例
```javascript
// backend/__tests__/translation-core.test.js
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { extractRules, generateFileContent } from '../core/translation-core.js';

// Mock fs module
vi.mock('fs/promises');

describe('翻译文件核心功能', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('extractRules', () => {
    test('应该正确解析文本规则', () => {
      const content = `
        export const testDomain = {
          textRules: [
            ["Hello", "你好"],
            ["World", "世界"]
          ]
        };
      `;

      const result = extractRules(content, 'textRules');

      expect(result).toEqual([
        { source: 'Hello', target: '你好' },
        { source: 'World', target: '世界' }
      ]);
    });

    test('应该正确解析正则规则', () => {
      const content = `
        export const testDomain = {
          regexRules: [
            [/\\d+ days/gi, "$1 天"],
            [/Hello/i, "你好"]
          ]
        };
      `;

      const result = extractRules(content, 'regexRules');

      expect(result).toEqual([
        { pattern: '\\d+ days', flags: 'gi', replacement: '$1 天' },
        { pattern: 'Hello', flags: 'i', replacement: '你好' }
      ]);
    });

    test('应该处理空规则数组', () => {
      const content = `
        export const testDomain = {
          textRules: []
        };
      `;

      const result = extractRules(content, 'textRules');

      expect(result).toEqual([]);
    });

    test('应该忽略注释掉的规则', () => {
      const content = `
        export const testDomain = {
          textRules: [
            // ["Commented", "注释"],
            ["Active", "活跃"]
          ]
        };
      `;

      const result = extractRules(content, 'textRules');

      expect(result).toEqual([
        { source: 'Active', target: '活跃' }
      ]);
    });
  });

  describe('generateFileContent', () => {
    test('应该生成正确的文件内容', () => {
      const rules = {
        domain: 'test.com',
        textRules: [
          { source: 'Hello', target: '你好' }
        ],
        regexRules: [
          { pattern: '\\d+ days', flags: 'gi', replacement: '$1 天' }
        ],
        styles: ['body { color: red; }'],
        jsRules: ['console.log("test");']
      };

      const content = generateFileContent(rules);

      expect(content).toContain('export const testCom = {');
      expect(content).toContain('["Hello", "你好"]');
      expect(content).toContain('[/\\d+ days/gi, "$1 天"]');
      expect(content).toContain('"body { color: red; }"');
      expect(content).toContain('"console.log(\\"test\\");"');
    });

    test('应该处理空规则', () => {
      const rules = {
        domain: 'empty.com',
        textRules: [],
        regexRules: [],
        styles: [],
        jsRules: []
      };

      const content = generateFileContent(rules);

      expect(content).toContain('export const emptyCom = {');
      expect(content).toContain('textRules: []');
      expect(content).toContain('regexRules: []');
      expect(content).toContain('styles: []');
      expect(content).toContain('jsRules: []');
    });
  });
});
```

#### E2E 测试配置
```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    }
  ],

  webServer: [
    {
      command: 'npm run dev:backend',
      port: 3001,
      reuseExistingServer: !process.env.CI
    },
    {
      command: 'npm run dev:frontend',
      port: 5173,
      reuseExistingServer: !process.env.CI
    }
  ]
});
```

```javascript
// e2e/translation-manager.spec.js
import { test, expect } from '@playwright/test';

test.describe('翻译管理器', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('应该显示欢迎页面', async ({ page }) => {
    await expect(page.getByText('翻译管理器')).toBeVisible();
    await expect(page.getByText('欢迎使用翻译管理器')).toBeVisible();
  });

  test('应该能够切换到文件管理页面', async ({ page }) => {
    await page.click('text=文件管理');
    await expect(page.getByText('翻译文件列表')).toBeVisible();
  });

  test('应该能够加载和编辑翻译文件', async ({ page }) => {
    // 切换到文件管理
    await page.click('text=文件管理');
    
    // 等待文件列表加载
    await page.waitForSelector('[data-testid="file-item"]', { timeout: 10000 });
    
    // 点击第一个文件
    await page.click('[data-testid="file-item"]:first-child');
    
    // 等待编辑器加载
    await expect(page.getByText('翻译规则编辑器')).toBeVisible();
    
    // 检查是否有翻译规则
    const rulesTable = page.locator('table');
    await expect(rulesTable).toBeVisible();
  });

  test('应该能够添加新的翻译规则', async ({ page }) => {
    // 导航到编辑器
    await page.click('text=文件管理');
    await page.waitForSelector('[data-testid="file-item"]');
    await page.click('[data-testid="file-item"]:first-child');
    
    // 添加新规则
    await page.click('text=添加规则');
    
    // 填写规则
    await page.fill('input[placeholder="原文"]', 'Test');
    await page.fill('input[placeholder="译文"]', '测试');
    
    // 保存
    await page.click('text=保存');
    
    // 验证保存成功
    await expect(page.getByText('保存成功')).toBeVisible({ timeout: 5000 });
  });

  test('应该能够切换主题', async ({ page }) => {
    // 点击主题切换按钮
    await page.click('[data-testid="theme-toggle"]');
    
    // 选择夜间模式
    await page.click('text=夜间模式');
    
    // 验证主题切换
    const body = page.locator('body');
    await expect(body).toHaveClass(/dark/);
  });

  test('应该在移动设备上正常显示', async ({ page }) => {
    // 模拟移动设备
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 检查侧边栏是否折叠
    const sidebar = page.locator('[data-testid="sidebar"]');
    await expect(sidebar).toHaveClass(/collapsed/);
    
    // 点击菜单按钮展开
    await page.click('[data-testid="menu-toggle"]');
    await expect(sidebar).not.toHaveClass(/collapsed/);
  });
});
```

#### 测试覆盖率配置
```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:coverage && npm run test:e2e"
  }
}
```

## 🔍 故障排除与日志分析

### 常见故障排除

#### 1. 端口占用问题
```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID <PID>

# macOS/Linux
lsof -ti:3001 | xargs kill -9

# 或者使用 npx kill-port
npx kill-port 3001
```

#### 2. 依赖安装问题
```bash
# 清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# 或者使用 pnpm
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### 3. 文件权限问题
```bash
# Linux/macOS 设置文件权限
chmod 755 backend/server.js
chmod -R 644 src/translations/

# Windows 以管理员身份运行
