import { Autohook } from '@addtodoist/twitter-autohook';
import { handleDirectMessage, directMessageRecieved, getMessage } from './DirectMessages';

export async function setupAutohookServer() {
  const autohook = await createAutohook();
  configureListeners(autohook);

  return autohook;
}

async function createAutohook() {
  const webhook = new Autohook({
    port: 5000,
  });

  await webhook.removeWebhooks();

  if (process.env.AUTOHOOK_URL) {
    // only in production
    await webhook.startServer();
    console.log('Autohook server started on port', webhook.port);
  }

  await webhook.start(process.env.AUTOHOOK_URL); // undefined == use ngrok

  // Subscribes to your own user's activity
  await webhook.subscribe({
    oauth_token: process.env.TWITTER_ACCESS_TOKEN || '',
    oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
  });

  return webhook;
}

function configureListeners(webhook: Autohook) {
  webhook.on('event', async (event) => {
    if (directMessageRecieved(event)) {
      const message = getMessage(event);
      return handleDirectMessage(message);
    }
  });
}
