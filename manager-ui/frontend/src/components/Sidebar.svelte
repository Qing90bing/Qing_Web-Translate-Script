<!-- 
<!-- 
  @file src/components/Sidebar.svelte
  @description 左侧导航栏
-->

<script>
  import { currentView, sidebarCollapsed } from '../stores/app.js';
  import ThemeToggle from './ui/ThemeToggle.svelte';
  
  let collapsed = false;
  
  // 订阅store状态
  sidebarCollapsed.subscribe(value => collapsed = value);
  
  // 导航菜单项
  const welcomeItem = {
    id: 'welcome',
    label: '欢迎页面',
    icon: 'fas fa-home',
    description: '开始使用',
    color: '#2563eb'
  };
  
  const menuItems = [
    {
      id: 'files',
      label: '文件管理',
      icon: 'fas fa-folder-open',
      description: '管理翻译文件',
      color: '#2563eb'
    },
    {
      id: 'editor',
      label: '规则编辑',
      icon: 'fas fa-edit',
      description: '编辑翻译规则',
      color: '#1d4ed8'
    },
    {
      id: 'actions',
      label: '检查修复',
      icon: 'fas fa-tools',
      description: '检查和修复问题',
      color: '#0ea5e9'
    },
    {
      id: 'help',
      label: '帮助管理',
      icon: 'fas fa-question-circle',
      description: '管理帮助内容',
      color: '#7c3aed'
    }
  ];
  
  function switchView(viewId) {
    currentView.set(viewId);
  }
  
  function toggleSidebar() {
    sidebarCollapsed.update(value => !value);
  }
</script>

<aside class="sidebar" class:collapsed>
  <!-- 顶部Logo -->  
  <div class="sidebar-header">
    <div class="logo">
      {#if !collapsed}
        <div class="logo-icon">
          <i class="fas fa-language"></i>
        </div>
        <div class="logo-content">
          <span class="logo-title">翻译管理器</span>
          <span class="logo-subtitle">Translation Manager</span>
        </div>
      {:else}
        <div class="logo-icon collapsed">
          <i class="fas fa-language"></i>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- 折叠按钮 - 放在侧边栏右侧 -->
  <button 
    class="collapse-btn"
    on:click={toggleSidebar}
    title={collapsed ? '展开侧边栏' : '收起侧边栏'}
  >
    <i class="fas fa-{collapsed ? 'chevron-right' : 'chevron-left'}"></i>
  </button>
  
  <!-- 导航菜单 -->
  <nav class="sidebar-nav">
    <!-- 欢迎页面区域 -->
    <div class="nav-section">
      {#if !collapsed}
        <div class="section-title">快速开始</div>
      {/if}
      <button
        class="nav-item"
        class:active={$currentView === welcomeItem.id}
        on:click={() => switchView(welcomeItem.id)}
        title={collapsed ? welcomeItem.description : ''}
        style="--item-color: {welcomeItem.color}"
      >
        <div class="nav-icon">
          <i class={welcomeItem.icon}></i>
        </div>
        {#if !collapsed}
          <div class="nav-content">
            <span class="nav-label">{welcomeItem.label}</span>
            <span class="nav-description">{welcomeItem.description}</span>
          </div>
          <div class="nav-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        {/if}
      </button>
    </div>
    
    <!-- 分隔线 -->
    {#if !collapsed}
      <div class="nav-divider"></div>
    {/if}
    
    <!-- 主要功能区域 -->
    <div class="nav-section">
      {#if !collapsed}
        <div class="section-title">主要功能</div>
      {/if}
      {#each menuItems as item}
        <button
          class="nav-item"
          class:active={$currentView === item.id}
          on:click={() => switchView(item.id)}
          title={collapsed ? item.description : ''}
          style="--item-color: {item.color}"
        >
          <div class="nav-icon">
            <i class={item.icon}></i>
          </div>
          {#if !collapsed}
            <div class="nav-content">
              <span class="nav-label">{item.label}</span>
              <span class="nav-description">{item.description}</span>
            </div>
            <div class="nav-arrow">
              <i class="fas fa-chevron-right"></i>
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </nav>
  
  <!-- 底部操作 -->
  <div class="sidebar-footer">
    <!-- 主题切换 -->
    {#if !collapsed}
      <ThemeToggle />
    {:else}
      <div class="compact-theme-toggle">
        <button
          class="theme-toggle-compact"
          on:click={() => {
            const currentTheme = localStorage.getItem('theme') || 'auto';
            const themes = ['light', 'dark', 'auto'];
            const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
            const nextTheme = themes[nextIndex];
            localStorage.setItem('theme', nextTheme);
            
            // 应用主题
            const root = document.documentElement;
            if (nextTheme === 'auto') {
              const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const actualTheme = isDarkMode ? 'dark' : 'light';
              applyTheme(actualTheme);
            } else {
              applyTheme(nextTheme);
            }
            
            function applyTheme(theme) {
              if (theme === 'dark') {
                root.style.setProperty('--bg-primary', '#1a1a1a');
                root.style.setProperty('--bg-secondary', '#2d2d2d');
                root.style.setProperty('--bg-tertiary', '#404040');
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#cccccc');
                root.style.setProperty('--text-muted', '#888888');
                root.style.setProperty('--border-color', '#404040');
                root.style.setProperty('--accent-color', '#2563eb');
                root.style.setProperty('--success-color', '#10b981');
                root.style.setProperty('--warning-color', '#f59e0b');
                root.style.setProperty('--error-color', '#ef4444');
                root.style.setProperty('--hover-bg', '#363636');
                root.style.setProperty('--active-bg', '#4a4a4a');
              } else {
                root.style.setProperty('--bg-primary', '#ffffff');
                root.style.setProperty('--bg-secondary', '#f8fafc');
                root.style.setProperty('--bg-tertiary', '#f1f5f9');
                root.style.setProperty('--text-primary', '#1e293b');
                root.style.setProperty('--text-secondary', '#475569');
                root.style.setProperty('--text-muted', '#94a3b8');
                root.style.setProperty('--border-color', '#e2e8f0');
                root.style.setProperty('--accent-color', '#2563eb');
                root.style.setProperty('--success-color', '#10b981');
                root.style.setProperty('--warning-color', '#f59e0b');
                root.style.setProperty('--error-color', '#ef4444');
                root.style.setProperty('--hover-bg', '#f1f5f9');
                root.style.setProperty('--active-bg', '#e2e8f0');
              }
            }
          }}
          title="切换主题"
        >
          <i class="fas fa-palette"></i>
        </button>
      </div>
    {/if}
  </div>
</aside>

<style>
  .sidebar {
    width: 280px;
    height: 100vh;
    background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    backdrop-filter: blur(10px);
    position: relative;
  }
  
  .sidebar.collapsed {
    width: 80px;
  }
  
  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    background-color: var(--bg-primary);
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    min-width: 0;
  }
  
  .logo-icon {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, var(--accent-color), #1d4ed8);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    box-shadow: var(--shadow-lg);
    flex-shrink: 0;
  }
  
  .logo-icon.collapsed {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.25rem;
  }
  
  .logo-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }
  
  .logo-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: var(--text-primary);
    line-height: 1;
  }
  
  .logo-subtitle {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  
  .collapse-btn {
    position: absolute;
    top: 20px;
    right: -12px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    background-color: var(--bg-primary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .collapse-btn:hover {
    background-color: var(--accent-color);
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 1.5rem 1rem;
    overflow-y: auto;
  }
  
  .nav-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
    padding-left: 0.75rem;
  }
  
  .nav-divider {
    height: 1px;
    background: var(--border-color);
    margin: 1rem 0.75rem;
    opacity: 0.5;
  }
  
  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0.75rem;
    border: none;
    background: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    border-radius: 12px;
    margin-bottom: 0.25rem;
    position: relative;
    overflow: hidden;
  }
  
  .nav-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    background: var(--accent-color);
    transition: width 0.3s ease;
    opacity: 0.1;
  }
  
  .nav-item:hover {
    background-color: var(--hover-bg);
    color: var(--text-primary);
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .nav-item:hover::before {
    width: 4px;
  }
  
  .nav-item.active {
    background: var(--accent-color);
    color: white;
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  
  .nav-item.active .nav-icon {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  .nav-item.active .nav-label,
  .nav-item.active .nav-description {
    color: white;
  }
  
  .nav-item.active .nav-description {
    opacity: 0.9;
  }
  
  .nav-icon {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: var(--bg-tertiary);
    font-size: 1.125rem;
    flex-shrink: 0;
    transition: var(--transition);
  }
  
  .nav-item:hover .nav-icon {
    background-color: var(--hover-bg);
    color: var(--accent-color);
  }
  
  .nav-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }
  
  .nav-label {
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1;
  }
  
  .nav-description {
    font-size: 0.75rem;
    opacity: 0.7;
    line-height: 1;
  }
  
  .nav-arrow {
    opacity: 0;
    transition: var(--transition);
    font-size: 0.75rem;
  }
  
  .nav-item:hover .nav-arrow {
    opacity: 1;
    transform: translateX(4px);
  }
  
  .nav-item.active .nav-arrow {
    opacity: 1;
  }
  
  .sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
    background-color: var(--bg-primary);
  }
  
  .theme-toggle-compact {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background-color: var(--bg-secondary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }
  
  .theme-toggle-compact:hover {
    background-color: var(--bg-tertiary);
    border-color: var(--accent-color);
    color: var(--accent-color);
    transform: scale(1.05);
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      transform: translateX(0);
    }
    
    .sidebar.collapsed {
      transform: translateX(-100%);
      width: 280px;
    }
  }
</style>