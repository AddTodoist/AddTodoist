import { getTweetContent } from 'TWAPI';

/**
 * Recieves as parameter a user message that must match the `/project <number>` format
 * and returns the number if it matches, otherwise returns null
 */
export const getProjectNumFromMessage = ( message: string ) => {
  if (typeof message !== 'string') return null;

  // regex for digits: /\d+/
  const isValidProjectNum = message.trim().match(/^\/project (\d+)$/i);

  if (!isValidProjectNum) return null;
  return Number(isValidProjectNum[1]);
};

export const getUserCustomTaskContent = ( message: TWDirectMessage, URLEntity: URLEntity) => {
  const textWithoutURL = message.message_data.text.slice(0, URLEntity.indices[0]).trim();
  const taskText = `[${textWithoutURL}](${URLEntity.expanded_url})`;
  return taskText;
};

export const getDefaultTaskContent = async (url: string) => {
  const text = await getTweetContent(url);

  const truncatedPreviewText = text.length <= 100
    ? text
    : `${text.slice(0, 97)}...`;

  return `${truncatedPreviewText} - ${url}`;
};
