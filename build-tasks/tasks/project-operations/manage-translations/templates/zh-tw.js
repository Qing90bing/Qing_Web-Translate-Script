export const getTemplate = (trimmedDomain, variableName, currentDate, language) => {
  return `// 翻譯目標網站: ${trimmedDomain}

export const ${variableName} = {
  // 描述：此翻譯配置的描述資訊
  description: '此翻譯配置適用於 ${trimmedDomain} 網站的本地化。',

  // 測試連結：用於開發者測試網站顯示效果的URL
  testUrl: '',

  // 建立日期：此翻譯配置的建立日期
  createdAt: '${currentDate}',

  // 語言：此翻譯配置適用的語言
  language: '${language}', // 支援的語言: zh-cn(簡體中文), zh-tw(繁體中文), zh-hk(中文香港)

  // 啟用狀態：控制此翻譯配置是否啟用
  enabled: true,

  // 樣式 (CSS)
  // 支援編寫多個CSS規則
  styles: [
    // 在這裡新增styles程式碼，例如：
    // "body { background-color: #f0f0f0; }",
    // "h1 { color: #333; }"
    // ".rule3 { margin: 10px; }"
  ],

  // 禁止翻譯的元素選擇器
  blockedElements: [
    // 在這裡新增CSS選擇器，例如：
    // '.notranslate',
    // '#header .logo'
  ],

  // 擴展翻譯元素選擇器
  // 用於翻譯那些預設情況下未被翻譯的元素
  extendedElements: [
    // 在這裡新增CSS選擇器，例如：
    // '#dynamic-content',
    // '.custom-widget'
  ],

  // 自訂屬性白名單
  // 在此陣列中新增的任何 HTML 屬性名稱，都將在整個網站範圍內被翻譯。
  // 範例: 'data-tip', 'data-title'
  customAttributes: [
    // 在這裡新增自訂屬性
  ],

  // 自訂屬性黑名單
  // 在此陣列中新增的任何 HTML 屬性名稱，都將強制不被翻譯。
  // 此列表的優先級高於白名單，可用於覆蓋預設的翻譯行為。
  // 範例: 'title'
  blockedAttributes: [
    // 在這裡新增要阻止翻譯的屬性
  ],

  // 注入指令碼 (JavaScript)
  // 支援編寫多個JS規則，透過循環遍歷，每個規則都建立獨立的<script>標籤注入到頁面
  jsRules: [
    // 在這裡新增JavaScript程式碼，例如：
    // "console.log('第一條規則');",
    // "alert('第二條規則');",
    // "document.title = '修改後的標題';"
  ],

  // 正規表示式翻譯規則
  // 規則會自動應用於相符的文字
  // 格式: [/原始文字正規表示式/i, '翻譯後的文字']
  // 使用 $1, $2, ... 來參照正規表示式中的擷取組
  // 範例: [/^Hello (\\w+)/, '您好 $1']
  regexRules: [
    // 在這裡新增正規表示式規則
  ],

  // 純文字翻譯規則
  // 規則會完全符合整個文字
  // 格式: ['原始文字', '翻譯後的文字']
  // 範例: ['Login', '登入']
  textRules: [
    // 在這裡新增純文字規則
  ],
};
`;
};