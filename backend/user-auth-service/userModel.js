import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  refreshToken: { type: String },  // ✅ Store refresh tokens in DB
});

export default mongoose.model("User", UserSchema);
