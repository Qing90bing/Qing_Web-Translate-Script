/**
 * @file src/config/languages.js
 * @description
 * 语言配置文件，作为项目中所有受支持语言的“单一事实来源”(Single Source of Truth)。
 * 此文件集中管理了所有语言的元数据，并提供了相关的辅助函数。
 *
 * **如何添加一种新的语言支持**:
 * 这是一个多步骤的过程，需要修改项目的多个部分：
 * 1.  **更新此文件**: 在 `SUPPORTED_LANGUAGES` 数组中添加新的语言对象，包含 `code`, `name`, 和 `flag`。
 * 2.  **创建语言目录**: 在 `src/translations/` 目录下创建一个与新语言代码同名的文件夹 (例如 `src/translations/fr/`)。
 * 3.  **创建模板文件 (可选但推荐)**: 在 `build-tasks/tasks/translation/templates/` 目录下创建一个对应的模板文件 (例如 `fr.js`)，以便通过构建工具快速生成该语言的翻译文件。
 * 4.  **添加翻译文件**: 使用 `node build.js` 启动构建工具，并通过“管理翻译文件”->“添加翻译”的交互式菜单来为新语言添加具体的网站翻译配置。
 */

/**
 * @const {Array<object>} SUPPORTED_LANGUAGES
 * @description
 * 一个包含所有受支持语言对象的数组。每个对象都定义了一种语言的元数据。
 * 这是整个项目的核心语言列表。
 *
 * @property {string} code - 语言的唯一代码 (例如 'zh-cn')，遵循 BCP 47 标准。
 * @property {string} name - 语言的完整名称 (例如 '简体中文-大陆')，用于在界面中显示。
 * @property {string} flag - 代表该语言/地区的旗帜表情符号，用于增强 UI 的可识别性。
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'zh-cn', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
];

