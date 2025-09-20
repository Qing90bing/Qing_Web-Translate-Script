<!-- 
  @file src/components/DetailsPanel.svelte
  @description 文件详情面板组件
-->

<script>
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  // 添加过渡动画导入
  import { translationApi } from '../lib/api.js';
  import { addNotification, currentView, currentFile } from '../stores/app.js';
  
  export let file = null;
  
  const dispatch = createEventDispatcher();
  
  let loading = false;
  let showDeleteDialog = false; // 添加删除确认对话框状态
  
  // 格式化文件大小
  function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // 格式化日期
  function formatDate(dateString) {
    try {
      // 如果没有日期数据，返回未知
      if (!dateString) return '未知';
      
      let date;
      
      // 处理不同的日期格式
      if (typeof dateString === 'string') {
        // 如果是 ISO 字符串格式 (YYYY-MM-DDTHH:mm:ss.sssZ)
        if (dateString.includes('T')) {
          date = new Date(dateString);
        } 
        // 如果是 YYYY-MM-DD 格式
        else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          const parts = dateString.split('-');
          date = new Date(parts[0], parts[1] - 1, parts[2]);
        } 
        // 其他字符串格式
        else {
          date = new Date(dateString);
        }
      } 
      // 如果已经是 Date 对象
      else if (dateString instanceof Date) {
        date = dateString;
      } 
      // 如果是时间戳
      else if (typeof dateString === 'number') {
        date = new Date(dateString);
      } 
      // 其他情况
      else {
        return '未知';
      }
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return '未知';
      }
      
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '未知';
    }
  }
  
  // 编辑文件
  function editFile() {
    currentFile.set(file);
    currentView.set('editor');
    dispatch('close');
  }
  
  // 删除文件
  function deleteFile() {
    // 显示删除确认对话框而不是使用浏览器原生confirm
    showDeleteDialog = true;
  }
  
  // 确认删除文件
  async function confirmDelete() {
    showDeleteDialog = false;
    loading = true;
    try {
      const response = await translationApi.delete(file.filename || file.name);
      if (response.success) {
        addNotification('文件删除成功', 'success');
        dispatch('fileDeleted', file.filename || file.name);
        dispatch('close');
      }
    } catch (error) {
      addNotification('删除文件失败: ' + error.message, 'error');
    } finally {
      loading = false;
    }
  }
  
  // 取消删除
  function cancelDelete() {
    showDeleteDialog = false;
  }
  
  // 打开测试链接
  function openTestUrl() {
    if (file.testUrl) {
      window.open(file.testUrl, '_blank');
    }
  }
  
  // 复制文件名
  function copyFilename() {
    const filename = file.filename || file.name;
    if (filename) {
      navigator.clipboard.writeText(filename).then(() => {
        addNotification('文件名已复制到剪贴板', 'success');
      }).catch(() => {
        addNotification('复制失败', 'error');
      });
    }
  }
  
  // 复制域名
  function copyDomain() {
    if (file.domain) {
      navigator.clipboard.writeText(file.domain).then(() => {
        addNotification('域名已复制到剪贴板', 'success');
      }).catch(() => {
        addNotification('复制失败', 'error');
      });
    }
  }
</script>

{#if file}
  <div class="details-panel">
    <div class="panel-header">
      <h2 class="panel-title">
        <i class="fas fa-file-code"></i>
        文件详情
      </h2>
      <button class="close-btn" on:click={() => dispatch('close')}>
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="panel-content">
      <!-- 基本信息 -->
      <div class="info-section">
        <h3 class="section-title">基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>文件名</label>
            <div class="info-value">
              <code>{file.filename || file.name}</code>
              <button class="copy-btn" on:click={copyFilename} title="复制文件名">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          
          <div class="info-item">
            <label>域名</label>
            <div class="info-value">
              {file.domain}
              <button class="copy-btn" on:click={copyDomain} title="复制域名">
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>
          
          <div class="info-item">
            <label>描述</label>
            <div class="info-value">{file.description || '暂无描述'}</div>
          </div>
          
          <div class="info-item">
            <label>测试链接</label>
            <div class="info-value">
              {#if file.testUrl}
                <a href={file.testUrl} target="_blank" rel="noopener noreferrer" class="test-link">
                  {file.testUrl}
                </a>
                <button class="link-btn" on:click={openTestUrl} title="在新窗口打开">
                  <i class="fas fa-external-link-alt"></i>
                </button>
              {:else}
                <span class="text-muted">无测试链接</span>
              {/if}
            </div>
          </div>
          
          <div class="info-item">
            <label>创建日期</label>
            <div class="info-value">{formatDate(file.creationDate)}</div>
          </div>
          
          <div class="info-item">
            <label>最后修改</label>
            <div class="info-value">{formatDate(file.lastModified)}</div>
          </div>
        </div>
      </div>
      
      <!-- 统计信息 -->
      <div class="info-section">
        <h3 class="section-title">统计信息</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon text-rules">
              <i class="fas fa-font"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{file.textRuleCount || 0}</div>
              <div class="stat-label">纯文本规则</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon regex-rules">
              <i class="fas fa-code"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{file.regexRuleCount || 0}</div>
              <div class="stat-label">正则表达式规则</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon file-size">
              <i class="fas fa-file"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{formatFileSize(file.size)}</div>
              <div class="stat-label">文件大小</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon total-rules">
              <i class="fas fa-list"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{(file.textRuleCount || 0) + (file.regexRuleCount || 0)}</div>
              <div class="stat-label">总规则数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="panel-actions">
      <button class="btn btn-primary" on:click={editFile}>
        <i class="fas fa-edit"></i>
        编辑文件
      </button>
      <button 
        class="btn btn-error" 
        on:click={deleteFile}
        disabled={loading}
      >
        {#if loading}
          <div class="loading"></div>
        {:else}
          <i class="fas fa-trash"></i>
        {/if}
        删除文件
      </button>
    </div>
  </div>
{/if}

<!-- 删除确认对话框 -->
{#if showDeleteDialog}
  <div class="modal-overlay" on:click={cancelDelete} transition:fade>
    <div class="modal delete-modal" on:click|stopPropagation transition:fly|local={{ y: -100, duration: 300 }}>
      <div class="modal-header delete-modal-header">
        <h2>确认删除文件</h2>
        <button class="close-btn" on:click={cancelDelete}>
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body delete-modal-body">
        <div class="delete-warning">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p>您确定要删除文件 <strong>{file?.filename || file?.name}</strong> 吗？</p>
          <p class="warning-text">此操作不可恢复，请谨慎操作。</p>
        </div>
      </div>
      <div class="modal-footer delete-modal-footer">
        <button class="btn btn-secondary" on:click={cancelDelete} disabled={loading}>
          取消
        </button>
        <button 
          class="btn btn-error"
          on:click={confirmDelete}
          disabled={loading}
        >
          {#if loading}
            <div class="loading"></div>
          {:else}
            <i class="fas fa-trash"></i>
          {/if}
          确认删除
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .details-panel {
    background-color: var(--bg-primary);
    border-left: 1px solid var(--border-color);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .panel-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--bg-secondary);
  }
  
  .panel-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
  }
  
  .panel-title i {
    color: var(--accent-color);
  }
  
  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    transition: var(--transition);
  }
  
  .close-btn:hover {
    color: var(--text-primary);
    background-color: var(--bg-tertiary);
  }
  
  .panel-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  
  .info-section {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--accent-color);
  }
  
  .info-grid {
    display: grid;
    gap: 1rem;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .info-item label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  .info-value {
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .info-value code {
    background-color: var(--bg-secondary);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-family: monospace;
    font-size: 0.875rem;
  }
  
  .copy-btn, .link-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    transition: var(--transition);
  }
  
  .copy-btn:hover, .link-btn:hover {
    color: var(--accent-color);
    background-color: var(--bg-secondary);
  }
  
  .test-link {
    color: var(--accent-color);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
  }
  
  .test-link:hover {
    text-decoration: underline;
  }
  
  .text-muted {
    color: var(--text-muted);
    font-style: italic;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    background-color: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: var(--transition);
    cursor: pointer;
  }
  
  .stat-card:hover {
    border-color: var(--accent-color);
    box-shadow: var(--shadow-sm);
  }
  
  .stat-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    color: white;
  }
  
  .stat-icon.text-rules {
    background-color: #10b981;
  }
  
  .stat-icon.regex-rules {
    background-color: #3b82f6;
  }
  
  .stat-icon.file-size {
    background-color: #f59e0b;
  }
  
  .stat-icon.total-rules {
    background-color: #8b5cf6;
  }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }
  
  .panel-actions {
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 0.75rem;
  }
  
  .panel-actions .btn {
    flex: 1;
    cursor: pointer;
  }
  
  .panel-actions .btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  .panel-actions .btn:active {
    transform: translateY(0);
  }
  
  .panel-actions .btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
  
  /* 添加删除确认对话框样式 */
  .delete-modal {
    max-width: 450px;
  }
  
  .delete-modal-header {
    background-color: var(--bg-secondary);
  }
  
  .delete-modal-body {
    text-align: center;
  }
  
  .delete-warning {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .warning-icon {
    font-size: 3rem;
    color: var(--warning-color);
  }
  
  .warning-text {
    color: var(--text-muted);
    font-size: 0.875rem;
  }
  
  .delete-modal-footer {
    background-color: var(--bg-secondary);
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .panel-actions {
      flex-direction: column;
    }
  }
</style>