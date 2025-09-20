/**
 * @file stores/theme.js
 * @description 主题管理store
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// 创建主题store
function createThemeStore() {
  const { subscribe, set, update } = writable('light');

  return {
    subscribe,
    setTheme: (theme) => {
      if (browser) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
      set(theme);
    },
    toggleTheme: () => {
      update(currentTheme => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        if (browser) {
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);
        }
        return newTheme;
      });
    },
    initTheme: () => {
      if (browser) {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', theme);
        set(theme);
      }
    }
  };
}

export const theme = createThemeStore();