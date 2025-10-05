// 翻译目标网站: www.avogado6.com

export const wwwAvogado6ComZhCn = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 www.avogado6.com 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: 'https://www.avogado6.com',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-10-05',

  // 语言：此翻译配置适用的语言
  language: 'zh-cn', // 支持的语言: zh-cn(简体中文), zh-tw(繁体中文), zh-hk(中文香港)

  // 启用状态：控制此翻译配置是否启用
  enabled: true,

  // 样式 (CSS)
  // 支持编写多个CSS规则
  styles: [
    "body, body * { font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, 'STSong', '华文宋体', 'NSimSun', '新宋体', 'SimSun', '宋体', serif !important; }"
  ],

  // 禁止翻译的元素选择器
  blockedElements: [
    // 在这里添加CSS选择器，例如：
    // '.notranslate',
    // '#header .logo'
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
    ["利用規約", "使用条款"],
    ["works", "作品"],
    ["home", "首页"],
    ["shop", "周边"]
  ],
};
