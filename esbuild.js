import esbuild from 'esbuild';
import fs from 'fs';
const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let deps = Object.keys(json.dependencies);

esbuild
  .build({
    platform: 'node',
    logLevel: 'info',
    entryPoints: ['src/server-oauth.ts', 'src/server-webhook.ts' ],
    bundle: true,
    minify: true,
    format: 'esm',
    target: 'node16',
    outdir: 'dist',
    external: deps,
  })
  .catch(() => process.exit(1));
