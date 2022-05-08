import fkill from "fkill";
import { createServer, RequestListener } from "http";
import URL from "url";
import { sendDirectMessage } from "../TWAPI.js";
import Client from "todoist-rest-client";
import axios from "axios";
import { DB } from "../TWHookServer/DirectMessages.js";
import TEXTS from "./Texts.js";

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

  if (path === "/redirect/oauth") {
    const { code, state } = query;
    const twId = state as string;

    res.writeHead(301, { Location: "https://twitter.com/messages" });
    res.end();

    const token = await getUserToken(code as string);

    if (!token) {
      return await sendDirectMessage(twId, TEXTS.GENERAL_WRONG + ": err 10");
    } else {
      DB.push({ id: twId, token, projectId: 0 });
      // console.log(DB);
      // TODO
      // crear usuario en BBDD: {userId: twitterUserId, accessToken: data.access_token, projectId: noséxd}
      await sendDirectMessage(twId, TEXTS.ACCOUNT_LINKED);
    }

    let projects;
    try {
      const todoistClient = Client(token);
      projects = await todoistClient.project.getAll();

      //save inbox id to db
      const userIndex = DB.findIndex((user) => user.id === twId);
      if (userIndex !== -1) DB[userIndex]["projectId"] = projects[0].id;
    } catch {
      return await sendDirectMessage(twId, TEXTS.GENERAL_WRONG + ": err 12");
    }

    const projectsString = projects
      .map((project, index) => `${index} - ${project.name}`)
      .join("\n");

    return await sendDirectMessage(
      twId,
      TEXTS.PROJECT_CONFIG_HEADER + projectsString + TEXTS.PROJECT_CONFIG_FOOTER
    );
  } else return res.writeHead(301, { Location: "https://dubis.dev" }).end();
};

export const getUserToken = async (authCode: string) => {
  const clientId = process.env.TODOIST_CLIENT_ID as string;
  const clientSecret = process.env.TODOIST_CLIENT_SECRET as string;

  const url = new URL.URL("https://todoist.com/oauth/access_token");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("client_secret", clientSecret);
  url.searchParams.append("code", authCode);

  const { data } = await axios.post(url.href);

  console.log(data);

  return data.access_token || null;
};
