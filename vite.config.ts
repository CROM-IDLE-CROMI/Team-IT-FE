import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].mjs',
        entryFileNames: 'assets/[name]-[hash].mjs',
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/v1': { target: 'http://3.37.26.26:8080/', changeOrigin: true },
    },
  },
})
