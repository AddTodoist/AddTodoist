const itIsMe = (event) =>
  event.tweet_create_events[0].user.id_str === "1311791486531497985";

export const mentionedIn = (event) =>
  event.tweet_create_events && !event.user_has_blocked && !itIsMe(event);
