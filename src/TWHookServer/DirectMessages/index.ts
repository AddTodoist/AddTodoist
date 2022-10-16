import DMHandler from './DMHandler';

export const directMessageRecieved = (event) => (
  event.direct_message_events
  && event.for_user_id === process.env.TW_ACC_ID
  && event.direct_message_events[0].type === 'message_create'
  && getMessage(event).sender_id !== process.env.TW_ACC_ID
);

export const handleDirectMessage = async (message: TWDirectMessage) => {
  // Temporal fix for the bug that makes the bot answer before the user
  await new Promise(res => setTimeout(res, 1000));

  const { text } = message.message_data;
  const command = text.split(' ')[0].toLowerCase();

  return DMHandler[command] ? DMHandler[command](message) : DMHandler.DEFAULT(message, null);
};

export const getMessage = (event): TWDirectMessage =>  {
  return { ...event.direct_message_events[0].message_create, sender_name: getDMSenderName(event)};
  
};

const getDMSenderName = (event): string => {
  const senderId = event.direct_message_events[0].message_create.sender_id;
  const sender = event.users[senderId];
  return sender.name;
};
