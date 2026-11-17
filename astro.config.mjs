import { defineConfig } from 'astro/config';

const usePolling = process.env.CHOKIDAR_USEPOLLING === '1';

export default defineConfig({
  site: 'https://evgenykon.github.io',
  build: {
    format: 'directory',
  },
  devToolbar: { enabled: false },
  vite: {
    server: {
      host: true,
      watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
    },
  },
});
