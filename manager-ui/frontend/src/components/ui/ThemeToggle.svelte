<script>
  import { onMount } from 'svelte';
  
  let currentTheme = 'auto';
  let isDropdownOpen = false;
  
  const themeOptions = [
    { value: 'light', label: '日间模式', icon: 'fas fa-sun', description: '明亮主题' },
    { value: 'dark', label: '夜间模式', icon: 'fas fa-moon', description: '深色主题' },
    { value: 'auto', label: '跟随系统', icon: 'fas fa-desktop', description: '自动切换' }
  ];
  
  function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = isDarkMode ? 'dark' : 'light';
    }
    
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
  
  function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    isDropdownOpen = false;
  }
  
  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }
  
  function handleClickOutside(event) {
    if (!event.target.closest('.theme-toggle')) {
      isDropdownOpen = false;
    }
  }
  
  onMount(() => {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    currentTheme = savedTheme;
    applyTheme(savedTheme);
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    });
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  
  $: currentOption = themeOptions.find(option => option.value === currentTheme);
</script>

<div class="theme-toggle">
  <button 
    class="theme-button"
    on:click={toggleDropdown}
    aria-label="切换主题"
  >
    <i class={currentOption?.icon || 'fas fa-desktop'}></i>
    <span class="theme-label">{currentOption?.label || '跟随系统'}</span>
    <i class="fas fa-chevron-down dropdown-icon" class:rotated={isDropdownOpen}></i>
  </button>
  
  {#if isDropdownOpen}
    <div class="dropdown-menu">
      {#each themeOptions as option}
        <button
          class="dropdown-item"
          class:active={currentTheme === option.value}
          on:click={() => setTheme(option.value)}
        >
          <div class="option-icon">
            <i class={option.icon}></i>
          </div>
          <div class="option-content">
            <div class="option-label">{option.label}</div>
            <div class="option-description">{option.description}</div>
          </div>
          {#if currentTheme === option.value}
            <i class="fas fa-check check-icon"></i>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .theme-toggle {
    position: relative;
    z-index: 1000;
  }
  
  .theme-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    min-width: 140px;
    justify-content: space-between;
  }
  
  .theme-button:hover {
    background: var(--hover-bg);
    border-color: var(--accent-color);
  }
  
  .theme-label {
    flex: 1;
    text-align: left;
  }
  
  .dropdown-icon {
    transition: transform 0.2s ease;
    font-size: 12px;
    color: var(--text-muted);
  }
  
  .dropdown-icon.rotated {
    transform: rotate(180deg);
  }
  
  .dropdown-menu {
    position: absolute;
    top: auto;
    bottom: 100%;
    left: 0;
    right: 0;
    margin-bottom: 4px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    animation: dropdownSlideUp 0.2s ease;
    z-index: 1000;
  }
  
  @keyframes dropdownSlideUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px;
    background: none;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    gap: 12px;
  }
  
  .dropdown-item:hover {
    background: var(--hover-bg);
  }
  
  .dropdown-item.active {
    background: var(--accent-color);
    color: white;
  }
  
  .dropdown-item.active .option-icon {
    color: white;
  }
  
  .dropdown-item.active .option-description {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .option-icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-color);
  }
  
  .option-content {
    flex: 1;
    text-align: left;
  }
  
  .option-label {
    color: var(--text-primary);
    font-weight: 500;
    font-size: 14px;
  }
  
  .option-description {
    color: var(--text-muted);
    font-size: 12px;
    margin-top: 2px;
  }
  
  .check-icon {
    color: var(--accent-color);
    font-size: 12px;
  }
</style>