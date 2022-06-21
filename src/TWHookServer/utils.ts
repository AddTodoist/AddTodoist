import Client from 'todoist-rest-client';

export const getProjectNumFromMessage = ( message: string ): [boolean, number] => {
  const projectNum = message.split(' ')[1];
  // regex for digit: /^\d+$/
  const isValidProjectNum = projectNum?.match(/^\d+$/);

  if (!isValidProjectNum) return [false, NaN];
  return [true, +isValidProjectNum[0]];
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