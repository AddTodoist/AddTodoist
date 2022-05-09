import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_DB || "");

const userSchema = new mongoose.Schema({
  _id: String,
  userInfo: String,
});

const UserInfo = mongoose.model("userInfo", userSchema);

export default UserInfo;
