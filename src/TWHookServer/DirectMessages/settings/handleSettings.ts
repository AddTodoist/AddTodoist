import { sendDirectMessage } from 'TWAPI';

const availableSettings = ['reset', 'response', 'thread-label'];

export const handleSettings: DMHandlerFunction = async (message, user) => {
  const userId = message.sender_id;
  const { text } = message.message_data;

  // TODO - continue implemention settings (save to DB)
  const match = text.match(/\/settings (?<setting>\S+)( (?<value>.+))?/i);
  if (!match) return sendDirectMessage(userId, '🔴 Invalid setting structure. Please use\n/settings <setting> <value>');

  const { setting: rawSetting, value: rawValue } = match.groups || {};
  const setting = rawSetting?.toLowerCase();

  if (!availableSettings.includes(setting)) return sendDirectMessage(userId, '🔴 Invalid setting');

  if (setting === 'reset') {
    user.noResponse = undefined;
    user.threadLabel = undefined;
    await user.save();
    return sendDirectMessage(userId, '✅ Settings reset to default');
  }

  if (setting === 'response') {
    const value = rawValue?.toLowerCase();
    if (!['true', 'false', undefined].includes(value)) return sendDirectMessage(userId, '🔴 Invalid value. Please use true or false');
    if (value === 'false') user.noResponse = true;
    if (value === 'true' || value === undefined) user.noResponse = undefined;
    await user.save();
    return sendDirectMessage(userId, `✅ Setting ${setting} set to ${value || 'true'}`);
  }

  if (setting === 'thread-label') {
    if (rawValue === undefined) user.threadLabel = undefined;
    else if (rawValue.toLowerCase() === 'null') user.threadLabel = null;
    else user.threadLabel = rawValue;
  
    await user.save();
    return sendDirectMessage(userId, `✅ Setting ${setting} set to ${rawValue || 'default (🧵Thread)'}`);
  }
  
};
