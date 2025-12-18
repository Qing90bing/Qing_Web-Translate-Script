// 翻译目标网站: sso.curseforge.com

export const ssoCurseforgeComZhCn = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 sso.curseforge.com 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: '',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-12-16',

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
  regexRules: [
    [/\s*Please\s+confirm\s+this\s+is\s+the\s+account\s+you\s+wish\s+to\s+sign\s+in\s+with:?\s*/i, "请确认您要使用此账号登录："],
    [/\s*Continue\s+as\s+(.+?)\s*$/i, "以 $1 身份继续"],
    [/\s*Hi\s+(.+?)\s*$/i, "你好，$1"]
  ],

  // 纯文本翻译规则
  // 规则会完全匹配整个文本
  // 格式: ['原始文本', '翻译后的文本']
  // 示例: ['Login', '登录']
  textRules: [
    ["\n          CurseForge is managed by Overwolf. By continuing you agree to", "CurseForge 由 Overwolf 管理，继续登录即表示同意"],
    ["\n      To continue, CurseForge will gain access to your:\n      ", "为了继续，CurseForge 将获得您的："],
    ["\n            Sign up\n            with Discord\n          ", "使用 Discord 注册"],
    ["\n            Log in\n            with Discord\n          ", "使用 Discord 登录"],
    ["\n            Sign up\n            with Github\n          ", "使用 Github 注册"],
    ["\n            Sign up\n            with Google\n          ", "使用 Google 注册"],
    ["\n            Sign up\n            with Twitch\n          ", "使用 Twitch 注册"],
    ["\n            Log in\n            with Github\n          ", "使用 Github 登录"],
    ["\n            Log in\n            with Google\n          ", "使用 Google 登录"],
    ["\n            Log in\n            with Twitch\n          ", "使用 Twitch 登录"],
    ["\n              Already have an account?\n              ", "已有账号吗？"],
    ["\n              New to CurseForge?\n              ", "新用户吗？"],
    ["Agree to sign in with CurseForge", "同意使用 CurseForge 登录"],
    ["Please try again or contact our ", "请再次尝试或联系我们的"],
    ["\n            Terms of Service\n          ", "服务条款"],
    ["Create a CurseForge Account", "创建 CurseForge 账号"],
    ["\n            Privacy Policy\n          ", "隐私政策"],
    ["Create an\n                account", "创建一个账号"],
    ["Welcome back to CurseForge", "欢迎回到 CurseForge"],
    ["\n          Overwolf’s\n          ", "Overwolf 的"],
    ["Oops, something went wrong", "哦，出现了一些问题"],
    ["Confirm and sign in", "确认并登录"],
    ["\n           and\n          ", "和"],
    ["Profile Information", "个人信息"],
    ["E-mail address", "邮箱地址"],
    ["General Error", "一般错误"],
    ["support team", "支持团队"],
    ["Subscriptions", "订阅"],
    ["Log in", "登录"]
  ],
};
