<!-- 
  @file src/components/Editor.svelte
  @description 表格形式的翻译规则编辑器
-->

<script>
  import { onMount } from 'svelte';
  import { translationApi } from '../lib/api.js';
  import { currentFile, currentView, addNotification } from '../stores/app.js';
  
  let file = null;
  let textRules = [];
  let regexRules = [];
  let styles = [];
  let jsRules = [];
  let loading = false;
  let saving = false;
  
  // 元数据字段
  let description = '';
  let testUrl = '';
  let creationDate = '';
  
  // 订阅当前文件
  currentFile.subscribe(value => {
    file = value;
    if (file) {
      loadFileContent();
    }
  });
  
  async function loadFileContent() {
    if (!file) return;
    
    loading = true;
    try {
      console.log('正在加载文件:', file.name);
      const response = await translationApi.get(file.name);
      console.log('API响应:', response);
      
      if (response.success) {
        const data = response.data;
        console.log('解析到的数据:', data);
        
        textRules = data.textRules || [];
        regexRules = data.regexRules || [];
        styles = data.styles || [];
        jsRules = data.jsRules || [];
        
        // 加载元数据
        description = data.description || '';
        testUrl = data.testUrl || '';
        creationDate = data.creationDate || '';
        
        console.log('设置后的规则:', {
          textRules: textRules.length,
          regexRules: regexRules.length,
          styles: styles.length,
          jsRules: jsRules.length
        });
        
        if (textRules.length > 0 || regexRules.length > 0) {
          addNotification(`成功加载 ${textRules.length} 条文本规则和 ${regexRules.length} 条正则规则`, 'success');
        }
      }
    } catch (error) {
      console.error('加载文件失败:', error);
      addNotification('加载文件内容失败: ' + error.message, 'error');
    } finally {
      loading = false;
    }
  }
  
  async function saveFile() {
    if (!file) return;
    
    saving = true;
    try {
      const data = {
        textRules: textRules.filter(rule => rule.source.trim() || rule.target.trim()),
        regexRules: regexRules.filter(rule => rule.pattern.trim() || rule.replacement.trim()),
        styles: styles.filter(style => style.trim()),
        jsRules: jsRules.filter(rule => rule.trim()),
        // 包含元数据
        description: description.trim(),
        testUrl: testUrl.trim(),
        creationDate: creationDate.trim()
      };
      
      const response = await translationApi.update(file.name, data);
      if (response.success) {
        addNotification('文件保存成功', 'success');
      }
    } catch (error) {
      addNotification('保存文件失败: ' + error.message, 'error');
    } finally {
      saving = false;
    }
  }
  
  function addTextRule() {
    textRules = [...textRules, { source: '', target: '' }];
  }
  
  function removeTextRule(index) {
    textRules = textRules.filter((_, i) => i !== index);
  }
  
  function addRegexRule() {
    regexRules = [...regexRules, { pattern: '', flags: 'i', replacement: '' }];
  }
  
  function removeRegexRule(index) {
    regexRules = regexRules.filter((_, i) => i !== index);
  }
  
  function addStyle() {
    styles = [...styles, ''];
  }
  
  function removeStyle(index) {
    styles = styles.filter((_, i) => i !== index);
  }
  
  function addJsRule() {
    jsRules = [...jsRules, ''];
  }
  
  function removeJsRule(index) {
    jsRules = jsRules.filter((_, i) => i !== index);
  }
  
  function goBack() {
    currentView.set('files');
    currentFile.set(null);
  }
  
  function handleKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      saveFile();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="editor-container">
  {#if !file}
    <div class="no-file-state">
      <div class="state-icon">
        <i class="fas fa-file-edit"></i>
      </div>
      <div class="state-content">
        <h3>未选择翻译文件</h3>
        <p>请先选择一个翻译文件进行编辑，或查看下面的示例内容了解编辑器功能</p>
        <div class="state-actions">
          <button class="btn btn-primary" on:click={goBack}>
            <i class="fas fa-folder-open"></i>
            选择文件
          </button>
        </div>
      </div>
    </div>
    
    <!-- 示例内容区域 -->
    <div class="demo-section">
      <div class="demo-header">
        <h2>
          <i class="fas fa-lightbulb"></i>
          编辑器功能预览
        </h2>
        <p>下面是翻译规则编辑器的功能示例，选择文件后即可开始编辑</p>
      </div>
      
      <div class="demo-content">
        <!-- 纯文本规则示例 -->
        <div class="demo-section-item">
          <h3>
            <i class="fas fa-font"></i>
            纯文本翻译规则
          </h3>
          <p>直接对应的文本替换，支持精确匹配</p>
          <div class="demo-table">
            <table class="table">
              <thead>
                <tr>
                  <th>原文</th>
                  <th>译文</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Home</td>
                  <td>首页</td>
                </tr>
                <tr>
                  <td>About</td>
                  <td>关于</td>
                </tr>
                <tr>
                  <td>Contact</td>
                  <td>联系我们</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 正则规则示例 -->
        <div class="demo-section-item">
          <h3>
            <i class="fas fa-code"></i>
            正则表达式翻译规则
          </h3>
          <p>使用正则表达式匹配复杂模式，支持高级替换</p>
          <div class="demo-table">
            <table class="table">
              <thead>
                <tr>
                  <th>正则模式</th>
                  <th>标志</th>
                  <th>替换文本</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-family: monospace;">\\d{4}-\\d{2}-\\d{2}</td>
                  <td style="font-family: monospace;">g</td>
                  <td>日期格式</td>
                </tr>
                <tr>
                  <td style="font-family: monospace;">\\$\\d+\\.\\d{2}</td>
                  <td style="font-family: monospace;">g</td>
                  <td>价格</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- 头部操作栏 -->
    <div class="header">
      <div class="header-content">
        <div class="file-info">
          <button class="btn btn-secondary btn-sm" on:click={goBack}>
            <i class="fas fa-arrow-left"></i>
            返回
          </button>
          <div class="file-details">
            <h1 class="file-title">
              <i class="fas fa-file-code"></i>
              {file.domain}
            </h1>
            <p class="file-name">{file.name}</p>
          </div>
        </div>
        <div class="header-actions">
          <button 
            class="btn btn-success"
            on:click={saveFile}
            disabled={saving || loading}
          >
            {#if saving}
              <div class="loading"></div>
            {:else}
              <i class="fas fa-save"></i>
            {/if}
            保存 (Ctrl+S)
          </button>
        </div>
      </div>
    </div>
    
    {#if loading}
      <div class="loading-state">
        <div class="loading"></div>
        <p>正在加载文件内容...</p>
      </div>
    {:else}
      <!-- 编辑区域 -->
      <div class="editor-content">
        <!-- 元数据编辑区域 -->
        <div class="section metadata-section">
          <div class="section-header">
            <h2>
              <i class="fas fa-info-circle"></i>
              文件元数据
            </h2>
          </div>
          <div class="metadata-form">
            <div class="form-row">
              <div class="form-group">
                <label for="description">文件描述</label>
                <input 
                  type="text" 
                  id="description"
                  class="input"
                  bind:value={description}
                  placeholder="请输入文件描述..."
                />
              </div>
              <div class="form-group">
                <label for="testUrl">测试链接</label>
                <input 
                  type="url" 
                  id="testUrl"
                  class="input"
                  bind:value={testUrl}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="creationDate">创建日期</label>
                <input 
                  type="date" 
                  id="creationDate"
                  class="input"
                  bind:value={creationDate}
                />
              </div>
              <div class="form-group">
                <label for="domain">域名（只读）</label>
                <input 
                  type="text" 
                  id="domain"
                  class="input"
                  value={file ? file.domain : ''}
                  readonly
                  style="background-color: var(--bg-secondary); color: var(--text-muted);"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 纯文本翻译规则 -->
        <div class="section">
          <div class="section-header">
            <h2>
              <i class="fas fa-font"></i>
              纯文本翻译规则
            </h2>
            <button class="btn btn-sm btn-primary" on:click={addTextRule}>
              <i class="fas fa-plus"></i>
              添加规则
            </button>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th width="40%">原文</th>
                  <th width="40%">译文</th>
                  <th width="20%">操作</th>
                </tr>
              </thead>
              <tbody>
                {#each textRules as rule, index}
                  <tr>
                    <td>
                      <input 
                        type="text" 
                        class="input"
                        bind:value={rule.source}
                        placeholder="输入原文..."
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        class="input"
                        bind:value={rule.target}
                        placeholder="输入译文..."
                      />
                    </td>
                    <td>
                      <button 
                        class="btn btn-sm btn-error"
                        on:click={() => removeTextRule(index)}
                        title="删除规则"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                {/each}
                {#if textRules.length === 0}
                  <tr>
                    <td colspan="3" class="empty-row">
                      暂无纯文本规则，点击"添加规则"开始添加
                    </td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 正则表达式翻译规则 -->
        <div class="section">
          <div class="section-header">
            <h2>
              <i class="fas fa-code"></i>
              正则表达式翻译规则
            </h2>
            <button class="btn btn-sm btn-primary" on:click={addRegexRule}>
              <i class="fas fa-plus"></i>
              添加规则
            </button>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th width="35%">正则模式</th>
                  <th width="15%">标志</th>
                  <th width="35%">替换文本</th>
                  <th width="15%">操作</th>
                </tr>
              </thead>
              <tbody>
                {#each regexRules as rule, index}
                  <tr>
                    <td>
                      <input 
                        type="text" 
                        class="input"
                        bind:value={rule.pattern}
                        placeholder="输入正则表达式..."
                        style="font-family: monospace;"
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        class="input"
                        bind:value={rule.flags}
                        placeholder="gimuy"
                        style="font-family: monospace;"
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        class="input"
                        bind:value={rule.replacement}
                        placeholder="替换文本..."
                      />
                    </td>
                    <td>
                      <button 
                        class="btn btn-sm btn-error"
                        on:click={() => removeRegexRule(index)}
                        title="删除规则"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                {/each}
                {#if regexRules.length === 0}
                  <tr>
                    <td colspan="4" class="empty-row">
                      暂无正则表达式规则，点击"添加规则"开始添加
                    </td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- CSS 样式 -->
        <div class="section">
          <div class="section-header">
            <h2>
              <i class="fas fa-paint-brush"></i>
              CSS 样式
            </h2>
            <button class="btn btn-sm btn-primary" on:click={addStyle}>
              <i class="fas fa-plus"></i>
              添加样式
            </button>
          </div>
          <div class="styles-container">
            {#each styles as style, index}
              <div class="style-item">
                <textarea 
                  class="input"
                  bind:value={styles[index]}
                  placeholder="输入CSS样式..."
                  rows="3"
                  style="font-family: monospace;"
                ></textarea>
                <button 
                  class="btn btn-sm btn-error"
                  on:click={() => removeStyle(index)}
                  title="删除样式"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            {/each}
            {#if styles.length === 0}
              <div class="empty-state-small">
                暂无CSS样式，点击"添加样式"开始添加
              </div>
            {/if}
          </div>
        </div>
        
        <!-- JavaScript 脚本 -->
        <div class="section">
          <div class="section-header">
            <h2>
              <i class="fas fa-code"></i>
              JavaScript 脚本
            </h2>
            <button class="btn btn-sm btn-primary" on:click={addJsRule}>
              <i class="fas fa-plus"></i>
              添加脚本
            </button>
          </div>
          <div class="scripts-container">
            {#each jsRules as script, index}
              <div class="script-item">
                <textarea 
                  class="input"
                  bind:value={jsRules[index]}
                  placeholder="输入JavaScript代码..."
                  rows="4"
                  style="font-family: monospace;"
                ></textarea>
                <button 
                  class="btn btn-sm btn-error"
                  on:click={() => removeJsRule(index)}
                  title="删除脚本"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            {/each}
            {#if jsRules.length === 0}
              <div class="empty-state-small">
                暂无JavaScript脚本，点击"添加脚本"开始添加
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .editor-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .no-file-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    text-align: center;
    background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
    border-radius: 16px;
    margin: 2rem;
    border: 1px solid var(--border-color);
  }
  
  .state-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--accent-color), #7c3aed);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .state-icon i {
    font-size: 2.5rem;
    color: white;
  }
  
  .state-content h3 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .state-content p {
    margin: 0 0 2rem 0;
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 400px;
  }
  
  .demo-section {
    padding: 2rem;
    overflow-y: auto;
  }
  
  .demo-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem;
    background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
    border-radius: 16px;
    border: 1px solid var(--border-color);
  }
  
  .demo-header h2 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 1.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
  
  .demo-header h2 i {
    color: var(--accent-color);
  }
  
  .demo-header p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  .demo-content {
    display: grid;
    gap: 2rem;
  }
  
  .demo-section-item {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .demo-section-item h3 {
    margin: 0;
    padding: 1.5rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 1.125rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .demo-section-item h3 i {
    color: var(--accent-color);
  }
  
  .demo-section-item > p {
    margin: 0;
    padding: 1rem 1.5rem;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
  }
  
  .demo-table {
    padding: 1rem;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--text-muted);
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
  
  .file-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .file-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .file-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
  }
  
  .file-title i {
    color: var(--accent-color);
  }
  
  .file-name {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
    font-family: monospace;
  }
  
  .editor-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .section {
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .metadata-section {
    border-color: var(--accent-color);
    border-width: 2px;
    margin-bottom: 2rem;
  }
  
  .metadata-form {
    padding: 2rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .form-row:last-child {
    margin-bottom: 0;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  .section-header {
    padding: 1.5rem 2rem;
    background-color: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .section-header h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .table th,
  .table td {
    padding: 1rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    vertical-align: top;
  }
  
  .table th {
    background-color: var(--bg-tertiary);
    font-weight: 600;
    color: var(--text-secondary);
    white-space: nowrap;
  }
  
  .table .input {
    border: none;
    background: transparent;
    width: 100%;
    min-width: 200px;
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  
  .table .input:focus {
    background-color: var(--bg-secondary);
    border: 1px solid var(--accent-color);
    border-radius: var(--radius-sm);
  }
  
  .empty-row {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    padding: 2rem;
  }
  
  .styles-container,
  .scripts-container {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .style-item,
  .script-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }
  
  .style-item textarea,
  .script-item textarea {
    flex: 1;
  }
  
  .empty-state-small {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    padding: 2rem;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .file-info {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .file-details {
      text-align: center;
    }
    
    .header-actions {
      justify-content: center;
    }
    
    .section-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .table-container {
      font-size: 0.875rem;
    }
    
    .style-item,
    .script-item {
      flex-direction: column;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .metadata-form {
      padding: 1rem;
    }
  }
</style>