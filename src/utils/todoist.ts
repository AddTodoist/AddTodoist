/**
 * This module includes tools to interact with the Todoist API.
 */

import axios from 'axios';
import { TodoistApi } from '@doist/todoist-api-typescript';

export const getTodoistUserData = async (token: string) => {
  const { data } = await axios.post('https://api.todoist.com/sync/v9/sync',
    { sync_token: '*', resource_types: ['user'] },
    { headers: { Authorization: `Bearer ${token}` } }
  );
    
  const {user} = data;
  return user;
};

export const addTodoistTask: TodoistTaskAdder = (task) => {
  const { content, token, projectId, labels, parentId, order } = task;
  
  const tdsClient = new TodoistApi(token);
  return tdsClient.addTask({
    labels,
    content,
    projectId,
    parentId,
    order
  });
};

export const getTodoistProjects = (token: string) => {
  const tdsClient = new TodoistApi(token);
  return tdsClient.getProjects();
};
  
export const revokeAccessToken = async (token: string) => {
  const revokeUrl = 'https://api.todoist.com/sync/v9/access_tokens/revoke';
  const { status } = await axios.post(revokeUrl, {
    client_id: process.env.TODOIST_CLIENT_ID,
    client_secret: process.env.TODOIST_CLIENT_SECRET,
    access_token: token,
  });
  
  if (status === 204) return true;
  return false;
};
  
