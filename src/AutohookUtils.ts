// @ts-ignore
import { Autohook } from "twitter-autohook";
import { mentionedIn, directMessageRecieved } from "./utils.js";
import { ResponseTwit } from "./Twit.js";

export async function createAutohook() {
  try {
    const webhook = new Autohook({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      token: process.env.OAUTH_TOKEN,
      token_secret: process.env.OAUTH_TOKEN_SECRET,
      env: process.env.TW_ENV,
    });

    await webhook.removeWebhooks();
    await webhook.start();

    // Subscribes to your own user's activity
    await webhook.subscribe({
      oauth_token: process.env.OAUTH_TOKEN,
      oauth_token_secret: process.env.OAUTH_TOKEN_SECRET,
    });

    return webhook;
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

export function configureListeners(webhook) {
  webhook.on("event", async (event) => {
    //console.log(event);
    if (directMessageRecieved(event)) {
      const message = getMessage(event);
      console.log(message);
      console.log(event.direct_message_events[0]);
      console.log("recieved");
    }
  });
}

const getMessage = (event) => event.direct_message_events[0].message_create;

const handleDirectMessage = () => {};
