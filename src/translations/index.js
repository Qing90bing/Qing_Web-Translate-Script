// 导入翻译模块
import { julesGoogleCom } from './jules.google.com.js';
import { aistudioGoogleCom } from './aistudio.google.com.js';
import { claudeAi } from './claude.ai.js';
import { consoleAnthropicCom } from './console.anthropic.com.js';
import { statusAnthropicCom } from './status.anthropic.com.js';
// 导出主翻译映射
export const masterTranslationMap = {
  "jules.google.com": julesGoogleCom,
  "aistudio.google.com": aistudioGoogleCom,
  "claude.ai": claudeAi,
  "console.anthropic.com": consoleAnthropicCom,
  "status.anthropic.com": statusAnthropicCom,
};
