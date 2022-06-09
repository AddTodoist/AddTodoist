export const getProjectNumFromMessage = (
  message: string
): [boolean, number] => {
  const projectNum = message.split(" ")[1];
  const surenum = +projectNum;
  if (isNaN(surenum)) return [false, NaN];
  return [true, surenum];
};
