import { sendDirectMessage } from "../TWAPI.js";
import Client from "todoist-rest-client";
import UserInfo from "../DB/index.js";
import { decodeUser, encodeUser, hashId } from "../DB/encrypts.js";
import { IUserInfo } from "../DB/index.js";

type TWDirectMessage = {
  target: Object;
  sender_id: string;
  message_data: {
    text: string;
    entities: Object;
  };
};

export const mentionedIn = (event) => {
  return // TODO - check mention from event
};

export const handleMention = async (message: TWDirectMessage) => {
  const userId = message.sender_id;
  const { text, entities } = message.message_data;

  const action = text.match(/#thread|#tweets/)
  if (action === null) return; // TODO - response with help text

  // here we check if user is registered (common to all actions)
  const user = await UserInfo.findOne({ twId: hashId(userId) })
  if (!user) return // TODO - response with help text

  switch (action[0]) {
    case "#thread":
      return handleThread({message, user});
    case "#tweets":
      return handleTweet({text, user});
  }
};

const handleThread = async ({message, user}: {message: TWDirectMessage, user: IUserInfo}) => {
  // get top tweet of thread
  // get labels

  // decode user info
  // const { apiToken, projectId } = decodeUser(user.userInfo);
  // add to TODOIST DB
  // const todoistClient = Client(apiToken);

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

export const getMessage = (event): TWDirectMessage =>
  event.direct_message_events[0].message_create;