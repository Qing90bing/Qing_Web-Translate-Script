// 导入翻译模块
import { julesGoogleCom } from './jules.google.com.js';
import { aistudioGoogleCom } from './aistudio.google.com.js';
import { claudeAi } from './claude.ai.js';
import { platformClaudeCom } from './platform.claude.com.js';
import { statusAnthropicCom } from './status.anthropic.com.js';
// 导出主翻译映射
export const masterTranslationMap = {
  "jules.google.com": julesGoogleCom,
  "aistudio.google.com": aistudioGoogleCom,
  "claude.ai": claudeAi,
  "platform.claude.com": platformClaudeCom,
  "status.anthropic.com": statusAnthropicCom,
};