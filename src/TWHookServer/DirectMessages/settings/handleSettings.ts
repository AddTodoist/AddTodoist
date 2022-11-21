import { sendDirectMessage } from 'TWAPI';

const availableSettings = ['reset', 'response'];

export const handleSettings: DMHandlerFunction = async (message, user) => {
  const userId = message.sender_id;
  const { text } = message.message_data;

  // TODO - continue implemention settings (save to DB)
  const match = text.match(/\/settings (?<setting>\S+)( (?<value>.+))?/i);
  if (!match) return sendDirectMessage(userId, '🔴 Invalid setting structure. Please use\n/settings <setting> <value>');

  const { setting, value } = match.groups || {};
  
  if (!availableSettings.includes(setting)) return sendDirectMessage(userId, '🔴 Invalid setting');

  if (setting === 'reset') {
    user.noResponse = undefined;
    await user.save();
    return sendDirectMessage(userId, '✅ Settings reset to default');
  }

  if (setting === 'response') {
    if (!['true', 'false', undefined].includes(value)) return sendDirectMessage(userId, '🔴 Invalid value. Please use true or false');
    if (value === 'false') user.noResponse = true;
    if (value === 'true' || value === undefined) user.noResponse = undefined;
    await user.save();
    return sendDirectMessage(userId, `✅ Setting ${setting} set to ${value || 'true'}`);
  }
  
};
