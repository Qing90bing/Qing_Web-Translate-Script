<!-- 
  @file src/components/MainContent.svelte
  @description 主内容区域
-->

<script>
  import { sidebarCollapsed } from '../stores/app.js';
  
  let collapsed = false;
  sidebarCollapsed.subscribe(value => collapsed = value);
</script>

<main class="main-content" class:sidebar-collapsed={collapsed}>
  <slot />
</main>

<style>
  .main-content {
    flex: 1;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--bg-primary);
    transition: margin-left 0.3s ease;
    scroll-behavior: smooth;
  }
  
  /* 自定义滚动条样式 */
  .main-content::-webkit-scrollbar {
    width: 8px;
  }
  
  .main-content::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }
  
  .main-content::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
  }
  
  .main-content::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
    }
    
    .main-content.sidebar-collapsed {
      margin-left: 0;
    }
  }
</style>