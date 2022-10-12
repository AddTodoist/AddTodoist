import mongoose from 'mongoose';

await mongoose.connect(process.env.MONGO_DB || '');

const userSchema = new mongoose.Schema<IUserInfo>({
  _id: { type: String, required: true },
  todoistToken: { type: String, required: true },
  todoistProjectId: { type: String, required: true },
  todoistSettings: { type: Object, required: false },
});

const UserInfo = mongoose.model<IUserInfo>('users', userSchema);

export default UserInfo;
