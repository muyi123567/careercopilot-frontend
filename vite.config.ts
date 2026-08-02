import { defineConfig } from 'vitest/config';
import path from 'node:path';
import react from '@vitejs/plugin-react';

// 纯静态 Vite PWA：PWA 由 public/manifest.webmanifest + public/sw.js 实现，
// 不依赖 vite-plugin-pwa（该插件在 Node22/ESM 下有 require('workbox-build') 打包 bug）。
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-echarts': ['echarts'],
          'vendor-pdf': ['pdfjs-dist'],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
