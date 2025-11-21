import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 监听所有网络接口
    port: 3000,      // 指定端口号
  },
  css: {
    preprocessorOptions: {
      less: {
        // Less全局配置
        javascriptEnabled: true,
        // 自动导入全局变量文件
        additionalData: `@import "${resolve(process.cwd(), 'src/styles/variables.less')}";`
      }
    }
  }
})