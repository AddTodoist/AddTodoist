import UserInfo from 'DB';
import { hashId } from 'DB/encrypts';

/**
 * Finds a user by twitter id *(not hashed)*
 */
export const findUser = async (userId: string) => {
  const user = await UserInfo.findOne({ _id: hashId(userId) });
  return user;
};
