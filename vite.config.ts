import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'Templar',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'Templar.esm.js';
        if (format === 'cjs') return 'Templar.js';
        return `Templar.${format}.js`;
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        }
      }
    },
    sourcemap: true,
    target: 'es2018',
    minify: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
