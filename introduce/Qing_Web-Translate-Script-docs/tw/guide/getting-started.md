# 開始安裝

本指南將帶您完成「WEB 中文漢化腳本」的安裝過程。整個過程非常簡單，只需兩步即可完成。

## 步驟 1: 安裝使用者腳本管理器

要執行本腳本，您首先需要在瀏覽器中安裝一個「使用者腳本管理器」擴充功能。這是一種瀏覽器外掛程式，它允許您安裝和管理各種增強網頁功能的第三方腳本。

我們強烈推薦 **[Tampermonkey (竄改猴)](https://www.tampermonkey.net/)**，它是目前最流行、功能最強大的腳本管理器。

請造訪其官方網站，並根據您的瀏覽器類型（如 Chrome, Firefox, Edge, Safari 等）下載並安裝它。

<div style="text-align: center; margin: 20px 0;">
  <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #42b983; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
    前往 Tampermonkey 官網
  </a>
</div>

> [!IMPORTANT]
> 對於使用 `Chrome / Chromium` 核心瀏覽器的使用者，請確保在安裝擴充功能後，在擴充功能管理頁面 (`chrome://extensions`) 中開啟右上角的「開發者模式」，以獲得最佳相容性。

## 步驟 2: 安裝 WEB 中文漢化腳本

安裝好 Tampermonkey 後，您就可以安裝我們的漢化腳本了。我們提供兩個版本供您選擇：

<div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">

<div class="InstallationCard" style="flex: 1; min-width: 280px; display: flex; flex-direction: column; border-radius: 12px; background-color: var(--vp-c-bg-soft); padding: 24px;">
  <h3 style="margin: 0 0 8px 0; border: none; font-size: 1.1em; font-weight: 600;">CDN 版 <span style="background-color: var(--vp-c-brand-1); color: white; padding: 3px 8px; border-radius: 6px; font-size: 0.8em; vertical-align: middle;">推薦</span></h3>
  <p style="flex-grow: 1; font-size: 0.9em; color: var(--vp-c-text-2); line-height: 1.6;">腳本體積小，能自動獲取最新詞典，適合絕大多數使用者</p>
  <div style="padding-top: 12px; text-align: right;">
    <a href="https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.cdn.user.js" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: var(--vp-c-brand-1); color: white;border-radius: 8px; text-decoration: none; font-weight: 600;">
      點擊安裝
    </a>
  </div>
</div>

<div class="InstallationCard" style="flex: 1; min-width: 280px; display: flex; flex-direction: column; border-radius: 12px; background-color: var(--vp-c-bg-soft); padding: 24px;">
  <h3 style="margin: 0 0 8px 0; border: none; font-size: 1.1em; font-weight: 600;">離線版 <span style="background-color: var(--vp-c-brand-1); color: white; padding: 3px 8px; border-radius: 6px; font-size: 0.8em; vertical-align: middle;">穩定</span></h3>
  <p style="flex-grow: 1; font-size: 0.9em; color: var(--vp-c-text-2); line-height: 1.6;">內建所有翻譯資料，無需聯網載入，但需手動更新腳本以獲取最新詞典</p>
  <div style="padding-top: 12px; text-align: right;">
    <a href="https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.user.js" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: var(--vp-c-brand-1); color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
      點擊安裝
    </a>
  </div>
</div>

</div>

點擊您選擇版本的「點擊安裝」連結，Tampermonkey 會自動彈出安裝確認視窗，再次點擊「安裝」即可完成。

安裝完成後，腳本就已經準備就緒了！

## 步驟 3: 驗證安裝

安裝成功後，您可以造訪任何一個我們已經支援的網站（例如 [Google AI Studio](https://aistudio.google.com/)），腳本會自動偵測並套用漢化。

您也可以點擊瀏覽器工具列上的 Tampermonkey 圖示，在「管理面板」中看到「WEB 中文漢化腳本」已處於啟用狀態。

現在，您可以開始享受更清爽、更友善的瀏覽體驗了！
