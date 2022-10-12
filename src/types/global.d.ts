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

  /**
   * Commands are the valid messages that the bot can receive by DM (without a tweet)
   */
  type COMMANDS = '/init' | '/help' | '/project' | '/config' | '/delete' | '/deleteall' | '/settings';
  
  /**
   * Options are special messages that can be sent with the Tweet by DM that causes the bot to do something special.
   */
  type OPTIONS = '#main' | '#thread'

  type VALID_MESSAGES = COMMANDS | OPTIONS | 'DEFAULT';

  interface IUserInfo {
    /**
     * Unique user id
     */
    _id: string;
    /**
     * @deprecated
     * Encrypted JWT that contains { apiToken: string, projectId: string }
     */
    userInfo: string;
    /**
     * Todoist **encrypted** token
     */
    todoistToken: string;
    /**
     * The todoist projectId to add tasks to
     */
    todoistProjectId: string;
    /**
     * An object that contains the user's settings
     */
    todoistSettings?: Record<string, string> | null
  }

}

export { };
