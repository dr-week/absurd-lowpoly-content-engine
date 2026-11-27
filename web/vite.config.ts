import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/absurd-lowpoly-content-engine/' : './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/')) return 'stories-vault';
          if (id.includes('/src/engine/storage/') || id.includes('/src/engine/script/')) return 'core-engines';
          if (id.includes('/src/ui/chat/') || id.includes('/src/engine/chat/')) return 'chat-module';
          if (id.includes('/src/ui/stage/')) return 'stage-module';
        },
      },
    },
  },
});
