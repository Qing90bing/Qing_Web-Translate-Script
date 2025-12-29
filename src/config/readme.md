# `src/config` 目录

## 目录概述

`src/config` 目录是项目的核心配置中心。它包含了一系列定义了脚本关键行为和元数据的 JavaScript 文件。这些配置文件是“单一事实来源”(Single Source of Truth)，确保了整个应用程序在语言支持、目标网站等方面的一致性。

---

## 文件结构和功能

本目录包含以下关键配置文件：

-   **`index.js`**
    -   **功能**: 全局通用配置文件。
    -   **职责**:
        -   定义翻译引擎的核心行为规则，如哪些标签 (`BLOCKS_ALL_TRANSLATION`) 或属性 (`attributesToTranslate`) 需要被处理或忽略。
        -   管理 **嵌入式站点列表 (`embeddedSites`)**：
            -   定义需要将翻译数据直接嵌入到脚本中的网站域名（主要用于绕过 CSP 限制）。
            -   仅对 CDN 构建生效。
        -   定义禁止翻译的 CSS 类名 (`BLOCKED_CSS_CLASSES`)。

-   **`languages.js`**
    -   **功能**: 集中管理项目中所有受支持的语言 **(纯数据)**。
    -   **职责**:
        -   仅导出一个 `SUPPORTED_LANGUAGES` 数组。
        -   相关的逻辑函数（如 `getLanguageName`）已移动到 `src/modules/utils/language.js`。

### `src/modules/utils` 目录

-   **`language.js`**
    -   **功能**: 语言相关工具函数。
    -   **职责**:
        -   提供 `getLanguageName`、`addLanguage` 等辅助函数。
        -   导出 `SUPPORTED_LANGUAGE_CODES`。

---

## 使用方式

当需要修改项目的基本配置时（例如增删语言、调整 CDN 构建策略），开发者应首先查阅并修改此目录下的相应文件。这些配置在构建过程中会被其他模块（如 `build-project.js`, `main.js` 等）导入和使用。