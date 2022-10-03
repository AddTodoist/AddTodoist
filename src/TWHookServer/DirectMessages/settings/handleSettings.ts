import { sendDirectMessage } from 'TWAPI';
// import { findUser } from 'utils/db';
// import TEXTS from '../texts';

const availableSettings = [''];

export const handleSettings: DMHandler = async (message) => {
  const userId = message.sender_id;
  const { text } = message.message_data;

  // TODO - continue implemention settings (save to DB)
  // TODO - accept empty in value group so we can remove the setting (i.e. set label to null)
  const match = text.match(/\/settings (?<setting>\S+) (?<value>.+)/i);
  if (!match) return sendDirectMessage(userId, '🔴 Invalid setting structure. Please use\n/settings <setting> <value>');

  const { setting, value } = match.groups || {};

  if (!availableSettings.includes(setting)) return sendDirectMessage(userId, '🔴 Invalid setting');

  // continue with this

  // const user = await findUser(userId);
  // if (!user) return sendDirectMessage(userId, TEXTS.BAD_TOKEN + '\nErr: USER_NOT_FOUND');
  
};
