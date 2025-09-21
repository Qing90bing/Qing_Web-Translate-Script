// src/translations/status.anthropic.com.js

export const statusAnthropicCom = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 status.anthropic.com 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: '',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-09-21',
  // 样式（CSS）
  styles: [],

  // 注入脚本（JavaScript）
  jsRules: [
    // 在这里添加JavaScript代码，例如：
    // "alert('Hello, World!');"
  ],

  // 正则表达式翻译规则
  regexRules: [
    [/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{2}:\d{2})\s+UTC/i, "MM月DD日, $3 UTC"],
    [/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})/i, "YYYY年MM月DD日"],
    [/Uptime over the past\s+(\d+)\s+days\./i, "过去 $1 天的正常运行时间。"],
    [/Resend OTP in:\s*(\d+)\s*seconds/i, "在 $1 秒后重新发送 OTP"],
    [/^(\d{1,2})\s+Dec\s+(\d{4})$/i, "$2年12月$1日"],
    [/^(\d{1,2})\s+Nov\s+(\d{4})$/i, "$2年11月$1日"],
    [/^(\d{1,2})\s+Oct\s+(\d{4})$/i, "$2年10月$1日"],
    [/([\d\.]+)\s*%\s*uptime/i, "正常运行时间 $1%"],
    [/^(\d{1,2})\s+Apr\s+(\d{4})$/i, "$2年4月$1日"],
    [/^(\d{1,2})\s+Aug\s+(\d{4})$/i, "$2年8月$1日"],
    [/^(\d{1,2})\s+Feb\s+(\d{4})$/i, "$2年2月$1日"],
    [/^(\d{1,2})\s+Jan\s+(\d{4})$/i, "$2年1月$1日"],
    [/^(\d{1,2})\s+Jul\s+(\d{4})$/i, "$2年7月$1日"],
    [/^(\d{1,2})\s+Jun\s+(\d{4})$/i, "$2年6月$1日"],
    [/^(\d{1,2})\s+Mar\s+(\d{4})$/i, "$2年3月$1日"],
    [/^(\d{1,2})\s+May\s+(\d{4})$/i, "$2年5月$1日"],
    [/^(\d{1,2})\s+Sep\s+(\d{4})$/i, "$2年9月$1日"],
    [/^(\d+)\s*mins?$/i, "ashdajkhdahjkdas"],
    [/(\d+)\s+components?/i, "$1 个组件"],
    [/(\d+)\s+days ago/i, "$1 天前"],
    [/(\d+)\s+mins/i, "asojdakld"],
    [/^(\d+)\s*hrs?$/i, "$1小时"],
    [/^(\d+)\s*secs?$/i, "$1秒"],
    [/(\d+)\s+hrs/i, "$1 小时"]
  ],

  // 纯文本翻译规则
  textRules: [
    ["Atlassian uses cookies to improve your browsing experience, perform analytics and research, and conduct advertising. Accept all cookies to indicate that you agree to our use of cookies on your device.", "Atlassian 使用 Cookie 来改善您的浏览体验、进行分析和研究以及开展广告。接受所有 Cookie 即表示您同意我们在您的设备上使用 Cookie。"],
    ["Welcome to Anthropic's home for real-time and historical data on system performance.", "欢迎访问 Anthropic，在此查看系统性能的实时和历史数据。"],
    ["Team plan organizations unable to add more members", "团队计划组织无法添加更多成员"],
    ["Atlassian cookies and tracking notice", "Atlassian Cookie 和跟踪声明"],
    ["Subscribe via webhook", "通过 Webhook 订阅"],
    [", (opens new window)", "（在新窗口中打开）"],
    ["Subscribe via email", "通过电子邮件订阅"],
    ["Subscribe via slack", "通过 Slack 订阅"],
    ["Subscribe via teams", "通过 Teams 订阅"],
    ["Uptime over the past ", "正常运行时间"],
    ["Anthropic Status", "asdnjkasdjkas"],
    ["Subscribe via SMS", "通过短信订阅"],
    ["Subscribe to updates", "订阅更新"],
    ["% uptime", "% 正常运行时间"],
    ["Only necessary", "仅限必要"],
    ["Preferences", "偏好设置"],
    ["Accept all", "全部接受"],
    ["Page logo", "页面标志"],
    [" days ago", "天前"],
    [" days. ", "天"]
  ],
};