import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const directory = path.dirname(fileURLToPath(import.meta.url));
await build({
  absWorkingDir: directory,
  entryPoints: ['src/index.jsx'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  outfile: '../../assets/vendor/portal-arco-search.js',
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'linked',
  jsx: 'transform',
  logLevel: 'info'
});
