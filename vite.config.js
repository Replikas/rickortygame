import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['pg', 'fs', 'path', 'crypto', 'stream', 'util', 'url', 'net', 'tls', 'events']
    }
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    exclude: ['pg']
  }
})