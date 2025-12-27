// 翻译目标网站: opal.google

export const opalGoogleZhCn = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 opal.google 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: 'https://opal.google/landing/',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-12-09',

  // 语言：此翻译配置适用的语言
  language: 'zh-cn', // 支持的语言: zh-cn(简体中文), zh-tw(繁体中文), zh-hk(中文香港)

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
    ["\n            Mini-apps anyone can build. Sign in to view or make your own.\n          ", "任何人都可以构建的迷你应用 登录以查看或创建您自己的应用"],
    ["\n              Edit and refine your app’s logic with a node-based workflow.\n            ", "使用基于节点的流程编辑和优化您的应用逻辑"],
    ["\n          Start from scratch or explore our gallery for instant inspiration\n        ", "从头开始或探索我们的应用库以获取即时灵感"],
    ["\n          Build, edit, and share AI mini-apps using natural language\n        ", "使用自然语言构建、编辑和分享 AI 迷你应用"],
    ["\n          Join our Discord for support and sharing feedback\n        ", "加入我们的 Discord 以获取支持和分享反馈"],
    ["Turn ideas into working applications in minutes, not months.", "在几分钟内，而非数月，将想法转化为可工作的应用"],
    ["Create a playlist for your current mood with YouTube links", "根据您当前的心情创建带有 YouTube 链接的播放列表"],
    ["Creates AI video ads with your product and target audience", "使用您的产品和目标受众创建 AI 视频广告"],
    ["\n          Unleash your creativity and start building with\n          ", "释放您的创造力，开始使用"],
    ["Get book recommendations and discover your next favorite read", "获取书籍推荐，发现您的下一本最爱"],
    ["Get a personalized report for the product you want to research", "获取您想研究的产品的个性化报告"],
    ["Turn your YouTube video into a quiz to help you learn", "将您的 YouTube 视频变成测验，帮助您学习"],
    ["Create a weather appropriate outfit for a specific occasion", "为特定场合创建一套适合天气的服装"],
    ["An accurate glimpse of how the internet sees your business", "准确了解互联网如何看待您的业务"],
    ["Build powerful AI mini-apps using natural language.", "使用自然语言构建强大的 AI 迷你应用"],
    ["Create a game concept with AI-generated visuals", "使用 AI 生成的视觉效果创建游戏概念"],
    ["Researches a topic and writes a blog post about it", "研究一个主题并撰写一篇博客文章"],
    [" when you are\n            asked about access.\n          ", " 当被要求授权访问时"],
    ["Hear a word and example sentence, then spell it", "听一个单词和例句，然后拼写它"],
    ["Bring your app ideas to life with Opal", "使用 Opal 将您的应用创意变为现实"],
    ["Create a social media post for your business", "为您的业务创建社交媒体帖子"],
    ["\n          Bring your ideas to life with ", "将您的创意变为现实，使用"],
    ["\n          Additional access required\n        ", "需要额外访问权限"],
    ["Welcome - Opal [Experiment]", "欢迎 - Opal [实验性应用]"],
    ["\n            Please click\n            ", "请再次点击"],
    ["Intuitive Visual Editing", "直观的视觉编辑"],
    ["Learning with YouTube", "使用 YouTube 学习"],
    ["Opal [Experiment]", "Opal [实验性应用]"],
    ["Google Labs Logo", "Google Labs 标志"],
    ["\n        Try now\n      ", "立即试用"],
    ["Business Profiler", "商业概况分析器"],
    ["Blog Post Writer", "博客文章撰写器"],
    ["Generated Playlist", "生成播放列表"],
    ["Rapid Prototyping", "快速原型设计"],
    ["Social Media Post", "社交媒体帖子"],
    [" again, and choose ", "，并选择"],
    ["Google Products", "Google 产品"],
    ["No-Code Creation", "无代码创建"],
    ["Video Marketer", "视频营销人员"],
    ["Fashion Stylist", "时尚造型师"],
    ["Google Labs", "Google 实验室"],
    ["Product Research", "产品研究"],
    ["About Google", "关于 Google"],
    ["City Builder", "城市建造者"],
    ["Stay connected", "保持联系"],
    ["Spelling Bee", "拼写竞赛"],
    ["Book Recs", "书籍推荐"],
    ["Documentation", "文档"],
    ["Try Opal", "试用 Opal"],
    ["Experiment", "实验"],
    ["Select all", "全选"],
    ["FAQ", "常见问题"],
    ["Privacy", "隐私"],
    ["Sign in", "登录"],
    ["Terms", "条款"],
    ["Help", "帮助"]
  ],
};
