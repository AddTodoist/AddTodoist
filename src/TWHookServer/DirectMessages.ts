import Client from 'todoist-rest-client';
import { APIProjectObject } from 'todoist-rest-client/dist/definitions';
import { sendDirectMessage } from '../TWAPI.js';
import TEXTS, { generateInitText } from './Texts.js';
import { getProjectNumFromMessage } from './utils.js';
import UserInfo from '../DB/index.js';
import { decodeUser, encodeUser, hashId } from '../DB/encrypts.js';

type TWDirectMessage = {
  target: Record<string, unknown>; // object
  sender_id: string;
  message_data: {
    text: string;
    entities: Record<string, unknown>; // object
  };
};

const VALID_COMMANDS = [
  // "/help",
  '/init',
  '/project',
  // "/getconfig",
  // "/deleteall",
];

export const directMessageRecieved = (event) => (
  event.direct_message_events
  && event.for_user_id === '1522266105271701505'
  && event.direct_message_events[0].type === 'message_create'
);

export const handleDirectMessage = async (message: TWDirectMessage) => {
  const userId = message.sender_id;
  const { text, entities } = message.message_data;
  const command = text.split(' ')[0];
  if (!VALID_COMMANDS.includes(command)) return;

  switch (command) {
    case '/init':
      return await sendDirectMessage(userId, generateInitText(userId));
    case '/project':
      return handleProject(message);
  }
};

const handleProject = async (message: TWDirectMessage) => {
  const userId = message.sender_id;
  const { text, entities } = message.message_data;
  const [isValidProjectNum, projectNum] = getProjectNumFromMessage(text);

  if (!isValidProjectNum) {
    return await sendDirectMessage(userId, TEXTS.INVALID_PROJECT_NUM);
  }

  const user = await UserInfo.findOne({ twId: hashId(userId) });
  if (!user) return await sendDirectMessage(userId, TEXTS.NO_TOKEN);

  const { apiToken, projectId } = decodeUser(user.userInfo);

  let projects: APIProjectObject[];
  try {
    const todoistClient = Client(apiToken);
    projects = await todoistClient.project.getAll();
  } catch (e) {
    return await sendDirectMessage(userId, TEXTS.NO_TOKEN);
  }

  const currentProject = projects.find(
    (project) => project.id === projectId,
  )?.name;

  if (projectNum >= projects.length) {
    return await sendDirectMessage(
      userId,
      `${TEXTS.INVALID_PROJECT_NUM}Current project is:\n${currentProject}`,
    );
  }

  const project = projects[projectNum];

  user.userInfo = encodeUser({
    apiToken,
    projectId: project.id,
  });

  await user.save();

  return await sendDirectMessage(
    userId,
    `${TEXTS.TWEETS_SAVED_TO}${project.name}`,
  );
};

export const getMessage = (event): TWDirectMessage => event.direct_message_events[0].message_create;
