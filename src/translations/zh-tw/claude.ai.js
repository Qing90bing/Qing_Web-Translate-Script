// src/translations/claude.ai.js

export const claudeAiZhTw = {
  // 描述：此翻譯配置的描述資訊
  description: '此翻譯配置適用於 claude.ai 網站的在地化。',

  // 測試連結：用於開發者測試網站顯示效果的URL
  testUrl: 'https://claude.ai/',

  // 建立日期：此翻譯配置的建立日期
  createdAt: '2025-08-21',

  // 語言：此翻譯配置適用的語言
  language: 'zh-tw',

  // 啟用狀態：控制此翻譯配置是否啟用
  enabled: true,

  // 樣式（CSS）
  styles: [],

  // 禁止翻譯的元素選擇器
  // 為每個網站提供客製化的禁止翻譯元素配置
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

  // 注入指令稿（JavaScript）
  jsRules: [
    // 在這裡新增JavaScript程式碼，例如：
    // "alert('Hello, World!');"
  ],

  // 正規表示式翻譯規則
  regexRules: [
    [/Per person \/ month with annual subscription discount\. SGD ([\d.]+)\s+if billed monthly\. Minimum (\d+)\s+members\./i, "每人/月，享年度訂閱折扣。若按月計費則為 新幣 $1。至少 $2 名成員。"],
    [/Per person \/ month\. Minimum (\d+)\s+members\./i, "每人/月。至少 $1 名成員。"],
    [/Delete\s+(\d+)\s+selected\s+items?/i, "刪除 $1 個選取的項目"],
    [/(\d+)\s+chats?\s+with\s+(.+)/i, "與 $2 共有 $1 則聊天記錄"],
    [/Dec\s+(\d{1,2}),\s+(\d{4})/, "$2年12月$1日"],
    [/Nov\s+(\d{1,2}),\s+(\d{4})/, "$2年11月$1日"],
    [/Oct\s+(\d{1,2}),\s+(\d{4})/, "$2年10月$1日"],
    [/Apr\s+(\d{1,2}),\s+(\d{4})/, "$2年4月$1日"],
    [/Aug\s+(\d{1,2}),\s+(\d{4})/, "$2年8月$1日"],
    [/Feb\s+(\d{1,2}),\s+(\d{4})/, "$2年2月$1日"],
    [/Jan\s+(\d{1,2}),\s+(\d{4})/, "$2年1月$1日"],
    [/Jul\s+(\d{1,2}),\s+(\d{4})/, "$2年7月$1日"],
    [/Jun\s+(\d{1,2}),\s+(\d{4})/, "$2年6月$1日"],
    [/Mar\s+(\d{1,2}),\s+(\d{4})/, "$2年3月$1日"],
    [/May\s+(\d{1,2}),\s+(\d{4})/, "$2年5月$1日"],
    [/Sep\s+(\d{1,2}),\s+(\d{4})/, "$2年9月$1日"],
    [/SGD\s+([\d.]+)/i, "新幣 $1"]
  ],

  // 純文字翻譯規則
  textRules: [
    ["upstream connect error or disconnect/reset before headers. reset reason: connection termination", "與後端伺服器連線錯誤，或在收到其回應標頭前連線被重設。重設原因：連線已終止。"],
    ["Don’t share personal information or third-party content without permission, and see our ", "未經許可，請勿分享個人資訊或第三方內容，並請參閱我們的"],
    ["Only messages up until now will be shared", "僅分享截至目前的訊息"],
    ["Chat on web, iOS, and Android", "在網頁、iOS 和 Android 上聊天"],
    ["Private (only you have access)", "私人 (僅限您本人存取)"],
    ["Ability to search the web", "能夠搜尋網路"],
    ["Analyze text and images", "分析文字與圖片"],
    ["English (United States)", "英文 (美國)"],
    ["Deutsch (Deutschland)", "德文 (德國)"],
    ["français (France)", "法文 (法國)"],
    ["Try Claude", "試用 Claude"],
    ["Star", "標記星號"],
    ["Connect", "連線"],
    ["Log out", "登出"],
    ["Members", "成員"],
    ["Thumbs up", "讚"],
    ["Upgrade", "升級"],
    ["Accept", "接受"],
    ["Browse", "瀏覽"],
    ["Code", "程式碼"],
    ["Delete", "刪除"],
    ["Latest", "最新"],
    ["Manage", "管理"],
    ["Chats", "聊天"],
    ["Image", "圖片"],
    ["Learn", "學習"],
    ["Legal", "法律"],
    ["Other", "其他"],
    ["Retry", "重試"],
    ["Write", "撰寫"],
    ["Edit", "編輯"],
    ["Save", "儲存"],
    ["Skip", "略過"]
  ],
};