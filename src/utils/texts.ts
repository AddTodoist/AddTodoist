import { getTweetContent } from 'TWAPI';

export const getProjectNumFromMessage = ( message: string ) => {
  const projectNum = message.split(' ')[1];
  // regex for digit: /^\d+$/
  const isValidProjectNum = projectNum?.match(/^\d+$/);

  if (!isValidProjectNum) return null;
  return Number(isValidProjectNum[0]);
};

export const getUserCustomTaskContent = ( message: TWDirectMessage, URLEntity: URLEntity) => {
  const textWithoutURL = message.message_data.text.slice(0, URLEntity.indices[0]).trim();
  const taskText = `[${textWithoutURL}](${URLEntity.expanded_url})`;
  return taskText;
};

export const getDefaultTaskContent = async (url: string) => {
  const text = await getTweetContent(url);

  const truncatedPreviewText = text.length <= 45
    ? text
    : `${text.slice(0, 42)}...`;

  return `${truncatedPreviewText} - ${url}`;
};
