enum TWHookServerTexts {
  INVALID_PROJECT_NUM = "🔴 Invalid project number 🔴\n",
  INIT_TEXT = "Init",
  NO_TOKEN = "🔴 No token configured 🔴\nPlease run\n/init\ncommand",
  TWEETS_SAVED_TO = `🔴 Now the tweets will be saved to:\n`,
}

export const generateInitText = (userId: string) => `
🔴 Hi there! 🔴\n\
I'm SaveToTodoist bot and I'm here to help you save tweets and threads to your Todoist account.\n\
\nFirst of all, you must cofigure me for making me able to access your account.\n\n\
👉Follow this steps👈\n\
1. Go to https://todoist.com/oauth/authorize?client_id=${process.env.TODOIST_CLIENT_ID}&scope=data:read_write&state=${userId} and get your todoist account token\n\
2. Grant app permissions:\n\
3. When you are done I will come back to set up your projects cofiguration.`;

export default TWHookServerTexts;
