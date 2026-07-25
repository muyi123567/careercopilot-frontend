import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// 纯静态 Vite PWA：PWA 由 public/manifest.webmanifest + public/sw.js 实现，
// 不依赖 vite-plugin-pwa（该插件在 Node22/ESM 下有 require('workbox-build') 打包 bug）。
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
