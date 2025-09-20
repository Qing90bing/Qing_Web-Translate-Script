<!-- 
  @file src/routes/+page.svelte
  @description 主页面
-->

<script>
  import { onMount } from 'svelte';
  import { currentView, selectedFileForDetails, translationFiles } from '../stores/app.js';
  import WelcomePage from '../components/WelcomePage.svelte';
  import FileList from '../components/FileList.svelte';
  import Editor from '../components/Editor.svelte';
  import Actions from '../components/Actions.svelte';
  import HelpManager from '../components/HelpManager.svelte';
  import DetailsPanel from '../components/DetailsPanel.svelte';
  
  let activeView = 'welcome';
  let selectedFile = null;
  let showOverlay = false;
  let detailsVisible = false;
  
  // 订阅当前视图状态
  currentView.subscribe(view => {
    activeView = view;
  });
  
  // 订阅选中的详情文件
  selectedFileForDetails.subscribe(file => {
    selectedFile = file;
    showOverlay = !!file;
    detailsVisible = !!file;
  });
  
  // 关闭详情面板
  function closeDetailsPanel() {
    detailsVisible = false;
    // 延迟清除selectedFile以确保动画完成
    setTimeout(() => {
      selectedFileForDetails.set(null);
    }, 300);
  }
  
  // 处理文件删除
  function handleFileDeleted(event) {
    const deletedFileName = event.detail;
    // 从文件列表中移除已删除的文件
    translationFiles.update(files => 
      files.filter(file => file.name !== deletedFileName)
    );
  }
</script>

<svelte:head>
  <title>翻译管理器</title>
  <meta name="description" content="网页翻译脚本可视化管理工具" />
</svelte:head>

<div class="main-container h-full">
  <div class="main-view" class:blurred={showOverlay}>
    {#if activeView === 'welcome'}
      <WelcomePage />
    {:else if activeView === 'files'}
      <FileList />
    {:else if activeView === 'editor'}
      <Editor />
    {:else if activeView === 'actions'}
      <Actions />
    {:else if activeView === 'help'}
      <HelpManager />
    {/if}
  </div>
  
  {#if showOverlay}
    <div class="overlay" on:click={closeDetailsPanel}></div>
  {/if}
  
  {#if selectedFile}
    <div class="details-container" class:show={detailsVisible}>
      <DetailsPanel 
        file={selectedFile} 
        on:close={closeDetailsPanel}
        on:fileDeleted={handleFileDeleted}
      />
    </div>
  {/if}
</div>

<style>
  .main-container {
    display: flex;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  
  .main-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    overflow: auto;
    transition: filter 0.3s ease;
  }
  
  .main-view.blurred {
    filter: blur(3px);
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
  
  .details-container {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 400px;
    max-width: 50vw;
    background-color: var(--bg-primary);
    z-index: 1000;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .details-container.show {
    transform: translateX(0);
  }
  
  /* 响应式设计 */
  @media (max-width: 1024px) {
    .details-container {
      width: 350px;
    }
  }
  
  @media (max-width: 768px) {
    .main-container {
      flex-direction: column;
    }
    
    .details-container {
      width: 100%;
      max-width: none;
      height: 50vh;
      top: auto;
      bottom: 0;
      transform: translateY(100%);
    }
    
    .details-container.show {
      transform: translateY(0);
    }
  }
</style>