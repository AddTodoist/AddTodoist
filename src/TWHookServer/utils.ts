export const getProjectNumFromMessage = ( message: string ): [boolean, number] => {
  const projectNum = message.split(' ')[1];
  // regex for digit: /^\d+$/
  const isValidProjectNum = projectNum?.match(/^\d+$/);

  if (!isValidProjectNum) return [false, NaN];
  return [true, +isValidProjectNum[0]];
};
