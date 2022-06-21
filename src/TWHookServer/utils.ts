import Client from 'todoist-rest-client';
import { TWDirectMessage, URLEntity } from './DirectMessages';

export const getProjectNumFromMessage = ( message: string ): [boolean, number] => {
  const projectNum = message.split(' ')[1];
  // regex for digit: /^\d+$/
  const isValidProjectNum = projectNum?.match(/^\d+$/);

  if (!isValidProjectNum) return [false, NaN];
  return [true, +isValidProjectNum[0]];
};

export const getMessageWithoutURL = ( message: TWDirectMessage, URLEntity: URLEntity): string => {
  const textWithoutURL = message.message_data.text.slice(0, URLEntity.indices[0]).trim();
  const taskText = `[${textWithoutURL}](${URLEntity.expanded_url})`;
  return taskText;

};

export const quickAddTodoistTask = (text: string, token: string) => {
  return fetch('https://api.todoist.com/sync/v8/quick/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
};

export const addTodoistTask = ({content, token, projectId}: {content: string, token: string, projectId?: number}) => {
  const tdsClient = Client(token);
  return tdsClient.task.create({
    content,
    project_id: projectId,
  });
};

export const getTodoistProjects = (token: string) => {
  const tdsClient = Client(token);
  return tdsClient.project.getAll();
};