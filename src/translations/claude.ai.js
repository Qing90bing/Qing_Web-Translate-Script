// src/translations/claude.ai.js

export const claudeAi = {
  // 样式（CSS）
  styles: [],

  // 注入脚本（JavaScript）
  jsRules: [
    // 在这里添加JavaScript代码，例如：
    // "alert('Hello, World!');"
  ],

  // 正则表达式翻译规则
  regexRules: [
    [/Per person \/ month with annual subscription discount\. SGD ([\d.]+)\s+if billed monthly\. Minimum (\d+)\s+members\./i, "每人/月，享受年度订阅折扣。按月计费则为 SGD $1。最少 $2 名成员。"],
    [/Per person \/ month\. Minimum (\d+)\s+members\./i, "每人/月。最少 $1 名成员。"],
    [/Delete\s+(\d+)\s+selected\s+items?/i, "删除 $1 个选定的项目"],
    [/(\d+)\s+chats?\s+with\s+(.+)/i, "与 $2 共有 $1 条聊天记录"],
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
    [/Sep\s+(\d{1,2}),\s+(\d{4})/, "$2年9月$1日"],
    [/SGD\s+([\d.]+)/i, "SGD $1"]
  ],

  // 纯文本翻译规则
  textRules: [
    ["upstream connect error or disconnect/reset before headers. reset reason: connection termination", "连接后端服务器失败，或在收到其响应数据前连接被重置。重置原因：连接被终止。"],
    ["Don’t share personal information or third-party content without permission, and see our ", "不要分享个人信息或第三方内容，否则会违反我们的"],
    ["Only messages up until now will be shared", "仅分享到目前为止的对话"],
    ["Chat on web, iOS, and Android", "在网页、iOS和Android上聊天"],
    ["Private (only you have access)", "私人（仅您可见）"],
    ["Ability to search the web", "能够搜索网络"],
    ["Analyze text and images", "分析文本和图片"],
    ["English (United States)", "英语（美国）"],
    ["Deutsch (Deutschland)", "德语（德国）"],
    ["français (France)", "法语（法国）"],
    ["Try Claude", "体验 Claude"],
    ["Latest", "最新的"],
    ["Connect", "连接"],
    ["Log out", "登出"],
    ["Members", "成员"],
    ["Thumbs up", "赞"],
    ["Upgrade", "升级"],
    ["Accept", "接受"],
    ["Browse", "浏览"],
    ["Delete", "删除"],
    ["Manage", "管理"],
    ["Chats", "聊天"],
    ["Image", "图片"],
    ["Learn", "学习"],
    ["Legal", "法律"],
    ["Other", "其他"],
    ["Retry", "重试"],
    ["Write", "编写"],
    ["Code", "代码"],
    ["Edit", "编辑"],
    ["Save", "保存"],
    ["Skip", "跳过"],
    ["Star", "收藏"]
  ],
};