// ==UserScript==
// @name         AI网站中文汉化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @icon         https://s21.ax1x.com/2025/08/10/pVdPiOe.png
// @description  给Jules,Google AI Studio网站的英文替换成中文翻译，提高使用效率。采用严格匹配模式，避免过度翻译，目前翻译不完善，但是足够使用了。
// @author       Qing90bing (Optimized by Gemini)
// @match        *://jules.google.com/*
// @match        *://aistudio.google.com/*
// @match        *://claude.ai/*
// @match        *://platform.claude.com/*
// @match        *://status.anthropic.com/*
// @match        *://bbc.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @noframes
// ==/UserScript==

(() => {
  var julesGoogleComZhCn = {
    language: 'zh-cn',
    enabled: true,
    styles: ['.feedback-button { width: auto !important; white-space: nowrap !important; }'],
    jsRules: [],
    regexRules: [
      [/^Step\s+(\d+)\s+of the plan is complete\.$/i, '“计划”的第 $1 步已完成。'],
      [/Completed\s+(\d+)\s+minutes?\s+ago/i, '$1 分钟前完成'],
      [/Completed\s+(\d+)\s+hours?\s+ago/i, '$1 小时前完成'],
      [/Completed\s+(\d+)\s+seconds?\s+ago/i, '$1 秒前完成'],
      [/Dec\s+(\d{1,2})\s+(\d{2}:\d{2})/, '12 月 $1 日 $2'],
      [/Nov\s+(\d{1,2})\s+(\d{2}:\d{2})/, '11 月 $1 日 $2'],
      [/Oct\s+(\d{1,2})\s+(\d{2}:\d{2})/, '10 月 $1 日 $2'],
      [/Apr\s+(\d{1,2})\s+(\d{2}:\d{2})/, '4 月 $1 日 $2'],
      [/Aug\s+(\d{1,2})\s+(\d{2}:\d{2})/, '8 月 $1 日 $2'],
      [/Feb\s+(\d{1,2})\s+(\d{2}:\d{2})/, '2 月 $1 日 $2'],
      [/Jan\s+(\d{1,2})\s+(\d{2}:\d{2})/, '1 月 $1 日 $2'],
      [/Jul\s+(\d{1,2})\s+(\d{2}:\d{2})/, '7 月 $1 日 $2'],
      [/Jun\s+(\d{1,2})\s+(\d{2}:\d{2})/, '6 月 $1 日 $2'],
      [/Mar\s+(\d{1,2})\s+(\d{2}:\d{2})/, '3 月 $1 日 $2'],
      [/May\s+(\d{1,2})\s+(\d{2}:\d{2})/, '5 月 $1 日 $2'],
      [/Sep\s+(\d{1,2})\s+(\d{2}:\d{2})/, '9 月 $1 日 $2'],
      [/Completed\s+(\d+)\s+days?\s+ago/i, '$1 天前完成'],
      [/^Searching for\s+"(.+?)"$/i, '正在搜索“$1”'],
      [/Completed\s+<1 minute\s+ago/i, '刚刚完成'],
      [/(\d{1,2})\s+(\d{1,2})月/, '$2 月 $1 日'],
      [/^Searching for\s+(.+)$/i, '正在搜索：$1'],
      [/Today\s+(\d{1,2}:\d{2})/i, '今天 $1'],
      [/Read\s+([\w\.\-]+)/i, '读取文件：$1'],
    ],
    textRules: [
      ['Jules attempts to setup your environment according to hints in your codebase and agents.md. Optionally, you can provide a setup script to be run explicitly. No need for clone commands, the repo will be cloned automatically into the /app directory.', 'Jules 会根据您代码库中的线索和 `agents.md` 文件来尝试配置环境。您也可以提供一个设置脚本来精确执行。仓库会自动克隆到 /app 目录，无需手动执行克隆命令。'],
      ['Let Google use your future Jules conversations and code on content Jules receives from public repositories to train its generative AI models. Opting out does not apply to any feedback you may choose to provide.', '允许 Google 使用您未来与 Jules 的对话，以及 Jules 从公开代码库中获取的代码内容，用于训练其生成式 AI 模型。选择退出此项，不影响您主动提供的任何反馈。'],
      ['After a successful test of the setup script, your environment will be snapshotted for faster startups. For more information and a list of default toolsets installed see the ', '设置脚本成功通过测试后，系统将为您的环境创建快照，以便未来能更快启动。更多信息及默认安装的工具列表，请参阅'],
      ['Google does not train its generative AI models on content Jules receives from your private repositories unless you choose to include that content along with your feedback.', '除非您在提交反馈时选择包含私有代码库中的内容，否则 Google 不会使用这些内容来训练其生成式 AI 模型。'],
      ['Enable notifications to receive updates about your Jules conversations, including when a plan is created or when code is ready for review.', '启 用通知后，您将收到关于 Jules 对话的更新，例如计划已创建或代码待审核的提醒。'],
      ['Jules tackles bugs, small feature requests, and other software engineering tasks, with direct export to GitHub.', 'Jules 能够处理漏洞修复、小型功能请求和其他软件工程任务，并能将代码直接导出到 GitHub。'],
      ['Set your preferences for when you want to be contacted by the Jules team about product updates and research opportunities.', '请设置您的偏好，以 便在 Jules 团队发布产品更新或提供研究机会时与您联系。'],
      ['Jules is currently experiencing high load. You can view your existing tasks. Come back in a bit to create more tasks.', 'Jules 当前负载较高。您可以查看现有任务，请稍后再来创建新任务。'],
      ["I'd like to receive emails for model updates, offers, useful tips and news about Google AI.", '我希望接收关于 Google AI 模型更新、优惠活动、实用 技巧和相关新闻的邮件。'],
      ["Would you like to enable notifications and I'll let you know when a plan is ready or code is ready for review?", '需要启用通知吗？当计划或代码准 备就绪时，我会通知您。'],
      ["You're on the Pro plan—built for steady, high-intensity workflows. Need even more capacity?", '您正在使用专业版订阅——专为稳定、高强度的工作流而设计。需要更高额度吗？'],
      ["I'd like to receive invitations to participate in research studies to help improve Google AI.", '我希望接收参与研究的邀请，以帮助改进 Google AI。'],
      ['Feedback submitted will include your conversation and related code.', '您提交的反馈将包含本次对话和相关的代码。'],
      ['Work with Jules to deeply understand goals before plan generation', '在生成计划前，与 Jules 深入沟通以明确目标'],
      ['Allow AI model training on content from public repositories', '允许 AI 模型使用公开代码库的内容进行训练'],
      ['submitted will include your conversation and related code', '提交内容将包括您的对话和相关代码'],
      ['Jules encountered an error when working on the task.', 'Jules 在处理任务时遇到了一个错误。'],
      ['This step was already completed in the previous plan.', '此步骤在上一个计划中已经完成。'],
      ['Jules is waiting for your input to continue working', 'Jules 正等待您的指示以继续操作'],
      ['The data structures and logic were updated as planned.', '数据结构和逻辑已按计划更新。'],
      ["I've inspected the frontend changes visually: ", '我已通过视觉方式检查了前端的变更：'],
      ['Tell us more - what went right or wrong', '请告诉我们更多细节——哪些地方做得好或不好'],
      ['Deleting a task is permanent and cannot be undone', '删除任务是永久性操作，无法撤销'],
      ['Jules is not yet available in your region.', 'Jules 暂未在您的区域提供服务'],
    ],
  };
  var aistudioGoogleComZhCn = {
    language: 'zh-cn',
    enabled: true,
    styles: [],
    jsRules: [],
    regexRules: [
      [/↩\s*Add a new line\s*\s*Alt\s*\+\s*↩\s*Append text without running\s*\s*Ctrl\s*\+\s*↩\s*Run prompt/i, '↩  换行 Alt + ↩  追加文本 (不执行) Ctrl + ↩  执行指令'],
      [/Invalid JSON: SyntaxError: Unexpected token '(.+?)', "(.+?)" is not valid JSON/i, '无效的 JSON 语法错误：在 “$2” 中存在意外的字符 “$1”'],
      [/([<>]=?)\s*(\d+K)\s+tokens\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '$1$2 Tokens | 输入: $$ $3 / 输出: $$ $4'],
      [/Image \(\*Output per image\) • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '图像 (*每张图片输出) | 输入: $$ $1 / 输出: $$ $2'],
      [/All context lengths\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, '所有上下文长度 | 输入: $$ $1 / 输出: $$ $2'],
      [/Text • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, '文本 | 输入：$$ $1，输出：$ $2'],
      [/Dec\s+(\d{1,2}),\s+(\d{4})/, '$2年12月$1日'],
      [/Nov\s+(\d{1,2}),\s+(\d{4})/, '$2年11月$1日'],
      [/Oct\s+(\d{1,2}),\s+(\d{4})/, '$2年10月$1日'],
      [/Apr\s+(\d{1,2}),\s+(\d{4})/, '$2年4月$1日'],
      [/Aug\s+(\d{1,2}),\s+(\d{4})/, '$2年8月$1日'],
      [/Feb\s+(\d{1,2}),\s+(\d{4})/, '$2年2月$1日'],
      [/Jan\s+(\d{1,2}),\s+(\d{4})/, '$2年1月$1日'],
      [/Jul\s+(\d{1,2}),\s+(\d{4})/, '$2年7月$1日'],
      [/Jun\s+(\d{1,2}),\s+(\d{4})/, '$2年6月$1日'],
      [/Mar\s+(\d{1,2}),\s+(\d{4})/, '$2年3月$1日'],
      [/May\s+(\d{1,2}),\s+(\d{4})/, '$2年5月$1日'],
      [/Sep\s+(\d{1,2}),\s+(\d{4})/, '$2年9月$1日'],
    ],
    textRules: [
      ['Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.', '上传您的个人照片和心仪服装，即可轻松预览上身效果。这间虚拟试衣间由 Nano Banana™ 倾力打造。'],
      ['Gemini 2.5 Flash Audio', 'Gemini 2.5 Flash 音频'],
      ['Here are the changes:', '更改内容如下：'],
      ['Character consistency', '角色一致性'],
      ['object consistency', '客观的'],
      [' Running for ', '运行时间 '],
      ['Image Editing', '图像编辑'],
      ['Restored from', '恢复自：'],
      ['Thinking...', '思考中...'],
      ['Saving…..', '保存中...'],
      ['Save app', '保存 App'],
      ['Added', '添加'],
      ['Live', '实时'],
      ['Medium', '中'],
      ['Move', '移动'],
      ['Name', '新明'],
      ['Save', '保存'],
      ['Send', '发送'],
      ['Stop', '停止'],
      ['Talk', '交谈'],
      ['Text', '文本'],
      ['Type', '类型'],
      ['User', '用户'],
      ['All', '全部'],
      ['Cut', '剪切'],
      ['Empty', '空'],
      ['HOT', '热门'],
      ['Off', '关闭'],
      ['Run', '运行'],
      ['High', '高'],
      ['and', '和'],
      ['Low', '低'],
      ['NEW', '新'],
    ],
  };
  var claudeAiZhCn = {
    language: 'zh-cn',
    enabled: true,
    styles: [],
    jsRules: [],
    regexRules: [
      [/Per person \/ month with annual subscription discount\. SGD ([\d.]+)\s+if billed monthly\. Minimum (\d+)\s+members\./i, '每人/月，享受年度订阅折扣。按月计费则为 SGD $1。最少 $2 名成员。'],
      [/Per person \/ month\. Minimum (\d+)\s+members\./i, '每人/月。最少 $1 名成员。'],
      [/Delete\s+(\d+)\s+selected\s+items?/i, '删除 $1 个选定的项目'],
      [/(\d+)\s+chats?\s+with\s+(.+)/i, '与 $2 共有 $1 条聊天记录'],
      [/Dec\s+(\d{1,2}),\s+(\d{4})/, '$2年12月$1日'],
      [/Nov\s+(\d{1,2}),\s+(\d{4})/, '$2年11月$1日'],
      [/Oct\s+(\d{1,2}),\s+(\d{4})/, '$2年10月$1日'],
      [/Apr\s+(\d{1,2}),\s+(\d{4})/, '$2年4月$1日'],
      [/Aug\s+(\d{1,2}),\s+(\d{4})/, '$2年8月$1日'],
      [/Feb\s+(\d{1,2}),\s+(\d{4})/, '$2年2月$1日'],
      [/Jan\s+(\d{1,2}),\s+(\d{4})/, '$2年1月$1日'],
      [/Jul\s+(\d{1,2}),\s+(\d{4})/, '$2年7月$1日'],
      [/Jun\s+(\d{1,2}),\s+(\d{4})/, '$2年6月$1日'],
      [/Mar\s+(\d{1,2}),\s+(\d{4})/, '$2年3月$1日'],
      [/May\s+(\d{1,2}),\s+(\d{4})/, '$2年5月$1日'],
      [/Sep\s+(\d{1,2}),\s+(\d{4})/, '$2年9月$1日'],
      [/SGD\s+([\d.]+)/i, 'SGD $1'],
    ],
    textRules: [
      ['upstream connect error or disconnect/reset before headers. reset reason: connection termination', '连接后端服务器失败，或在收到其响应数据前连接被重置。重置原因：连接被终止。'],
      ['Don’t share personal information or third-party content without permission, and see our ', '不要分享个人信息或第三方内容，否则会违反我们的'],
      ['Only messages up until now will be shared', '仅分享到目前为止的对话'],
      ['Chat on web, iOS, and Android', '在网页、iOS和Android上聊天'],
      ['Private (only you have access)', '私人（仅您可见）'],
      ['Ability to search the web', '能够搜索网络'],
      ['Analyze text and images', '分析文本和图片'],
      ['English (United States)', '英语（美国）'],
      ['Deutsch (Deutschland)', '德语（德国）'],
      ['français (France)', '法语（法国）'],
      ['Try Claude', '体验 Claude'],
      ['Latest', '最新的'],
      ['Connect', '连接'],
      ['Log out', '登出'],
      ['Members', '成员'],
      ['Thumbs up', '赞'],
      ['Upgrade', '升级'],
      ['Accept', '接受'],
      ['Browse', '浏览'],
      ['Delete', '删除'],
      ['Manage', '管理'],
      ['Chats', '聊天'],
      ['Image', '图片'],
      ['Learn', '学习'],
      ['Legal', '法律'],
      ['Other', '其他'],
      ['Retry', '重试'],
      ['Write', '编写'],
      ['Code', '代码'],
      ['Edit', '编辑'],
      ['Save', '保存'],
      ['Skip', '跳过'],
      ['Star', '收藏'],
    ],
  };
  var platformClaudeComZhCn = {
    language: 'zh-cn',
    enabled: true,
    styles: [],
    jsRules: [],
    regexRules: [
      [/Save up to (\d+)% on Claude Code input tokens when you join our Development Partner Program today/i, '立即加入我们的开发合作伙伴计划，Claude Code 输入令牌可节省高达 $1% 的费用'],
      [/Confirm Development Partner Program enrollment for (.+)/i, '确认为 $1 加入开发合作伙伴计划'],
      [/\$([\d,\.]+)\s+of\s+\$([\d,\.]+)/i, '共 $2 美元，已用 $1 美元'],
      [/(\d+)\s+day\s+retention period/i, '$1 天保留期'],
      [/^(\d{1,3}(?:,\d{3})*)\s+keys?$/i, '$1 个密钥'],
      [/Dec\s+(\d{1,2}),\s+(\d{4})/, '$2年12月$1日'],
      [/Nov\s+(\d{1,2}),\s+(\d{4})/, '$2年11月$1日'],
      [/Oct\s+(\d{1,2}),\s+(\d{4})/, '$2年10月$1日'],
      [/Apr\s+(\d{1,2}),\s+(\d{4})/, '$2年4月$1日'],
      [/Aug\s+(\d{1,2}),\s+(\d{4})/, '$2年8月$1日'],
      [/Feb\s+(\d{1,2}),\s+(\d{4})/, '$2年2月$1日'],
      [/Jan\s+(\d{1,2}),\s+(\d{4})/, '$2年1月$1日'],
      [/Jul\s+(\d{1,2}),\s+(\d{4})/, '$2年7月$1日'],
      [/Jun\s+(\d{1,2}),\s+(\d{4})/, '$2年6月$1日'],
      [/Mar\s+(\d{1,2}),\s+(\d{4})/, '$2年3月$1日'],
      [/May\s+(\d{1,2}),\s+(\d{4})/, '$2年5月$1日'],
      [/Sep\s+(\d{1,2}),\s+(\d{4})/, '$2年9月$1日'],
      [/Resets on\s+(.+)/i, '将于 $1 重置'],
      [/US\$\s*([\d,\.]+)/i, '美元$1'],
    ],
    textRules: [
      ['Disabling web search may break existing services that have web search enabled. Are you sure you want to disable web search for your organization?', '禁用Web搜索可能会破坏启用Web搜索的现有服务。您确定要禁用网络搜索您的组织吗？'],
      ['This will permanently delete all metrics data collected from Claude Code. This action cannot be undone. Are you sure you want to continue?', '这将永久删除从Claude Code收集的所有指标数据。此操作无法撤消。您确定要继续吗？'],
      ['Search and cite content from any domain', '搜索和引用任何域名的内容'],
      ['Delete Claude Code metrics data', '删除 Claude Code 度量数据'],
      ['Code for Anthropic API', 'Anthropic API 的代码'],
      ['How was your experience?', '你的体验怎么样？'],
      ['Need help instead? Visit', '需要帮助吗？访问'],
      ['Give us more details', '告诉我们更多细节'],
      ['Write me an email', '给我写一封电子邮件'],
      ['Your Privacy Choices', '您的隐私选择'],
      ['Disable web search', '禁止网页搜索'],
      ['Summarize a document', '总结文档'],
      ['Recommend a product', '推荐产品'],
      ['Content moderation', '内容审核'],
      ['Help & Support ', '帮助和支持'],
      ['Submit Feedback', '提交反馈'],
      ['Data retention', '数据保留'],
      ['Translate code', '翻译代码'],
      ['Legal center', '法律中心'],
      ['Log out', '登出'],
    ],
  };
  var statusAnthropicComZhCn = {
    language: 'zh-cn',
    enabled: true,
    styles: [],
    jsRules: [],
    regexRules: [
      [/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{2}:\d{2})\s+UTC/i, 'MM月DD日, $3 UTC'],
      [/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})/i, 'YYYY年MM月DD日'],
      [/Uptime over the past\s+(\d+)\s+days\./i, '过去 $1 天的正常运行时间。'],
      [/Resend OTP in:\s*(\d+)\s*seconds/i, '在 $1 秒后重新发送 OTP'],
      [/(?:\d+|\d+\.\d+)\s+components?/i, '$1 个组件'],
      [/^(\d{1,2})\s+Dec\s+(\d{4})$/i, '$2年12月$1日'],
      [/^(\d{1,2})\s+Nov\s+(\d{4})$/i, '$2年11月$1日'],
      [/^(\d{1,2})\s+Oct\s+(\d{4})$/i, '$2年10月$1日'],
      [/([\d\.]+)\s*%\s*uptime/i, '正常运行时间 $1%'],
      [/^(\d{1,2})\s+Apr\s+(\d{4})$/i, '$2年4月$1日'],
      [/^(\d{1,2})\s+Aug\s+(\d{4})$/i, '$2年8月$1日'],
      [/^(\d{1,2})\s+Feb\s+(\d{4})$/i, '$2年2月$1日'],
      [/^(\d{1,2})\s+Jan\s+(\d{4})$/i, '$2年1月$1日'],
      [/^(\d{1,2})\s+Jul\s+(\d{4})$/i, '$2年7月$1日'],
      [/^(\d{1,2})\s+Jun\s+(\d{4})$/i, '$2年6月$1日'],
      [/^(\d{1,2})\s+Mar\s+(\d{4})$/i, '$2年3月$1日'],
      [/^(\d{1,2})\s+May\s+(\d{4})$/i, '$2年5月$1日'],
      [/^(\d{1,2})\s+Sep\s+(\d{4})$/i, '$2年9月$1日'],
      [/(\d+)\s+days ago/i, '$1 天前'],
      [/^(\d+)\s*hrs?$/i, '$1小时'],
      [/^(\d+)\s*secs?$/i, '$1秒'],
      [/(\d+)\s+hrs/i, '$1 小时'],
    ],
    textRules: [
      ['Atlassian uses cookies to improve your browsing experience, perform analytics and research, and conduct advertising. Accept all cookies to indicate that you agree to our use of cookies on your device.', 'Atlassian 使用 Cookie 来改善您的浏览体验、进行分析和研究以及开展广告。接受所有 Cookie 即表示您同意我们在您的设备上使用 Cookie。'],
      ["Welcome to Anthropic's home for real-time and historical data on system performance.", '欢迎访问 Anthropic，在此查看系统性能的实时和历史数据。'],
      ['Team plan organizations unable to add more members', '团队计划组织无法添加更多成员'],
      ['Atlassian cookies and tracking notice', 'Atlassian Cookie 和跟踪声明'],
      ['Subscribe via webhook', '通过 Webhook 订阅'],
      [', (opens new window)', '（在新窗口中打开）'],
      ['Subscribe via email', '通过电子邮件订阅'],
      ['Subscribe via slack', '通过 Slack 订阅'],
      ['Subscribe via teams', '通过 Teams 订阅'],
      ['Uptime over the past ', '正常运行时间'],
      ['Subscribe via SMS', '通过短信订阅'],
      ['Subscribe to updates', '订阅更新'],
      ['% uptime', '% 正常运行时间'],
      ['Only necessary', '仅限必要'],
      ['Preferences', '偏好设置'],
      ['Accept all', '全部接受'],
      ['Page logo', '页面标志'],
      [' days ago', '天前'],
      [' days. ', '天'],
    ],
  };
  var bbcComZhCn = {
    language: 'zh-cn',
    enabled: true,
    styles: [],
    jsRules: [],
    regexRules: [],
    textRules: [],
  };
  var bbcComZhTw = {
    language: 'zh-tw',
    enabled: true,
    styles: [],
    jsRules: [],
    regexRules: [],
    textRules: [],
  };
  var bbcComZhHk = {
    language: 'zh-hk',
    enabled: true,
    styles: [],
    jsRules: [],
    regexRules: [],
    textRules: [],
  };
  var masterTranslationMap = {
    'jules.google.com#zh-cn': julesGoogleComZhCn,
    'aistudio.google.com#zh-cn': aistudioGoogleComZhCn,
    'claude.ai#zh-cn': claudeAiZhCn,
    'platform.claude.com#zh-cn': platformClaudeComZhCn,
    'status.anthropic.com#zh-cn': statusAnthropicComZhCn,
    'bbc.com#zh-cn': bbcComZhCn,
    'bbc.com#zh-tw': bbcComZhTw,
    'bbc.com#zh-hk': bbcComZhHk,
  };
  var LOG_KEY = 'web_translate_debug_mode';
  var isDebugMode = GM_getValue(LOG_KEY, false);
  function updateDebugState(newMode) {
    isDebugMode = newMode;
  }
  function log(...args) {
    if (isDebugMode) {
      console.log('[汉化脚本]', ...args);
    }
  }
  var MENU_COMMAND_ID = 'toggle_debug_log_command';
  function toggleDebugMode() {
    const newMode = !isDebugMode;
    GM_setValue(LOG_KEY, newMode);
    updateDebugState(newMode);
    updateMenuCommand();
  }
  function updateMenuCommand() {
    const status = isDebugMode ? '开启' : '关闭';
    GM_registerMenuCommand(`切换调试日志 (当前: ${status})`, toggleDebugMode, { id: MENU_COMMAND_ID });
  }
  function initializeMenu() {
    updateMenuCommand();
  }
  var STYLE_ID = 'anti-flicker-style';
  function injectAntiFlickerStyle() {
    document.documentElement.classList.add('translation-in-progress');
    const antiFlickerStyle = document.createElement('style');
    antiFlickerStyle.id = STYLE_ID;
    antiFlickerStyle.textContent = `
        html.translation-in-progress body {
            visibility: hidden !important;
            opacity: 0 !important;
        }
        html.translation-complete body {
            visibility: visible !important;
            opacity: 1 !important;
            transition: opacity 0.3s ease-in !important;
        }
        html.translation-in-progress [class*="load"],
        html.translation-in-progress [class*="spin"],
        html.translation-in-progress [id*="load"],
        html.translation-in-progress [id*="spin"],
        html.translation-in-progress .loader,
        html.translation-in-progress .spinner,
        html.translation-in-progress .loading {
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    head.insertBefore(antiFlickerStyle, head.firstChild);
  }
  function removeAntiFlickerStyle() {
    document.documentElement.classList.remove('translation-in-progress');
    document.documentElement.classList.add('translation-complete');
    setTimeout(() => {
      document.getElementById(STYLE_ID)?.remove();
    }, 500);
  }
  var BLOCKS_ALL_TRANSLATION = new Set(['script', 'style', 'pre', 'code']);
  var BLOCKS_CONTENT_ONLY = new Set(['textarea', 'input']);
  var ALL_UNTRANSLATABLE_TAGS = new Set([...BLOCKS_ALL_TRANSLATION, ...BLOCKS_CONTENT_ONLY]);
  var attributesToTranslate = ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'];
  var textTranslationMap;
  var regexRules;
  var translationCache;
  var translatedElements;
  function translateText(text) {
    if (!text || typeof text !== 'string') return text;
    const originalText = text;
    if (translationCache.has(originalText)) {
      return translationCache.get(originalText);
    }
    const trimmedText = text.trim();
    if (trimmedText === '') return text;
    let translatedText = text;
    let hasChanged = false;
    const mapTranslation = textTranslationMap.get(trimmedText);
    if (mapTranslation) {
      const leadingSpace = originalText.match(/^\s*/)[0] || '';
      const trailingSpace = originalText.match(/\s*$/)[0] || '';
      translatedText = leadingSpace + mapTranslation + trailingSpace;
      hasChanged = true;
    } else {
      for (const [match, replacement] of regexRules) {
        const newText = translatedText.replace(match, replacement);
        if (newText !== translatedText) {
          translatedText = newText;
          hasChanged = true;
        }
      }
    }
    if (hasChanged) {
      translationCache.set(originalText, translatedText);
    }
    return translatedText;
  }
  function translateElementContent(element) {
    const tagName = element.tagName?.toLowerCase();
    if (!element || ALL_UNTRANSLATABLE_TAGS.has(tagName) || element.isContentEditable) {
      return false;
    }
    if (element.querySelector(Array.from(ALL_UNTRANSLATABLE_TAGS).join(','))) {
      return false;
    }
    const fullText = element.textContent?.trim();
    if (!fullText) return false;
    const translation = textTranslationMap.get(fullText);
    if (!translation) return false;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => (node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    if (textNodes.length === 0) return false;
    textNodes[0].nodeValue = translation;
    for (let i = 1; i < textNodes.length; i++) {
      textNodes[i].nodeValue = '';
    }
    log('整段翻译:', `"${fullText}"`, '->', `"${translation}"`);
    return true;
  }
  function translateElement(element) {
    if (!element || translatedElements.has(element) || !(element instanceof Element)) return;
    const tagName = element.tagName.toLowerCase();
    if (BLOCKS_ALL_TRANSLATION.has(tagName) || element.isContentEditable) {
      translatedElements.add(element);
      return;
    }
    const isContentBlocked = BLOCKS_CONTENT_ONLY.has(tagName);
    if (!isContentBlocked) {
      if (translateElementContent(element)) {
        translatedElements.add(element);
        return;
      }
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
          let parent = node.parentElement;
          while (parent) {
            if (ALL_UNTRANSLATABLE_TAGS.has(parent.tagName.toLowerCase()) || parent.isContentEditable) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent === element) break;
            parent = parent.parentElement;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      const nodesToTranslate = [];
      while (walker.nextNode()) nodesToTranslate.push(walker.currentNode);
      nodesToTranslate.forEach((textNode) => {
        const originalText = textNode.nodeValue;
        const translatedText = translateText(originalText);
        if (originalText !== translatedText) {
          textNode.nodeValue = translatedText;
        }
      });
    }
    const elementsWithAttributes = element.matches(`[${attributesToTranslate.join('], [')}]`) ? [element, ...element.querySelectorAll(`[${attributesToTranslate.join('], [')}]`)] : [...element.querySelectorAll(`[${attributesToTranslate.join('], [')}]`)];
    elementsWithAttributes.forEach((el) => {
      let current = el;
      let isBlockedByContainer = false;
      while (current && current !== element.parentElement) {
        if (BLOCKS_ALL_TRANSLATION.has(current.tagName.toLowerCase())) {
          isBlockedByContainer = true;
          break;
        }
        if (current === element) break;
        current = current.parentElement;
      }
      if (isBlockedByContainer) return;
      attributesToTranslate.forEach((attr) => {
        if (el.hasAttribute(attr)) {
          const originalValue = el.getAttribute(attr);
          const translatedValue = translateText(originalValue);
          if (originalValue !== translatedValue) {
            el.setAttribute(attr, translatedValue);
          }
        }
      });
    });
    if (element.shadowRoot) {
      translateElement(element.shadowRoot);
    }
    translatedElements.add(element);
  }
  function createTranslator(textMap, regexArr) {
    textTranslationMap = textMap;
    regexRules = regexArr;
    translationCache = new Map();
    translatedElements = new WeakSet();
    return {
      translate: translateElement,
      resetState: () => {
        translationCache.clear();
        translatedElements = new WeakSet();
      },
      deleteElement: (element) => {
        translatedElements.delete(element);
      },
    };
  }
  function initializeObservers(translator) {
    let translationTimer;
    let pendingNodes = new Set();
    let lastModelInfo = '';
    function detectModelChange() {
      const modelElements = document.querySelectorAll('.model-name, .model-info, [class*="model"]');
      const currentModelInfo = Array.from(modelElements)
        .map((el) => el.textContent?.trim())
        .join('|');
      if (currentModelInfo && currentModelInfo !== lastModelInfo) {
        lastModelInfo = currentModelInfo;
        log('检测到模型切换:', currentModelInfo);
        translator.resetState();
        setTimeout(() => {
          if (document.body) {
            translator.translate(document.body);
          }
        }, 100);
        return true;
      }
      return false;
    }
    function scheduleTranslation() {
      clearTimeout(translationTimer);
      translationTimer = setTimeout(() => {
        const hasModelChange = detectModelChange();
        if (pendingNodes.size > 0) {
          const nodesToProcess = Array.from(pendingNodes);
          pendingNodes.clear();
          nodesToProcess.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              translator.translate(node);
            } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
              translator.translate(node.parentElement);
            }
          });
        }
        if (hasModelChange && pendingNodes.size === 0) {
          if (document.body) {
            translator.translate(document.body);
          }
        }
      }, 0);
    }
    const mainObserver = new MutationObserver((mutations) => {
      const dirtyRoots = new Set();
      for (const mutation of mutations) {
        let target = null;
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          target = mutation.target;
        } else if (mutation.type === 'characterData') {
          target = mutation.target.parentElement;
        }
        if (target instanceof Element) dirtyRoots.add(target);
      }
      if (dirtyRoots.size > 0) {
        for (const root of dirtyRoots) {
          translator.deleteElement(root);
          const descendants = root.getElementsByTagName('*');
          for (let i = 0; i < descendants.length; i++) {
            translator.deleteElement(descendants[i]);
          }
          pendingNodes.add(root);
        }
        scheduleTranslation();
      }
    });
    let currentUrl = window.location.href;
    const pageObserver = new MutationObserver(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        log('检测到页面导航，将重新翻译:', currentUrl);
        translator.resetState();
        lastModelInfo = '';
        setTimeout(() => {
          log('开始重新翻译新页面内容...');
          if (document.body) translator.translate(document.body);
        }, 300);
      }
    });
    const modelChangeObserver = new MutationObserver((mutations) => {
      let shouldCheckModel = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              if (element.classList?.contains('mat-mdc-dialog-component-host') || element.querySelector?.('.model-name, .model-info') || element.classList?.contains('model-name') || element.classList?.contains('model-info')) {
                shouldCheckModel = true;
              }
            }
          });
        }
        if (mutation.type === 'characterData') {
          const parent = mutation.target.parentElement;
          if (parent?.classList?.contains('model-name') || parent?.classList?.contains('model-info') || parent?.querySelector?.('.model-name, .model-info')) {
            shouldCheckModel = true;
          }
        }
      });
      if (shouldCheckModel) {
        setTimeout(() => detectModelChange(), 50);
      }
    });
    mainObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'mattooltip'],
      characterData: true,
    });
    pageObserver.observe(document.body, { childList: true, subtree: true });
    modelChangeObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    window.forceRetranslate = function () {
      log('强制重新翻译已触发。');
      translator.resetState();
      lastModelInfo = '';
      if (document.body) {
        translator.translate(document.body);
      }
    };
    log('监听器初始化完成。');
  }
  (function (translations) {
    'use strict';
    injectAntiFlickerStyle();
    function getUserLanguage() {
      const storedLang = localStorage.getItem('web-translate-language');
      if (storedLang && ['zh-cn', 'zh-tw', 'zh-hk'].includes(storedLang)) {
        return storedLang;
      }
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang) {
        if (browserLang.startsWith('zh-HK') || browserLang.startsWith('zh-hk')) {
          return 'zh-hk';
        } else if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-tw')) {
          return 'zh-tw';
        } else if (browserLang.startsWith('zh')) {
          return 'zh-cn';
        }
      }
      return 'zh-cn';
    }
    function selectTranslationForSite(hostname) {
      const userLang = getUserLanguage();
      const langSpecificKey = `${hostname}#${userLang}`;
      if (translations[langSpecificKey]) {
        return translations[langSpecificKey];
      }
      if (translations[hostname]) {
        return translations[hostname];
      }
      const chineseVariants = ['zh-cn', 'zh-tw', 'zh-hk'];
      for (const lang of chineseVariants) {
        const variantKey = `${hostname}#${lang}`;
        if (translations[variantKey]) {
          return translations[variantKey];
        }
      }
      return void 0;
    }
    const siteDictionary = selectTranslationForSite(window.location.hostname);
    if (!siteDictionary) {
      removeAntiFlickerStyle();
      return;
    }
    if (!siteDictionary.enabled) {
      removeAntiFlickerStyle();
      return;
    }
    const { description, testUrl, createdAt, language, styles: cssRules = [], jsRules = [], regexRules: regexRules2 = [], textRules = [] } = siteDictionary;
    const textTranslationMap2 = new Map();
    for (const rule of textRules) {
      if (Array.isArray(rule) && rule.length === 2 && typeof rule[0] === 'string' && typeof rule[1] === 'string') {
        textTranslationMap2.set(rule[0].trim(), rule[1]);
      }
    }
    if (cssRules.length > 0) {
      const customStyleElement = document.createElement('style');
      customStyleElement.id = 'web-translate-custom-styles';
      customStyleElement.textContent = cssRules.join('\n');
      const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
      head.appendChild(customStyleElement);
    }
    if (jsRules.length > 0) {
      const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
      for (const scriptText of jsRules) {
        if (typeof scriptText === 'string' && scriptText.trim()) {
          const scriptElement = document.createElement('script');
          scriptElement.type = 'text/javascript';
          scriptElement.textContent = scriptText;
          head.appendChild(scriptElement);
        }
      }
    }
    const translator = createTranslator(textTranslationMap2, regexRules2);
    function initializeTranslation() {
      translator.translate(document.body);
      log(`初次翻译完成。使用语言: ${language || 'unknown'}`);
      removeAntiFlickerStyle();
      initializeObservers(translator);
    }
    function startTranslation() {
      if (document.body) {
        initializeTranslation();
      } else {
        new MutationObserver((_mutations, obs) => {
          if (document.body) {
            obs.disconnect();
            initializeTranslation();
          }
        }).observe(document.documentElement, { childList: true });
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startTranslation);
    } else {
      startTranslation();
    }
    initializeMenu();
  })(masterTranslationMap);
})();
