<!-- 
  @file src/components/FileList.svelte
  @description 翻译文件列表和功能菜单
-->

<script>
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { translationApi } from '../lib/api.js';
  import { translationFiles, currentFile, currentView, addNotification, selectedFileForDetails } from '../stores/app.js';
  
  let files = [];
  let loading = false;
  let showCreateDialog = false;
  let showDeleteDialog = false;
  let fileToDelete = null;
  let newDomain = '';
  
  // 订阅store
  translationFiles.subscribe(value => files = value);
  
  onMount(() => {
    loadFiles();
  });
  
  async function loadFiles() {
    loading = true;
    try {
      const response = await translationApi.getAll();
      if (response.success) {
        translationFiles.set(response.data);
        addNotification(`已加载 ${response.data.length} 个翻译文件`, 'success');
      }
    } catch (error) {
      addNotification('加载翻译文件失败: ' + error.message, 'error');
    } finally {
      loading = false;
    }
  }
  
  async function createFile() {
    if (!newDomain.trim()) {
      addNotification('请输入有效的域名', 'warning');
      return;
    }
    
    loading = true;
    try {
      const response = await translationApi.create(newDomain.trim());
      if (response.success) {
        addNotification('翻译文件创建成功', 'success');
        showCreateDialog = false;
        newDomain = '';
        await loadFiles();
      }
    } catch (error) {
      addNotification('创建文件失败: ' + error.message, 'error');
    } finally {
      loading = false;
    }
  }
  
  // 显示删除确认对话框
  function showDeleteConfirmation(file) {
    fileToDelete = file;
    showDeleteDialog = true;
  }
  
  // 确认删除文件
  async function confirmDelete() {
    if (!fileToDelete) return;
    
    loading = true;
    showDeleteDialog = false;
    
    try {
      const response = await translationApi.delete(fileToDelete.name);
      if (response.success) {
        addNotification('文件删除成功', 'success');
        await loadFiles();
        // 如果删除的是当前编辑的文件，清空当前文件
        currentFile.update(current => current?.filename === fileToDelete.name ? null : current);
      }
    } catch (error) {
      addNotification('删除文件失败: ' + error.message, 'error');
    } finally {
      loading = false;
      fileToDelete = null;
    }
  }
  
  // 取消删除
  function cancelDelete() {
    showDeleteDialog = false;
    fileToDelete = null;
  }
  
  function editFile(file) {
    currentFile.set(file);
    currentView.set('editor');
  }
  
  // 查看详情时获取完整的文件信息（包含元数据）
  async function viewDetails(file) {
    loading = true;
    try {
      const response = await translationApi.get(file.name);
      if (response.success) {
        selectedFileForDetails.set(response.data);
      } else {
        addNotification('获取文件详情失败: ' + response.message, 'error');
        // 如果获取详情失败，仍然显示基本信息
        selectedFileForDetails.set(file);
      }
    } catch (error) {
      addNotification('获取文件详情失败: ' + error.message, 'error');
      // 如果获取详情失败，仍然显示基本信息
      selectedFileForDetails.set(file);
    } finally {
      loading = false;
    }
  }
  
  function cancelCreate() {
    showCreateDialog = false;
    newDomain = '';
  }
  
  // 格式化文件大小
  function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // 获取最后修改时间
  function getLastModified(file) {
    try {
      // 检查文件对象中是否有 lastModified 字段
      if (file.lastModified) {
        // 如果是字符串格式的日期
        if (typeof file.lastModified === 'string') {
          // 如果是 ISO 格式的时间戳
          if (file.lastModified.includes('T')) {
            return new Date(file.lastModified).toLocaleDateString('zh-CN');
          }
          // 如果是其他格式的日期字符串
          else {
            const date = new Date(file.lastModified);
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString('zh-CN');
            }
          }
        }
        // 如果是 Date 对象
        else if (file.lastModified instanceof Date) {
          return file.lastModified.toLocaleDateString('zh-CN');
        }
        // 如果是时间戳数字
        else if (typeof file.lastModified === 'number') {
          return new Date(file.lastModified).toLocaleDateString('zh-CN');
        }
      }
      // 如果没有 lastModified 字段，返回未知
      return '未知';
    } catch (error) {
      console.error('解析最后修改时间出错:', error);
      return '未知';
    }
  }
</script>

<div class="file-list-container">
  <!-- 头部操作栏 -->
  <div class="header">
    <div class="header-content">
      <h1 class="page-title">
        <i class="fas fa-folder"></i>
        翻译文件管理
      </h1>
      <div class="header-actions">
        <button 
          class="btn btn-primary"
          on:click={() => showCreateDialog = true}
          disabled={loading}
        >
          <i class="fas fa-plus"></i>
          新建文件
        </button>
        <button 
          class="btn btn-secondary"
          on:click={loadFiles}
          disabled={loading}
        >
          <i class="fas fa-refresh" class:loading></i>
          刷新
        </button>
      </div>
    </div>
  </div>
  
  <!-- 文件列表 -->
  <div class="file-list">
    {#if loading && files.length === 0}
      <div class="loading-state">
        <div class="loading"></div>
        <p>正在加载翻译文件...</p>
      </div>
    {:else if files.length === 0}
      <div class="empty-state">
        <i class="fas fa-folder-open"></i>
        <h3>暂无翻译文件</h3>
        <p>点击"新建文件"创建您的第一个翻译文件</p>
        <button 
          class="btn btn-primary"
          on:click={() => showCreateDialog = true}
        >
          <i class="fas fa-plus"></i>
          新建文件
        </button>
      </div>
    {:else}
      <div class="files-grid">
        {#each files as file}
          <div class="file-card card" on:click={() => viewDetails(file)}>
            <div class="file-icon">
              <i class="fas fa-file-code"></i>
            </div>
            <div class="file-info">
              <h3 class="file-name">{file.domain}</h3>
              <p class="file-filename">{file.name}</p>
              <div class="file-meta">
                <span class="file-size">{formatFileSize(file.size || 0)}</span>
                <span class="file-date">{getLastModified(file)}</span>
              </div>
              <div class="file-stats">
                <div class="stat-item">
                  <i class="fas fa-font"></i>
                  <span>{file.textRuleCount || 0} 文本</span>
                </div>
                <div class="stat-item">
                  <i class="fas fa-code"></i>
                  <span>{file.regexRuleCount || 0} 正则</span>
                </div>
              </div>
            </div>
            <div class="file-actions" on:click|stopPropagation>
              <button 
                class="btn btn-sm btn-secondary"
                on:click={() => viewDetails(file)}
                title="查看详情"
              >
                <i class="fas fa-eye"></i>
                查看
              </button>
              <button 
                class="btn btn-sm btn-primary"
                on:click={() => editFile(file)}
                title="编辑文件"
              >
                <i class="fas fa-edit"></i>
                编辑
              </button>
              <button 
                class="btn btn-sm btn-error"
                on:click={() => showDeleteConfirmation(file)}
                title="删除文件"
                disabled={loading}
              >
                <i class="fas fa-trash"></i>
                删除
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- 创建文件对话框 -->
{#if showCreateDialog}
  <div class="modal-overlay" on:click={cancelCreate}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>创建新的翻译文件</h2>
        <button class="close-btn" on:click={cancelCreate}>
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="domain">网站域名</label>
          <input 
            type="text" 
            id="domain"
            class="input"
            bind:value={newDomain}
            placeholder="例如: example.com"
            on:keydown={(e) => e.key === 'Enter' && createFile()}
          />
          <small class="help-text">
            请输入要翻译的网站域名，如 example.com 或 sub.example.com
          </small>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" on:click={cancelCreate}>
          取消
        </button>
        <button 
          class="btn btn-primary"
          on:click={createFile}
          disabled={loading || !newDomain.trim()}
        >
          {#if loading}
            <div class="loading"></div>
          {:else}
            <i class="fas fa-plus"></i>
          {/if}
          创建文件
        </button>
      </div>
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
          <p>您确定要删除文件 <strong>{fileToDelete?.name}</strong> 吗？</p>
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
  .file-list-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-secondary);
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
  }
  
  .page-title i {
    color: var(--accent-color);
  }
  
  .header-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .file-list {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  
  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--text-muted);
  }
  
  .empty-state i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: var(--text-muted);
  }
  
  .empty-state h3 {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  
  .empty-state p {
    margin-bottom: 1.5rem;
  }
  
  /* 修复空状态下的按钮图标大小 */
  .empty-state .btn i {
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
  
  .files-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .file-card {
    padding: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    transition: var(--transition);
    cursor: pointer;
    position: relative;
  }
  
  .file-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
  
  .file-icon {
    color: var(--accent-color);
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .file-info {
    flex: 1;
    min-width: 0;
  }
  
  .file-name {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--text-primary);
  }
  
  .file-filename {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    font-family: monospace;
  }
  
  .file-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }
  
  .file-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-secondary);
  }
  
  .stat-item i {
    font-size: 0.625rem;
  }
  
  /* 修改文件卡片按钮为垂直排列（从上往下显示） */
  .file-actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* 增加间距，使其平均分布 */
  }
  
  .file-actions .btn {
    padding: 0.5rem 0.75rem; /* 增大按钮尺寸 */
    font-size: 0.875rem;
  }
  
  .file-actions .btn i {
    margin-right: 0.25rem;
  }
  
  /* 调整文件信息区域，避免与操作按钮冲突 */
  .file-info {
    flex: 1;
    min-width: 0;
    padding-right: 5rem; /* 为操作按钮留出空间 */
  }
  
  /* 模态框样式 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background-color: var(--bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow: hidden;
  }
  
  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
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
    background-color: var(--bg-secondary);
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .help-text {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: var(--text-muted);
  }
  
  /* 删除确认对话框特殊样式 */
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
    .header-content {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .header-actions {
      justify-content: center;
    }
    
    .files-grid {
      grid-template-columns: 1fr;
    }
    
    .file-card {
      padding: 1rem;
    }
    
    .file-actions {
      padding: 0.25rem;
      gap: 0.25rem;
    }
    
    .file-actions .btn {
      padding: 0.25rem;
      font-size: 0.75rem;
    }
  }
</style>