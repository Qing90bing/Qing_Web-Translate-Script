<!-- 
  @file src/components/Actions.svelte
  @description 检查修复和项目操作界面
-->

<script>
  import { onMount } from 'svelte';
  import { checkApi, operationApi } from '../lib/api.js';
  import { addNotification } from '../stores/app.js';
  
  let checkTypes = [];
  let operationTypes = [];
  let checkResults = {};
  let operationResults = {};
  let activeTab = 'checks';
  let runningChecks = new Set();
  let runningOperations = new Set();
  
  onMount(() => {
    loadCheckTypes();
    loadOperationTypes();
  });
  
  async function loadCheckTypes() {
    try {
      const response = await checkApi.getTypes();
      if (response.success) {
        checkTypes = response.data;
      }
    } catch (error) {
      addNotification('加载检查类型失败: ' + error.message, 'error');
    }
  }
  
  async function loadOperationTypes() {
    try {
      const response = await operationApi.getTypes();
      if (response.success) {
        operationTypes = response.data;
      }
    } catch (error) {
      addNotification('加载操作类型失败: ' + error.message, 'error');
    }
  }
  
  async function runCheck(checkType) {
    runningChecks.add(checkType.id);
    runningChecks = runningChecks;
    
    try {
      const response = await checkApi.run(checkType.id);
      checkResults[checkType.id] = response.data;
      checkResults = checkResults;
      
      if (response.data.success) {
        addNotification(`${checkType.name}完成，发现 ${response.data.errorCount} 个问题`, 
          response.data.errorCount === 0 ? 'success' : 'warning');
      } else {
        addNotification(`${checkType.name}失败`, 'error');
      }
    } catch (error) {
      addNotification(`运行${checkType.name}失败: ${error.message}`, 'error');
    } finally {
      runningChecks.delete(checkType.id);
      runningChecks = runningChecks;
    }
  }
  
  async function runAllChecks() {
    const checkIds = checkTypes.map(t => t.id);
    
    for (const id of checkIds) {
      runningChecks.add(id);
    }
    runningChecks = runningChecks;
    
    try {
      const response = await checkApi.runBatch(checkIds);
      if (response.success) {
        checkResults = { ...checkResults, ...response.data.results };
        addNotification(`批量检查完成，共发现 ${response.data.summary.totalErrors} 个问题`, 
          response.data.summary.totalErrors === 0 ? 'success' : 'warning');
      }
    } catch (error) {
      addNotification(`批量检查失败: ${error.message}`, 'error');
    } finally {
      runningChecks.clear();
      runningChecks = runningChecks;
    }
  }
  
  async function runOperation(operation) {
    runningOperations.add(operation.id);
    runningOperations = runningOperations;
    
    try {
      let response;
      if (operation.id === 'build') {
        response = await operationApi.build();
      } else if (operation.id === 'sort') {
        response = await operationApi.sort();
      }
      
      operationResults[operation.id] = response;
      operationResults = operationResults;
      
      if (response.success) {
        addNotification(`${operation.name}完成`, 'success');
      } else {
        addNotification(`${operation.name}失败: ${response.message}`, 'error');
      }
    } catch (error) {
      addNotification(`执行${operation.name}失败: ${error.message}`, 'error');
    } finally {
      runningOperations.delete(operation.id);
      runningOperations = runningOperations;
    }
  }
  
  function clearResults() {
    if (activeTab === 'checks') {
      checkResults = {};
    } else {
      operationResults = {};
    }
  }
  
  function getStatusIcon(result) {
    if (!result) return 'fas fa-minus-circle text-muted';
    if (result.success) {
      return result.errorCount === 0 ? 'fas fa-check-circle text-success' : 'fas fa-exclamation-triangle text-warning';
    }
    return 'fas fa-times-circle text-error';
  }
  
  function getStatusText(result) {
    if (!result) return '未运行';
    if (result.success) {
      return result.errorCount === 0 ? '通过' : `发现 ${result.errorCount} 个问题`;
    }
    return '失败';
  }
</script>

<div class="actions-container">
  <!-- 头部 -->
  <div class="header">
    <h1 class="page-title">
      <i class="fas fa-tools"></i>
      检查与操作
    </h1>
    <div class="header-actions">
      <button 
        class="btn btn-secondary"
        on:click={clearResults}
      >
        <i class="fas fa-trash"></i>
        清空结果
      </button>
    </div>
  </div>
  
  <!-- 标签页 -->
  <div class="tabs">
    <button 
      class="tab"
      class:active={activeTab === 'checks'}
      on:click={() => activeTab = 'checks'}
    >
      <i class="fas fa-search"></i>
      检查与修复
    </button>
    <button 
      class="tab"
      class:active={activeTab === 'operations'}
      on:click={() => activeTab = 'operations'}
    >
      <i class="fas fa-cogs"></i>
      项目操作
    </button>
  </div>
  
  <!-- 内容区域 -->
  <div class="content">
    {#if activeTab === 'checks'}
      <!-- 检查与修复 -->
      <div class="section">
        <div class="section-header">
          <h2>代码检查</h2>
          <button 
            class="btn btn-primary"
            on:click={runAllChecks}
            disabled={runningChecks.size > 0}
          >
            {#if runningChecks.size > 0}
              <div class="loading"></div>
            {:else}
              <i class="fas fa-play"></i>
            {/if}
            运行所有检查
          </button>
        </div>
        
        <div class="checks-grid">
          {#each checkTypes as checkType}
            <div class="check-card card">
              <div class="check-header">
                <div class="check-info">
                  <h3>{checkType.name}</h3>
                  <p>{checkType.description}</p>
                </div>
                <div class="check-status">
                  <i class={getStatusIcon(checkResults[checkType.id])}></i>
                </div>
              </div>
              
              <div class="check-actions">
                <button 
                  class="btn btn-sm btn-primary"
                  on:click={() => runCheck(checkType)}
                  disabled={runningChecks.has(checkType.id)}
                >
                  {#if runningChecks.has(checkType.id)}
                    <div class="loading"></div>
                  {:else}
                    <i class="fas fa-play"></i>
                  {/if}
                  运行检查
                </button>
                <span class="status-text">
                  {getStatusText(checkResults[checkType.id])}
                </span>
              </div>
              
              <!-- 结果详情 -->
              {#if checkResults[checkType.id]}
                <div class="check-results">
                  {#if checkResults[checkType.id].errors.length > 0}
                    <div class="errors-list">
                      <h4>发现的问题:</h4>
                      {#each checkResults[checkType.id].errors.slice(0, 5) as error}
                        <div class="error-item">
                          <span class="error-file">{error.file}</span>
                          <span class="error-line">第{error.line}行</span>
                          <span class="error-message">{error.message}</span>
                        </div>
                      {/each}
                      {#if checkResults[checkType.id].errors.length > 5}
                        <div class="more-errors">
                          还有 {checkResults[checkType.id].errors.length - 5} 个问题...
                        </div>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <!-- 项目操作 -->
      <div class="section">
        <div class="section-header">
          <h2>项目操作</h2>
        </div>
        
        <div class="operations-grid">
          {#each operationTypes as operation}
            <div class="operation-card card">
              <div class="operation-header">
                <div class="operation-info">
                  <h3>{operation.name}</h3>
                  <p>{operation.description}</p>
                </div>
                <div class="operation-status">
                  <i class={getStatusIcon(operationResults[operation.id])}></i>
                </div>
              </div>
              
              <div class="operation-actions">
                <button 
                  class="btn btn-primary"
                  on:click={() => runOperation(operation)}
                  disabled={runningOperations.has(operation.id)}
                >
                  {#if runningOperations.has(operation.id)}
                    <div class="loading"></div>
                  {:else}
                    <i class="fas fa-play"></i>
                  {/if}
                  执行操作
                </button>
              </div>
              
              <!-- 操作结果 -->
              {#if operationResults[operation.id]}
                <div class="operation-results">
                  {#if operationResults[operation.id].success}
                    <div class="success-message">
                      <i class="fas fa-check-circle text-success"></i>
                      {operationResults[operation.id].message}
                    </div>
                    {#if operationResults[operation.id].data}
                      <div class="result-details">
                        {#if operation.id === 'build'}
                          <div class="build-info">
                            <span>输出文件: {operationResults[operation.id].data.outputPath}</span>
                          </div>
                        {:else if operation.id === 'sort'}
                          <div class="sort-info">
                            <span>处理文件: {operationResults[operation.id].data.totalFiles}</span>
                            <span>排序文件: {operationResults[operation.id].data.sortedFiles}</span>
                          </div>
                        {/if}
                      </div>
                    {/if}
                  {:else}
                    <div class="error-message">
                      <i class="fas fa-times-circle text-error"></i>
                      {operationResults[operation.id].message}
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .actions-container {
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
  
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-secondary);
  }
  
  .tab {
    padding: 1rem 1.5rem;
    border: none;
    background: none;
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 2px solid transparent;
  }
  
  .tab:hover {
    color: var(--text-primary);
    background-color: var(--bg-tertiary);
  }
  
  .tab.active {
    color: var(--accent-color);
    border-bottom-color: var(--accent-color);
  }
  
  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  
  .section {
    margin-bottom: 2rem;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  
  .section-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
  }
  
  .checks-grid,
  .operations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
  }
  
  .check-card,
  .operation-card {
    padding: 1.5rem;
  }
  
  .check-header,
  .operation-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .check-info h3,
  .operation-info h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }
  
  .check-info p,
  .operation-info p {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
  }
  
  .check-status,
  .operation-status {
    font-size: 1.25rem;
    flex-shrink: 0;
  }
  
  .check-actions,
  .operation-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .status-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .check-results,
  .operation-results {
    border-top: 1px solid var(--border-color);
    padding-top: 1rem;
    margin-top: 1rem;
  }
  
  .errors-list h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    color: var(--text-primary);
  }
  
  .error-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.5rem;
    background-color: var(--bg-secondary);
    border-radius: var(--radius-sm);
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
  }
  
  .error-file {
    font-weight: 600;
    color: var(--accent-color);
    font-family: monospace;
  }
  
  .error-line {
    color: var(--text-secondary);
    white-space: nowrap;
  }
  
  .error-message {
    color: var(--text-primary);
    flex: 1;
  }
  
  .more-errors {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.75rem;
    padding: 0.5rem;
  }
  
  .success-message,
  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }
  
  .success-message {
    background-color: rgb(34 197 94 / 0.1);
    color: var(--success-color);
  }
  
  .error-message {
    background-color: rgb(239 68 68 / 0.1);
    color: var(--error-color);
  }
  
  .result-details {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
  
  .build-info,
  .sort-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .text-success {
    color: var(--success-color);
  }
  
  .text-warning {
    color: var(--warning-color);
  }
  
  .text-error {
    color: var(--error-color);
  }
  
  .text-muted {
    color: var(--text-muted);
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .checks-grid,
    .operations-grid {
      grid-template-columns: 1fr;
    }
    
    .check-actions,
    .operation-actions {
      flex-direction: column;
      align-items: stretch;
    }
    
    .error-item {
      flex-direction: column;
      gap: 0.25rem;
    }
  }
</style>