import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  filepath: { type: String, required: true },
  size: { type: Number, required: true }, 
  uploadedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  username: { type: String, required: true }, 
});

const Video = mongoose.model("Video", videoSchema);
export default Video;