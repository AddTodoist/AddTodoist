import type { Project } from '@doist/todoist-api-typescript';
import TEXTS, { generateConfigText, generateInitText, generateInvalidDMText } from './Texts.js';
import { getTodoistProjects, getTodoistUserData, revokeAccessToken, addTodoistTask } from 'utils/todoist.js';
import { getProjectNumFromMessage, getDefaultTaskContent, getUserCustomTaskContent } from 'utils/texts.js';
import { decodeUser, encodeUser } from 'DB/encrypts.js';
import Bugsnag from 'bugsnag';
import { findUser } from 'utils/db.js';
import { getOriginalTweet, sendDirectMessage } from 'TWAPI';

const handleConfig: DMHandler = async (message) => {
  const userId = message.sender_id;
  
  const user = await findUser(userId);
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
  
const handleDelete: DMHandler = async (message) => {
  const userId = message.sender_id;
  
  const user = await findUser(userId);
  if (!user) return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: USER_NOT_FOUND');
  
  sendDirectMessage(userId, TEXTS.ALERT_DELETE);
};
  
const handleDeleteAll: DMHandler = async (message) => {
  const userId = message.sender_id;
  
  const user = await findUser(userId);
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
  
const handleProject: DMHandler = async (message) => {
  const userId = message.sender_id;
  const { text } = message.message_data;
  const projectNum = getProjectNumFromMessage(text);
  
  if (projectNum === null) return sendDirectMessage(userId, TEXTS.INVALID_PROJECT_NUM);
  
  const user = await findUser(userId);
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
const handleDefaultDM: DMHandler = async (message) => {
  const urls = message.message_data.entities.urls as URLEntity[];
  const tweetURLEntity = urls.find(url => url.display_url.startsWith('twitter.com/')); // is or not a tweet DM
  if (!tweetURLEntity) return handleInvalidDM(message);
  
  const userId = message.sender_id;
  
  const user = await findUser(userId);
  if (!user) return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: USER_NOT_FOUND');
  
  const { apiToken, projectId } = decodeUser(user.userInfo);
  
  // get task content (just a tweet or custom text)
  const taskContent = tweetURLEntity.indices[0] === 0
    ? await getDefaultTaskContent(tweetURLEntity.expanded_url)
    : getUserCustomTaskContent(message, tweetURLEntity);
  
  try {
    await addTodoistTask({
      labels: ['🐦Tweet'],
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
  
const handleInvalidDM: DMHandler = async (message) => {
  const userId = message.sender_id;
  sendDirectMessage(userId, generateInvalidDMText(message.sender_name));
};

const handleInit: DMHandler = async (message) => {
  const userId = message.sender_id;
  sendDirectMessage(userId, generateInitText(userId));
};

const handleHelp: DMHandler = async (message) => {
  const userId = message.sender_id;
  sendDirectMessage(userId, TEXTS.HELP);
};

const handleMain = async (message: TWDirectMessage) => {
  const urls = message.message_data.entities.urls as URLEntity[];
  const tweetURLEntity = urls.find(url => url.display_url.startsWith('twitter.com/')); // is or not a tweet DM
  if (!tweetURLEntity) return handleInvalidDM(message);

  const userId = message.sender_id;

  const user = await findUser(userId);
  if (!user) return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: USER_NOT_FOUND');
  
  const { apiToken, projectId } = decodeUser(user.userInfo);
  
  // get the head tweet of a thread
  const mainTweetURL = tweetURLEntity.expanded_url;
  const mainTweetId = mainTweetURL.split('/').pop() as string;
  const originalTweet = await getOriginalTweet(mainTweetId);
  if (!originalTweet) return; // TODO - handle this

  const content = await getDefaultTaskContent(originalTweet.url); // TODO - improve this as we already have the content and is not necessary to get it again

  try {
    await addTodoistTask({
      token: apiToken,
      labels: ['🧵Thread'],
      content,
      projectId
    });
  } catch (e) {
    Bugsnag.notify(e);
    return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: TDS_ERROR');
  }
  
  sendDirectMessage(userId, TEXTS.ADDED_TO_ACCOUNT);
};

export {
  handleInit,
  handleHelp,
  handleConfig,
  handleDelete,
  handleDeleteAll,
  handleProject,
  handleDefaultDM,
  handleMain
};
