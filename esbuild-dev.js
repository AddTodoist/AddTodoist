import esbuild from 'esbuild';
import { typecheckPlugin } from '@jgoz/esbuild-plugin-typecheck';

import fs from 'fs';
const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let deps = Object.keys(json.dependencies);

esbuild
  .build({
    watch: true,
    platform: 'node',
    logLevel: 'info',
    entryPoints: [
      'src/server-webhook.ts',
      'src/server-oauth.ts'
    ],
    bundle: true,
    minify: false,
    format: 'esm',
    target: 'node16',
    outdir: 'dist',
    external: deps,
    plugins: [typecheckPlugin({
      watch: true
    })]
  })
  .catch(() => process.exit(1));