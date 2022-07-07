import 'configure-dotenv';
import mongoose from 'mongoose';
import Bugsnag from './bugsnag';

import { setupOAuthServer } from './OAuthServer/index.js';

process.on('uncaughtException', async (error) => {
  Bugsnag.notify(error);
  await mongoose.connection.close();
  process.exit(1);
});
process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

console.clear();

const OAuthServer = await setupOAuthServer();

OAuthServer.on('error', (err) => {
  OAuthServer.close();
  Bugsnag.notify(err);
  console.error('OAuthServer error:', err);
  console.error('OAuthServer is down');
});