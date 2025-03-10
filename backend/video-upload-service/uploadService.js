import Video from "./videoModel.js";
import path from "path";

export const saveVideoMetadata = async (file, userId, username, title, description) => {
  try {
    const video = new Video({
      filename: file.filename,
      originalName: file.originalname,
      title,
      description,
      filepath: path.join("videos", file.filename),
      size: file.size,
      uploadedAt: Date.now(),
      userId,
      username, // Ensure username is saved
    });

    await video.save();
    console.log("✅ Video metadata saved:", video);
    return video;
  } catch (error) {
    console.error("❌ Error saving video metadata:", error);
    throw error;
  }
};