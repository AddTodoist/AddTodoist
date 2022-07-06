import esbuild from 'esbuild';
import fs from 'fs';
const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let deps = Object.keys(json.dependencies);

const entryPoint =
  process.env.IS_AUTOHOOK_SERVER
    ? 'src/server-webhook.ts'
    : 'src/server-oauth.ts';

esbuild
  .build({
    nodePaths: ['src'],
    platform: 'node',
    logLevel: 'info',
    entryPoints: [entryPoint],
    bundle: true,
    minify: true,
    format: 'esm',
    target: 'node16',
    outfile: 'dist/index.js',
    external: deps,
  })
  .catch(() => process.exit(1));
