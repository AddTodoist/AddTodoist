import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_DB || "");

interface IUserInfo {
  _id: string;
  userInfo: string;
}

const userSchema = new mongoose.Schema<IUserInfo>({
  _id: String,
  userInfo: String,
});

const UserInfo = mongoose.model<IUserInfo>("userInfo", userSchema);

export default UserInfo;
