import dotenv from "dotenv";

import { setupOAuthServer } from "./OAuthServer/index.js";
import { setupAutohookServer } from "./TWHookServer/index.js";

process.on("uncaughtException", async () => process.exit(1));
process.on("SIGTERM", () => process.exit(0));

dotenv.config();
console.clear();

try {
  const OAuthServer = await setupOAuthServer();
  OAuthServer.on("error", (err) => {
    OAuthServer.close();
    console.error("OAuthServer error:", err);
    console.error("OAuthServer is down");
  });
} catch (err) {
  console.error("OAuthServer setup failed", err);
}

try {
  const TWAutohookServer = await setupAutohookServer();
  TWAutohookServer.on("error", (err) => {
    console.error("TWAutohookServer error:", err);
    TWAutohookServer.removeWebhooks();
    console.error("TWAutohookServer is down");
  });
} catch (err) {
  console.error("TWAutohookServer setup failed", err);
}
