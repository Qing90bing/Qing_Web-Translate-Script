<!-- 
  @file src/routes/+layout.svelte
  @description 应用主布局
-->

<script>
  import { onMount } from 'svelte';
  import { theme } from '../stores/theme.js';
  import '../app.css';
  
  import Sidebar from '../components/Sidebar.svelte';
  import MainContent from '../components/MainContent.svelte';
  import NotificationCenter from '../components/ui/NotificationCenter.svelte';
  
  onMount(() => {
    // 初始化主题
    theme.initTheme();
  });
</script>

<div class="app-container h-full flex">
  <!-- 侧边栏 -->
  <Sidebar />
  
  <!-- 主内容区域 -->
  <MainContent>
    <slot />
  </MainContent>
  
  <!-- 通知中心 -->
  <NotificationCenter />
</div>

<style>
  .app-container {
    background-color: var(--bg-primary);
    color: var(--text-primary);
  }
</style>