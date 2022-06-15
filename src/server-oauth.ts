import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { setupOAuthServer } from './OAuthServer/index.js';

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

const OAuthServer = await setupOAuthServer();

OAuthServer.on('error', (err) => {
  OAuthServer.close();
  console.error('OAuthServer error:', err);
  console.error('OAuthServer is down');
});