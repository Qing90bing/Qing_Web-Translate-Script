<!-- 
  @file src/components/HelpManager.svelte
  @description 帮助内容管理组件
-->

<script>
  import { onMount } from 'svelte';
  import { helpApi } from '../lib/api.js';
  import { addNotification } from '../stores/app.js';
  
  let helpContent = {};
  let loading = false;
  let saving = false;
  let selectedSection = null;
  let editingSection = null;
  let showImageUpload = false;
  let images = [];
  
  const sections = [
    { id: 'overview', name: '概览', icon: 'fas fa-home' },
    { id: 'fileManagement', name: '文件管理', icon: 'fas fa-folder' },
    { id: 'ruleEditing', name: '规则编辑', icon: 'fas fa-edit' },
    { id: 'checking', name: '检查与修复', icon: 'fas fa-search' },
    { id: 'building', name: '项目构建', icon: 'fas fa-hammer' }
  ];
  
  onMount(() => {
    loadHelpContent();
    loadImages();
  });
  
  async function loadHelpContent() {
    loading = true;
    try {
      const response = await helpApi.getAll();
      if (response.success) {
        helpContent = response.data;
        if (!selectedSection && sections.length > 0) {
          selectedSection = sections[0].id;
        }
      }
    } catch (error) {
      addNotification('加载帮助内容失败: ' + error.message, 'error');
    } finally {
      loading = false;
    }
  }
  
  async function loadImages() {
    try {
      const response = await helpApi.getImages();
      if (response.success) {
        images = response.data;
      }
    } catch (error) {
      console.warn('加载图片列表失败:', error);
    }
  }
  
  async function saveSection(sectionId) {
    if (!helpContent[sectionId]) return;
    
    saving = true;
    try {
      const response = await helpApi.update(sectionId, helpContent[sectionId]);
      if (response.success) {
        addNotification('帮助内容保存成功', 'success');
        editingSection = null;
      }
    } catch (error) {
      addNotification('保存帮助内容失败: ' + error.message, 'error');
    } finally {
      saving = false;
    }
  }
  
  async function uploadImage(file) {
    try {
      const response = await helpApi.uploadImage(file);
      if (response.success) {
        addNotification('图片上传成功', 'success');
        await loadImages();
        showImageUpload = false;
        return response.data.url;
      }
    } catch (error) {
      addNotification('图片上传失败: ' + error.message, 'error');
    }
    return null;
  }
  
  async function deleteImage(filename) {
    if (!confirm('确定要删除这张图片吗？')) return;
    
    try {
      const response = await helpApi.deleteImage(filename);
      if (response.success) {
        addNotification('图片删除成功', 'success');
        await loadImages();
      }
    } catch (error) {
      addNotification('删除图片失败: ' + error.message, 'error');
    }
  }
  
  function addImageToContent(imageUrl) {
    if (!selectedSection || !helpContent[selectedSection]) return;
    
    const section = helpContent[selectedSection];
    if (!section.images) {
      section.images = [];
    }
    
    if (!section.images.includes(imageUrl)) {
      section.images.push(imageUrl);
      helpContent = helpContent;
    }
  }
  
  function removeImageFromContent(imageUrl) {
    if (!selectedSection || !helpContent[selectedSection]) return;
    
    const section = helpContent[selectedSection];
    if (section.images) {
      section.images = section.images.filter(url => url !== imageUrl);
      helpContent = helpContent;
    }
  }
  
  function getSectionName(sectionId) {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.name : sectionId;
  }
  
  function getSectionIcon(sectionId) {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.icon : 'fas fa-file';
  }
  
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    } else {
      addNotification('请选择有效的图片文件', 'warning');
    }
    event.target.value = '';
  }
  
  function cancelEdit() {
    editingSection = null;
    loadHelpContent(); // 重新加载以撤销未保存的更改
  }
</script>

<div class="help-manager-container">
  <!-- 头部 -->
  <div class="header">
    <h1 class="page-title">
      <i class="fas fa-question-circle"></i>
      帮助内容管理
    </h1>
    <div class="header-actions">
      <button 
        class="btn btn-secondary"
        on:click={() => showImageUpload = !showImageUpload}
      >
        <i class="fas fa-image"></i>
        图片管理
      </button>
      <button 
        class="btn btn-primary"
        on:click={loadHelpContent}
        disabled={loading}
      >
        <i class="fas fa-refresh" class:loading></i>
        刷新
      </button>
    </div>
  </div>
  
  <!-- 主要内容 -->
  <div class="main-content">
    <!-- 左侧节目录 -->
    <div class="sidebar">
      <div class="section-list">
        {#each sections as section}
          <button
            class="section-item"
            class:active={selectedSection === section.id}
            on:click={() => selectedSection = section.id}
          >
            <i class={section.icon}></i>
            <span>{section.name}</span>
          </button>
        {/each}
      </div>
    </div>
    
    <!-- 右侧内容编辑 -->
    <div class="content-area">
      {#if loading}
        <div class="loading-state">
          <div class="loading"></div>
          <p>正在加载帮助内容...</p>
        </div>
      {:else if selectedSection && helpContent[selectedSection]}
        <div class="section-editor">
          <!-- 节标题 -->
          <div class="section-header">
            <div class="section-info">
              <h2>
                <i class={getSectionIcon(selectedSection)}></i>
                {getSectionName(selectedSection)}
              </h2>
            </div>
            <div class="section-actions">
              {#if editingSection === selectedSection}
                <button 
                  class="btn btn-secondary btn-sm"
                  on:click={cancelEdit}
                >
                  取消
                </button>
                <button 
                  class="btn btn-success btn-sm"
                  on:click={() => saveSection(selectedSection)}
                  disabled={saving}
                >
                  {#if saving}
                    <div class="loading"></div>
                  {:else}
                    <i class="fas fa-save"></i>
                  {/if}
                  保存
                </button>
              {:else}
                <button 
                  class="btn btn-primary btn-sm"
                  on:click={() => editingSection = selectedSection}
                >
                  <i class="fas fa-edit"></i>
                  编辑
                </button>
              {/if}
            </div>
          </div>
          
          <!-- 编辑表单 -->
          {#if editingSection === selectedSection}
            <div class="editor-form">
              <div class="form-group">
                <label for="title">标题</label>
                <input 
                  type="text" 
                  id="title"
                  class="input"
                  bind:value={helpContent[selectedSection].title}
                  placeholder="输入帮助节标题..."
                />
              </div>
              
              <div class="form-group">
                <label for="content">内容</label>
                <textarea 
                  id="content"
                  class="input"
                  rows="10"
                  bind:value={helpContent[selectedSection].content}
                  placeholder="输入帮助内容，支持HTML格式..."
                ></textarea>
              </div>
              
              <!-- 图片管理 -->
              <div class="form-group">
                <label>相关图片</label>
                <div class="images-section">
                  {#if helpContent[selectedSection].images && helpContent[selectedSection].images.length > 0}
                    <div class="images-grid">
                      {#each helpContent[selectedSection].images as imageUrl}
                        <div class="image-item">
                          <img src={imageUrl} alt="帮助图片" />
                          <button 
                            class="remove-image-btn"
                            on:click={() => removeImageFromContent(imageUrl)}
                            title="从此节中移除图片"
                          >
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                      {/each}
                    </div>
                  {:else}
                    <div class="no-images">
                      <i class="fas fa-image"></i>
                      <p>暂无相关图片</p>
                    </div>
                  {/if}
                  
                  <div class="add-images">
                    <h4>可用图片:</h4>
                    {#if images.length > 0}
                      <div class="available-images">
                        {#each images as image}
                          <div class="available-image">
                            <img src={image.url} alt={image.filename} />
                            <button 
                              class="add-image-btn btn btn-sm btn-primary"
                              on:click={() => addImageToContent(image.url)}
                              title="添加到此节"
                            >
                              <i class="fas fa-plus"></i>
                            </button>
                          </div>
                        {/each}
                      </div>
                    {:else}
                      <p class="text-muted">暂无可用图片</p>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {:else}
            <!-- 预览模式 -->
            <div class="preview-content">
              <h3>{helpContent[selectedSection].title}</h3>
              <div class="content-text">
                {@html helpContent[selectedSection].content}
              </div>
              
              {#if helpContent[selectedSection].images && helpContent[selectedSection].images.length > 0}
                <div class="content-images">
                  <h4>相关图片:</h4>
                  <div class="images-grid">
                    {#each helpContent[selectedSection].images as imageUrl}
                      <div class="image-item">
                        <img src={imageUrl} alt="帮助图片" />
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {:else}
        <div class="no-selection">
          <i class="fas fa-hand-pointer"></i>
          <h3>请选择要编辑的帮助节</h3>
          <p>从左侧列表中选择一个帮助节开始编辑</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- 图片上传面板 -->
{#if showImageUpload}
  <div class="modal-overlay" on:click={() => showImageUpload = false}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>图片管理</h2>
        <button class="close-btn" on:click={() => showImageUpload = false}>
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <!-- 上传新图片 -->
        <div class="upload-section">
          <h3>上传新图片</h3>
          <div class="upload-area">
            <input 
              type="file" 
              accept="image/*" 
              on:change={handleFileUpload}
              style="display: none;"
              id="fileInput"
            />
            <label for="fileInput" class="upload-btn btn btn-primary">
              <i class="fas fa-upload"></i>
              选择图片文件
            </label>
            <p class="upload-help">支持 JPG, PNG, GIF, WebP 格式，最大 5MB</p>
          </div>
        </div>
        
        <!-- 已有图片列表 -->
        <div class="images-management">
          <h3>已有图片 ({images.length})</h3>
          {#if images.length > 0}
            <div class="images-list">
              {#each images as image}
                <div class="image-row">
                  <img src={image.url} alt={image.filename} class="thumbnail" />
                  <div class="image-info">
                    <span class="filename">{image.filename}</span>
                    <span class="url">{image.url}</span>
                  </div>
                  <button 
                    class="btn btn-sm btn-error"
                    on:click={() => deleteImage(image.filename)}
                    title="删除图片"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <div class="no-images-state">
              <i class="fas fa-image"></i>
              <p>暂无图片</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .help-manager-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .page-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-primary);
  }
  
  .page-title i {
    color: var(--accent-color);
  }
  
  .header-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  
  .sidebar {
    width: 250px;
    border-right: 1px solid var(--border-color);
    background-color: var(--bg-secondary);
    overflow-y: auto;
  }
  
  .section-list {
    padding: 1rem;
  }
  
  .section-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border: none;
    background: none;
    color: var(--text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: var(--transition);
    text-align: left;
    border-radius: var(--radius);
    margin-bottom: 0.25rem;
  }
  
  .section-item:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  .section-item.active {
    background-color: var(--accent-color);
    color: white;
  }
  
  .content-area {
    flex: 1;
    overflow-y: auto;
  }
  
  .loading-state,
  .no-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--text-muted);
  }
  
  .no-selection i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: var(--text-muted);
  }
  
  .section-editor {
    padding: 1.5rem;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .section-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-primary);
  }
  
  .section-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .editor-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .preview-content h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }
  
  .content-text {
    line-height: 1.6;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }
  
  .content-images h4,
  .add-images h4 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }
  
  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .image-item {
    position: relative;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border-color);
  }
  
  .image-item img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }
  
  .remove-image-btn {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .no-images {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
  }
  
  .no-images i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .available-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
  
  .available-image {
    position: relative;
    border-radius: var(--radius);
    overflow: hidden;
    border: 1px solid var(--border-color);
  }
  
  .available-image img {
    width: 100%;
    height: 80px;
    object-fit: cover;
  }
  
  .add-image-btn {
    position: absolute;
    bottom: 0.25rem;
    right: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    font-size: 0.75rem;
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
    max-width: 800px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    overflow-y: auto;
    flex: 1;
  }
  
  .upload-section {
    margin-bottom: 2rem;
  }
  
  .upload-area {
    text-align: center;
    padding: 2rem;
    border: 2px dashed var(--border-color);
    border-radius: var(--radius);
  }
  
  .upload-btn {
    margin-bottom: 0.5rem;
  }
  
  .upload-help {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin: 0;
  }
  
  .images-management h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-primary);
  }
  
  .images-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .image-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    background-color: var(--bg-secondary);
  }
  
  .thumbnail {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: var(--radius-sm);
    flex-shrink: 0;
  }
  
  .image-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }
  
  .filename {
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .url {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: monospace;
    word-break: break-all;
  }
  
  .no-images-state {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
  }
  
  .no-images-state i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .main-content {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      height: auto;
      border-right: none;
      border-bottom: 1px solid var(--border-color);
    }
    
    .section-list {
      display: flex;
      overflow-x: auto;
      gap: 0.5rem;
    }
    
    .section-item {
      white-space: nowrap;
      margin-bottom: 0;
    }
    
    .section-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .images-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
</style>