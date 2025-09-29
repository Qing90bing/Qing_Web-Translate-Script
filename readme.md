<p align="center">
  <img src="introduce/icon/Qing_Web-Translate-Script.svg" width="100" height="100" alt="WEB 中文汉化插件图标">
</p>
<h1 align="center">WEB 中文汉化脚本</h1>
<p align="center">提升常用网站浏览体验，减少阅读压力:)</p>

<p align="center">
    <a href="https://github.com/Qing90bing/Qing_Web-Translate-Script/stargazers">
      <img src="https://img.shields.io/github/stars/Qing90bing/Qing_Web-Translate-Script?style=flat-square&logo=github&label=Stars" alt="GitHub Stars">
    </a>
    <a href="https://github.com/Qing90bing/Qing_Web-Translate-Script/issues">
      <img src="https://img.shields.io/github/issues/Qing90bing/Qing_Web-Translate-Script?style=flat-square&logo=github&label=Issues" alt="GitHub Issues">
    </a>
    <a href="https://github.com/Qing90bing/Qing_Web-Translate-Script/forks">
      <img src="https://img.shields.io/github/forks/Qing90bing/Qing_Web-Translate-Script?style=flat-square&logo=github&label=Forks" alt="GitHub Forks">
    </a>
    <a href="https://github.com/Qing90bing/Qing_Web-Translate-Script/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/Qing90bing/Qing_Web-Translate-Script?style=flat-square&logo=gitbook&label=License" alt="License">
    </a>
</p>

## 🤔 这是什么？

“WEB 中文汉化脚本”是一个浏览器增强工具，它运行在 [油猴 (Tampermonkey)](https://www.tampermonkey.net/) 等脚本管理器之上。

与浏览器自带的“整页翻译”不同，本脚本的每一句翻译都由社区人工贡献，翻译网站为中文，提升常用网站浏览体验，减少阅读压力。

## ✨ 主要特性

- **🎯 精准翻译**：所有译文均由人工编写，保证术语准确、语境贴切。
- **🚀 无缝体验**：内置“防闪烁”加载机制，在翻译应用前后，页面内容保持稳定，告别页面抖动和闪烁。
- **🌐 智能适配**：脚本能自动检测浏览器语言并应用翻译，您也可以在油猴菜单中手动切换。
- **🌍 社区驱动**：一个开放的项目，欢迎所有用户参与贡献，共同扩展和完善翻译库。
- **🔧 开发者友好**：提供了简单易用的命令行工具，方便开发者检查、构建和管理翻译内容。

## 🖥️ 效果预览

<div align="center">
  <figure>
    <figcaption>Google AI Studio 汉化效果</figcaption>
    <img src="introduce/img/googleaistudio_introduce.jpg" width="700" alt="Google AI Studio 汉化效果预览">
  </figure>
  <br>
  <figure>
    <figcaption>Jules 网站汉化效果</figcaption>
    <img src="introduce/img/jules_introduce.jpg" width="700" alt="Jules 汉化效果预览">
  </figure>
</div>

## 🚀 安装指南

在开始之前，您需要先安装一个用户脚本管理器。

### 步骤 1: 安装脚本管理器

- **[Tampermonkey (篡改猴)](https://www.tampermonkey.net/)** 是目前最流行和推荐的选择。请根据您的浏览器（Chrome, Firefox, Edge 等）前往其官网进行安装。
- **重要提示**: 对于 `Chrome / Chromium` 内核的浏览器，请确保在扩展程序管理页面 (`chrome://extensions`) 中开启“开发者模式”。

### 步骤 2: 安装本脚本

提供两个版本供您选择：

| 版本 | 安装链接 | 描述 |
|:---:|:---:|:---|
| **CDN 版 (推荐)** | [**点击安装**](https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.cdn.user.js) | **适合大多数用户**。通过 CDN 加载词典，脚本体积小，能更快地获取翻译更新。 |
| **离线版** | [**点击安装**](https://raw.githubusercontent.com/Qing90bing/Qing_Web-Translate-Script/main/dist/Web-Translate-Script.user.js) | 将所有翻译词典内置于脚本中，适合网络不稳定或希望离线使用的场景。 |

点击上方的“点击安装”链接，Tampermonkey 会自动弹出安装确认窗口，再次点击“安装”即可完成。

## 🤝 参与贡献

我们非常欢迎任何形式的贡献！无论是添加新网站的翻译、改进现有翻译，还是报告问题，都对项目意义重大。

## 📝 待办事项

- 开发一个更友好的浏览器图形化配置界面。
- 增加对更多网站的翻译支持。

## 🙏 特别致谢

这个项目的实现离不开以下优秀的技术和资源，在此表示感谢：

- **运行环境**: [Tampermonkey](https://www.tampermonkey.net/), [Greasy Fork](https://greasyfork.org/)
- **AI 助理**: [Jules](https://https://jules.google.com/), [Gemini](https://https://gemini.google.com/)
- **开发工具**: [Visual Studio Code](https://code.visualstudio.com/), [GitHub](https://github.com/)
- **核心依赖**: [esbuild](https://esbuild.github.io/), [inquirer](https://github.com/SBoudrias/Inquirer.js/), [acorn](https://github.com/acornjs/acorn), [Prettier](https://prettier.io/)

## 👨‍💻 作者声明

> [!TIP]
> 我只是一名小白，不懂计算机语言，该插件是全程在AI的协助下完成的。如果遇到bug，我会尽我所能去解决。

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源协议。
