// 翻译目标网站: test.example.com

export const testExampleCom = {
  // === 文件元数据 ===
  // 文件描述
  description: "test.example.com 网站翻译配置",
  
  // 测试链接 
  testUrl: "https://test.example.com",
  
  // 创建日期
  creationDate: "2024-01-01",

  // === 翻译规则 ===
  // 样式 (CSS)
  styles: [
    // 在这里添加网站所需的自定义样式
  ],

  // 注入脚本 (JavaScript)
  jsRules: [
    // 在这里添加JavaScript代码
  ],

  // 正则表达式翻译规则
  // 规则会自动应用于匹配的文本
  // 格式: [/原始文本正则表达式/i, '翻译后的文本']
  // 使用 $1, $2, ... 来引用正则表达式中的捕获组
  // 示例: [/^您好 (\w+)/, 'Hello $1']
  regexRules: [
    // 在这里添加正则表达式规则
  ],

  // 纯文本翻译规则
  // 规则会完全匹配整个文本
  // 格式: ['原始文本', '翻译后的文本']
  // 示例: ['登录', 'Login']
  textRules: [
    // 在这里添加纯文本规则
  ],
};