// src/translations/console.anthropic.com.js

export const consoleAnthropicCom = {
  // 样式（CSS）
  styles: [],

  // 正则表达式翻译规则
  regexRules: [
    [/Confirm Development Partner Program enrollment for (.+)/i, '确认为 $1 加入开发合作伙伴计划'],
    [/(\d+)\s+day\s+retention period/i, '$1 天保留期'],
    [/Save up to (\d+)% on Claude Code input tokens when you join our Development Partner Program today/i, '立即加入我们的开发合作伙伴计划，Claude Code 输入令牌可节省高达 $1% 的费用'],
    [/Resets on\s+(.+)/i, '将于 $1 重置'],
    [/\$([\d,\.]+)\s+of\s+\$([\d,\.]+)/i, '共 $2 美元，已用 $1 美元'],
    [/US\$\s*([\d,\.]+)/i, '美元$1'],
    [/^(\d{1,3}(?:,\d{3})*)\s+keys?$/i, '$1 个密钥'],
    // 月份 日, 年份 格式 (例如: Jul 2, 2025)
    [/Jan\s+(\d{1,2}),\s+(\d{4})/, '$2年1月$1日'],
    [/Feb\s+(\d{1,2}),\s+(\d{4})/, '$2年2月$1日'],
    [/Mar\s+(\d{1,2}),\s+(\d{4})/, '$2年3月$1日'],
    [/Apr\s+(\d{1,2}),\s+(\d{4})/, '$2年4月$1日'],
    [/May\s+(\d{1,2}),\s+(\d{4})/, '$2年5月$1日'],
    [/Jun\s+(\d{1,2}),\s+(\d{4})/, '$2年6月$1日'],
    [/Jul\s+(\d{1,2}),\s+(\d{4})/, '$2年7月$1日'],
    [/Aug\s+(\d{1,2}),\s+(\d{4})/, '$2年8月$1日'],
    [/Sep\s+(\d{1,2}),\s+(\d{4})/, '$2年9月$1日'],
    [/Oct\s+(\d{1,2}),\s+(\d{4})/, '$2年10月$1日'],
    [/Nov\s+(\d{1,2}),\s+(\d{4})/, '$2年11月$1日'],
    [/Dec\s+(\d{1,2}),\s+(\d{4})/, '$2年12月$1日'],
  ],

  // 纯文本翻译规则
  textRules: [
    ["Disabling web search may break existing services that have web search enabled. Are you sure you want to disable web search for your organization?", "禁用Web搜索可能会破坏启用Web搜索的现有服务。您确定要禁用网络搜索您的组织吗？"],
    ["This will permanently delete all metrics data collected from Claude Code. This action cannot be undone. Are you sure you want to continue?", "这将永久删除从Claude Code收集的所有指标数据。此操作无法撤消。您确定要继续吗？"],
    ["Search and cite content from any domain", "搜索和引用任何域名的内容"],
    ["Delete Claude Code metrics data", "删除 Claude Code 度量数据"],
    ["Code for Anthropic API", "Anthropic API 的代码"],
    ["How was your experience?", "你的体验怎么样？"],
    ["Need help instead? Visit", "需要帮助吗？访问"],
    ["Give us more details", "告诉我们更多细节"],
    ["Write me an email", "给我写一封电子邮件"],
    ["Your Privacy Choices", "您的隐私选择"],
    ["Disable web search", "禁止网页搜索"],
    ["Summarize a document", "总结文档"],
    ["Recommend a product", "推荐产品"],
    ["Content moderation", "内容审核"],
    ["Help & Support ", "帮助和支持"],
    ["Submit Feedback", "提交反馈"],
    ["Data retention", "数据保留"],
    ["Translate code", "翻译代码"],
    ["Legal center", "法律中心"],
    ["Log out", "登出"]
  ],
};