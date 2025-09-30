// VitePress 主题配置文件
// 官方文档：https://vitepress.dev/guide/custom-theme

import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css' // 导入自定义样式

/**
 * @type {import('vitepress').Theme}
 * 导出一个 VitePress 主题配置对象。
 * 通过这个对象，我们可以扩展和自定义默认主题。
 */
export default {
  /**
   * 继承默认主题。
   * 这是自定义主题的基础，我们可以在此之上进行扩展。
   * 如果不继承，就需要从头开始构建所有主题组件。
   */
  extends: DefaultTheme,

  /**
   * 自定义布局。
   * `Layout` 是一个函数式组件，用于渲染整个页面的布局。
   * 这里我们使用 Vue 的 `h` 函数来渲染默认主题的布局组件。
   * 我们可以在第三个参数（插槽）中插入自定义的 Vue 组件，
   * 以此来扩展或替换默认布局的特定部分。
   *
   * 官方插槽文档：https://vitepress.dev/guide/extending-default-theme#layout-slots
   */
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 示例：在文档内容的末尾添加一个组件
      // 'doc-after': () => h(MyComponent),
    })
  },

  /**
   * 增强应用程序实例。
   * `enhanceApp` 是一个函数，允许我们访问和修改 Vue 应用实例、
   * 路由实例和站点数据。这对于注册全局组件、插件或添加路由守卫非常有用。
   *
   * @param {object} context - 上下文对象
   * @param {import('vue').App} context.app - Vue 应用实例
   * @param {import('vue-router').Router} context.router - Vue Router 实例
   * @param {object} context.siteData - 站点元数据
   */
  enhanceApp({ app, router, siteData }) {
    // 在这里可以注册全局组件
    // app.component('MyGlobalComponent', MyGlobalComponent)

    // 或者添加路由守卫
    // router.beforeEach((to, from, next) => {
    //   // ...
    //   next()
    // })
  }
}