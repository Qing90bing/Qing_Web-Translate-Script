// src/translations/jules.google.com.js

export const julesGoogleCom = [
    ['css', '.feedback-button { width: auto !important; white-space: nowrap !important; }'],
    // --- 正则表达式翻译 ---
    // 匹配 "Completed ... ago" 等完成状态
    [/Ran command\s+"(.*?)"/i, '执行命令：“$1”'],
    [/Read\s+([\w\.\-]+)/i, '读取文件：$1'],
    [/(\d{1,2})\s+(\d{1,2})月/, '$2 月 $1 日'],
    [/^Searching for\s+"(.+?)"$/i, '正在搜索“$1”'],
    [/^Searching for\s+(.+)$/i, '正在搜索：$1'],
    [/^Step\s+(\d+)\s+of the plan is complete\.$/i, '“计划”的第 $1 步已完成。'],
    [/Completed\s+<1 minute\s+ago/i, '刚刚完成'],
    [/Completed\s+(\d+)\s+days?\s+ago/i, '$1 天前完成'],
    [/Completed\s+(\d+)\s+hours?\s+ago/i, '$1 小时前完成'],
    [/Completed\s+(\d+)\s+minutes?\s+ago/i, '$1 分钟前完成'],
    [/Completed\s+(\d+)\s+seconds?\s+ago/i, '$1 秒前完成'],

    // 匹配日期和时间 (例如: Jan 1 14:30)
    [/Jan\s+(\d{1,2})\s+(\d{2}:\d{2})/, '1 月 $1 日 $2'],
    [/Feb\s+(\d{1,2})\s+(\d{2}:\d{2})/, '2 月 $1 日 $2'],
    [/Mar\s+(\d{1,2})\s+(\d{2}:\d{2})/, '3 月 $1 日 $2'],
    [/Apr\s+(\d{1,2})\s+(\d{2}:\d{2})/, '4 月 $1 日 $2'],
    [/May\s+(\d{1,2})\s+(\d{2}:\d{2})/, '5 月 $1 日 $2'],
    [/Jun\s+(\d{1,2})\s+(\d{2}:\d{2})/, '6 月 $1 日 $2'],
    [/Jul\s+(\d{1,2})\s+(\d{2}:\d{2})/, '7 月 $1 日 $2'],
    [/Aug\s+(\d{1,2})\s+(\d{2}:\d{2})/, '8 月 $1 日 $2'],
    [/Sep\s+(\d{1,2})\s+(\d{2}:\d{2})/, '9 月 $1 日 $2'],
    [/Oct\s+(\d{1,2})\s+(\d{2}:\d{2})/, '10 月 $1 日 $2'],
    [/Nov\s+(\d{1,2})\s+(\d{2}:\d{2})/, '11 月 $1 日 $2'],
    [/Dec\s+(\d{1,2})\s+(\d{2}:\d{2})/, '12 月 $1 日 $2'],
    [/Today\s+(\d{1,2}:\d{2})/i, '今天 $1'],

    // --- 完整句子和短语翻译 ---
    // 按长度降序排列，以优先匹配长句
    ["Jules is not yet available in your region.", "Jules 暂未在您的区域提供服务"],
    ["Jules attempts to setup your environment according to hints in your codebase and agents.md. Optionally, you can provide a setup script to be run explicitly. No need for clone commands, the repo will be cloned automatically into the /app directory.", "Jules 会根据您代码库中的线索和 `agents.md` 文件来尝试配置环境。您也可以提供一个设置脚本来精确执行。仓库会自动克隆到 /app 目录，无需手动执行克隆命令。"],
    ["Let Google use your future Jules conversations and code on content Jules receives from public repositories to train its generative AI models. Opting out does not apply to any feedback you may choose to provide.", "允许 Google 使用您未来与 Jules 的对话，以及 Jules 从公开代码库中获取的代码内容，用于训练其生成式 AI 模型。选择退出此项，不影响您主动提供的任何反馈。"],
    ["After a successful test of the setup script, your environment will be snapshotted for faster startups. For more information and a list of default toolsets installed see the ", "设置脚本成功通过测试后，系统将为您的环境创建快照，以便未来能更快启动。更多信息及默认安装的工具列表，请参阅"],
    ["Google does not train its generative AI models on content Jules receives from your private repositories unless you choose to include that content along with your feedback.", "除非您在提交反馈时选择包含私有代码库中的内容，否则 Google 不会使用这些内容来训练其生成式 AI 模型。"],
    ["Enable notifications to receive updates about your Jules conversations, including when a plan is created or when code is ready for review.", "启 用通知后，您将收到关于 Jules 对话的更新，例如计划已创建或代码待审核的提醒。"],
    ["Jules tackles bugs, small feature requests, and other software engineering tasks, with direct export to GitHub.", "Jules 能够处理漏洞修复、小型功能请求和其他软件工程任务，并能将代码直接导出到 GitHub。"],
    ["Set your preferences for when you want to be contacted by the Jules team about product updates and research opportunities.", "请设置您的偏好，以 便在 Jules 团队发布产品更新或提供研究机会时与您联系。"],
    ["Jules is currently experiencing high load. You can view your existing tasks. Come back in a bit to create more tasks.", "Jules 当前负载较高。您可以查看现有任务，请稍后再来创建新任务。"],
    ["I'd like to receive emails for model updates, offers, useful tips and news about Google AI.", "我希望接收关于 Google AI 模型更新、优惠活动、实用 技巧和相关新闻的邮件。"],
    ["Would you like to enable notifications and I'll let you know when a plan is ready or code is ready for review?", "需要启用通知吗？当计划或代码准 备就绪时，我会通知您。"],
    ["You're on the Pro plan—built for steady, high-intensity workflows. Need even more capacity?", "您正在使用专业版订阅——专为稳定、高强度的工作流而设计。需要更高额度吗？"],
    ["I'd like to receive invitations to participate in research studies to help improve Google AI.", "我希望接收参与研究的邀请，以帮助改进 Google AI。"],
    ["Feedback submitted will include your conversation and related code.", "您提交的反馈将包含本次对话和相关的代码。"],
    ["Work with Jules to deeply understand goals before plan generation", "在生成计划前，与 Jules 深入沟通以明确目标"],
    ["Allow AI model training on content from public repositories", "允许 AI 模型使用公开代码库的内容进行训练"],
    ["submitted will include your conversation and related code", "提交内容将包括您的对话和相关代码"],
    ["You have unsaved changes. Are you sure you want to leave?", "您有未保存的变更,确定要离开吗？"],
    ["Jules encountered an error when working on the task.", "Jules 在处理任务时遇到了一个错误。"],
    ["This step was already completed in the previous plan.", "此步骤在上一个计划中已经完成。"],
    ["The data structures and logic were updated as planned.", "数据结构和逻辑已按计划更新。"],
    ["Jules is waiting for your input to continue working", "Jules 正等待您的指示以继续操作"],
    ["I've inspected the frontend changes visually: ", "我已通过视觉方式检查了前端的变更："],
    ["Tell us more - what went right or wrong", "请告诉我们更多细节——哪些地方做得好或不好"],
    ["Deleting a task is permanent and cannot be undone", "删除任务是永久性操作，无法撤销"],

];