import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config();

const userClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.OAUTH_TOKEN,
  accessSecret: process.env.OAUTH_TOKEN_SECRET,
}).readWrite;

export const TwitRandom = async () => {
  try {
    await userClient.v1.tweet(status);
  } catch (e) {
    console.log("Couldn Tweet :(");
    console.log(e);
  }
};

export const ResponseTwit = async (tweet) => {
  const { id_str } = tweet;
  try {
    await userClient.v1.reply(status, id_str);
  } catch (e) {
    console.log("Couldn Response :(");
    console.log(e);
  }
};
