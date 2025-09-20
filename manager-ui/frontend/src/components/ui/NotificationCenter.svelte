<!-- 
  @file src/components/ui/NotificationCenter.svelte
  @description 通知中心
-->

<script>
  import { notifications, removeNotification } from '../../stores/app.js';
  import { fly, slide } from 'svelte/transition';
  
  function getNotificationIcon(type) {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      case 'error': return 'fas fa-times-circle';
      default: return 'fas fa-info-circle';
    }
  }
  
  function getNotificationClass(type) {
    switch (type) {
      case 'success': return 'notification-success';
      case 'warning': return 'notification-warning';
      case 'error': return 'notification-error';
      default: return 'notification-info';
    }
  }
</script>

<div class="notification-container">
  {#each $notifications as notification (notification.id)}
    <div 
      class="notification {getNotificationClass(notification.type)}"
      in:fly={{ x: 300, duration: 300 }}
      out:fly={{ x: 300, duration: 300 }}
    >
      <div class="notification-content">
        <i class={getNotificationIcon(notification.type)}></i>
        <span class="notification-message">{notification.message}</span>
      </div>
      <button 
        class="notification-close"
        on:click={() => removeNotification(notification.id)}
        title="关闭"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  {/each}
</div>

<style>
  .notification-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column-reverse; /* 反向排列，新通知在上面 */
    gap: 0.75rem;
    max-width: 450px;
  }
  
  .notification {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem; /* 增加内边距 */
    border-radius: var(--radius-lg); /* 增加圆角 */
    box-shadow: var(--shadow-lg);
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    min-height: 4.5rem; /* 增加最小高度 */
    width: 100%;
    font-size: 1rem; /* 增加字体大小 */
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    min-width: 0;
  }
  
  .notification-message {
    font-size: 1rem; /* 增加字体大小 */
    line-height: 1.5;
    word-wrap: break-word;
    flex: 1;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    transition: var(--transition);
    flex-shrink: 0;
    align-self: flex-start; /* 顶部对齐 */
    margin-left: 1rem;
  }
  
  .notification-close:hover {
    color: var(--text-primary);
    background-color: var(--bg-secondary);
  }
  
  .notification-success {
    border-left: 4px solid var(--success-color);
  }
  
  .notification-success i {
    color: var(--success-color);
    font-size: 1.5rem; /* 增加图标大小 */
  }
  
  .notification-warning {
    border-left: 4px solid var(--warning-color);
  }
  
  .notification-warning i {
    color: var(--warning-color);
    font-size: 1.5rem;
  }
  
  .notification-error {
    border-left: 4px solid var(--error-color);
  }
  
  .notification-error i {
    color: var(--error-color);
    font-size: 1.5rem;
  }
  
  .notification-info {
    border-left: 4px solid var(--accent-color);
  }
  
  .notification-info i {
    color: var(--accent-color);
    font-size: 1.5rem;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .notification-container {
      bottom: 0.75rem;
      right: 0.75rem;
      left: 0.75rem;
      max-width: none;
    }
    
    .notification {
      padding: 1rem;
    }
    
    .notification-message {
      font-size: 0.95rem;
    }
  }
</style>