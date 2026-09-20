import {annotationShared} from './server/annotationShared.mjs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { prdShared, readingPrdShared } from './server/prdShared.mjs'

export default defineConfig({
  base: './',
  cacheDir: '.local/vite-cache',
  plugins: [
    react(),
{name:'portal-public-paths',enforce:'pre',transform(code,id){if(!/\.[cm]?[jt]sx?$/.test(id)||id.includes('node_modules'))return null;return code.replace(/(["'`])\/(assets|antenna|pdfjs)\//g,'$1./$2/')}},
    annotationShared(),
    prdShared(),
    readingPrdShared(),
  ],
  server: {
    host: '127.0.0.1',
    port: 5174,
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
    port: 4174,
    strictPort: true,
  },
})
