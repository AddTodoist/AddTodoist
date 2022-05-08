import { sendDirectMessage } from "../TWAPI.js";
import Client from "todoist-rest-client";
import TEXTS, { generateInitText } from "./Texts.js";

type TWDirectMessage = {
  target: Object;
  sender_id: string;
  message_data: {
    text: string;
    entities: Object;
  };
};

const VALID_COMMANDS = [
  //"/help",
  "/DB",
  "/init",
  "/project",
  //"/getconfig",
  //"/deleteall",
];

export const directMessageRecieved = (event) => {
  return (
    event.direct_message_events &&
    event.for_user_id === "1522266105271701505" &&
    event.direct_message_events[0].type === "message_create"
  );
};

export const handleDirectMessage = async (message: TWDirectMessage) => {
  const userId = message.sender_id;
  const { text, entities } = message.message_data;
  const command = text.split(" ")[0];
  if (!VALID_COMMANDS.includes(command)) return;

  switch (command) {
    case "/init":
      return await sendDirectMessage(userId, generateInitText(userId));
    case "/project":
      return handleProject(message);
    case "/DB":
      return console.log(DB);
  }
};

const handleProject = async (message: TWDirectMessage) => {
  const userId = message.sender_id;
  const { text, entities } = message.message_data;
  const projectNum = text.split(" ")[1];
  const surenum = +projectNum;
  if (isNaN(surenum))
    return await sendDirectMessage(userId, TEXTS.INVALID_PROJECT_NUM);

  const token = DB.find((user) => user.id === userId)?.token;

  if (!token) {
    return await sendDirectMessage(userId, TEXTS.NO_TOKEN);
  }

  const projectId = DB.find((user) => user.id === userId)?.projectId;

  const todoistClient = Client(token);
  const projects = await todoistClient.project.getAll();

  const currentProject = projects.find(
    (project) => project.id === projectId
  )?.name;
  if (surenum >= projects.length) {
    return await sendDirectMessage(
      userId,
      TEXTS.INVALID_PROJECT_NUM + `Current project is:\n${currentProject}`
    );
  }

  const project = projects[surenum];

  const dbUserIndex = DB.findIndex((user) => user.id === userId);
  DB[dbUserIndex]["projectId"] = project.id;

  return await sendDirectMessage(
    userId,
    TEXTS.TWEETS_SAVED_TO + `${project.name} 🔴`
  );
};

export const getMessage = (event): TWDirectMessage =>
  event.direct_message_events[0].message_create;

export const DB = [{ id: "1", token: "test", projectId: 1234 }];
