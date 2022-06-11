import dotenv from 'dotenv';

import { setupOAuthServer } from './OAuthServer/index.js';

process.on('uncaughtException', async () => process.exit(1));
process.on('SIGTERM', () => process.exit(0));

dotenv.config();
console.clear();

try {
  const OAuthServer = await setupOAuthServer();
  OAuthServer.on('error', (err) => {
    OAuthServer.close();
    console.error('OAuthServer error:', err);
    console.error('OAuthServer is down');
  });
} catch (err) {
  console.error('OAuthServer setup failed', err);
}