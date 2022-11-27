# @AddTodoist Twitter Bot ![User Count](https://img.shields.io/endpoint?color=green&style=flat-square&url=https%3A%2F%2Faddtodoist-oauth.dubis.dev%2Fusercount) ![Auth Server Status](https://img.shields.io/website?down_color=red&down_message=offline&label=Auth%20Server&up_color=green&up_message=online&url=https%3A%2F%2Faddtodoist-oauth.dubis.dev%2Fstatus&style=flat-square) ![DM Server Status](https://img.shields.io/website?down_color=red&down_message=offline&label=DM%20Server&up_color=green&up_message=online&url=https%3A%2F%2Faddtodoist-webhooks.dubis.dev%2Fstatus&style=flat-square)

🤖 ***A Twitter bot that will help you save tweets and threads to your Todoist account***

> **⚠️ Not linked to @Doist or @Todoist**

## About the project

🚀 This bot is deployed in [Qoddi](https://qoddi.com/) and uses a MongoDB database stored in [MongoDB Atlas](https://www.mongodb.com/es/atlas/database)

🔏 All the user's data is encrypted before being saved to the DB using hashing algorithms and is never shared with third parts.

<p align="center">
<img src="https://user-images.githubusercontent.com/77246331/186970413-006dcf54-66fc-4e77-aa05-3773707dbacb.png" width="400">
<img src="https://user-images.githubusercontent.com/77246331/186971152-9a312391-a751-4d72-b306-0e54d32c0bcb.png" width="400">

## Usage Instructions

1. Sign up to your Twitter account
2. Search for [@AddTodoist Twitter account](https://twitter.com/AddToDoist)
3. (Optional) Follow the account to get notified about the bot updates (is free and helps a lot 🚀)
4. [Set up](#set-up-your-account) your account (Just the first time)
5. Start saving tweets by sending them to the bot by DM

> If you are receiving an error message, please check the [errors documentation](errors.md)

### Set Up Your Account

Before using the bot you must provide access to your Todoist account so the tweets can be saved to it. You can do this by sending `/init` by DM to the bot. Then it will answer you with instructions to complete this process.

<img src="https://user-images.githubusercontent.com/77246331/186975670-5f9bc272-2d01-4d75-997f-0a61ba1da96a.png" width="480">

You must grant permissions. Then you are done 🚀

<img src="https://user-images.githubusercontent.com/77246331/186975825-3f27146a-73f1-42b3-ae0d-aeca52506b1e.png">

## Available commands

The bot features can be accessed by sending one of these commands (⚠️ Don't forget the slash `/`):

<img src="https://user-images.githubusercontent.com/77246331/186976402-3f119743-c63f-4507-8f78-e7e0362d95eb.png" width="700">

## Settings

You can customize the bot's behavior by using the `/settings` command. Currently, you can change the following settings:

- **`response`**: The bot will respond to your DMs with a message confirming the tweet has been saved to your Todoist account. You can disable this feature by sending `/settings response false` by DM to the bot.

- **`tweet-label`** and **`thread-label`**: The bot will add a label to the saved tweets. You can change this labels by sending `/settings thread-label label` and `/settings tweet-label label` by DM to the bot. By default, this labels are "🐦Tweet" and "🧵Thread". You can also disable this feature by sending `/settings thread-label null` and `/settings tweet-label null` by DM to the bot.

- **`reset`**: If you want to reset all your settings, you can do it by sending `/settings reset` by DM to the bot. This will reset all your settings to their default values.

## Privacy

- The only collected information from users is their token, which is encrypted and stored in a secure database.
- No more data is collected
- Users can choose to delete their data by using `/delete` command

## Contributing

The bot has associated hosting costs so any help to cover them is welcome. You can do it through a small donation at [BuyMeACoffee](https://www.buymeacoffee.com/dubisdev). Also any feedback, [issue](https://github.com/AddToDoist/AddToDoist/issues) or PR is welcome 💗. Don't forget to ⭐star the repository.

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/dubisdev)

## License

See the [LICENSE](./LICENSE.md) file for license rights and limitations.
