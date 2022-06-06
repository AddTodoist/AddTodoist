import { getOriginalTweet, sendDirectMessage } from "../TWAPI.js";
import Client from "todoist-rest-client";
import UserInfo from "../DB/index.js";
import { decodeUser, encodeUser, hashId } from "../DB/encrypts.js";
import { IUserInfo } from "../DB/index.js";

// KNOWN ERRORS
// FAIL when mentioned in quoted tweet

export const mentionedIn = (event) => {
  return // TODO - check mention from event
};

export const handleMention = async (event) => {

  // console.log(event)
  const userId = event.tweet_create_events[0].user.id_str
  const { text, entities } = event.tweet_create_events[0];

  const action = text.match(/#thread|#tweets/i)
  if (action === null) return; // TODO - response with help text

  // here we check if user is registered (common to all actions)
  const user = await UserInfo.findOne({ twId: hashId(userId) })
  if (!user) return // TODO - response with help text

  // console.log("lets handle a", action)
  switch (action[0].toLowerCase()) {
    case "#thread":
      return handleThread({event, user});
    case "#tweets":
      return handleTweet({text, user});
  }
};

const handleThread = async ({event, user}: {event, user: IUserInfo}) => {
  // get top tweet of thread
  const tweetId = event.tweet_create_events[0].in_reply_to_status_id_str
  const originalTweetInfo = await getOriginalTweet(tweetId)
  // -- conversation_id: 	The Tweet ID of the original Tweet of the conversation (which includes direct replies, replies of replies).
  // get labels

  // decode user info
  const { apiToken, projectId } = decodeUser(user.userInfo);
  // add to TODOIST DB
  const todoistClient = Client(apiToken);
  await todoistClient.task.create({
    content: `[🧵${originalTweetInfo?.text}](${originalTweetInfo?.url})`,
    project_id: projectId,
  })

  // send response

}

const handleTweet = async ({text, user}: {text: string, user: IUserInfo}) => {

  // get twit link
  // get labels
  // decode user info

  // add to TODOIST DB
    // dar forma al mensaje [name](link)
    // añadirlo con labels
  // send response


}

export const getTweetInfo = (event) =>
  event.direct_message_events[0].message_create;