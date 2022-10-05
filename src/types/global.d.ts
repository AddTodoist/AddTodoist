import { Task } from '@doist/todoist-api-typescript';

declare global {
  type URLEntity = {
    url: string,
    expanded_url: string,
    display_url: string,
    indices: [number, number]
  }
  type TWDirectMessage = {
    target: Record<string, unknown>;
    sender_id: string;
    sender_name: string;
    message_data: {
      text: string;
      entities: {
        hashtags: { text: string, indices: any[] }[];
        symbols: any[];
        user_mentions: any[];
        urls: URLEntity[];
      };
    };
  };

  type CustomTask = {content: string, token: string, projectId?: string, labels?: string[], parentId?: string, order?: number }

  type TodoistTaskAdder = (task: CustomTask) => Promise<Task>;

  type DMHandler = (message: TWDirectMessage) => Promise<void>
  type COMMANDS = '/init' | '/help' | '/project' | '/config' | '/delete' | '/deleteall' | '/settings';
  type OPTIONS = '#main' | '#thread'
  type VALID_MESSAGES = COMMANDS | OPTIONS | 'DEFAULT';
}

export { };
