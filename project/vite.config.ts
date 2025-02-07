import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://equal-maryjane-blackduck-c7d1f9fc.koyeb.app',
        // target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
