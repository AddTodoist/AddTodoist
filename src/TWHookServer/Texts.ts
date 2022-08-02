enum TWHookServerTexts {
  INVALID_PROJECT_NUM = '🔴 Invalid project number\n',
  INIT_TEXT = 'Init',
  BAD_TOKEN = '🔴 Something is wrong with your account configuration.\nPlease run\n/init\ncommand',
  TWEETS_SAVED_TO = '🔴 Now the tweets will be saved to:\n',
  ADDED_TO_ACCOUNT = '🔴 Added to your account',
  CANT_DELETE = '🔴 Can\'t delete your account. Try again. If the problem persists, contact @dubisdev_',
  DELETED_ACCOUNT = '🔴 All your account data has been deleted',
  ALERT_DELETE = '🔴 Are you sure you want to delete your account? This action CAN NOT be undone. \nType\n/deleteall\nto continue'
}

export const generateInitText = (userId: string) => `
🔴 Hi there!\n\
I'm AddToDoist bot and I'm here to help you save tweets and threads to your Todoist account.\n\
\nFirst of all, you must cofigure me for making me able to access your account.\n\n\
Follow this steps:\n\
1. Go to https://todoist.com/oauth/authorize?client_id=${process.env.TODOIST_CLIENT_ID}&scope=data:read_write&state=${userId}\n\
2. Grant app permissions.\n\
3. When you are done I will come back to set up your projects cofiguration.`;

export const generateConfigText = ({username, email, projectName, projectId}) => `
🔴 This is your current configuration:\n\
- Username: ${username}\n\
- Email: ${email}\n\
- Project: ${projectName} (id: ${projectId})`;

export default TWHookServerTexts;
