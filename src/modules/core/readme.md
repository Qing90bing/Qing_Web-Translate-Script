# `src/modules/core` 目录

## 目录概述

`src/modules/core` 目录是整个翻译脚本的“心脏”，它包含了实现翻译功能最核心的逻辑。此目录下的模块负责处理从接收翻译任务、执行文本替换到监听页面动态变化的全过程。

---

## 文件结构和功能

本目录包含以下三个关键模块：

-   **`translator.js`**
    -   **功能**: 核心翻译引擎。
    -   **职责**:
        -   采用工厂函数模式 (`createTranslator`) 创建一个包含独立状态（翻译规则、缓存）的翻译器实例。
        -   使用 `TreeWalker` 高效遍历 DOM 树，并结合 `Map` 和正则表达式对文本节点和元素属性进行翻译。
        -   内置多种性能优化策略，如文本缓存（`translationCache`）、已处理元素跟踪（`translatedElements`）和“整段内容”快速翻译。
        -   提供 `resetState` 和 `deleteElement` 等 API，供其他模块管理其内部状态。

-   **`observers.js`**
    -   **功能**: 动态内容监听器。
    -   **职责**:
        -   初始化并管理多个 `MutationObserver` 实例，以“激活”翻译功能，使其能够响应页面的动态变化。
        -   采用多观察者策略分离关注点，分别处理常规 DOM 变动、SPA 页面导航和 AI 模型切换等特定事件。
        -   内置防抖（Debounce）机制，将高频的 DOM 变动合并为一次批量翻译，以优化性能。

-   **`translationInitializer.js`**
    -   **功能**: 翻译流程的“编排者”和“总指挥”。
    -   **职责**:
        -   作为翻译流程的入口，负责协调其他核心模块的工作。
        -   解析特定网站的翻译配置，注入自定义的 CSS 和 JavaScript。
        -   调用 `translator.js` 创建一个翻译器实例。
        -   在合适的时机（通常是 `DOMContentLoaded`）执行首次的全页面翻译。
        -   在首次翻译完成后，调用 `observers.js` 来启动对后续动态内容的监听。

---

## 模块协同工作流程

这三个模块紧密协作，完成一次完整的翻译生命周期：

1.  **启动**: `main.js` 根据当前网站的域名，加载对应的翻译配置，并调用 `translationInitializer.js` 中的 `initializeTranslation` 函数，将配置和其他核心模块的工厂函数（如 `createTranslator`）作为依赖注入。
2.  **初始化**: `translationInitializer.js` 接收到配置后，首先注入必要的 CSS 和 JS，然后调用 `createTranslator` 创建一个包含该网站所有翻译规则的 `translator` 实例。
3.  **首次翻译**: `translationInitializer.js` 等待页面 DOM 加载完成后，调用 `translator` 实例的 `translate()` 方法，对 `document.body` 进行一次完整的、自上而下的翻译。
4.  **启动监听**: 首次翻译完成后，`translationInitializer.js` 调用 `observers.js` 中的 `initializeObservers` 函数，并将 `translator` 实例传递给它。
5.  **动态翻译**: `observers.js` 启动 `MutationObserver`。当页面内容发生动态变化时，它会捕捉到这些变化，并调用 `translator` 实例的 `translate()` 方法对新出现或已改变的 DOM 节点进行增量翻译，同时通过 `deleteElement` 方法精确地清除旧缓存。

通过这种方式，脚本实现了对静态和动态内容的高效、精确翻译。