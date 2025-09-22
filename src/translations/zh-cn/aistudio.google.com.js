// src/translations/aistudio.google.com.js

export const aistudioGoogleComZhCn = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 aistudio.google.com 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: 'https://aistudio.google.com/',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-08-21',

    // 语言：此翻译配置适用的语言
  language: 'zh-cn',

  // 启用状态：控制此翻译配置是否启用
  enabled: true,

  // 样式（CSS）
  styles: [
    // 在这里添加CSS规则，例如：
    // 'body { font-family: "Arial", sans-serif; }'
  ],

  // 注入脚本（JavaScript）
  jsRules: [
    // 在这里添加JavaScript代码，例如：
    // "alert('Hello, World!');"
  ],

  // 正则表达式翻译规则
  regexRules: [
    [/↩\s*Add a new line\s*\s*Alt\s*\+\s*↩\s*Append text without running\s*\s*Ctrl\s*\+\s*↩\s*Run prompt/i, "↩  换行 Alt + ↩  追加文本 (不执行) Ctrl + ↩  执行指令"],
    [/Invalid JSON: SyntaxError: Unexpected token '(.+?)', "(.+?)" is not valid JSON/i, "无效的 JSON 语法错误：在 “$2” 中存在意外的字符 “$1”"],
    [/([<>]=?)\s*(\d+K)\s+tokens\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, "$1$2 Tokens | 输入: $$ $3 / 输出: $$ $4"],
    [/Image \(\*Output per image\) • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, "图像 (*每张图片输出) | 输入: $$ $1 / 输出: $$ $2"],
    [/All context lengths\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, "所有上下文长度 | 输入: $$ $1 / 输出: $$ $2"],
    [/Text • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, "文本 | 输入：$$ $1，输出：$ $2"],
    [/Dec\s+(\d{1,2}),\s+(\d{4})/, "$2年12月$1日"],
    [/Nov\s+(\d{1,2}),\s+(\d{4})/, "$2年11月$1日"],
    [/Oct\s+(\d{1,2}),\s+(\d{4})/, "$2年10月$1日"],
    [/Apr\s+(\d{1,2}),\s+(\d{4})/, "$2年4月$1日"],
    [/Aug\s+(\d{1,2}),\s+(\d{4})/, "$2年8月$1日"],
    [/Feb\s+(\d{1,2}),\s+(\d{4})/, "$2年2月$1日"],
    [/Jan\s+(\d{1,2}),\s+(\d{4})/, "$2年1月$1日"],
    [/Jul\s+(\d{1,2}),\s+(\d{4})/, "$2年7月$1日"],
    [/Jun\s+(\d{1,2}),\s+(\d{4})/, "$2年6月$1日"],
    [/Mar\s+(\d{1,2}),\s+(\d{4})/, "$2年3月$1日"],
    [/May\s+(\d{1,2}),\s+(\d{4})/, "$2年5月$1日"],
    [/Sep\s+(\d{1,2}),\s+(\d{4})/, "$2年9月$1日"]
  ],

  // 纯文本翻译规则
  textRules: [
    ["Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.", "上传您的个人照片和心仪服装，即可轻松预览上身效果。这间虚拟试衣间由 Nano Banana™ 倾力打造。"],
    ["Gemini 2.5 Flash Audio", "Gemini 2.5 Flash 音频"],
    ["Here are the changes:", "更改内容如下："],
    ["Character consistency", "角色一致性"],
    ["object consistency", "客观的"],
    [" Running for ", "运行时间 "],
    ["Image Editing", "图像编辑"],
    ["Restored from", "恢复自："],
    ["Thinking...", "思考中..."],
    ["Saving…..", "保存中..."],
    ["Save app", "保存 App"],
    ["Added", "添加"],
    ["Live", "实时"],
    ["Medium", "中"],
    ["Move", "移动"],
    ["Name", "新明"],
    ["Save", "保存"],
    ["Send", "发送"],
    ["Stop", "停止"],
    ["Talk", "交谈"],
    ["Text", "文本"],
    ["Type", "类型"],
    ["User", "用户"],
    ["All", "全部"],
    ["Cut", "剪切"],
    ["Empty", "空"],
    ["HOT", "热门"],
    ["Off", "关闭"],
    ["Run", "运行"],
    ["High", "高"],
    ["and", "和"],
    ["Low", "低"],
    ["NEW", "新"]
  ],
};