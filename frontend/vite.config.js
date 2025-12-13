import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: ['169131cb-cbd9-4881-a6aa-59b09b5adb40.preview.emergentagent.com', 'localhost', '.emergentagent.com']
  },
  build: {
    outDir: 'dist'
  }
})
