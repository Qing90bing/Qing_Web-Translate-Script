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
    // 在这里添加正则表达式规则
  ],

  // 纯文本翻译规则
  // 规则会完全匹配整个文本
  // 格式: ['原始文本', '翻译后的文本']
  // 示例: ['Login', '登录']
  textRules: [
    ["home", "首页"],
    ["利用規約","使用条款"],
    ["works","作品"],
    ["shop","周边"],
    ["about/contact","关于/联系"],
    ["UTAUなど配布素材についてはこちら&ZeroWidthSpace;(外部サイトに飛びます)", "关于UTAU等发布素材，请点击此处&ZeroWidthSpace;（将跳转到外部网站）"],
    ["作品使用についての規約", "关于作品使用的规定"],
    ["Terms", "使用条款"],
    ["・二次創作及び、トレース・模倣について", "・关于二次创作、描摹与模仿"],
    ["・映像 ＜Movie＞", "・影像 ＜Movie＞"],
    ["ニコニコ動画内で映像を使用する場合、", "在Niconico动画内使用影像时，"],
    ["コンテンツツリーの登録をして下さい。", "请进行内容树的登录。"],
    ["また、アボガド6が制作したと分かる様、", "此外，为明确作品由avogado6（アボガド6）制作，"],
    ["動画説明欄に作者名を記載してください。", "请在视频说明栏中记载作者名。"],
    ["Twitterやyoutubeなど、ニコニコ動画外で映像を使用する場合、", "在Twitter或YouTube等Niconico动画以外的平台使用影像时，"],
    ["アボガド6が制作したと分かる様、", "为明确作品由avogado6（アボガド6）制作，"],
    ["作者名を動画説明欄や投稿文に記載してください。", "请在视频说明栏或帖子中记载作者名。"],
    ["また、使用作品のURLも同様に記載してください。", "另外，也请一并记载所使用作品的URL。"],
    ["ただし、ニコニコ動画のビデオクリップ機能などの", "但是，关于使用Niconico动画的视频剪辑功能等"],
    ["動画サイト側の切り抜き機能を使用したSNSへの共有については", "视频网站自带的剪辑功能分享至社交网络，"],
    ["クレジットは任意で構いません。", "是否标注出处皆可。"],
    ["ライブなど金銭が発生する場での使用は必ず事前にご連絡下さい。", "在演唱会等会产生金钱交易的场合使用时，请务必事先联系我们。"],
    ["なお、ニコニコ動画のクリエイター奨励プログラムにおいてのみ、", "另外，仅限于在Niconico动画的创作者奖励计划中，"],
    ["歌ってみた動画などの映像を使用して作成した作品、", "使用本影像制作的“翻唱”视频等作品，"],
    ["または手書き動画などの二次創作作品で", "或手书视频等二次创作作品，"],
    ["収益を得ることを許可します。", "允许获得收益。"],
    ["その際もコンテンツツリーの親作品登録と、元作品をアボガド6が", "届时也请进行内容树的亲作品登录，并为明确原作由avogado6（アボガド6）"],
    ["制作したと分かる様、作者名を記載してください", "制作，请记载作者名。"],
    ["ただし、ミラー動画などの自身の創造性が主体でない作品では、", "但是，对于镜像搬运视频等非自身创造性为主体的作品，"],
    ["収益を得ることを禁じます。", "禁止获得收益。"],
    ["並びに、加工・改変はお止め下さい。", "同时，请勿进行加工或修改。"],
    ["音源の使用については各制作者様のガイドラインに従ってください。", "关于音源的使用，请遵循各制作人的准则。"],
    ["When using video on the video hosting website (YouTube, etc.),be sure to include the copyright notice for Avogado6 and URL of the original work.", "在视频托管网站（YouTube等）上使用视频时，请务必包含avogado6的版权声明和原作的URL。"],
    ["Please contact us for permission to use when money is generated.", "当涉及盈利时，请联系我们以获得使用许可。"],
    ["And processing and modification are prohibited.", "并且禁止加工和修改。"],
    ["・映像のトレース・模倣について", "・关于影像的描摹与模仿"],
    ["・イラスト、漫画 ＜Art / Comic＞", "・插画、漫画 ＜Art / Comic＞"],
    ["TwitterやLINE、他インターネット上のすべての媒体において", "在Twitter、LINE以及其他所有网络媒体上，"],
    ["作者名・作品URLの記載なく、使用することを禁じます。", "禁止在未记载作者名和作品URL的情况下使用。"],
    ["(アイコン、ヘッダー、紹介など)", "（头像、横幅、介绍等）"],
    ["使用する場合はアボガド6が制作したと分かる様、", "如需使用，为明确作品由avogado6（アボガド6）制作，"],
    ["プロフィール欄などの分かりやすい場所に", "请在个人资料栏等易于看到的地方"],
    ["作者名を記載してください。", "记载作者名。"],
    ["また、どのイラストを使用したか分かる様、", "此外，为明确使用了哪一张插画，"],
    ["その作品のURLも同様に記載してください。", "也请一并记载该作品的URL。"],
    ["特に、アイコンなどで創作物を利用する際、", "特别是，在使用作品作为头像等用途时，"],
    ["利用者は周りの人を傷つけたり不愉快にさせる言動は", "使用者伤害他人或发表令人不快言论的行为"],
    ["絶対にしないで下さい。", "是绝对禁止的。"],
    ["尚、作者名・作品URLの記載があっても", "另外，即使记载了作者名和作品URL，"],
    ["instagramやTumblr、youtube、", "在Instagram、Tumblr、YouTube、"],
    ["その他画像投稿サイトへの転載などの", "或其他图片发布网站上转载等"],
    ["紹介や引用の範囲を超えた使用や、", "超出介绍或引用范围的使用，"],
    ["無断でのグッズ化、", "以及未经许可的周边商品化，"],
    ["他、収益が生じる場での使用は固く禁じます。", "或其他会产生收益的场合下的使用，均被严格禁止。"],
    ["When posting on Twitter, LINE, etc , be sure to include Art title, Art URL, and the copyright notice for Avogado6.", "在Twitter、LINE等平台发布时，请务必包含作品标题、作品URL以及avogado6的版权声明。"],
    ["In particular, when using the work of Avogado6 as an icon,", "特别是，当使用avogado6的作品作为头像时，"],
    ["users should never say or do anything to hurt", "用户绝不应发表任何伤害"],
    ["or offend those around them.", "或冒犯他人的言论。"],
    ["Their reprints on Instagram, Tumblr and YouTube are prohibited.", "禁止在Instagram、Tumblr和YouTube上转载。"],
    ["Processing and modification are prohibited.", "禁止加工和修改。"],
    ["And It is strictly forbidden to use it", "并且严禁将其用于"],
    ["in any place where revenue is generated.", "任何产生收益的场合。"],
    ["・イラストのトレース・模倣について", "・关于插画的描摹与模仿"],
    ["・楽曲<Music>", "・乐曲<Music>"],
    ["ニコニコ動画内で楽曲を使用する場合、", "在Niconico动画内使用乐曲时，"],
    ["Twitterやyoutubeなど、", "在Twitter或YouTube等，"],
    ["ニコニコ動画外で楽曲を使用する場合、", "Niconico动画以外的平台使用乐曲时，"],
    ["楽曲を使用して作成した作品で収益を得ることを許可します。", "允许通过使用乐曲创作的作品获得收益。"],
    ["その際はコンテンツツリーの親作品登録は必ずしてください。", "届时请务必进行内容树的亲作品登录。"],
    ["並びに楽曲内で有料効果音を使用しているため、", "同时，由于乐曲中使用了付费音效，"],
    ["楽曲を素材化し使用することを禁じます。", "禁止将乐曲作为素材使用。"],
    ["When using video on the video hosting website (YouTube, etc.),", "在视频托管网站（YouTube等）上使用视频时，"],
    ["be sure to include the copyright notice for Avogado6.", "请务必包含avogado6的版权声明。"],
    ["二次創作及び、トレース・模倣について", "关于二次创作、描摹与模仿"],
    ["映像、イラスト、漫画などすべての作品において、", "关于影像、插画、漫画等所有作品，"],
    ["非営利かつ個人的な利用の場合、複製・保存等は", "在非盈利且个人使用的前提下，复制、保存等行为"],
    ["ご自由にしていただいて構いません。", "可以自由进行。"],
    ["二次創作(ファンアート)についても", "关于二次创作（同人作品），"],
    ["ご自由に制作、公開しても大丈夫です。", "也可以自由地制作和发布。"],
    ["ただし、精巧に元作品を再現した二次創作イラストが、", "但是，由于曾发生过精确再现原作的二次创作插画"],
    ["「アボガド6のイラスト」として無断転載されていたことが", "被当作“avogado6的插画”未经许可转载的情况，"],
    ["あったため、イラスト・映像問わず、", "因此，无论是插画还是影像，"],
    ["トレースや明らかな模倣を行って制作した作品を発表する場合は、", "在发布通过描摹或明显模仿创作的作品时，"],
    ["模倣元の作品名と、その制作をアボガド6が担当している旨を", "请注明模仿的原作名称，以及该作由avogado6负责制作的事实，"],
    ["また、アボガド6が映像を担当している楽曲MVの", "此外，对于avogado6负责影像制作的歌曲MV，"],
    ["歌ってみた・カバー動画などで、元の映像・サムネイル等を", "在“翻唱”或翻唱视频中，将原始影像、缩略图等"],
    ["無断でトレースをし、オリジナルMVとして発表している例が", "未经许可进行描摹并作为原创MV发布的例子"],
    ["多数見受けられます。", "时有发生。"],
    ["個人的に、自分の作品が素材扱いされるのは", "从个人角度而言，自己的作品被当作素材使用"],
    ["快く思わないため、下記例を参考にして", "并非乐见之事，因此若能参考以下示例"],
    ["クレジット等を記載していただけると嬉しく思います。", "并标注出处，我将不胜感激。"],
    ["模倣例1", "模仿示例1"],
    ["元映像を参考にキャラクターやアイテムを置き換えてすべて描き下ろし、", "参考原始影像，替换角色和物品并全部重新绘制，"],
    ["新しく映像を作った。", "制作了新的影像。"],
    ["模倣例2", "模仿示例2"],
    ["元映像を参考に歌詞配置や色彩・演出などの編集を行い、", "参考原始影像，进行歌词布局、色彩、演出等编辑，"],
    ["明らかに元映像を想起させる内容で、新しく映像を作った。", "以明显让人联想到原始影像的内容，制作了新的影像。"],
    ["禁止例", "禁止示例"],
    ["元映像の上からキャラクターやアイテムだけを置き換え一部加工し、", "在原始影像上仅替换角色和物品并进行部分加工，"],
    ["映像を作った。", "制作了影像。"],
    ["例外", "例外情况"],
    ["元映像を加工せずサイズを調整・配置、その他部分にキャラクターを置き", "未加工原始影像，仅调整尺寸和位置，并在其他部分放置角色，"],
    ["カバー映像を作った。", "制作了翻唱影像。"],
    ["トレース・模倣のクレジット例：", "描摹/模仿的出处标注示例："],
    ["原作 シャルル／flower", "原作 Charles／flower"],
    ["作詞作曲　バルーン", "作词作曲 Balloon"],
    ["原作映像　アボガド6", "原作影像 avogado6"],
    ["(+ニコニコ動画の場合コンテンツツリーの登録)", "（+在Niconico动画的情况下需登录内容树）"],
    ["※尚、商用や企業が関わるものでの模倣・トレースは", "※另外，涉及商业或企业用途的模仿/描摹，"],
    ["いかなる場合でも事前にご連絡くださるようお願いいたします。", "无论何种情况都请务必事先联系我们。"],
    ["※利用規約に沿ってトレース・模倣を行い作成した", "※即使是遵循使用规定进行描摹/模仿创作的"],
    ["作品であっても、「オリジナルMV」など誤解を招く文言を", "作品，使用“原创MV”等易引起误解的措辞"],
    ["記載をして発表することは固く禁じます。", "进行发布也是严格禁止的。"],
    ["また、アボガド6作品全般において、", "此外，对于avogado6的所有作品，"],
    ["利用者は規約に沿って利用していたとしても、", "即使用户是遵循规定进行使用，"],
    ["創作物自体や人を傷つけたり不愉快にさせる言動は", "也绝对禁止发表伤害作品本身或他人、或令人不快的言论。"],
    ["並びに、アボガD6作品を利用して別の作品を", "同时，请勿利用avogado6的作品"],
    ["制作し公開しないでください。", "来创作并发布另一部作品。"],
    ["禁止例1：自分で作った楽曲にアボガド6のイラストを付けた", "禁止示例1：为自己创作的乐曲配上avogado6的插画"],
    ["映像を動画サイトに投稿する", "并将影像投稿至视频网站。"],
    ["禁止例2：アボガド6のイラストに、自分の詩などの言葉をのせて", "禁止示例2：在avogado6的插画上添加自己的诗歌等文字"],
    ["加工しSNSなどに投稿する。", "并加工后发布到社交网络等平台。"],
    ["利用規約は予告なく変更される場合があります。", "使用规定可能会在不另行通知的情况下变更。"],
    ["当ページに記載されている内容が最新のものであり、", "本页面记载的内容为最新版本，"],
    ["過去作品すべてにも、この規約が適応されます。", "此规定同样适用于所有过去的作品。"],
    ["尚、上記規約に違反して作品を使用している場面を発見した際、", "另外，若发现违反上述规定的作品使用情况，"],
    ["削除申請や使用料の請求をする場合がございます。", "我们可能会提出删除申请或要求支付使用费。"],
    ["それによって違反コンテンツが削除されたり、", "由此导致违规内容被删除，"],
    ["違反者にとってなにかしらの不利益が生じても", "或给违规者带来任何不利影响，"],
    ["一切の責任を負いません。", "我们概不负责。"],
    ["ご留意ください。", "敬请留意。"],
    ["For non-profit and personal use, reproduction and storage are possible.", "出于非盈利和个人用途，可以进行复制和存储。"],
    ["You are free to create and publish your own fanart.", "您可以自由创作和发布自己的同人作品。"],
    ["However, if you have traced or clearly imitated the original work, please include the original work and the name of the author.", "但是，如果您描摹或明显模仿了原作，请注明原作和作者姓名。"],
    ["Example of imitation: When releasing a cover of a song for which Avogado6 is in charge of the video, a new video is created by replacing characters and items based on the original video.", "模仿示例：在发布avogado6负责视频制作的歌曲翻唱时，基于原始视频替换角色和物品来创作新视频。"],
    ["Prohibited example: When releasing a cover of a song for which", "禁止示例：在发布一首歌曲的翻唱时，如果"],
    ["Avogado6 is in charge of the video, created a video", "avogado6负责该视频的制作，通过"],
    ["by", "以下方式创建视频："],
    ["partially modifying the original video, replacing only the characters and items on top of the original video.", "部分修改原始视频，仅在原始视频上替换角色和物品。"],
    ["Please do not say or do anything to hurt or displease the creations themselves or others, even if you are using them in accordance with the terms and conditions of the Avogado6 art works in general.", "请不要发表任何伤害或冒犯创作本身或他人的言论，即使您是按照avogado6作品的通用条款和条件来使用它们。"],
    ["Please do not create and publish another work using the Avogado6 work.", "请不要使用avogado6的作品来创作和发布另一部作品。"],
    ["Prohibited example 1: Posting a video of a song you made with an illustration of Avogado6 on a video site.", "禁止示例1：将您自己创作的歌曲配上avogado6的插画，并发布到视频网站。"],
    ["Prohibited example 2: Placing your own poetry or other words on the Avogado6 illustration, processing it, and posting it on SNS, etc.", "禁止示例2：在avogado6的插画上添加您自己的诗歌或其他文字，进行加工后发布到社交网络等平台。"],
    ["The Terms of Use are subject to change without notice.", "使用条款如有变更，恕不另行通知。"],
    ["The information on this page is the most current version.", "本页信息为最新版本。"],
    ["These terms and conditions also apply to all past works.", "这些条款和条件同样适用于所有过去的作品。"],
    ["We may take legal action for those who violate the terms.", "我们可能会对违反条款者采取法律行动。"],
    ["In that case, we will not take any responsibility for any disadvantage.", "在这种情况下，我们对任何不利后果概不负责。"],
    ["使用に関してご不明な点がありましたら下記連絡先までご連絡ください。", "关于使用有任何疑问，请通过以下联系方式与我们联系。"],
    ["Please contact us for any questions.", "如有任何问题，请联系我们。"],
  ],
};
