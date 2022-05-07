const itIsMe = (event) =>
  event.tweet_create_events[0].user.id_str === "1311791486531497985";
export const mentionedIn = (event) =>
  event.tweet_create_events && !event.user_has_blocked && !itIsMe(event);

export const directMessageRecieved = (event) => {
  return (
    event.direct_message_events &&
    event.for_user_id === "1522266105271701505" &&
    event.direct_message_events[0].type === "message_create"
  );
};
