import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_DB || '');

const userSchema = new mongoose.Schema<IUserInfo>();

const UserInfo = mongoose.model<IUserInfo>('users', userSchema);

export default UserInfo;
