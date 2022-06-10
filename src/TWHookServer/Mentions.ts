import Client from 'todoist-rest-client';
import { getOriginalTweet, getResponseTweet, responseTweet } from '../TWAPI.js';
import UserInfo, { IUserInfo } from '../DB/index.js';
import { decodeUser, hashId } from '../DB/encrypts.js';

export const mentionedIn = (event): boolean => {
  const itIsMe = (event) => event.tweet_create_events[0].user.id_str === process.env.TW_ACC_ID;

  if( !event.user_has_blocked
      && event.tweet_create_events?.[0]?.in_reply_to_status_id_str // its a reply (to a tweet, a thread...)
      && !itIsMe(event)
  ) return true;
  else return false;
};

export const handleMention = async (event) => {
  const tweet = getTweet(event);
  const userId = tweet.user.id_str;
  const { text } = tweet;

  const action = text.match(/#thread|#tweets/i);
  if (action === null) return responseTweet(tweet, 'I don\'t know what you mean. Try #thread or #tweets');

  // here we check if user is registered (common to all actions)
  const user = await UserInfo.findOne({ twId: hashId(userId) });
  if (!user) return responseTweet(tweet, 'You are not registered. Send me /init');

  // console.log("lets handle a", action)
  switch (action[0].toLowerCase()) {
    case '#thread':
      return handleThread({ tweet, user });
    case '#tweets':
      return handleTweet({ tweet, user });
  }
};

const handleThread = async ({ tweet, user }: { tweet, user: IUserInfo }) => {
  // get top tweet of thread
  const tweetId = tweet.in_reply_to_status_id_str;
  const originalTweetInfo = await getOriginalTweet(tweetId);

  // decode user info
  const { apiToken, projectId } = decodeUser(user.userInfo);

  // add to TODOIST DB
  const todoistClient = Client(apiToken);
  await todoistClient.task.create({
    content: `[🧵${originalTweetInfo?.text}](${originalTweetInfo?.url})`,
    project_id: projectId,
  });

  // send response
  return responseTweet(tweet, 'Just added this thread to your Todoist Account :)');
};

const handleTweet = async ({ tweet, user }: { tweet, user: IUserInfo }) => {
  const responsedUserId = tweet.in_reply_to_user_id_str;
  const tweetId = tweet.in_reply_to_status_id_str;

  // get twit link
  const url = await getResponseTweet(tweetId, responsedUserId);

  // decode user info
  const { apiToken, projectId } = decodeUser(user.userInfo);

  // add to TODOIST DB
  const todoistClient = Client(apiToken);
  await todoistClient.task.create({
    content: url,
    project_id: projectId,
  });

  // send response
  return responseTweet(tweet, 'Just added this tweet to your Todoist Account :)');
};

const getTweet = (event) => event.tweet_create_events[0];
