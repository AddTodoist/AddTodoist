process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});
process.on("SIGTERM", () => {
  process.exit(0);
});

import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import URL from "url";
import axios from "axios";
import { sendDirectMessage } from "./TWAPI.js";
import Client from "todoist-rest-client";
console.clear();

import { createAutohook, configureListeners } from "./AutohookUtils.js";

const webhook = await createAutohook();
configureListeners(webhook);

const server = createServer(async (req, res) => {
  const { pathname: path, query } = URL.parse(req.url as string, true);

  if (path === "/redirect/oauth") {
    const { code, state } = query;

    const url = new URL.URL("https://todoist.com/oauth/access_token");
    // @ts-ignore
    url.searchParams.append("client_id", process.env.TODOIST_CLIENT_ID);
    // @ts-ignore
    url.searchParams.append("client_secret", process.env.TODOIST_CLIENT_SECRET);
    // @ts-ignore
    url.searchParams.append("code", code);
    res.writeHead(301, { Location: "https://twitter.com/messages" });
    res.end();

    const { data } = await axios.post(url.href);
    // TODO
    // crear usuario en BBDD: {userId: state, accessToken: data.access_token, projectId: noséxd}

    await sendDirectMessage(state as string, "Your account has been linked!");

    let projects;
    try {
      const todoistClient = Client(data.access_token);
      projects = await todoistClient.project.getAll();
    } catch {
      return await sendDirectMessage(state as string, "Something went wrong");
    }

    const projectsString = projects
      .map((project, index) => `${index} - ${project.name}`)
      .join("\n");

    return await sendDirectMessage(
      state as string,
      projectConfigHeader + projectsString + projectConfigFooter
    );
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const projectConfigHeader = `
🔴 Its you again! 🔴\n\
Now that I can access your account, let's select:\n\
In which project sould I save the tweets?:\n`;

const projectConfigFooter = `
\nTo select a project send me\n\
/project <number>\n\
For example:\n\
/project 0\n\
By default your inbox is selected`;
