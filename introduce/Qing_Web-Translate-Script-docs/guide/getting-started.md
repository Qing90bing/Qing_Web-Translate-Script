# 开始安装

本指南将带您完成“WEB 中文汉化脚本”的安装过程。整个过程非常简单，只需两步即可完成。

## 步骤 1: 安装用户脚本管理器

要运行本脚本，您首先需要在浏览器中安装一个“用户脚本管理器”扩展。这是一种浏览器插件，它允许您安装和管理各种增强网页功能的第三方脚本。

我们强烈推荐 **[Tampermonkey (篡改猴)](https://www.tampermonkey.net/)**，它是目前最流行、功能最强大的脚本管理器。

请访问其官方网站，并根据您的浏览器类型（如 Chrome, Firefox, Edge, Safari 等）下载并安装它。

<div style="text-align: center; margin: 20px 0;">
  <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #42b983; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
    前往 Tampermonkey 官网
  </a>
</div>

> [!IMPORTANT]
> 对于使用 `Chrome / Chromium` 内核浏览器的用户，请确保在安装扩展后，在扩展管理页面 (`chrome://extensions`) 中开启右上角的“开发者模式”，以获得最佳兼容性。

## 步骤 2: 安装 WEB 中文汉化脚本

安装好 Tampermonkey 后，您就可以安装我们的汉化脚本了。我们提供两个版本供您选择：

<div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">

<div class="InstallationCard" style="flex: 1; min-width: 280px; display: flex; flex-direction: column; border-radius: 12px; background-color: var(--vp-c-bg-soft); padding: 24px;">
  <h3 style="margin: 0 0 8px 0; border: none; font-size: 1.1em; font-weight: 600;">CDN 版 <span style="background-color: var(--vp-c-brand-1); color: var(--vp-c-bg-soft); padding: 3px 8px; border-radius: 6px; font-size: 0.8em; vertical-align: middle;">推荐</span></h3>
  <p style="flex-grow: 1; font-size: 0.9em; color: var(--vp-c-text-2); line-height: 1.6;">脚本体积小，能自动获取最新词典，适合绝大多数用户。</p>
  <div style="padding-top: 12px;">
    <a href="https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.cdn.user.js" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: var(--vp-c-brand-1); color: var(--vp-c-bg-soft); border-radius: 8px; text-decoration: none; font-weight: 600;">
      点击安装
    </a>
  </div>
</div>

<div class="InstallationCard" style="flex: 1; min-width: 280px; display: flex; flex-direction: column; border-radius: 12px; background-color: var(--vp-c-bg-soft); padding: 24px;">
  <h3 style="margin: 0 0 8px 0; border: none; font-size: 1.1em; font-weight: 600;">离线版 <span style="background-color: var(--vp-c-gray-1); color: var(--vp-c-text-1); padding: 3px 8px; border-radius: 6px; font-size: 0.8em; vertical-align: middle;">稳定</span></h3>
  <p style="flex-grow: 1; font-size: 0.9em; color: var(--vp-c-text-2); line-height: 1.6;">内置所有翻译数据，无需联网加载，但需手动更新脚本以获取最新词典。</p>
  <div style="padding-top: 12px;">
    <a href="https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.user.js" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: var(--vp-c-brand-1); color: var(--vp-c-bg-soft); border-radius: 8px; text-decoration: none; font-weight: 600;">
      点击安装
    </a>
  </div>
</div>

</div>

点击您选择版本的“点击安装”链接，Tampermonkey 会自动弹出安装确认窗口，再次点击“安装”即可完成。

安装完成后，脚本就已经准备就绪了！

## 步骤 3: 验证安装

安装成功后，您可以访问任何一个我们已经支持的网站（例如 [Google AI Studio](https://aistudio.google.com/)），脚本会自动检测并应用汉化。

您也可以点击浏览器工具栏上的 Tampermonkey 图标，在“管理面板”中看到“WEB 中文汉化脚本”已处于启用状态。

现在，您可以开始享受更清爽、更友好的浏览体验了！