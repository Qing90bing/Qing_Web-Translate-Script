// 导入翻译模块
import { julesGoogleComZhCn } from './zh-cn/jules.google.com.js';
import { aistudioGoogleComZhCn } from './zh-cn/aistudio.google.com.js';
import { claudeAiZhCn } from './zh-cn/claude.ai.js';
import { platformClaudeComZhCn } from './zh-cn/platform.claude.com.js';
import { statusClaudeComZhCn } from './zh-cn/status.claude.com.js';
// 导入繁体中文（香港）翻译模块
import { julesGoogleComZhHk } from './zh-hk/jules.google.com.js';
import { aistudioGoogleComZhHk } from './zh-hk/aistudio.google.com.js';
import { claudeAiZhHk } from './zh-hk/claude.ai.js';
// 导入繁体中文（台湾）翻译模块
import { aistudioGoogleComZhTw } from './zh-tw/aistudio.google.com.js';
import { claudeAiZhTw } from './zh-tw/claude.ai.js';
import { geminiGoogleComZhCn } from './zh-cn/gemini.google.com.js';
import { wwwAvogado6ComZhCn } from './zh-cn/www.avogado6.com.js';
import { wplaceLiveZhCn } from './zh-cn/wplace.live.js';
import { huggingfaceCoZhCn } from './zh-cn/huggingface.co.js';
// 导出主翻译映射
export const masterTranslationMap = {
  "jules.google.com#zh-cn": julesGoogleComZhCn,
  "aistudio.google.com#zh-cn": aistudioGoogleComZhCn,
  "claude.ai#zh-cn": claudeAiZhCn,
  "platform.claude.com#zh-cn": platformClaudeComZhCn,
  "status.claude.com#zh-cn": statusClaudeComZhCn,
// 繁体中文（香港）翻译映射
  "jules.google.com#zh-hk": julesGoogleComZhHk,
  "aistudio.google.com#zh-hk": aistudioGoogleComZhHk,
  "claude.ai#zh-hk": claudeAiZhHk,
// 繁体中文（台湾）翻译映射
  "aistudio.google.com#zh-tw": aistudioGoogleComZhTw,
  "claude.ai#zh-tw": claudeAiZhTw,
  "gemini.google.com#zh-cn": geminiGoogleComZhCn,
  "www.avogado6.com#zh-cn": wwwAvogado6ComZhCn,
  "wplace.live#zh-cn": wplaceLiveZhCn,
  "huggingface.co#zh-cn": huggingfaceCoZhCn,
};