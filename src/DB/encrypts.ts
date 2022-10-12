import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const secret = process.env.DB_SECRET || 'null';
if (!secret) throw new Error('DB_SECRET is not set');

type User = {
  apiToken: string;
  projectId: string;
};

export const hashId = (id: string) => CryptoJS.SHA256(id).toString();

export const encodeUser = (user: User) => jwt.sign(user, secret, { noTimestamp: true });

export const decodeUser = (encodedUser: string): User => jwt.verify(encodedUser, secret) as User;
