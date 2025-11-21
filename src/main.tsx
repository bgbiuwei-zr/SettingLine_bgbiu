import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.less'
import App from './App.tsx'

// 注册 Service Worker 实现缓存
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker 注册成功:', registration.scope);
      })
      .catch((error) => {
        console.log('❌ Service Worker 注册失败:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)