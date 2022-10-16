enum TWHookServerTexts {
  USER_NOT_FOUND = '🔴 User Not Found.\nPlease use\n/init\nto initialize your account',
  INVALID_PROJECT_NUM = '🔴 Invalid project number\n',
  BAD_TOKEN = '🔴 Something is wrong with your account configuration.\nPlease run\n/init\ncommand',
  TWEETS_SAVED_TO = '🔴 Now the tweets will be saved to:\n',
  ADDED_TO_ACCOUNT = '🔴 Added to your account',
  CANT_DELETE = '🔴 Can\'t delete your account. Try again. If the problem persists, contact @dubisdev_',
  DELETED_ACCOUNT = '🔴 All your account data has been deleted',
  ALERT_DELETE = '🔴 Are you sure you want to delete your account? This action CAN NOT be undone. \nType\n/deleteall\nto continue',
  HELP = '🔴 Available Commands:\n\n/init - Set up your account\n/config - Get your account data\n/delete - Delete your account\n/project <number> - Set up your default project\n/help - Shows this message\n\n⚠️ Don\'t forget the slash (/) before the command'
}

export const generateInitText = (userId: string) => `
🔴 Hi there!\n\
I'm AddTodoist bot and I'm here to help you save tweets and threads to your Todoist account.\n\
\nFirst of all, you must cofigure me for making me able to access your account.\n\n\
Follow this steps:\n\
1. Go to https://todoist.com/oauth/authorize?client_id=${process.env.TODOIST_CLIENT_ID}&scope=data:read_write&state=${userId}\n\
2. Grant app permissions.\n\
3. When you are done I will come back to set up your projects cofiguration.`;

export const generateConfigText = ({
  username,
  email,
  projectName,
  projectId,
}) => `
🔴 This is your current configuration:\n\
- Username: ${username}\n\
- Email: ${email}\n\
- Project: ${projectName} (id: ${projectId})`;

export const generateInvalidDMText = (username: string) => `
🔴 Welcome ${username}!\n\n\
It seems like you have sent me an invalid message.\n\n\
Please, send me a valid command or type\n\
'/init'\n\
to start your account configuration.\n\n\
For more information type\n\
'/help'\n\n\
⚠️ Don't forget the slash (/) before the commands`;

export default TWHookServerTexts;
