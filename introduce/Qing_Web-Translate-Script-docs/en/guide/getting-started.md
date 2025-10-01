# Getting Started

This guide will walk you through the installation process for the "Web Translate Script". The process is very simple and can be completed in just two steps.

## Step 1: Install a Userscript Manager

To run this script, you first need to install a "Userscript Manager" extension in your browser. This is a browser add-on that allows you to install and manage various third-party scripts that enhance web pages.

We highly recommend **[Tampermonkey](https://www.tampermonkey.net/)**, which is currently the most popular and powerful script manager.

Please visit its official website, and download and install it according to your browser type (e.g., Chrome, Firefox, Edge, Safari).

<div style="text-align: center; margin: 20px 0;">
  <a href="https://www.tampermonkey.net/" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; background-color: #42b983; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
    Go to Tampermonkey's Website
  </a>
</div>

> [!IMPORTANT]
> For users of `Chrome / Chromium` based browsers, please make sure to enable "Developer mode" in the top right corner of the extensions management page (`chrome://extensions`) after installation for the best compatibility.

## Step 2: Install the Web Translate Script

Once Tampermonkey is installed, you can install our translation script. We offer two versions for you to choose from:

<div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem;">

<div class="InstallationCard" style="flex: 1; min-width: 280px; display: flex; flex-direction: column; border-radius: 12px; background-color: var(--vp-c-bg-soft); padding: 24px;">
  <h3 style="margin: 0 0 8px 0; border: none; font-size: 1.1em; font-weight: 600;">CDN Version <span style="background-color: var(--vp-c-brand-1); color: white; padding: 3px 8px; border-radius: 6px; font-size: 0.8em; vertical-align: middle;">Recommended</span></h3>
  <p style="flex-grow: 1; font-size: 0.9em; color: var(--vp-c-text-2); line-height: 1.6;">Small script size, automatically fetches the latest dictionaries. Suitable for most users.</p>
  <div style="padding-top: 12px; text-align: right;">
    <a href="https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.cdn.user.js" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: var(--vp-c-brand-1); color: white;border-radius: 8px; text-decoration: none; font-weight: 600;">
      Install
    </a>
  </div>
</div>

<div class="InstallationCard" style="flex: 1; min-width: 280px; display: flex; flex-direction: column; border-radius: 12px; background-color: var(--vp-c-bg-soft); padding: 24px;">
  <h3 style="margin: 0 0 8px 0; border: none; font-size: 1.1em; font-weight: 600;">Offline Version <span style="background-color: var(--vp-c-brand-1); color: white; padding: 3px 8px; border-radius: 6px; font-size: 0.8em; vertical-align: middle;">Stable</span></h3>
  <p style="flex-grow: 1; font-size: 0.9em; color: var(--vp-c-text-2); line-height: 1.6;">Includes all translation data offline, no network required for loading, but requires manual script updates to get the latest dictionaries.</p>
  <div style="padding-top: 12px; text-align: right;">
    <a href="https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.user.js" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 8px 16px; background-color: var(--vp-c-brand-1); color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
      Install
    </a>
  </div>
</div>

</div>

Click the "Install" link for the version you choose. Tampermonkey will automatically open a confirmation window. Click "Install" again to complete the process.

After installation, the script is ready to use!

## Step 3: Verify the Installation

After a successful installation, you can visit websites that support translation (e.g., [Google AI Studio](https://aistudio.google.com/)), and the script will automatically detect and apply the Chinese localization.

You can also click the Tampermonkey icon in your browser's toolbar and see that the "Web Translate Script" is enabled in the dashboard.

Now, you can start enjoying a cleaner, more user-friendly browsing experience!
