import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      // /api 요청은 wrangler가 띄운 Pages Functions 서버(8788)로 전달
      '/api': 'http://localhost:8788',
    },
  },
})
