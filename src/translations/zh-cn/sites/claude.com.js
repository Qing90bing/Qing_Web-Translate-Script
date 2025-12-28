// 翻译目标网站: claude.com

export const claudeComZhCn = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 claude.com 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: 'https://claude.com/app-unavailable-in-region',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-12-28',

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
    ["Hi Claude! Could you help me develop a unique voice for an audience? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to— like Google Drive, web search, etc.—if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能帮我为受众开发一种独特的风格吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何有助于您更好完成工作的文档，请告诉我。您可以利用您有权访问的工具（如 Google Drive、网页搜索等）来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Hi Claude! Could you explain a complex topic simply? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to— like Google Drive, web search, etc.—if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能深入浅出地解释一个复杂主题吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何文档，请告诉我。您可以利用您有权访问的工具来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Hi Claude! Could you look over my code and give me tips? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to— like Google Drive, web search, etc.—if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能检查我的代码并提供建议吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何文档，请告诉我。您可以利用您有权访问的工具来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Hi Claude! Could you prepare for an exam or interview? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to— like Google Drive, web search, etc.—if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能为考试或面试做准备吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何文档，请告诉我。您可以利用您有权访问的工具来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Hi Claude! Could you help me make sense of these ideas? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to— like Google Drive, web search, etc.—if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能帮我理清这些思路吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何文档，请告诉我。您可以利用您有权访问的工具来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Hi Claude! Could you explain a programming concept? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to— like Google Drive, web search, etc.—if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能解释一个编程概念吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何文档，请告诉我。您可以利用您有权访问的工具来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Hi Claude! Could you brainstorm creative ideas? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to— like Google Drive, web search, etc.—if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能头脑风暴创意点子吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何文档，请告诉我。您可以利用您有权访问的工具来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Hi Claude! Could you improve my writing style? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to— like Google Drive, web search, etc.—if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能改进我的写作风格吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何文档，请告诉我。您可以利用您有权访问的工具来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Hi Claude! Could you vibe code with me? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to— like Google Drive, web search, etc.—if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能和我一起 Vibe code 吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何文档，请告诉我。您可以利用您有权访问的工具来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Hi Claude! Could you write grant proposals? If you need more information from me, ask me 1-2 key questions right away. If you think I should upload any documents that would help you do a better job, let me know. You can use the tools you have access to — like Google Drive, web search, etc. — if they’ll help you better accomplish this task. Do not use analysis tool. Please keep your responses friendly, brief and conversational. ", "您好 Claude！您能编写资助提案吗？如果您需要我的更多信息，请立即询问 1-2 个关键问题。如果您认为我应该上传任何文档，请告诉我。您可以利用您有权访问的工具来更好地完成此任务。请勿使用分析工具。请保持您的回复友好、简短且具对话性。"],
    ["Please execute the task as soon as you can - an artifact would be great if it makes sense. If using an artifact, consider what kind of artifact (interactive, visual, checklist, etc.) might be most helpful for this specific task. Thanks for your help!", "请尽快执行任务——如果合适，生成一个 Artifact 会很好。如果使用 Artifact，请考虑哪种类型的 Artifact（交互式、视觉、清单等）对这项特定任务最有帮助。感谢您的帮助！"],
    ["Please execute the task as soon as you can—an artifact would be great if it makes sense. If using an artifact, consider what kind of artifact (interactive, visual, checklist, etc.) might be most helpful for this specific task. Thanks for your help!", "请尽快执行任务——如果合适，生成一个 Artifact 会很好。如果使用 Artifact，请考虑哪种类型的 Artifact（交互式、视觉、清单等）对这项特定任务最有帮助。感谢您的帮助！"],
    ["\n      We use cookies to deliver and improve our services, analyze site usage, and if you agree, to customize or personalize your experience and market our services to you. You can read our Cookie Policy ", "我们使用 Cookie 来交付和改进我们的服务、分析网站使用情况，并在您同意的情况下定制或个性化您的体验并向您推销我们的服务。您可以阅读我们的 Cookie 政策"],
    ["Unfortunately, Claude is only available in certain regions right now. Please contact support if you think you’re getting this message in error.", "很抱歉，Claude 目前仅在部分地区可用。如果您认为这是误报，请联系支持团队。"],
    ["Oops! Something went wrong while submitting the form.", "糟糕！提交表单时出了点问题。"],
    ["Help me develop a unique voice for an audience", "帮我为受众开发一种独特的风格"],
    ["Thank you! Your submission has been received!", "感谢！我们已收到您的提交！"],
    ["Enables ads personalization and tracking.", "启用广告个性化和跟踪。"],
    ["App unavailable in region | Claude", "应用在该地区不可用 | Claude"],
    ["Enables security and basic functionality.", "启用安全和基本功能。"],
    ["Look over my code and give me tips", "检查我的代码并提供建议"],
    ["Enables tracking of site performance.", "启用网站性能跟踪。"],
    ["Explain a complex topic simply", "深入浅出地解释复杂主题"],
    ["App unavailable in region", "该应用在您所在的地区不可用"],
    ["Google Cloud’s Vertex AI", "Google Cloud 的 Vertex AI"],
    ["Help me make sense of these ideas", "帮我理清这些思路"],
    ["How can I help you today?", "今天我能帮您做点什么？"],
    ["Prepare for an exam or interview", "准备考试或面试"],
    ["Responsible disclosure policy", "负责任的披露政策"],
    ["\n        Save preferences\n      ", "保存偏好设置"],
    ["Terms of service: Commercial", "服务条款：商业版"],
    ["Ask questions about this page", "针对此页面提问"],
    ["View supported countries", "查看支持的国家/地区"],
    ["Claude Developer Platform", "Claude 开发者平台"],
    ["Engineering at Anthropic", "Anthropic 工程团队"],
    ["Responsible Scaling Policy", "负责任的扩展政策"],
    ["Terms of service: Consumer", "服务条款：个人版"],
    ["Brainstorm creative ideas", "头脑风暴创意点子"],
    ["Claude partner network", "Claude 合作伙伴网络"],
    ["Explain a programming concept", "解释编程概念"],
    ["Improve my writing style", "改进我的写作风格"],
    ["Footer Prompt failure", "页脚提示词提交失败"],
    ["Footer Prompt success", "页脚提示词提交成功"],
    ["Powered by Claude", "由 Claude 提供支持"],
    ["Security and compliance", "安全与合规性"],
    ["Vibe code with me", "和我一起 Vibe code"],
    ["Claude in Chrome", "Chrome 中的 Claude"],
    ["This is another test", "这是另一个测试"],
    ["Write grant proposals", "编写资助提案"],
    ["Claude in Excel", "Excel 中的 Claude"],
    ["Claude in Slack", "Slack 中的 Claude"],
    ["Copy as markdown", "复制为 Markdown"],
    ["Write video scripts", "编写视频脚本"],
    ["Write case studies", "编写案例研究"],
    ["Deutsch (Germany)", "德语（德国）"],
    ["Français (France)", "法语（法国）"],
    ["Regional Compliance", "地区合规性"],
    [" cookie settings", " Cookie 设置"],
    ["Anthropic news", "Anthropic 新闻"],
    ["Code modernization", "代码现代化"],
    ["Service partners", "服务合作伙伴"],
    ["Startups program", "初创企业计划"],
    ["Terms and policies", "条款与政策"],
    ["Help and security", "帮助与安全"],
    ["Cookie settings", "Cookie 设置"],
    ["Financial services", "金融服务"],
    ["this is a test", "这是一个测试"],
    ["App unavailable", "应用不可用"],
    ["Enterprise plan", "企业版方案"],
    [" all cookies", " 所有 Cookie"],
    ["Customer stories", "客户案例"],
    ["Customer support", "客户支持"],
    ["Developer docs", "开发者文档"],
    ["Economic Futures", "经济愿景"],
    ["English (US)", "英语（美国）"],
    ["Console login", "控制台登录"],
    ["Footer Prompt", "页脚提示词"],
    ["Privacy choices", "隐私选择"],
    ["\n        Customize", "定制"],
    ["Meet Claude", "认识 Claude"],
    ["Privacy policy", "隐私政策"],
    ["Support center", "支持中心"],
    ["Contact sales", "联系销售"],
    ["Life sciences", "生命科学"],
    ["Try Claude", "试用 Claude"],
    ["Download app", "下载应用"],
    ["Explore here", "在此探索"],
    ["Nonprofits", "非营利组织"],
    ["Usage policy", "使用政策"],
    ["\n        Accept", "接受"],
    ["\n        Reject", "拒绝"],
    ["Button Text", "按钮文本"],
    ["Team plan", "团队版方案"],
    ["AI agents", "AI 智能体"],
    ["Availability", "可用性"],
    ["Close menu", "关闭菜单"],
    ["Transparency", "透明度"],
    ["Solutions", "解决方案"],
    ["unavailable", "不可用"],
    ["Use cases", "使用场景"],
    ["Connectors", "连接器"],
    ["Max plan", "Max 方案"],
    ["Careers", "职位空缺"],
    ["Government", "政府"],
    ["Industries", "行业"],
    ["Status", "服务状态"],
    ["Analytics", "分析"],
    ["Education", "教育"],
    ["Home page", "首页"],
    ["Marketing", "营销"],
    ["Necessary", "必要"],
    ["Tutorials", "教程"],
    ["Features", "功能"],
    ["Homepage", "首页"],
    ["News", "新闻中心"],
    ["Overview", "概览"],
    ["Platform", "平台"],
    ["Products", "产品"],
    ["Required", "必需"],
    ["Research", "研究"],
    ["Company", "公司"],
    ["Courses", "课程"],
    ["Pricing", "定价"],
    ["Coding", "编程"],
    ["Events", "活动"],
    ["Log in", "登录"],
    ["Models", "模型"],
    ["Next", "下一步"],
    ["Skills", "技能"],
    ["Learn", "学习"],
    ["Write", "写作"],
    ["Blog", "博客"],
    ["Code", "代码"],
    ["here", "此处"],
    ["More", "更多"],
    ["App", "应用"],
    ["Off", "关闭"]
  ],
};
