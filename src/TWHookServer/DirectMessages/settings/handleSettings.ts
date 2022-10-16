import { sendDirectMessage } from 'TWAPI';

const availableSettings = ['reset'];

export const handleSettings: DMHandlerFunction = async (message, user) => {
  const userId = message.sender_id;
  const { text } = message.message_data;

  // TODO - continue implemention settings (save to DB)
  const match = text.match(/\/settings (?<setting>\S+)( (?<value>.+))?/i);
  if (!match) return sendDirectMessage(userId, '🔴 Invalid setting structure. Please use\n/settings <setting> <value>');

  const { setting, value } = match.groups || {};
  
  if (!availableSettings.includes(setting)) return sendDirectMessage(userId, '🔴 Invalid setting');

  if (setting === 'reset') {
    user.todoistSettings = null;
    await user.save();
    return sendDirectMessage(userId, '✅ Settings reset to default');
  }
  
};
