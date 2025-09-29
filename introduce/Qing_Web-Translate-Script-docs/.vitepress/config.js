import { defineConfig } from 'vitepress'

// 为页脚动态生成版权信息
const copyright = `Copyright © ${new Date().getFullYear()}-present Qing90bing`;

// VitePress 站点配置
export default defineConfig({
  // 部署站点的基础路径
  base: '/Qing_Web-Translate-Script/',
  // 站点图标
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
  ],
  // 网站的全局标题
  title: "WEB 中文汉化脚本",
  // 网站的全局描述
  description: "提升常用网站浏览体验，减少阅读压力 :)",

  // --- 主题配置 ---
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Qing90bing/Qing_Web-Translate-Script' }
    ]
  },

  // --- 多语言支持配置 ---
  locales: {
    // --- 中文（简体）配置 ---
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      title: "WEB 中文汉化脚本",
      description: "提升常用网站浏览体验，减少阅读压力 :)",
      themeConfig: {
        nav: [
          { text: '主页', link: '/' },
          { text: '安装指南', link: '/guide/introduction' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: '指南',
              items: [
                { text: '介绍', link: '/guide/introduction' },
                { text: '开始安装', link: '/guide/getting-started' }
              ]
            }
          ]
        },
        editLink: {
          // GitHub 仓库的 URL
          pattern: 'https://github.com/Qing90bing/Qing_Web-Translate-Script/edit/main/introduce/Qing_Web-Translate-Script-docs/:path',
          text: '在 GitHub 上编辑此页'
        },
        footer: {
          message: '基于 MIT 许可发布',
          copyright: copyright
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        outlineTitle: '在本页'
      }
    },
    // --- 英文配置 ---
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      title: "Qing's Web Translate Script",
      description: "Enhance your browsing experience on popular websites and reduce reading pressure :)",
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/introduction' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Introduction', link: '/en/guide/introduction' },
                { text: 'Getting Started', link: '/en/guide/getting-started' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/Qing90bing/Qing_Web-Translate-Script/edit/main/introduce/Qing_Web-Translate-Script-docs/:path',
          text: 'Edit this page on GitHub'
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: copyright
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        }
        // 英文环境默认显示 "On this page"，无需配置
      }
    },
    // --- 繁体中文（香港）配置 ---
    hk: {
      label: '繁體中文 (香港)',
      lang: 'zh-HK',
      link: '/hk/',
      title: "WEB 中文漢化腳本",
      description: "提升常用網站瀏覽體驗，減少閱讀壓力 :)",
      themeConfig: {
        nav: [
          { text: '主頁', link: '/hk/' },
          { text: '安裝指南', link: '/hk/guide/introduction' }
        ],
        sidebar: {
          '/hk/guide/': [
            {
              text: '指南',
              items: [
                { text: '介紹', link: '/hk/guide/introduction' },
                { text: '開始安裝', link: '/hk/guide/getting-started' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/Qing90bing/Qing_Web-Translate-Script/edit/main/introduce/Qing_Web-Translate-Script-docs/:path',
          text: '在 GitHub 上編輯此頁'
        },
        footer: {
          message: '基於 MIT 許可發布',
          copyright: copyright
        },
        docFooter: {
          prev: '上一頁',
          next: '下一頁'
        },
        outlineTitle: '在本頁'
      }
    },
    // --- 繁体中文（台湾）配置 ---
    tw: {
      label: '繁體中文 (台灣)',
      lang: 'zh-TW',
      link: '/tw/',
      title: "WEB 中文漢化腳本",
      description: "提升常用網站瀏覽體驗，減少閱讀壓力 :)",
      themeConfig: {
        nav: [
          { text: '首頁', link: '/tw/' },
          { text: '安裝指南', link: '/tw/guide/introduction' }
        ],
        sidebar: {
          '/tw/guide/': [
            {
              text: '指南',
              items: [
                { text: '介紹', link: '/tw/guide/introduction' },
                { text: '開始安裝', link: '/tw/guide/getting-started' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/Qing90bing/Qing_Web-Translate-Script/edit/main/introduce/Qing_Web-Translate-Script-docs/:path',
          text: '在 GitHub 上編輯此頁'
        },
        footer: {
          message: '基於 MIT 許可發布',
          copyright: copyright
        },
        docFooter: {
          prev: '上一頁',
          next: '下一頁'
        },
        outlineTitle: '在本頁'
      }
    }
  }
})