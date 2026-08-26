import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'portal-relative-public-assets',
      generateBundle(_options, bundle) {
        for (const output of Object.values(bundle)) {
          if (output.type !== 'chunk') continue
          output.code = output.code
            .replaceAll('"../assets/', '"./assets/')
            .replaceAll('"/assets/', '"./assets/')
            .replaceAll("'../assets/", "'./assets/")
            .replaceAll("'/assets/", "'./assets/")
        }
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    allowedHosts: ['.trycloudflare.com'],
    headers: {
      'Cache-Control': 'no-store',
    },
    watch: {
      usePolling: true,
      interval: 150,
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
})
