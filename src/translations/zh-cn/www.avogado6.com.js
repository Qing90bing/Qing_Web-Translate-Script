// 翻译目标网站: www.avogado6.com

export const wwwAvogado6ComZhCn = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 www.avogado6.com 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: 'https://www.avogado6.com',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-10-05',

  // 语言：此翻译配置适用的语言
  language: 'zh-cn', // 支持的语言: zh-cn(简体中文), zh-tw(繁体中文), zh-hk(中文香港)

  // 启用状态：控制此翻译配置是否启用
  enabled: true,

  // 样式 (CSS)
  // 支持编写多个CSS规则
  styles: [
  `
    @font-face {
      font-family: 'custom-numbers';
      src: local('Palatino Linotype'), local('Book Antiqua'), local('Palatino');
      unicode-range: U+30-39;
    }
    body, body * {
      font-family: 'custom-numbers', Georgia, 'STSong', '华文宋体', 'NSimSun', '新宋体', 'SimSun', '宋体', serif !important;
    }
    .img_imageZoomComp, .img_imageZoomComp * {
      font-family: initial !important;
    }
  `
  ],

  // 禁止翻译的元素选择器
  blockedElements: [
    '.img_imageZoomComp'
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
    ["\n情報用Twitterアカウントと​中国アカウントは運営を関係者に任せています。", "\n【信息分享】Twitter账号和中国账号均由相关人员运营。"],
    ["UTAUなど配布素材についてはこちら​(外部サイトに飛びます)", "关于发布的UTAU素材请访问此链接（外部网站）"],
    ["ニコニコ動画内で映像を使用する場合、", "在 NicoNico 视频内使用视频时，请遵守以下规定，"],
    ["\nまた、アボガド6が制作したと分かる様、", "\n此外，Avogado6 制作的作品均已在内容树中注册，"],
    ["動画説明欄に作者名を記載してください。", "请在视频描述中包含作者姓名。"],
    ["アボガド6が管理しているアカウントは上記のみです。", "Avogado6 仅管理以上账号。"],
    ["UTAU・素材配布サイト 仮倉庫", "UTAU 素材发布站 - 临时仓库"],
    ["下記メールアドレスまで​ご連絡下さい。", "请通过以下邮箱联系我们。"],
    ["なりすましや故意的な類似名のアカウントに", "请谨防假冒及高仿账号"],
    ["(たまにアカウントがロックされます)", "(偶尔账户会被锁定)"],
    ["コンテンツツリーの登録をして下さい。", "请注册内容树。"],
    ["・二次創作及び、", "・关于二次创作及，"],
    ["作品使用についての規約", "作品使用条款"],
    ["​Twitter【個人用】", "Twitter【个人】"],
    ["メインコンテンツにスキップ", "跳过主要内容"],
    ["home | アボガド6", "首页 | アボガド6"],
    ["about/contact", "关于/联系"],
    ["Red(小紅書)", "Red(小红书)"],
    ["【ボカロ用】", "【VOCALOID专用】"],
    ["何かありましたら", "如有任何事宜"],
    ["トレース・模倣", "临摹与模仿"],
    ["【情報用】", "【信息分享】"],
    ["利用規約", "使用条款"],
    ["・映像 ", "・影像 "],
    ["■ home", "■ 首页"],
    ["​ご注意ください。", "。"],
    ["について", "的规定"],
    ["works", "作品"],
    ["home", "首页"],
    ["shop", "周边"]
  ],
};
