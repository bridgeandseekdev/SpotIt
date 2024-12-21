import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: command === 'build' ? ['**/trialComponents/**'] : [], // Excludes 'trial' folder in production
    },
  },
}));
