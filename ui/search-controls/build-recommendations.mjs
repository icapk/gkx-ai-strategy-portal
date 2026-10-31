import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
await build({
  absWorkingDir: path.dirname(fileURLToPath(import.meta.url)),
  entryPoints: ['src/recommendations.jsx'],
  outfile: '../../assets/vendor/portal-arco-recommendations.js',
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'linked',
  jsx: 'transform',
  logLevel: 'info'
});
