import fkill from "fkill";
import { createServer, RequestListener } from "http";
import URL from "url";
import { sendDirectMessage } from "../TWAPI.js";
import Client from "todoist-rest-client";
import axios from "axios";
import TEXTS from "./Texts.js";
import UserInfo from "../DB/index.js";
import { APIProjectObject } from "todoist-rest-client/dist/definitions";
import { encodeUser, hashId } from "../DB/encrypts.js";

export async function setupOAuthServer() {
  const PORT = process.env.PORT || 3000;
  try {
    await fkill(`:${PORT}`);
  } catch (err) {
    console.log(`Port ${PORT} is not in use`);
  }

  const server = createServer(requestListener);

  await new Promise<void>((resolve, reject) => {
    server
      .listen(3000)
      .once("listening", () => {
        console.log(`OAuthServer listening on port ${PORT}`);
        resolve();
      })
      .once("error", reject);
  });

  return server;
}

const requestListener: RequestListener = async (req, res) => {
  const { pathname: path, query } = URL.parse(req.url as string, true);
  // only accept reuests to this
  if (path !== "/redirect/oauth") {
    return res.writeHead(301, { Location: "https://dubis.dev" }).end();
  }

  const { code, state } = query;
  if (!code || !state) return res.end("Invalid request");

  const twId = state as string;

  res.writeHead(301, { Location: "https://twitter.com/messages" });
  res.end();

  const token = await getUserToken(code as string);

  if (!token) {
    return await sendDirectMessage(twId, TEXTS.GENERAL_WRONG + ": err 9");
  }

  let userInfo = encodeUser({
    apiToken: token,
    projectId: 0,
  });

  const user = new UserInfo({
    _id: hashId(twId),
    userInfo: userInfo,
  });

  try {
    await user.save();
  } catch (err) {
    if (err.code === 11000) {
      user.isNew = false;
      await user.save();
    } else {
      console.log(new Date(), err);
      return await sendDirectMessage(twId, TEXTS.GENERAL_WRONG + ": err 10");
    }
  }

  await sendDirectMessage(twId, TEXTS.ACCOUNT_LINKED);

  let projects: APIProjectObject[];

  try {
    const todoistClient = Client(token);
    projects = await todoistClient.project.getAll();
  } catch {
    return await sendDirectMessage(twId, TEXTS.GENERAL_WRONG + ": err 11");
  }

  userInfo = encodeUser({
    apiToken: token,
    projectId: projects[0].id,
  });

  user.userInfo = userInfo;

  try {
    await user.save();
  } catch {
    return await sendDirectMessage(twId, TEXTS.GENERAL_WRONG + ": err 12");
  }

  const projectsString = projects
    .map((project, index) => `${index} - ${project.name}`)
    .join("\n");

  await sendDirectMessage(
    twId,
    TEXTS.PROJECT_CONFIG_HEADER + projectsString + TEXTS.PROJECT_CONFIG_FOOTER
  );
};

export const getUserToken = async (authCode: string) => {
  const clientId = process.env.TODOIST_CLIENT_ID as string;
  const clientSecret = process.env.TODOIST_CLIENT_SECRET as string;

  const url = new URL.URL("https://todoist.com/oauth/access_token");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("client_secret", clientSecret);
  url.searchParams.append("code", authCode);

  try {
    const { data } = await axios.post(url.href);
    return data.access_token || null;
  } catch {
    console.log("Something went wrong in getUserToken");
    return null;
  }
};
