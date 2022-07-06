import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Bugsnag from './bugsnag';

import { setupAutohookServer } from './TWHookServer/index.js';

process.on('uncaughtException', async (error) => {
  Bugsnag.notify(error);
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
  Bugsnag.notify(err);
  console.error('TWAutohookServer error:', err);
  await TWAutohookServer.removeWebhooks();
  console.error('TWAutohookServer is down');
});
