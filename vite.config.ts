import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    port: 7733,
    host: '0.0.0.0'
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'image2blocks',
      formats: ['es', 'cjs'],
      fileName: (format) => `image2blocks.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ['image-js'],
    },
  },
});
