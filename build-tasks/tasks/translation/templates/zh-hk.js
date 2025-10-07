export const getTemplate = (trimmedDomain, variableName, currentDate, language) => {
  return `// 翻譯目標網站: ${trimmedDomain}

export const ${variableName} = {
  // 描述：此翻譯配置嘅描述資訊
  description: '此翻譯配置適用於 ${trimmedDomain} 網站嘅本地化。',

  // 測試連結：用於開發者測試網站顯示效果嘅URL
  testUrl: '',

  // 建立日期：此翻譯配置嘅建立日期
  createdAt: '${currentDate}',

  // 語言：此翻譯配置適用嘅語言
  language: '${language}', // 支援嘅語言: zh-cn(簡體中文), zh-tw(繁體中文), zh-hk(中文香港)

  // 啟用狀態：控制此翻譯配置係咪啟用
  enabled: true,

  // 樣式 (CSS)
  // 支援編寫多個CSS規則
  styles: [
    // 喺呢度新增styles程式碼，例如：
    // "body { background-color: #f0f0f0; }",
    // "h1 { color: #333; }"
    // ".rule3 { margin: 10px; }"
  ],

  // 禁止翻譯嘅元素選擇器
  blockedElements: [
    // 喺呢度新增CSS選擇器，例如：
    // '.notranslate',
    // '#header .logo'
  ],

  // 擴展翻譯元素選擇器
  // 用於翻譯嗰啲預設情況下未被翻譯嘅元素
  extendedElements: [
    // 喺呢度新增CSS選擇器，例如：
    // '#dynamic-content',
    // '.custom-widget'
  ],

  // 注入指令碼 (JavaScript)
  // 支援編寫多個JS規則，透過循環遍歷，每個規則都建立獨立嘅<script>標籤注入到頁面
  jsRules: [
    // 喺呢度新增JavaScript程式碼，例如：
    // "console.log('第一條規則');",
    // "alert('第二條規則');",
    // "document.title = '修改後嘅標題';"
  ],

  // 正規表示式翻譯規則
  // 規則會自動應用於相符嘅文字
  // 格式: [/原始文字正規表示式/i, '翻譯後嘅文字']
  // 使用 $1, $2, ... 嚟參照正規表示式中嘅擷取組
  // 範例: [/^Hello (\\w+)/, '您好 $1']
  regexRules: [
    // 喺呢度新增正規表示式規則
  ],

  // 純文字翻譯規則
  // 規則會完全符合成個文字
  // 格式: ['原始文字', '翻譯後嘅文字']
  // 範例: ['Login', '登入']
  textRules: [
    // 喺呢度新增純文字規則
  ],
};
`;
};