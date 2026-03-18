import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import path from 'path'

export default defineConfig({
  base: './', // 상대 경로로 설정하여 어떤 경로에 배포해도 작동
  publicDir: 'public', // public 폴더를 dist로 복사 (명시적 설정)
  plugins: [
    react(),
    // Brotli compression for production builds
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240, // Only compress files larger than 10KB
    }),
    // Gzip compression for fallback
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
          'lucide': ['lucide-react'],
        },
      },
    },
    // 청크 크기 경고 임계값 증가 (비디오 파일로 인해)
    chunkSizeWarningLimit: 1000,
  },
})
