import { TwitterApi } from 'twitter-api-v2';
import Bugsnag from 'bugsnag';

const userClient = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY || '',
  appSecret: process.env.TWITTER_CONSUMER_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
});

export const tweet = async (status: string) => {
  try {
    return await userClient.v2.tweet(status);
  } catch (e) {
    Bugsnag.notify(e);
    console.log('Couldnt Tweet');
    console.log(e);
  }
};

/**
 * Returns an array of userIds that are mentioned in the tweet but are not the original mentioner
 * @param tweet
 * @returns
 */
const getExcludedFromReplyUsers = (tweet) => {
  const userMentions = tweet.entities.user_mentions;
  const userIds = userMentions.map((user) => user.id_str).filter((id) => id !== tweet.user.id_str);
  return userIds;
};

export const responseTweet = async (tweet, response: string) => {
  const { id_str } = tweet;
  try {
    await userClient.v2.reply(response, id_str, {
      reply: {
        exclude_reply_user_ids: getExcludedFromReplyUsers(tweet),
        in_reply_to_tweet_id: id_str
      }
    });
  } catch (e) {
    Bugsnag.notify(e);
    console.log('Couldn Response :(');
    console.log(e);
  }
};

export const sendDirectMessage = async (userId: string, message: string) => {
  try {
    await userClient.v1.sendDm({
      recipient_id: userId,
      text: message
    });
  } catch (e) {
    Bugsnag.notify(e);
    console.log('Couldn Send Direct Message :(');
    console.log(e);
  }
};

export const getTweetContent = async (url: string) => {
  const id = url.split('/').pop() || '';
  try {
    const tweet = await userClient.v2.singleTweet(id);
    const text = getTextWithoutUrls(tweet.data.text);

    return text.length > 0 ? text : '🔗 Media';
  } catch (e) {
    Bugsnag.notify(e);
    console.log(e);
    return '';
  }
};

const getTextWithoutUrls = (url: string) => {
  return url.replaceAll(/https:\/\/t.co\/[^\s]+/g, '').trim();
};

export const getOriginalTweet = async (tweetId: string) => {
  try {
    const mentionedInTweet = await userClient.v2.singleTweet(tweetId, {
      'tweet.fields': 'conversation_id'
    });

    const originalTweet = await userClient.v2.singleTweet(mentionedInTweet.data.conversation_id || '', {
      'tweet.fields': ['author_id']
    });

    const url = `https://twitter.com/${originalTweet.data.author_id}/status/${originalTweet.data.id}`;

    return { url, text: originalTweet.data.text };
  } catch (e) {
    Bugsnag.notify(e);
    console.log('Couldn Get Original Tweet :(. Err: ', e);
    console.log(e);
  }
};

export const getResponseTweet = async (tweetId: string, userId: string) => {
  const url = `https://twitter.com/${userId}/status/${tweetId}`;
  return url;
};
