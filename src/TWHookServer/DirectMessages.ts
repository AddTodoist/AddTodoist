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
  && event.for_user_id === process.env.TW_ACC_ID
  && event.direct_message_events[0].type === 'message_create'
  && getMessage(event).sender_id !== process.env.TW_ACC_ID // not me sending the message
);

export const handleDirectMessage = async (message: TWDirectMessage) => {
  const userId = message.sender_id;
  const { text } = message.message_data;
  const command = text.split(' ')[0].toLowerCase();
  if (!VALID_COMMANDS.includes(command)) return handleDefaultDM(message);

  switch (command) {
    case '/init':
      return sendDirectMessage(userId, generateInitText(userId));
    case '/project':
      return handleProject(message);
  }
};

const handleProject = async (message: TWDirectMessage) => {
  const userId = message.sender_id;
  const { text } = message.message_data;
  const [isValidProjectNum, projectNum] = getProjectNumFromMessage(text);

  if (!isValidProjectNum) {
    return sendDirectMessage(userId, TEXTS.INVALID_PROJECT_NUM);
  }

  const user = await UserInfo.findOne({ twId: hashId(userId) });
  if (!user) return sendDirectMessage(userId, TEXTS.NO_TOKEN);

  const { apiToken, projectId } = decodeUser(user.userInfo);

  let projects: APIProjectObject[];
  try {
    const todoistClient = Client(apiToken);
    projects = await todoistClient.project.getAll();
  } catch (e) {
    return sendDirectMessage(userId, TEXTS.NO_TOKEN);
  }

  const currentProject = projects.find(
    (project) => project.id === projectId,
  )?.name;

  if (projectNum >= projects.length) {
    return sendDirectMessage(
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

  sendDirectMessage( userId, `${TEXTS.TWEETS_SAVED_TO}${project.name}`);
};

/**
 * Check if recieved a tweet message
 * If true, adds to account
 * If false, does nothing
 */
const handleDefaultDM = async (message: TWDirectMessage) => {
  const urls = message.message_data.entities.urls as URLEntity[];
  const tweetURLEntity = urls.find(url => url.display_url.startsWith('twitter.com/')); // is or not a tweet DM
  if (!tweetURLEntity) return;

  const userId = message.sender_id;

  const user = await UserInfo.findOne({ twId: hashId(userId) });
  if (!user) return sendDirectMessage(userId, TEXTS.NO_TOKEN);

  const { apiToken, projectId } = decodeUser(user.userInfo);


  const todoistClient = Client(apiToken);
  await todoistClient.task.create({
    content: tweetURLEntity.expanded_url,
    project_id: projectId,
  });

  sendDirectMessage(userId, TEXTS.ADDED_TO_ACCOUNT);
};

export const getMessage = (event): TWDirectMessage => event.direct_message_events[0].message_create;

type URLEntity = {
  url: string,
  expanded_url: string,
  display_url: string,
  indices: [number, number]
}