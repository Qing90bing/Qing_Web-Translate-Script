<!-- 
  @file src/components/ui/NotificationCenter.svelte
  @description 通知中心
-->

<script>
  import { notifications, removeNotification } from '../../stores/app.js';
  import { fly } from 'svelte/transition';
  
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
      transition:fly={{ x: 300, duration: 300 }}
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
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 400px;
  }
  
  .notification {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    min-height: 3rem;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }
  
  .notification-message {
    font-size: 0.875rem;
    line-height: 1.4;
    word-wrap: break-word;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    transition: var(--transition);
    flex-shrink: 0;
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
  }
  
  .notification-warning {
    border-left: 4px solid var(--warning-color);
  }
  
  .notification-warning i {
    color: var(--warning-color);
  }
  
  .notification-error {
    border-left: 4px solid var(--error-color);
  }
  
  .notification-error i {
    color: var(--error-color);
  }
  
  .notification-info {
    border-left: 4px solid var(--accent-color);
  }
  
  .notification-info i {
    color: var(--accent-color);
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .notification-container {
      top: 0.5rem;
      right: 0.5rem;
      left: 0.5rem;
      max-width: none;
    }
  }
</style>