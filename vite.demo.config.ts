import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/mermaid-3d/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
