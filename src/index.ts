console.clear();

import dotenv from "dotenv";
dotenv.config();

import { createAutohook, configureListeners } from "./AutohookUtils.js";

const webhook = await createAutohook();
//configureListeners(webhook);
