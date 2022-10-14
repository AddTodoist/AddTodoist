import CryptoJS from 'crypto-js';

const secret = process.env.DB_SECRET || null;
if (!secret) throw new Error('DB_SECRET is not set');

export const hashId = (id: string) => CryptoJS.SHA256(id).toString();

export const encryptString = (data: string) => CryptoJS.AES.encrypt(data, secret).toString();
export const decryptString = (data: string) => CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8);
