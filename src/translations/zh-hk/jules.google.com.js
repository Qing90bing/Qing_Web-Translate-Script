// src/translations/jules.google.com.js

export const julesGoogleComZhHk = {
  // 描述：此翻譯配置的描述資訊
  description: '此翻譯配置適用於 jules.google.com 網站的本地化。',

  // 測試連結：用於開發者測試網站顯示效果的URL
  testUrl: 'https://jules.google.com/',

  // 建立日期：此翻譯配置的建立日期
  createdAt: '2025-08-21',
  
  // 語言：此翻譯配置適用的語言
  language: 'zh-hk',

  // 啟用狀態：控制此翻譯配置是否啟用
  enabled: true,

  // 樣式 (CSS)
  // 支援編寫多個CSS規則，透過join('\n')方法連接成一個字串，並透過單一<style>標籤注入到頁面
  styles: [
    '.feedback-button { width: auto !important; white-space: nowrap !important; }'
  ],

  // 禁止翻譯的元素選擇器
  // 為每個網站提供客製化的禁止翻譯元素配置
  blockedElements: [
    // 在這裡新增CSS選擇器，例如：
    // '.notranslate',
    // '#header .logo'
  ],

  // 注入指令稿 (JavaScript)
  // 支援編寫多個JS規則，透過迴圈遍歷，每個規則都建立獨立的<script>標籤注入到頁面
  jsRules: [
    // 在這裡新增JavaScript程式碼，例如：
    // "alert('Hello, World!');"
  ],

  // 正規表示式翻譯規則
  // 規則會自動應用於匹配的文字
  // 格式: [/原始文字正規表示式/i, '翻譯後的文字']
  // 使用 $1, $2, ... 來參照正規表示式中的捕獲組
  // 範例: [/^您好 (\w+)/, 'Hello $1']
  regexRules: [
    [/^Step\s+(\d+)\s+of the plan is complete\.$/i, "「計劃」的第 $1 步已完成。"],
    [/Completed\s+(\d+)\s+minutes?\s+ago/i, "$1 分鐘前完成"],
    [/Completed\s+(\d+)\s+hours?\s+ago/i, "$1 小時前完成"],
    [/Completed\s+(\d+)\s+seconds?\s+ago/i, "$1 秒前完成"],
    [/Dec\s+(\d{1,2})\s+(\d{2}:\d{2})/, "12 月 $1 日 $2"],
    [/Nov\s+(\d{1,2})\s+(\d{2}:\d{2})/, "11 月 $1 日 $2"],
    [/Oct\s+(\d{1,2})\s+(\d{2}:\d{2})/, "10 月 $1 日 $2"],
    [/Apr\s+(\d{1,2})\s+(\d{2}:\d{2})/, "4 月 $1 日 $2"],
    [/Aug\s+(\d{1,2})\s+(\d{2}:\d{2})/, "8 月 $1 日 $2"],
    [/Feb\s+(\d{1,2})\s+(\d{2}:\d{2})/, "2 月 $1 日 $2"],
    [/Jan\s+(\d{1,2})\s+(\d{2}:\d{2})/, "1 月 $1 日 $2"],
    [/Jul\s+(\d{1,2})\s+(\d{2}:\d{2})/, "7 月 $1 日 $2"],
    [/Jun\s+(\d{1,2})\s+(\d{2}:\d{2})/, "6 月 $1 日 $2"],
    [/Mar\s+(\d{1,2})\s+(\d{2}:\d{2})/, "3 月 $1 日 $2"],
    [/May\s+(\d{1,2})\s+(\d{2}:\d{2})/, "5 月 $1 日 $2"],
    [/Sep\s+(\d{1,2})\s+(\d{2}:\d{2})/, "9 月 $1 日 $2"],
    [/Completed\s+(\d+)\s+days?\s+ago/i, "$1 天前完成"],
    [/^Searching for\s+"(.+?)"$/i, "正在搜尋「$1」"],
    [/Completed\s+<1 minute\s+ago/i, "剛剛完成"],
    [/^Searching for\s+(.+)$/i, "正在搜尋：$1"],
    [/(\d{1,2})\s+(\d{1,2})月/, "$2 月 $1 日"],
    [/Read\s+([\w\.\-]+)/i, "讀取檔案：$1"],
    [/Today\s+(\d{1,2}:\d{2})/i, "今天 $1"]
  ],

  // 純文字翻譯規則
  // 規則會完全匹配整個文字
  // 格式: ['原始文字', '翻譯後的文字']
  // 範例: ['登入', 'Login']
  textRules: [
    ["Jules attempts to setup your environment according to hints in your codebase and agents.md. Optionally, you can provide a setup script to be run explicitly. No need for clone commands, the repo will be cloned automatically into the /app directory.", "Jules 會嘗試根據您代碼庫中的提示和 `agents.md` 檔案來設定您的環境。您也可以選擇提供一個設定腳本來明確執行。儲存庫會自動複製到 /app 目錄，無需手動執行複製指令。"],
    ["Let Google use your future Jules conversations and code on content Jules receives from public repositories to train its generative AI models. Opting out does not apply to any feedback you may choose to provide.", "允許 Google 使用您未來與 Jules 的對話，以及 Jules 從公開儲存庫中獲取的內容，用於訓練其生成式 AI 模型。選擇退出不適用於您可能選擇提供的任何意見回饋。"],
    ["After a successful test of the setup script, your environment will be snapshotted for faster startups. For more information and a list of default toolsets installed see the ", "設定腳本成功測試後，系統將為您的環境建立快照，以便將來能更快啟動。如需更多資訊及預設安裝的工具組清單，請參閱"],
    ["Google does not train its generative AI models on content Jules receives from your private repositories unless you choose to include that content along with your feedback.", "除非您在提交意見回饋時選擇包含私有儲存庫中的內容，否則 Google 不會使用這些內容來訓練其生成式 AI 模型。"],
    ["Enable notifications to receive updates about your Jules conversations, including when a plan is created or when code is ready for review.", "啟用通知以接收關於您 Jules 對話的更新，包括當計劃建立或代碼可供審核時。"],
    ["Jules tackles bugs, small feature requests, and other software engineering tasks, with direct export to GitHub.", "Jules 能夠處理錯誤修復、小型功能請求及其他軟件工程任務，並能將代碼直接匯出到 GitHub。"],
    ["Set your preferences for when you want to be contacted by the Jules team about product updates and research opportunities.", "設定您的偏好設定，以便在 Jules 團隊發布產品更新或提供研究機會時與您聯繫。"],
    ["Jules is currently experiencing high load. You can view your existing tasks. Come back in a bit to create more tasks.", "Jules 目前負載較高。您可以檢視現有任務，請稍後再回來建立新任務。"],
    ["Would you like to enable notifications and I'll let you know when a plan is ready or code is ready for review?", "您想啟用通知嗎？當計劃或代碼準備就緒時，我會通知您。"],
    ["You're on the Pro plan—built for steady, high-intensity workflows. Need even more capacity?", "您正在使用專業版方案——專為穩定、高強度的工作流程而設。需要更多容量嗎？"],
    ["I'd like to receive emails for model updates, offers, useful tips and news about Google AI.", "我希望收到關於 Google AI 模型更新、優惠、實用技巧和相關新聞的電郵。"],
    ["I'd like to receive invitations to participate in research studies to help improve Google AI.", "我希望能收到參與研究的邀請，以協助改善 Google AI。"],
    ["Work with Jules to deeply understand goals before plan generation", "在產生計劃前，與 Jules 深入溝通以確實了解目標"],
    ["Feedback submitted will include your conversation and related code.", "提交的意見回饋將包含您的對話和相關代碼。"],
    ["Allow AI model training on content from public repositories", "允許 AI 模型使用公開儲存庫的內容進行訓練"],
    ["submitted will include your conversation and related code", "提交的內容將包含您的對話和相關代碼"],
    ["Jules is waiting for your input to continue working", "Jules 正在等待您的輸入以繼續工作"],
    ["I've inspected the frontend changes visually: ", "我已透過視覺化方式檢查了前端的變更："],
    ["The data structures and logic were updated as planned.", "資料結構和邏輯已按計劃更新。"],
    ["This step was already completed in the previous plan.", "此步驟已在上一個計劃中完成。"],
    ["Jules encountered an error when working on the task.", "Jules 在處理任務時發生錯誤。"],
    ["Jules is not yet available in your region.", "Jules 目前尚未在您所在的地區提供服務。"],
    ["Deleting a task is permanent and cannot be undone", "刪除任務是永久性的，無法復原"],
    ["Tell us more - what went right or wrong", "告訴我們更多資訊 - 哪些地方正確或錯誤"]
  ],
};