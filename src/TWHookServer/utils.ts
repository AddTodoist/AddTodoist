const itIsMe = (event) =>
  event.tweet_create_events[0].user.id_str === "1522266105271701505";

export const mentionedIn = (event) =>
  event.tweet_create_events && !event.user_has_blocked && !itIsMe(event);

export const getProjectNumFromMessage = (
  message: string
): [boolean, number] => {
  const projectNum = message.split(" ")[1];
  const surenum = +projectNum;
  if (isNaN(surenum)) return [false, NaN];
  return [true, surenum];
};
