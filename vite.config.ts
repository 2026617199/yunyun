import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Web 部署使用绝对路径，确保二级路由刷新后资源加载正确
  base: '/',
  server: {
    port: 3004,
    host: '0.0.0.0',
  },
})
