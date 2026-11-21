import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/absurd-lowpoly-content-engine/' : './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
