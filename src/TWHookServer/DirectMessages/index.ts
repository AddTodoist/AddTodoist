import { handleConfig, handleProject, handleDefaultDM, handleDelete, handleDeleteAll, handleInit, handleMain, handleHelp, handleThread } from './handlers';
import { handleSettings } from './settings/handleSettings';

const handlers: Record<VALID_MESSAGES, DMHandler> = {
  '/init': handleInit,
  '/help': handleHelp,
  '/project': handleProject,
  '/config': handleConfig,
  '/delete': handleDelete,
  '/deleteall': handleDeleteAll,
  '/settings': handleSettings,
  '#main': handleMain,
  '#thread': handleThread,
  DEFAULT: handleDefaultDM,
};

export const directMessageRecieved = (event) => (
  event.direct_message_events
  && event.for_user_id === process.env.TW_ACC_ID
  && event.direct_message_events[0].type === 'message_create'
  && getMessage(event).sender_id !== process.env.TW_ACC_ID
);

export const handleDirectMessage = async (message: TWDirectMessage) => {
  const { text } = message.message_data;
  const command = text.split(' ')[0].toLowerCase();

  return handlers[command] ? handlers[command](message) : handlers.DEFAULT(message);
};

export const getMessage = (event): TWDirectMessage =>  {
  return { ...event.direct_message_events[0].message_create, sender_name: getDMSenderName(event)};
  
};

const getDMSenderName = (event): string => {
  const senderId = event.direct_message_events[0].message_create.sender_id;
  const sender = event.users[senderId];
  return sender.name;
};
