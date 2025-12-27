// 翻译目标网站: status.modrinth.com

export const statusModrinthComZhCn = {
  // 描述：此翻译配置的描述信息
  description: '此翻译配置适用于 status.modrinth.com 网站的本地化。',

  // 测试链接：用于开发者测试网站显示效果的URL
  testUrl: 'https://status.modrinth.com/',

  // 创建日期：此翻译配置的创建日期
  createdAt: '2025-12-08',

  // 语言：此翻译配置适用的语言
  language: 'zh-cn', // 支持的语言: zh-cn(简体中文), zh-tw(繁体中文), zh-hk(中文香港)

  // 启用状态：控制此翻译配置是否启用
  enabled: true,

  // 样式 (CSS)
  // 支持编写多个CSS规则
  styles: [
    // 在这里添加styles代码，例如：
    // "body { background-color: #f0f0f0; }",
    // "h1 { color: #333; }"
    // ".rule3 { margin: 10px; }"
  ],

  // 禁止翻译的元素选择器
  blockedElements: [
    // 在这里添加CSS选择器，例如：
    // '.notranslate',
    // '#header .logo'
  ],

  // 扩展翻译元素选择器
  // 用于翻译那些默认情况下未被翻译的元素
  extendedElements: [
    'main'
  ],

  // 自定义属性白名单 
  // 在此数组中添加的任何 HTML 属性名，都将在整个网站范围内被翻译。
  // 示例: 'data-tip', 'data-title'
  customAttributes: [
    // 在这里添加自定义属性
  ],

  // 自定义属性黑名单 
  // 在此数组中添加的任何 HTML 属性名，都将强制不被翻译。
  // 此列表的优先级高于白名单，可用于覆盖默认翻译行为。
  // 示例: 'title'
  blockedAttributes: [
    // 在这里添加要阻止翻译的属性
  ],

  // 注入脚本 (JavaScript)
  // 支持编写多个JS规则，通过循环遍历，每个规则都创建独立的<script>标签注入到页面
  jsRules: [
    // 在这里添加JavaScript代码，例如：
    // "console.log('第一条规则');",
    // "alert('第二条规则');",
    // "document.title = '修改后的标题';"
  ],

  // 正则表达式翻译规则
  // 规则会自动应用于匹配的文本
  // 格式: [/原始文本正则表达式/i, '翻译后的文本']
  // 使用 $1, $2, ... 来引用正则表达式中的捕获组
  // 示例: [/^Hello (\w+)/, '您好 $1']
  regexRules: [
    [/\s*Dec(?:ember)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "12 月 $1 日 $3 上午 $2"],
    [/\s*Dec(?:ember)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "12 月 $1 日 $3 下午 $2"],
    [/\s*Nov(?:ember)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "11 月 $1 日 $3 上午 $2"],
    [/\s*Nov(?:ember)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "11 月 $1 日 $3 下午 $2"],
    [/\s*Sep(?:tember)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "9 月 $1 日 $3 上午 $2"],
    [/\s*Sep(?:tember)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "9 月 $1 日 $3 下午 $2"],
    [/\s*Feb(?:ruary)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "2 月 $1 日 $3 上午 $2"],
    [/\s*Feb(?:ruary)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "2 月 $1 日 $3 下午 $2"],
    [/\s*Oct(?:ober)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "10 月 $1 日 $3 上午 $2"],
    [/\s*Oct(?:ober)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "10 月 $1 日 $3 下午 $2"],
    [/\s*Jan(?:uary)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "1 月 $1 日 $3 上午 $2"],
    [/\s*Jan(?:uary)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "1 月 $1 日 $3 下午 $2"],
    [/\s*Aug(?:ust)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "8 月 $1 日 $3 上午 $2"],
    [/\s*Aug(?:ust)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "8 月 $1 日 $3 下午 $2"],
    [/\s*Apr(?:il)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "4 月 $1 日 $3 上午 $2"],
    [/\s*Apr(?:il)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "4 月 $1 日 $3 下午 $2"],
    [/\s*Mar(?:ch)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "3 月 $1 日 $3 上午 $2"],
    [/\s*Mar(?:ch)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "3 月 $1 日 $3 下午 $2"],
    [/\s*Jul(?:y)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "7 月 $1 日 $3 上午 $2"],
    [/\s*Jul(?:y)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "7 月 $1 日 $3 下午 $2"],
    [/\s*Jun(?:e)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "6 月 $1 日 $3 上午 $2"],
    [/\s*Jun(?:e)?\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "6 月 $1 日 $3 下午 $2"],
    [/\s*May\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})am\s*([A-Z]{2,4})\s*/i, "5 月 $1 日 $3 上午 $2"],
    [/\s*May\s+(\d{1,2})\s+at\s+(\d{1,2}:\d{2})pm\s*([A-Z]{2,4})\s*/i, "5 月 $1 日 $3 下午 $2"],
    [/\s*Down\s+for\s+(\d+)\s+hours?\s+and\s+(\d+)\s+minutes?\s*/i, "已宕机 $1 小时 $2 分钟"],
    [/\s*Down\s+for\s+(\d+)\s+minutes?\s+and\s+(\d+)\s+seconds?\s*/i, "已宕机 $1 分钟 $2 秒"],
    [/\s*Up\s+for\s+(\d+)\s+hours?\s+and\s+(\d+)\s+minutes?\s*/i, "已在线 $1 小时 $2 分钟"],
    [/\s*Up\s+for\s+(\d+)\s+minutes?\s+and\s+(\d+)\s+seconds?\s*/i, "已在线 $1 分钟 $2 秒"],
    [/\s*Down\s+for\s+(\d+)\s+days?\s+and\s+(\d+)\s+hours?\s*/i, "已宕机 $1 天 $2 小时"],
    [/\s*Up\s+for\s+(\d+)\s+days?\s+and\s+(\d+)\s+hours?\s*/i, "已在线 $1 天 $2 小时"],
    [/\s*Dec(?:ember)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 12 月 $1 日"],
    [/\s*Nov(?:ember)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 11 月 $1 日"],
    [/\s*Sep(?:tember)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 9 月 $1 日"],
    [/\s*Feb(?:ruary)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 2 月 $1 日"],
    [/\s*Oct(?:ober)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 10 月 $1 日"],
    [/\s*Jan(?:uary)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 1 月 $1 日"],
    [/\s*(\d{1,2}:\d{2}:\d{2})am\s+(GMT[\+\-]\d+)\s*/i, "$2 上午 $1"],
    [/\s*(\d{1,2}:\d{2}:\d{2})pm\s+(GMT[\+\-]\d+)\s*/i, "$2 下午 $1"],
    [/\s*Aug(?:ust)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 8 月 $1 日"],
    [/\s*Apr(?:il)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 4 月 $1 日"],
    [/\s*Mar(?:ch)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 3 月 $1 日"],
    [/\s*Jul(?:y)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 7 月 $1 日"],
    [/\s*Jun(?:e)?\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 6 月 $1 日"],
    [/\s*Dec(?:ember)?\s+(\d{4})\s+to\s+/i, "$1 年 12 月 至 "],
    [/\s*Down\s+for\s+(\d+)\s+minutes?\s*/i, "已宕机 $1 分钟"],
    [/\s*Nov(?:ember)?\s+(\d{4})\s+to\s+/i, "$1 年 11 月 至 "],
    [/\s*Sep(?:tember)?\s+(\d{4})\s+to\s+/i, "$1 年 9 月 至 "],
    [/\s*Feb(?:ruary)?\s+(\d{4})\s+to\s+/i, "$1 年 2 月 至 "],
    [/\s*May\s+(\d{1,2}),\s*(\d{4})\s*/i, "$2 年 5 月 $1 日"],
    [/\s*Oct(?:ober)?\s+(\d{4})\s+to\s+/i, "$1 年 10 月 至 "],
    [/\s*Down\s+for\s+(\d+)\s+hours?\s*/i, "已宕机 $1 小时"],
    [/\s*Down\s+for\s+(\d+)\s+seconds?\s*/i, "已宕机 $1 秒"],
    [/\s*Jan(?:uary)?\s+(\d{4})\s+to\s+/i, "$1 年 1 月 至 "],
    [/\s*Up\s+for\s+(\d+)\s+minutes?\s*/i, "已在线 $1 分钟"],
    [/\s*(\d+)\s+previous\s+updates?\s*/i, "$1 个历史更新"],
    [/\s*Aug(?:ust)?\s+(\d{4})\s+to\s+/i, "$1 年 8 月 至 "],
    [/\s*Mar(?:ch)?\s+(\d{4})\s+to\s+/i, "$1 年 3 月 至 "],
    [/\s*Up\s+for\s+(\d+)\s+hours?\s*/i, "已在线 $1 小时"],
    [/\s*Up\s+for\s+(\d+)\s+seconds?\s*/i, "已在线 $1 秒"],
    [/\s*Apr(?:il)?\s+(\d{4})\s+to\s+/i, "$1 年 4 月至 "],
    [/\s*Down\s+for\s+(\d+)\s+days?\s*/i, "已宕机 $1 天"],
    [/\s*Jul(?:y)?\s+(\d{4})\s+to\s+/i, "$1 年 7 月 至 "],
    [/\s*Jun(?:e)?\s+(\d{4})\s+to\s+/i, "$1 年 6 月 至 "],
    [/\s*Up\s+for\s+(\d+)\s+days?\s*/i, "已在线 $1 天"],
    [/\s*Dec(?:ember)?\s+(\d{4})\s*/i, " $1 年 12 月"],
    [/\s*Nov(?:ember)?\s+(\d{4})\s*/i, " $1 年 11 月"],
    [/\s*Sep(?:tember)?\s+(\d{4})\s*/i, " $1 年 9 月"],
    [/\s*Feb(?:ruary)?\s+(\d{4})\s*/i, " $1 年 2 月"],
    [/\s*Oct(?:ober)?\s+(\d{4})\s*/i, " $1 年 10 月"],
    [/\s*Jan(?:uary)?\s+(\d{4})\s*/i, " $1 年 1 月"],
    [/\s*Aug(?:ust)?\s+(\d{4})\s*/i, " $1 年 8 月"],
    [/\s*May\s+(\d{4})\s+to\s+/i, "$1 年 5 月 至 "],
    [/\s*([\d\.]+)%\s+downtime\s*/i, "$1% 故障率"],
    [/\s*Apr(?:il)?\s+(\d{4})\s*/i, " $1 年 4 月"],
    [/\s*Mar(?:ch)?\s+(\d{4})\s*/i, " $1 年 3 月"],
    [/\s*Jul(?:y)?\s+(\d{4})\s*/i, " $1 年 7 月"],
    [/\s*Jun(?:e)?\s+(\d{4})\s*/i, " $1 年 6 月"],
    [/\s*([\d\.]+)%\s+uptime\s*/i, "$1% 在线率"],
    [/\s*(\d+)\s+maintenance\s*/i, "$1 个维护"],
    [/\s*(\d+)\s+incidents?\s*/i, "$1 起事故"],
    [/\s*May\s+(\d{4})\s*/i, " $1 年 5 月"],
    [/\s*([\d\.]+)\s*ms\b\s*/i, "$1 毫秒"],
    [/\s*([\d\.]+)\s*s\b\s*/i, "$1 秒"]
  ],

  // 纯文本翻译规则
  // 规则会完全匹配整个文本
  // 格式: ['原始文本', '翻译后的文本']
  // 示例: ['Login', '登录']
  textRules: [
    ["We’re switching to a new cluster for our API for better performance and reliability.", "我们正在为我们的 API 切换到新的集群，以获得更好的性能和可靠性。"],
    ["API, Version API, and 1 other service are down", "API、版本 API 和 1 个其他服务均中断"],
    ["API and Version API are down", "API 和版本 API 服务均中断"],
    ["Scheduled maintenance | Modrinth", "计划维护 | Modrinth"],
    ["Previous incidents | Modrinth", "历史事件 | Modrinth"],
    ["API and Search recovered.", "API 和搜索服务均已恢复"],
    ["API and Search are down", "API 和搜索服务均中断"],
    ["\nAll services are online\n", "所有服务均在线"],
    ["Version API recovered.", "版本 API 已恢复"],
    ["\nNo maintenance scheduled\n", "无计划维护"],
    ["Version API is down", "版本 API 服务中断"],
    ["API Hardware Migration", "API 硬件迁移"],
    ["\nNo incidents reported\n", "无事件报告"],
    ["Affected services", "受影响的服务"],
    ["Search went down.", "搜索服务中断"],
    ["\nPrevious incidents\n", "历史事件"],
    ["Modrinth status", "Modrinth 状态"],
    ["Website recovered.", "网站已恢复"],
    ["Search recovered.", "搜索已恢复"],
    ["Website is down", "网站服务中断"],
    ["\nPrevious updates\n", "历史更新"],
    ["API went down.", "API 服务中断"],
    ["Previous incidents", "历史事件"],
    ["Search is down", "搜索服务中断"],
    ["Launcher Meta", "启动器元数据"],
    ["API recovered.", "API 已恢复"],
    ["Back to overview", "返回概览"],
    ["CDN recovered.", "CDN 已恢复"],
    ["API is down", "API 服务中断"],
    ["CDN is down", "CDN 服务中断"],
    ["\nNo maintenance\n", "无维护"],
    ["Response times", "响应时间"],
    ["\nOperational\n", "运行正常"],
    ["Response time", "响应时间"],
    ["Get in touch", "联系我们"],
    ["Powered by", "技术支持方"],
    ["Version API", "版本 API"],
    ["30 days ago", "30 天前"],
    ["60 days ago", "60 天前"],
    ["90 days ago", "90 天前"],
    ["\nMaintenance\n", "维护"],
    ["Downtime", "停机时间"],
    ["Resolved", "已解决"],
    ["\nStatus\n", "状态"],
    ["Created", "创建"],
    ["Updated", "更新"],
    ["Website", "网站"],
    ["Search", "搜索"],
    ["Today", "今天"]
  ],
};
