# AddTodoist Error Codes

Here you will find the meaning of the error codes that the bot returns and the possible solutions.

- `USER_NOT_FOUND`: User not found - No user was found for your Twitter account.
  - You haven't initiated the bot yet. ➡️ Send `/init` to the bot.

- `CONFIG_TDS_ERROR`: Todoist API error - There was an error with the Todoist API.
  - Maybe your token is wrong. This can happen if you have revoked the token or if you have changed your Todoist password. ➡️ Send `/init` to the bot.
  - Maybe the Todoist API is down. ➡️ Wait a few minutes and try again.
  - This can also mean that the bot has been temporarily blocked by Twitter. ➡️ Wait a few minutes and try again.

- `DELETE_ERROR`: Can not delete your account.
  - Maybe you have revoked the token or if you have changed your Todoist password. ➡️ Send `/init` to the bot, configure your Todoist account again and then send `/delete` to the bot.

- `TDS_ERROR`: Todoist API error - There was an error with the Todoist API.
  - Maybe your token is wrong. This can happen if you have revoked the token or if you have changed your Todoist password. ➡️ Send `/init` to the bot.
  - Maybe the Todoist API is down. ➡️ Wait a few minutes and try again.

If nothing of this helps, please [open an issue](https://github.com/AddTodoist/AddTodoist/issues/new)
