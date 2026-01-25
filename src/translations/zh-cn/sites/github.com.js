// 翻译目标网站: github.com

export const githubComZhCn = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 github.com 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: '',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-12-30',

  // 语言：此翻译配置适用的语言
  language: 'zh-cn', // 支持的语言: zh-cn(简体中文), zh-tw(繁体中文)

  // 启用状态：控制此翻译配置是否启用
  enabled: true,

  // 样式 (CSS)
  // 支持编写多个CSS规则
  styles: [
    // 在这里添加styles代码，例如：
    // "body { background-color: #f0f0f0; }",
    // "h1 { color: #333; }"
    // ".rule3 { margin: 10px; }"
  ],

  // 禁止翻译的元素选择器
  blockedElements: [
    // 在这里添加CSS选择器，例如：
    // '.notranslate',
    // '#header .logo'
  ],

  // 扩展翻译元素选择器
  // 用于翻译那些默认情况下未被翻译的元素
  extendedElements: [
    // 在这里添加CSS选择器，例如：
    // '#dynamic-content',
    // '.custom-widget'
  ],

  // 自定义属性白名单 
  // 在此数组中添加的任何 HTML 属性名，都将在整个网站范围内被翻译。
  // 示例: 'data-tip', 'data-title'
  customAttributes: [
    // 在这里添加自定义属性
  ],

  // 自定义属性黑名单 
  // 在此数组中添加的任何 HTML 属性名，都将强制不被翻译。
  // 此列表的优先级高于白名单，可用于覆盖默认翻译行为。
  // 示例: 'title'
  blockedAttributes: [
    // 在这里添加要阻止翻译的属性
  ],

  // 注入脚本 (JavaScript)
  // 支持编写多个JS规则，通过循环遍历，每个规则都创建独立的<script>标签注入到页面
  jsRules: [
    // 在这里添加JavaScript代码，例如：
    // "console.log('第一条规则');",
    // "alert('第二条规则');",
    // "document.title = '修改后的标题';"
  ],

  // 正则表达式翻译规则
  // 规则会自动应用于匹配的文本
  // 格式: [/原始文本正则表达式/i, '翻译后的文本']
  // 使用 $1, $2, ... 来引用正则表达式中的捕获组
  // 示例: [/^Hello (\w+)/, '您好 $1']
  regexRules: [],

  // 纯文本翻译规则
  // 规则会完全匹配整个文本
  // 格式: ['原始文本', '翻译后的文本']
  // 示例: ['Login', '登录']
  textRules: [
    ["Search code, repositories, users, issues, pull requests...", "搜索代码、仓库、用户、问题、拉取请求..."],
    ["No spaces found. You can create a new space to get started.", "未找到空间，您可以创建一个新空间开始"],
    ["Deploy VitePress Site to Pages / Deploy (push)", "将 VitePress 站点部署到 Pages / 部署 (推送)"],
    ["Deploy VitePress Site to Pages / build (push)", "将 VitePress 站点部署到 Pages / 构建 (推送)"],
    ["Chat with Copilot, Start a new Copilot thread", "与 Copilot 聊天，开始一个新的 Copilot 讨论"],
    ["You switched accounts on another tab or window. ", "您在另一个标签页或窗口中切换了账户。"],
    ["No pull requests found, try a different filter.", "未找到拉取请求，尝试使用不同的筛选器"],
    ["You signed out in another tab or window. ", "您在另一个标签页或窗口中退出登录。"],
    ["No issues found, try a different filter.", "未找到议题，尝试使用不同的筛选器"],
    ["to access more models and higher limits.", "以访问更多模型和更高的限制"],
    ["You can create a new space to get started.", "您可以创建一个新空间开始"],
    ["Pull requests requesting your review", "请求您审查的拉取请求"],
    ["Add repositories, files, and spaces", "添加仓库、文件和空间"],
    ["\n        © 2025 GitHub, Inc.\n      ", "© 2025 GitHub, Inc."],
    ["Items will be filtered as you type", "您输入时将过滤项目"],
    ["There was an error while loading. ", "加载时出错。"],
    ["Pull requests mentioning you", "提及您的拉取请求"],
    ["Open global navigation menu", "打开全局导航菜单"],
    ["Show more breadcrumb items", "显示更多面包屑项"],
    ["Open in Copilot Chat", "在 Copilot 聊天中打开"],
    ["Open user navigation menu", "打开用户导航菜单"],
    ["Please reload this page", "请重新加载此页面"],
    ["    Create saved search\n", "创建保存的搜索"],
    ["Maximum age of results", "最大时间结果"],
    ["Search or jump to…", "搜索或跳转到..."],
    ["Chat with Copilot", "与 Copilot 聊天"],
    ["Create a new space", "创建一个新空间"],
    ["Search for repositories", "搜索仓库"],
    ["Create something new", "创建新内容"],
    ["GitHub Breadcrumb", "GitHub 面包屑"],
    ["GitHub Homepage", "GitHub 首页"],
    ["Select a space", "选择一个空间"],
    ["Footer navigation", "页脚导航"],
    ["No spaces found", "未找到空间"],
    ["Skip to content", "跳转到内容"],
    ["Navigation Menu", "导航菜单"],
    ["Recent spaces", "最近的空间"],
    ["Site navigation", "网站导航"],
    ["Ask anything", "问任何问题"],
    ["Dismiss alert", "关闭警告"],
    ["Dismiss error", "关闭错误"],
    ["Close search", "关闭搜索"],
    ["No maximum", "无最大值"],
    ["Suggestions", "建议"],
    ["Homepage ", "首页"],
    ["Model: ", "模型："],
    ["Clear", "清空"]
  ],
};
