import type { Project } from '@doist/todoist-api-typescript';
import { sendDirectMessage } from 'TWAPI';
import TEXTS, { generateConfigText, generateInitText } from './Texts.js';
import { addTodoistTask, getMessageWithoutURL, getProjectNumFromMessage, getTodoistProjects, getTodoistUserData, revokeAccessToken } from './utils.js';
import UserInfo from 'DB';
import { decodeUser, encodeUser, hashId } from 'DB/encrypts.js';
import Bugsnag from 'bugsnag';

const VALID_COMMANDS = [
  // "/help",
  '/init',
  '/project',
  '/config',
  '/delete',
  '/deleteall',
];

export const directMessageRecieved = (event) => (
  event.direct_message_events
  && event.for_user_id === process.env.TW_ACC_ID
  && event.direct_message_events[0].type === 'message_create'
  && getMessage(event).sender_id !== process.env.TW_ACC_ID
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
    case '/delete':
      return handleDelete(message);
    case '/deleteall':
      return handleDeleteAll(message);
    case '/config':
      return handleConfig(message);
  }
};

const handleConfig = async (message: TWDirectMessage) => {
  const userId = message.sender_id;

  const user = await UserInfo.findOne({ _id: hashId(userId) });
  if (!user) return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: USER_NOT_FOUND');

  const { apiToken, projectId } = decodeUser(user.userInfo);

  try {
    const projects = await getTodoistProjects(apiToken);
    const projectName = projects.find((p) => p.id === projectId)?.name;

    const {email, full_name: username} = await getTodoistUserData(apiToken);

    sendDirectMessage(userId, generateConfigText({email, username, projectName, projectId}));
  } catch (e) {
    Bugsnag.notify(e);
    return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: CONFIG_TDS_ERROR');
  }
};

const handleDelete = async (message: TWDirectMessage) => {
  const userId = message.sender_id;

  const user = await UserInfo.findOne({ _id: hashId(userId) });
  if (!user) return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: USER_NOT_FOUND');

  sendDirectMessage(userId, TEXTS.ALERT_DELETE);
};

const handleDeleteAll = async (message: TWDirectMessage) => {
  const userId = message.sender_id;

  const user = await UserInfo.findOne({ _id: hashId(userId) });
  if (!user) return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: USER_NOT_FOUND');
  const { apiToken } = decodeUser(user.userInfo);

  try {
    await Promise.all([
      revokeAccessToken(apiToken),
      user.delete()
    ]);

  } catch (err) {
    Bugsnag.notify(err);
    return sendDirectMessage(userId, TEXTS.CANT_DELETE + '\n Err: DELETE_ERROR');
  }

  sendDirectMessage(userId, TEXTS.DELETED_ACCOUNT);
};

const handleProject = async (message: TWDirectMessage) => {
  const userId = message.sender_id;
  const { text } = message.message_data;
  const projectNum = getProjectNumFromMessage(text);

  if (projectNum === null) return sendDirectMessage(userId, TEXTS.INVALID_PROJECT_NUM);

  const user = await UserInfo.findOne({ _id: hashId(userId) });
  if (!user) return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: USER_NOT_FOUND');

  const { apiToken, projectId } = decodeUser(user.userInfo);

  let projects: Project[];
  try {
    projects = await getTodoistProjects(apiToken);
  } catch (e) {
    console.log(e);
    Bugsnag.notify(e);
    return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: TDS_ERROR');
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

  const user = await UserInfo.findOne({ _id: hashId(userId) });
  if (!user) return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: USER_NOT_FOUND');

  const { apiToken, projectId } = decodeUser(user.userInfo);

  // get task content (just a tweet or custom text)
  const taskContent = tweetURLEntity.indices[0] === 0
    ? tweetURLEntity.expanded_url
    : getMessageWithoutURL(message, tweetURLEntity);

  try {
    await addTodoistTask({
      token: apiToken,
      content: taskContent,
      projectId
    });
  } catch (e) {
    Bugsnag.notify(e);
    return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: TDS_ERROR');
  }

  sendDirectMessage(userId, TEXTS.ADDED_TO_ACCOUNT);
};

export const getMessage = (event): TWDirectMessage => event.direct_message_events[0].message_create;

export type URLEntity = {
  url: string,
  expanded_url: string,
  display_url: string,
  indices: [number, number]
}

export type TWDirectMessage = {
  target: Record<string, unknown>; // object
  sender_id: string;
  message_data: {
    text: string;
    entities: Record<string, unknown>; // object
  };
};
