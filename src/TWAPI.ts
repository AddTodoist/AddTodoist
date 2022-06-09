import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const userClient = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY || '',
  appSecret: process.env.TWITTER_CONSUMER_SECRET|| '' ,
  accessToken: process.env.TWITTER_ACCESS_TOKEN|| '',
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET|| '',
});

export const tweet = async (status: string) => {
  try {
    return await userClient.v1.tweet(status);
  } catch (e) {
    console.log('Couldn Tweet :(');
    console.log(e);
  }
};

export const responseTweet = async (tweet) => {
  const { id_str } = tweet;
  try {
    await userClient.v1.reply('response', id_str);
  } catch (e) {
    console.log('Couldn Response :(');
    console.log(e);
  }
};

export const sendDirectMessage = async (userId: string, message: string) => {
  try {
    await userClient.v1.sendDm({
      recipient_id: userId,
      text: message,
    });
  } catch (e) {
    console.log('Couldn Send Direct Message :(');
    console.log(e);
  }
};

export const getOriginalTweet = async (tweetId: string) => {
  try {
    const mentionedInTweet = await userClient.v2.singleTweet(tweetId, {
      'tweet.fields': 'conversation_id',
    });

    const originalTweet = await userClient.v2.singleTweet(mentionedInTweet.data.conversation_id || '', {
      'tweet.fields': ['author_id'],
    });

    const url = `https://twitter.com/${originalTweet.data.author_id}/status/${originalTweet.data.id}`;

    return { url, text: originalTweet.data.text };
  } catch (e) {
    console.log('Couldn Get Original Tweet :(. Err: ', e);
    console.log(e);
  }
};
