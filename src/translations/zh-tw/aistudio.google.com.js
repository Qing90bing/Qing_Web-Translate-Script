// src/translations/aistudio.google.com.js

export const aistudioGoogleComZhTw = {
  // 描述：此翻譯配置的描述資訊
  description: '此翻譯配置適用於 aistudio.google.com 網站的在地化。',

  // 測試連結：用於開發者測試網站顯示效果的URL
  testUrl: 'https://aistudio.google.com/',

  // 建立日期：此翻譯配置的建立日期
  createdAt: '2025-08-21',

    // 語言：此翻譯配置適用的語言
  language: 'zh-tw',

  // 啟用狀態：控制此翻譯配置是否啟用
  enabled: true,

  // 樣式（CSS）
  styles: [
    // 在這裡新增CSS規則，例如：
    // 'body { font-family: "Arial", sans-serif; }'
  ],

  // 禁止翻譯的元素選擇器
  // 為每個網站提供客製化的禁止翻譯元素配置
  blockedElements: [
    // 在這裡新增CSS選擇器，例如：
    // '.notranslate',
    // '#header .logo'
  ],

  // 注入指令稿（JavaScript）
  jsRules: [
    // 在這裡新增JavaScript程式碼，例如：
    // "alert('Hello, World!');"
  ],

  // 正規表示式翻譯規則
  regexRules: [
    [/↩\s*Add a new line\s*\s*Alt\s*\+\s*↩\s*Append text without running\s*\s*Ctrl\s*\+\s*↩\s*Run prompt/i, "↩  換行 Alt + ↩  附加文字 (不執行) Ctrl + ↩  執行提示"],
    [/Invalid JSON: SyntaxError: Unexpected token '(.+?)', "(.+?)" is not valid JSON/i, "無效的 JSON 語法錯誤：在「$2」中存在非預期的字元「$1」"],
    [/([<>]=?)\s*(\d+K)\s+tokens\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, "$1$2 Tokens | 輸入: $ $3 / 輸出: $ $4"],
    [/Image \(\*Output per image\) • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, "圖片 (*每張圖片輸出) | 輸入: $ $1 / 輸出: $ $2"],
    [/All context lengths\s+•\s+Input:\s+\$([\d.]+)\s+\/\s+Output:\s+\$([\d.]+)/i, "所有內容長度 | 輸入: $ $1 / 輸出: $ $2"],
    [/Text • Input: \$([\d.]+) \/ Output: \$([\d.]+)/i, "文字 | 輸入：$ $1，輸出：$ $2"],
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
    [/Sep\s+(\d{1,2}),\s+(\d{4})/, "$2年9月$1日"]
  ],

  // 純文字翻譯規則
  textRules: [
    ["Upload a photo of yourself and an outfit to see how it looks on you. A virtual fitting room powered by Nano Banana.", "上傳您的個人照片和一套服飾，即可預覽穿在您身上的效果。這間虛擬試衣間由 Nano Banana™ 提供技術支援。"],
    ["Gemini 2.5 Flash Audio", "Gemini 2.5 Flash 音訊"],
    ["Here are the changes:", "變更內容如下："],
    ["Character consistency", "角色一致性"],
    ["object consistency", "物件一致性"],
    [" Running for ", "執行時間 "],
    ["Image Editing", "圖片編輯"],
    ["Restored from", "從...復原："],
    ["Thinking...", "思考中..."],
    ["Saving…..", "儲存中..."],
    ["Save app", "儲存應用程式"],
    ["Added", "已新增"],
    ["Live", "即時"],
    ["Medium", "中"],
    ["Move", "移動"],
    ["Name", "名稱"],
    ["Save", "儲存"],
    ["Send", "傳送"],
    ["Stop", "停止"],
    ["Talk", "交談"],
    ["Text", "文字"],
    ["Type", "類型"],
    ["User", "使用者"],
    ["All", "全部"],
    ["Cut", "剪下"],
    ["Empty", "空"],
    ["HOT", "熱門"],
    ["Off", "關閉"],
    ["Run", "執行"],
    ["High", "高"],
    ["and", "與"],
    ["Low", "低"],
    ["NEW", "新"]
  ],
};