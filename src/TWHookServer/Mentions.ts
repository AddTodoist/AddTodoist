import Client from 'todoist-rest-client';
import { getOriginalTweet, getResponseTweet, responseTweet } from '../TWAPI.js';
import UserInfo, { IUserInfo } from '../DB/index.js';
import { decodeUser, hashId } from '../DB/encrypts.js';

const itIsMe = (event) => event.tweet_create_events[0].user.id_str === '1522266105271701505';

export const mentionedIn = (event) => event.tweet_create_events // is a tweet create event
  && !event.user_has_blocked
  && event.tweet_create_events[0].in_reply_to_status_id_str // its a reply (to a tweet, a thread...)
  && !itIsMe(event);

export const handleMention = async (event) => {
  const userId = event.tweet_create_events[0].user.id_str;
  const { text, entities } = event.tweet_create_events[0];

  const action = text.match(/#thread|#tweets/i);
  if (action === null) return responseTweet(getTweet(event), 'I don\'t know what you mean. Try #thread or #tweets');

  // here we check if user is registered (common to all actions)
  const user = await UserInfo.findOne({ twId: hashId(userId) });
  if (!user) return responseTweet(getTweet(event), 'You are not registered. Send me /init');

  // console.log("lets handle a", action)
  switch (action[0].toLowerCase()) {
    case '#thread':
      return handleThread({ event, user });
    case '#tweets':
      return handleTweet({ event, user });
  }
};

const handleThread = async ({ event, user }: { event, user: IUserInfo }) => {
  const tweet = getTweet(event);

  // get top tweet of thread
  const tweetId = tweet.in_reply_to_status_id_str;
  const originalTweetInfo = await getOriginalTweet(tweetId);
  // -- conversation_id: 	The Tweet ID of the original Tweet of the conversation (which includes direct replies, replies of replies).
  // get labels

  // decode user info
  const { apiToken, projectId } = decodeUser(user.userInfo);
  // add to TODOIST DB
  const todoistClient = Client(apiToken);
  await todoistClient.task.create({
    content: `[🧵${originalTweetInfo?.text}](${originalTweetInfo?.url})`,
    project_id: projectId,
  });

  return responseTweet(tweet, 'Just added this thread to your Todoist Account :)');
};

const handleTweet = async ({ event, user }: { event, user: IUserInfo }) => {
  const tweet = getTweet(event);

  const responsedUserId = tweet.in_reply_to_user_id_str;
  const tweetId = tweet.in_reply_to_status_id_str;

  // get twit link
  const url = await getResponseTweet(tweetId, responsedUserId);
  // get labels

  // decode user info
  const { apiToken, projectId } = decodeUser(user.userInfo);

  // add to TODOIST DB
  const todoistClient = Client(apiToken);
  await todoistClient.task.create({
    content: url,
    project_id: projectId,
  });

  // dar forma al mensaje [name](link)
  // añadirlo con labels

  // send response
  return responseTweet(tweet, 'Just added this tweet to your Todoist Account :)');
};

const getTweet = (event) => event.tweet_create_events[0];
