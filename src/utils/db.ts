import UserInfo from 'DB';
import { hashId } from 'DB/encrypts';

export const findUser = async (userId: string) => {
  const user = await UserInfo.findOne({ _id: hashId(userId) });
  return user;
};
