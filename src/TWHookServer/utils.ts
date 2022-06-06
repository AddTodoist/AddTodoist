const itIsMe = (event) =>
  event.tweet_create_events[0].user.id_str === "1522266105271701505";

export const mentionedIn = (event) => {
  return event.tweet_create_events // is a tweet create event
          && !event.user_has_blocked
          && event.tweet_create_events[0].in_reply_to_status_id_str // its a reply (to a tweet, a thread...)
          && !itIsMe(event); 
}
  

export const getProjectNumFromMessage = (
  message: string
): [boolean, number] => {
  const projectNum = message.split(" ")[1];
  const surenum = +projectNum;
  if (isNaN(surenum)) return [false, NaN];
  return [true, surenum];
};
