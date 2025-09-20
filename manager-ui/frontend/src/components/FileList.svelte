<!-- 
  @file src/components/FileList.svelte
  @description 翻译文件列表和功能菜单
-->

<script>
  import { onMount } from 'svelte';
  import { translationApi } from '../lib/api.js';
  import { translationFiles, currentFile, currentView, addNotification } from '../stores/app.js';
  
  let files = [];
  let loading = false;
  let showCreateDialog = false;
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
  
  async function deleteFile(filename) {
    if (!confirm(`确定要删除文件 ${filename} 吗？此操作不可恢复。`)) {
      return;
    }
    
    loading = true;
    try {
      const response = await translationApi.delete(filename);
      if (response.success) {
        addNotification('文件删除成功', 'success');
        await loadFiles();
        // 如果删除的是当前编辑的文件，清空当前文件
        currentFile.update(current => current?.filename === filename ? null : current);
      }
    } catch (error) {
      addNotification('删除文件失败: ' + error.message, 'error');
    } finally {
      loading = false;
    }
  }
  
  function editFile(file) {
    currentFile.set(file);
    currentView.set('editor');
  }
  
  function cancelCreate() {
    showCreateDialog = false;
    newDomain = '';
  }
  
  function formatFileSize(path) {
    // 模拟文件大小计算，实际项目中可以从后端获取
    return Math.floor(Math.random() * 50 + 10) + 'KB';
  }
  
  function getLastModified() {
    // 模拟最后修改时间，实际项目中从后端获取
    return new Date().toLocaleDateString('zh-CN');
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
          <div class="file-card card">
            <div class="file-icon">
              <i class="fas fa-file-code"></i>
            </div>
            <div class="file-info">
              <h3 class="file-name">{file.domain}</h3>
              <p class="file-filename">{file.name}</p>
              <div class="file-meta">
                <span class="file-size">{formatFileSize(file.path)}</span>
                <span class="file-date">{getLastModified()}</span>
              </div>
            </div>
            <div class="file-actions">
              <button 
                class="btn btn-sm btn-primary"
                on:click={() => editFile(file)}
                title="编辑文件"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn btn-sm btn-error"
                on:click={() => deleteFile(file.name)}
                title="删除文件"
                disabled={loading}
              >
                <i class="fas fa-trash"></i>
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
  }
  
  .file-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
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
  }
</style>