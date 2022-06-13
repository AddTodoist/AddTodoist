import dotenv from 'dotenv';

import { setupAutohookServer } from './TWHookServer/index.js';

process.on('uncaughtException', async () => process.exit(1));
process.on('SIGTERM', () => process.exit(0));

dotenv.config();
console.clear();

const TWAutohookServer = await setupAutohookServer();

TWAutohookServer.on('error', (err) => {
  console.error('TWAutohookServer error:', err);
  TWAutohookServer.removeWebhooks();
  console.error('TWAutohookServer is down');
});
