import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',
  build: {
    outDir: '../public/css',
    emptyOutDir: true,
  }
})