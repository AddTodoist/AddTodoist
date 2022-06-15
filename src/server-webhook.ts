import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { setupAutohookServer } from './TWHookServer/index.js';

process.on('uncaughtException', async () => {
  await mongoose.connection.close();
  process.exit(1);
});
process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

dotenv.config();
console.clear();

const TWAutohookServer = await setupAutohookServer();

TWAutohookServer.on('error', async (err) => {
  console.error('TWAutohookServer error:', err);
  await TWAutohookServer.removeWebhooks();
  console.error('TWAutohookServer is down');
});
