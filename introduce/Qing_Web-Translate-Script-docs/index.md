<script setup>
import { onMounted } from 'vue'
import { useRouter, withBase } from 'vitepress'

const router = useRouter()
onMounted(() => {
  const lang = navigator.language || navigator.userLanguage || 'zh-CN';
  const lowerLang = lang.toLowerCase();

  let targetPath = '/cn/'; // 默认简体中文 (使用绝对路径，配合 withBase)

  if (lowerLang.includes('zh-tw') || lowerLang.includes('zh-hk') || lowerLang.includes('zh-mo')) {
    targetPath = '/tw/';
  } else if (lowerLang.startsWith('en')) {
    targetPath = '/en/';
  } else if (lowerLang.startsWith('zh')) {
     targetPath = '/cn/';
  } else {
     targetPath = '/en/';
  }

  // withBase 会自动加上 config.js 中配置的 base 路径
  // 例如：/Qing_Web-Translate-Script/cn/
  router.go(withBase(targetPath))
})
</script>

<div class="redirect-container">
  <div class="spinner"></div>
  <p>正在跳转...</p>
  <p class="sub-text">Redirecting...</p>
</div>

<style>
.redirect-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: var(--vp-c-bg); /* 遮挡底部内容 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--vp-font-family-base);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 2rem;
}

.redirect-container p {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 0;
}

.sub-text {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-top: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
