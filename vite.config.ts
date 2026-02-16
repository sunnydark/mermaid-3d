import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'mermaid3d',
      formats: ['es', 'umd'],
      fileName: (format) => `mermaid-3d.${format}.js`,
    },
    rollupOptions: {
      external: ['mermaid'],
      output: {
        exports: 'named',
        globals: {
          mermaid: 'mermaid',
        },
      },
    },
  },
});
