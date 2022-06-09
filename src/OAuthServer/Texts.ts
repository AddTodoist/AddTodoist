enum OAuthServerTexts {
  GENERAL_WRONG = '🔴 Something went wrong 🔴',
  ACCOUNT_LINKED = '🎉 Your account has been linked! 🎉',

  PROJECT_CONFIG_HEADER = `
🔴 Welcome again! 🔴\n\
Now that I can access your account, let's select:\n\
In which project sould I save the tweets?:\n`,

  PROJECT_CONFIG_FOOTER = `\n
To select a project send me\n\
/project <number>\n\
For example:\n\
/project 0\n\
By default your inbox is selected`,
}

export default OAuthServerTexts;
