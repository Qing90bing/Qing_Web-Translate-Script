import { defineConfig } from 'vitepress'

// --- 用于动态生成版权年份的辅助函数 ---
const currentYear = new Date().getFullYear();
const copyrightSince = 2025;
// 如果当前年份大于起始年份，则显示年份范围，否则只显示起始年份
const copyrightYearRange = currentYear > copyrightSince ? `${copyrightSince}-${currentYear}` : `${copyrightSince}`;

// VitePress 站点配置
export default defineConfig({
  // 部署站点的基础路径
  base: '/Qing_Web-Translate-Script/',
  // 站点图标
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/Qing_Web-Translate-Script/logo.svg" }],
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
    ],
    // -- 搜索配置 --
    search: {
      provider: 'local'
    }
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
          pattern: 'https://github.com/Qing90bing/Qing_Web-Translate-Script/edit/main/introduce/Qing_Web-Translate-Script-docs/:path',
          text: '在 GitHub 上编辑此页'
        },
        footer: {
          message: '基于 MIT 许可发布',
          copyright: `❤️ 版权所有 © ${copyrightYearRange} Qing90bing`
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        outline: {
          label: '在本页'
        },
        lastUpdated: {
          text: '最后更新于'
        },
        notFound: {
          title: '页面未找到',
          quote: '但只要不改变方向，坚持寻找，你最终会到达目的地。',
          linkText: '返回首页'
        },
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言',
        skipToContentLabel: '跳到主要内容',
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
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
          copyright: `❤️ Copyright © ${copyrightYearRange} Qing90bing`
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search'
              },
              modal: {
                noResultsText: 'No results for',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close'
                }
              }
            }
          }
        }
      }
    },
    // --- 繁体中文（台湾）配置 ---
    tw: {
      label: '繁體中文',
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
          copyright: `❤️ 版權所有 © ${copyrightYearRange} Qing90bing`
        },
        docFooter: {
          prev: '上一頁',
          next: '下一頁'
        },
        outline: {
          label: '在本頁'
        },
        lastUpdated: {
          text: '最後更新於'
        },
        notFound: {
          title: '頁面未找到',
          quote: '但只要不改變方向，堅持尋找，你最終會到達目的地。',
          linkText: '返回首頁'
        },
        darkModeSwitchLabel: '外觀',
        lightModeSwitchTitle: '切換至淺色模式',
        darkModeSwitchTitle: '切換至深色模式',
        sidebarMenuLabel: '選單',
        returnToTopLabel: '返回頂部',
        langMenuLabel: '切換語言',
        skipToContentLabel: '跳至主要內容',
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: '搜尋',
                buttonAriaLabel: '搜尋'
              },
              modal: {
                noResultsText: '無法找到相關結果',
                resetButtonTitle: '清除查詢條件',
                footer: {
                  selectText: '選擇',
                  navigateText: '切換',
                  closeText: '關閉'
                }
              }
            }
          }
        }
      }
    }
  }
})