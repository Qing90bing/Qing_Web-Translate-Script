// 翻译目标网站: huggingface.co

export const huggingfaceCoZhCn = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 huggingface.co 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: 'https://huggingface.co/',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-10-13',

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
    ["Access tokens programmatically authenticate your identity to the Hugging Face Hub, allowing applications to perform specific actions specified by the scope of permissions (read, write, or admin) granted", "访问令牌以编程方式对您的身份进行认证，允许应用程序执行由授予的权限范围（读、写或管理）指定的具体行动。"],
    ["Disclaimer: AI is an area of active research with known problems such as biased generation and misinformation. Do not use this application for high-stakes decisions or advice.", "免责声明：人工智能是一个活跃的研究领域，存在一些已知问题，如偏差生成和错误信息。请勿将此应用程序用于高风险决策或建议。"],
    ["Delete your HF account permanently, this action is irreversible. All your repositories (models, datasets, & Spaces) will be deleted.", "永久删除您的 HF 账户，此操作不可逆。您的所有资源库（模型、数据集和 Spaces）都将被删除。"],
    ["We will use this email to communicate with you. This is also the email to use to authenticate on hf.co.", "我们将使用此电子邮件与您联系。这也是在 hf.co 上进行身份验证时使用的电子邮件。"],
    ["The platform where the machine learning community collaborates on models, datasets, and applications.", "机器学习社区协作开发模型、数据集和应用的平台"],
    ["Your conversations will be shared with model authors unless you disable it from your settings.", "除非你在设置中禁用，否则你的对话将与模型作者共享。"],
    ["Link additional emails to your account to join your organizations easily and", "将其他的电子邮件链接到你的账户，以便轻松地加入你的组织和"],
    ["Choose on which organizations/users to get notified on new discussions and PRs", "选择哪些组织/用户获得新的讨论和公告的通知"],
    ["Making the community's best AI chat models available to everyone.", "让每个人都能使用社区中最好的人工智能聊天模型。"],
    ["Hugging Face is way more fun with friends and colleagues! ", "与朋友和同事一起加入 Hugging Face 更快乐！"],
    ["You need to add a payment method to get started.", "您需要添加一个支付方式才能开始使用。"],
    ["Discover amazing ML apps made by the community!", "发现社区制作的神奇 ML 应用程序！"],
    ["Please Sign in with Hugging Face to continue", "请登录 Hugging Face 以继续"],
    ["You are not a member of any organization.", "你不是任何组织的成员。"],
    ["New activity on watched orgs/users", "被关注的组织/用户的新活动"],
    ["Search models, datasets, users...", "搜索模型、数据集、用户..."],
    ["Join the community of machine learners!", "加入机器学习社区！"],
    ["No recent user activity to display", "没有显示最近的用户活动"],
    ["Other notifications (email only)", "其他的通知（仅电子邮件）"],
    ["Write an email from bullet list", "根据子弹列表编写电子邮件"],
    ["Create ML models without code", "无需代码即可创建 ML 模型"],
    ["The AI community building the future.", "构建未来 AI 社区"],
    ["Llama2 With Gradio Chat", "带有 Gradio 聊天功能的 Llama2"],
    ["Requests to join your organization", "要求加入你的组织"],
    ["running apps, trending first", "运行应用程序，趋势先行"],
    ["Scale with dedicated hardware", "使用专用硬件进行扩展"],
    ["Accelerate your ML roadmap", "加快你的 ML 路线图"],
    ["Sign in withHugging Face", "用 Hugging Face 登录"],
    ["Unconditional Image Generation", "无条件图像生成"],
    ["Zero-Shot Image Classification", "零镜头图像分类"],
    ["New features and announcements", "新功能和公告"],
    ["Automatic Speech Recognition", "自动语音识别"],
    ["Deploy models in minutes", "几分钟内部署模型"],
    ["Document Question Answering", "文档问题解答"],
    ["Expert Acceleration Program", "专家加速计划"],
    ["Natural Language Processing", "自然语言处理"],
    ["Update payment information", "更新支付信息"],
    ["Using HF paid services", "使用 HF 付费服务"],
    ["Open LLM Leaderboard", "开放式 LLM 排行榜"],
    ["Visual Question Answering", "视觉问题解答"],
    ["Participating and mentions", "参与和提及"],
    ["Table Question Answering", "表格问题解答"],
    ["The Tokenizer Playground", "代币器游乐场"],
    ["Build ML collaboratively", "协同建立 ML"],
    ["Confirm your new password", "确认新密码"],
    ["Join Hugging Face", "加入 Hugging Face"],
    ["Organization Leaderboard", "组织排行榜"],
    ["Text2Text Generation", "文本对文本生成"],
    ["Code a snake game", "编写蛇形游戏代码"],
    ["Transformers doc", "Transformers 文档"],
    ["IDEFICS Playground", "IDEFICS 游乐场"],
    ["Join an organization", "加入一个组织"],
    ["mithril-security", "Mithril-security"],
    ["Tabular Classification", "表格式分类"],
    ["Zero-Shot Classification", "零点分类"],
    ["Additional emails", "额外的电子邮件"],
    ["Delete your account", "删除您的帐户"],
    ["No application file", "没有应用文件"],
    ["Confirm new password", "确认新密码"],
    ["TCO Calculator", "总拥有成本计算器"],
    ["Delete my account", "删除我的账户"],
    ["Sentence Similarity", "句子相似性"],
    ["Updated a model", "更新了一个模型"],
    ["Assist in a task", "协助完成任务"],
    ["Audio Classification", "音频分类"],
    ["Dismiss this message", "不再提醒"],
    ["Enter new password", "输入新密码"],
    ["GitHub username", "GitHub 用户名"],
    ["Image Classification", "图像分类"],
    ["LoRA the Explorer", "探险家 LoRA"],
    ["Tabular Regression", "表格式回归"],
    ["Token Classification", "令牌分类"],
    ["Video Classification", "视频分类"],
    ["Create organization", "创建组织"],
    ["Explore AI Apps", "探索 AI 应用"],
    ["Inference Endpoints", "推导端点"],
    ["MTEB Leaderboard", "MTEB 排行榜"],
    ["Payment information", "支付信息"],
    ["Text Classification", "文本分类"],
    ["Alphabetical", "按字母顺序排列"],
    ["Feature Extraction", "特征提取"],
    ["Image Segmentation", "图像分割"],
    ["Image To Story", "图片转至故事"],
    ["PRO Subscription", "专业版订阅"],
    ["Question Answering", "问题解答"],
    ["Research interests", "研究兴趣"],
    ["Computer Vision", "计算机视觉"],
    ["Liked a model", "喜欢一个模型"],
    ["Liked a space", "喜欢一个空间"],
    ["Primary email", "主要电子邮件"],
    ["Audio-to-Audio", "音频到音频"],
    ["Depth Estimation", "深度估计"],
    ["Edit profile", "编辑个人资料"],
    ["Image-to-Image", "图像到图像"],
    ["Object Detection", "物体检测"],
    ["Profile Settings", "简介设置"],
    ["Recently Updated", "最近更新"],
    ["Text-to-Speech", "文本到语音"],
    ["Twitter username", "推特账户"],
    ["Watch settings ", "观察设置 "],
    ["\n			Trending on", "热门话题"],
    ["Image-to-Text", "图像到文本"],
    ["Multilinguality", "多语言性"],
    ["Text Generation", "文本生成"],
    ["Text-to-Image", "文本到图像"],
    ["Text-to-Video", "文本到视频"],
    ["Documentations", "文档资料"],
    ["Most Downloads", "最多下载"],
    ["Access Tokens", "访问令牌"],
    ["Current Model", "当前模型"],
    ["Organizations", "组织机构"],
    ["Search Spaces", "搜索空间"],
    ["last 7 days", "最近 7 天"],
    ["Save changes", "保存更改"],
    ["Seamless M4T", "无缝 M4T"],
    ["System theme", "系统主题"],
    ["Candle Yolo", "烛光晚餐"],
    ["Light theme", "光明主题"],
    ["New Dataset", "新数据集"],
    ["Private Hub", "私人枢纽"],
    ["(optional)", "（可选）"],
    ["Conversational", "对话"],
    ["Dark theme", "黑暗主题"],
    ["Fine-Grained", "细致的"],
    ["New Password", "新密码"],
    ["Old password", "旧密码"],
    ["AutoTrain", "自动训练"],
    ["Fill-Mask", "填充掩码"],
    ["Hub guide", "中枢指南"],
    ["minutes ago", "分钟前"],
    ["Notifications", "通知"],
    ["repositories ", "仓库"],
    ["Solutions", "解决方案"],
    ["Summarization", "总结"],
    ["this week\n			", "本周"],
    ["GPG Keys", "GPG 密钥"],
    ["Hardware", "硬件设施"],
    ["ISO code", "ISO 代码"],
    ["months ago", "个月前"],
    ["Multimodal", "多模态"],
    ["Notification", "通知"],
    ["Sign Out", "退出登录"],
    ["Libraries", "图书馆"],
    ["New Model", "新模型"],
    ["New Space", "新空间"],
    ["Privacy", "隐私保护"],
    ["Translation", "翻译"],
    ["Classrooms", "教室"],
    ["Create New", "新建"],
    ["Datasets", "数据集"],
    ["Licenses", "许可证"],
    ["Previous", "上一页"],
    ["Robotics", "机器人"],
    ["Username", "用户名"],
    ["Community", "社区"],
    ["Email", "电子邮件"],
    ["Full name", "全名"],
    ["Languages", "语言"],
    ["Resources", "资源"],
    ["Updated", "更新于"],
    ["days ago", "天前"],
    ["Examples", "示例"],
    ["Feedback", "反馈"],
    ["HF Store", "商店"],
    ["Homepage", "主页"],
    ["Jobs", "工作机会"],
    ["Language", "语言"],
    ["None yet", "尚无"],
    ["Overview", "概述"],
    ["Password", "密码"],
    ["Settings", "设置"],
    ["Trending", "趋势"],
    ["a space", "空间"],
    ["Account", "帐户"],
    ["Billing", "计费"],
    ["Company", "公司"],
    ["Discuss", "讨论"],
    ["Inbox", "收件箱"],
    ["Metrics", "指标"],
    ["Pricing", "定价"],
    ["Profile", "概述"],
    ["Sign Up", "注册"],
    ["Tabular", "表格"],
    ["TOS", "服务条款"],
    ["Website", "网站"],
    ["Avatar", "头像"],
    ["Course", "课程"],
    ["Log In", "登录"],
    ["Models", "模型"],
    ["Next", "下一页"],
    ["Spaces", "空间"],
    ["About", "关于"],
    ["Audio", "音频"],
    ["Forum", "论坛"],
    ["Learn", "学习"],
    ["Likes", "喜欢"],
    ["Sizes", "大小"],
    ["Tasks", "任务"],
    ["Theme", "主题"],
    ["Blog", "博客"],
    ["Docs", "文档"],
    ["Team", "团队"],
    ["All", "全部"],
    ["Get", "获取"],
    ["Web", "网页"],
    ["or", "或"]
  ],
};
