import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [
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
    react(),
  ],
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
})
