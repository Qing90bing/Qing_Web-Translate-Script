<!-- 
  @file src/routes/+page.svelte
  @description 主页面
-->

<script>
  import { onMount } from 'svelte';
  import { currentView } from '../stores/app.js';
  import WelcomePage from '../components/WelcomePage.svelte';
  import FileList from '../components/FileList.svelte';
  import Editor from '../components/Editor.svelte';
  import Actions from '../components/Actions.svelte';
  import HelpManager from '../components/HelpManager.svelte';
  
  let activeView = 'welcome';
  
  // 订阅当前视图状态
  currentView.subscribe(view => {
    activeView = view;
  });
</script>

<svelte:head>
  <title>翻译管理器</title>
  <meta name="description" content="网页翻译脚本可视化管理工具" />
</svelte:head>

<div class="main-view h-full">
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

<style>
  .main-view {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
</style>