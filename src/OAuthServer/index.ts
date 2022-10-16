import { createServer, RequestListener } from 'http';
import { parse, URL } from 'url';
import { Project } from '@doist/todoist-api-typescript';
import axios from 'axios';
import { sendDirectMessage } from 'TWAPI';
import TEXTS from './Texts.js';
import UserInfo from 'DB';
import { encryptString, hashId } from 'DB/encrypts.js';
import Bugsnag from 'bugsnag';
import { getTodoistProjects } from 'utils/todoist.js';

export async function setupOAuthServer() {
  const server = createServer(requestListener);

  await new Promise<void>((resolve, reject) => {
    server.listen(3000)
      .once('listening', resolve)
      .once('error', reject);
  });

  console.log('OAuthServer listening on port 3000');

  return server;
}

const requestListener: RequestListener = async (req, res) => {
  const { pathname: path, query } = parse(req.url as string, true);
  
  if (path === '/status') {
    return res.writeHead(200).end();
  }

  if (path === '/usercount') {
    const count = await UserInfo.countDocuments();
    const HALF_AN_HOUR_IN_SECONDS = 60 * 30;
    // https://shields.io/endpoint
    const shieldResponse = {
      schemaVersion: 1,
      label: 'Total Users',
      message: String(count),
      cacheSeconds: HALF_AN_HOUR_IN_SECONDS
    };
    return res.writeHead(200).end(JSON.stringify(shieldResponse));
  }

  // only accept reqests to oauth endpoint
  if (path !== '/redirect/oauth') {
    return res.writeHead(301, { Location: 'https://dubis.dev' }).end();
  }
  
  const { code, state, error } = query;

  if (error === 'access_denied') return res.writeHead(301, { Location: 'https://twitter.com/messages' }).end();
  if (error) Bugsnag.notify(new Error(error as string, { cause: new Error('Something went wrong getting the token') }));
  if (!code || !state) return res.end('Invalid request');

  const twId = state as string;

  res.writeHead(301, { Location: 'https://twitter.com/messages' }).end();

  const token = await getUserToken(code as string);

  if (!token) return sendDirectMessage(twId, `${TEXTS.GENERAL_WRONG}: err 9`);

  const user = new UserInfo({
    _id: hashId(twId),
    todoistToken: encryptString(token),
    todoistProjectId: '0',
  });

  try {
    await user.save();
  } catch (err) {
    if (err.code === 11000) {
      user.isNew = false;
      await user.save();
    } else {
      Bugsnag.notify(err);
      return sendDirectMessage(twId, `${TEXTS.GENERAL_WRONG}: err 10`);
    }
  }

  await sendDirectMessage(twId, TEXTS.ACCOUNT_LINKED);

  let projects: Project[];

  try {
    projects = await getTodoistProjects(token);
  } catch (err) {
    Bugsnag.notify(err);
    return sendDirectMessage(twId, `${TEXTS.GENERAL_WRONG}: err 11`);
  }

  user.todoistProjectId = projects[0].id;

  try {
    await user.save();
  } catch (err) {
    Bugsnag.notify(err);
    return sendDirectMessage(twId, `${TEXTS.GENERAL_WRONG}: err 12`);
  }

  const projectsString = projects
    .map((project, index) => `${index} - ${project.name}`)
    .join('\n');

  sendDirectMessage(
    twId,
    TEXTS.PROJECT_CONFIG_HEADER + projectsString + TEXTS.PROJECT_CONFIG_FOOTER,
  );
};

export const getUserToken = async (authCode: string) => {
  const clientId = process.env.TODOIST_CLIENT_ID as string;
  const clientSecret = process.env.TODOIST_CLIENT_SECRET as string;

  const url = new URL('https://todoist.com/oauth/access_token');
  url.searchParams.append('client_id', clientId);
  url.searchParams.append('client_secret', clientSecret);
  url.searchParams.append('code', authCode);

  try {
    const { data } = await axios.post(url.href);
    return data.access_token || null;
  } catch (err) {
    Bugsnag.notify(err);
    console.log('Something went wrong in getUserToken');
    return null;
  }
};
