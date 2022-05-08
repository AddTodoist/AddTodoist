import dotenv from "dotenv";

import { setupOAuthServer } from "./OAuthServer/index.js";
import { setupAutohookServer } from "./TWHookServer/index.js";

process.on("uncaughtException", async () => process.exit(1));
process.on("SIGTERM", () => process.exit(0));

dotenv.config();
console.clear();

const OAuthServer = await setupOAuthServer();
const TWAutohookServer = await setupAutohookServer();
