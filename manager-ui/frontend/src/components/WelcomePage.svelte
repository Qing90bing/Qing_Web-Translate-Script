<!-- 
  @file src/components/WelcomePage.svelte
  @description 欢迎页面，介绍工具功能和使用指南
-->

<script>
  import { currentView } from '../stores/app.js';
  
  const features = [
    {
      id: 'files',
      title: '文件管理',
      description: '创建、删除和管理翻译文件，支持批量操作',
      icon: 'fas fa-folder-open',
      color: '#2563eb',
      actions: ['新建文件', '删除文件', '文件列表', '批量操作']
    },
    {
      id: 'editor',
      title: '规则编辑',
      description: '可视化编辑翻译规则，支持实时预览和语法高亮',
      icon: 'fas fa-edit',
      color: '#10b981',
      actions: ['编辑翻译', '语法高亮', '实时预览', '批量编辑']
    },
    {
      id: 'actions',
      title: '检查修复',
      description: '自动检查翻译质量，发现并修复常见问题',
      icon: 'fas fa-tools',
      color: '#f59e0b',
      actions: ['质量检查', '错误修复', '格式优化', '批量处理']
    },
    {
      id: 'help',
      title: '帮助管理',
      description: '管理帮助文档和用户指南，提供完整的使用说明',
      icon: 'fas fa-question-circle',
      color: '#8b5cf6',
      actions: ['使用指南', '常见问题', '快捷键', '技术支持']
    }
  ];
  
  const quickStart = [
    {
      step: 1,
      title: '创建或选择翻译文件',
      description: '在文件管理中创建新的翻译文件或选择现有文件',
      icon: 'fas fa-file-plus',
      action: () => currentView.set('files')
    },
    {
      step: 2,
      title: '编辑翻译规则',
      description: '使用规则编辑器添加或修改翻译内容',
      icon: 'fas fa-edit',
      action: () => currentView.set('editor')
    },
    {
      step: 3,
      title: '检查和优化',
      description: '运行质量检查，自动修复发现的问题',
      icon: 'fas fa-check-circle',
      action: () => currentView.set('actions')
    }
  ];
  
  function navigateToFeature(featureId) {
    currentView.set(featureId);
  }
  
  function executeQuickAction(action) {
    action();
  }
</script>

<div class="welcome-page">
  <!-- 欢迎横幅 -->
  <div class="welcome-banner">
    <div class="banner-content">
      <div class="banner-icon">
        <i class="fas fa-language"></i>
      </div>
      <div class="banner-text">
        <h1>欢迎使用翻译管理工具</h1>
        <p>一个强大的浏览器端翻译文件管理和编辑工具，让翻译工作变得简单高效</p>
      </div>
    </div>
    <div class="banner-stats">
      <div class="stat-item">
        <div class="stat-number">4</div>
        <div class="stat-label">核心功能</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">∞</div>
        <div class="stat-label">支持文件</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">100%</div>
        <div class="stat-label">浏览器兼容</div>
      </div>
    </div>
  </div>
  
  <!-- 功能特性 -->
  <div class="features-section">
    <div class="section-header">
      <h2>主要功能</h2>
      <p>探索翻译管理工具的强大功能</p>
    </div>
    
    <div class="features-grid">
      {#each features as feature}
        <div 
          class="feature-card"
          style="--feature-color: {feature.color}"
          on:click={() => navigateToFeature(feature.id)}
          on:keydown={(e) => e.key === 'Enter' && navigateToFeature(feature.id)}
          tabindex="0"
          role="button"
        >
          <div class="feature-header">
            <div class="feature-icon">
              <i class={feature.icon}></i>
            </div>
            <h3>{feature.title}</h3>
          </div>
          <p class="feature-description">{feature.description}</p>
          <div class="feature-actions">
            {#each feature.actions as action}
              <span class="action-tag">{action}</span>
            {/each}
          </div>
          <div class="feature-arrow">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- 快速开始 -->
  <div class="quick-start-section">
    <div class="section-header">
      <h2>快速开始</h2>
      <p>按照以下步骤快速上手使用</p>
    </div>
    
    <div class="quick-start-steps">
      {#each quickStart as step}
        <div class="step-card">
          <div class="step-number">{step.step}</div>
          <div class="step-content">
            <div class="step-header">
              <div class="step-icon">
                <i class={step.icon}></i>
              </div>
              <h4>{step.title}</h4>
            </div>
            <p>{step.description}</p>
            <button 
              class="step-action"
              on:click={() => executeQuickAction(step.action)}
            >
              立即开始
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- 使用提示 -->
  <div class="tips-section">
    <div class="section-header">
      <h2>使用提示</h2>
      <p>充分利用工具的各项功能</p>
    </div>
    
    <div class="tips-grid">
      <div class="tip-card">
        <div class="tip-icon">
          <i class="fas fa-keyboard"></i>
        </div>
        <h4>快捷键支持</h4>
        <p>使用快捷键可以大大提高工作效率，在帮助页面查看完整列表</p>
      </div>
      
      <div class="tip-card">
        <div class="tip-icon">
          <i class="fas fa-palette"></i>
        </div>
        <h4>主题切换</h4>
        <p>支持日间、夜间和跟随系统三种主题模式，护眼又美观</p>
      </div>
      
      <div class="tip-card">
        <div class="tip-icon">
          <i class="fas fa-mobile-alt"></i>
        </div>
        <h4>响应式设计</h4>
        <p>完美支持各种屏幕尺寸，无论桌面还是移动设备都能流畅使用</p>
      </div>
      
      <div class="tip-card">
        <div class="tip-icon">
          <i class="fas fa-save"></i>
        </div>
        <h4>自动保存</h4>
        <p>编辑内容会自动保存，不用担心意外丢失重要的翻译工作</p>
      </div>
    </div>
  </div>
</div>

<style>
  .welcome-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    color: var(--text-primary);
  }
  
  /* 欢迎横幅 */
  .welcome-banner {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-radius: 24px;
    padding: 3rem;
    margin-bottom: 3rem;
    color: white;
    position: relative;
    overflow: hidden;
  }
  
  .welcome-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
  
  .banner-content {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    position: relative;
    z-index: 1;
  }
  
  .banner-icon {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    backdrop-filter: blur(10px);
  }
  
  .banner-text h1 {
    margin: 0 0 1rem 0;
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
  }
  
  .banner-text p {
    margin: 0;
    font-size: 1.2rem;
    opacity: 0.9;
    line-height: 1.5;
  }
  
  .banner-stats {
    display: flex;
    gap: 3rem;
    position: relative;
    z-index: 1;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  
  /* 功能区块 */
  .features-section,
  .quick-start-section,
  .tips-section {
    margin-bottom: 4rem;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .section-header h2 {
    margin: 0 0 1rem 0;
    font-size: 2rem;
    font-weight: 700;
  }
  
  .section-header p {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-secondary);
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .feature-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--feature-color);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: var(--feature-color);
  }
  
  .feature-card:hover::before {
    transform: scaleX(1);
  }
  
  .feature-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .feature-icon {
    width: 48px;
    height: 48px;
    background: var(--feature-color);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
  }
  
  .feature-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .feature-description {
    margin: 0 0 1.5rem 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  .feature-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .action-tag {
    background: var(--bg-tertiary);
    color: var(--text-muted);
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .feature-arrow {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    color: var(--feature-color);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .feature-card:hover .feature-arrow {
    opacity: 1;
    transform: translateX(4px);
  }
  
  /* 快速开始 */
  .quick-start-steps {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .step-card {
    display: flex;
    gap: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    transition: all 0.3s ease;
  }
  
  .step-card:hover {
    border-color: var(--accent-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .step-number {
    width: 48px;
    height: 48px;
    background: var(--accent-color);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: 700;
    flex-shrink: 0;
  }
  
  .step-content {
    flex: 1;
  }
  
  .step-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .step-icon {
    color: var(--accent-color);
    font-size: 1.25rem;
  }
  
  .step-header h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .step-content p {
    margin: 0 0 1rem 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  .step-action {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .step-action:hover {
    background: #3730a3;
    transform: translateY(-1px);
  }
  
  /* 使用提示 */
  .tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .tip-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
  }
  
  .tip-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .tip-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    margin: 0 auto 1rem auto;
  }
  
  .tip-card h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .tip-card p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.5;
    font-size: 0.9rem;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .welcome-page {
      padding: 1rem;
    }
    
    .welcome-banner {
      padding: 2rem;
    }
    
    .banner-content {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }
    
    .banner-text h1 {
      font-size: 2rem;
    }
    
    .banner-stats {
      justify-content: center;
      gap: 2rem;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
    }
    
    .step-card {
      flex-direction: column;
      gap: 1rem;
    }
    
    .step-header {
      justify-content: center;
    }
    
    .tips-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }
</style>