/**
 * @file stores/app.js
 * @description 应用状态管理store
 */

import { writable } from 'svelte/store';

// 当前视图状态
export const currentView = writable('welcome'); // 'welcome', 'files', 'editor', 'actions', 'help'

// 侧边栏状态
export const sidebarCollapsed = writable(false);

// 加载状态
export const loading = writable(false);

// 当前选中的文件
export const currentFile = writable(null);

// 翻译文件列表
export const translationFiles = writable([]);

// 通知消息
export const notifications = writable([]);

// 添加通知
export function addNotification(message, type = 'info', duration = 5000) {
  const id = Date.now();
  const notification = { id, message, type, duration };
  
  notifications.update(list => [...list, notification]);
  
  // 自动移除通知
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }
  
  return id;
}

// 移除通知
export function removeNotification(id) {
  notifications.update(list => list.filter(n => n.id !== id));
}

// 清空所有通知
export function clearNotifications() {
  notifications.set([]);
}