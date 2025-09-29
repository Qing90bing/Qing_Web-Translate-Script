// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
// 导入我们的自定义 CSS 样式
import './custom.css'

/**
 * 这是一个自定义主题的入口文件。
 * 我们从 'vitepress/theme' 导入默认主题，然后将其导出。
 * 通过导入我们自己的 `custom.css` 文件，VitePress 会将这些样式应用到网站上，
 * 并且由于它们是主题的一部分，其加载顺序会优于默认样式，从而避免了使用 `!important`。
 */
export default {
  ...DefaultTheme,
  // 在这里，我们可以覆盖或扩展默认主题的行为。
  // 例如，使用 enhanceApp 函数来注册全局Vue组件。
  // enhanceApp({ app, router, siteData }) {
  //   // ...
  // }
}