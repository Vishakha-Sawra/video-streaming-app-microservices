import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  filepath: { type: String, required: true },
  size: { type: Number, required: true }, // In bytes
  uploadedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to user
  username: { type: String, required: true }, // Add username field
});

const Video = mongoose.model("Video", videoSchema);
export default Video;