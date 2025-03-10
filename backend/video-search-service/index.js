import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Video from "./videoModel.js"; // Import the Video model
import { registerService, unregisterService } from "./serviceHandler.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const serviceConfig = { name: "video-search-service", version: "1.0.0" };

app.use(cors()); 
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI_VIDEO_SEARCH)
  .then(() => console.log("📦 MongoDB Connected for video-search-service"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.get("/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const sortBy = req.query.sort || "newest"; 

  try {
    let videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    // Apply sorting
    if (sortBy === "oldest") {
      videos.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      videos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(videos);
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    res.status(500).json({ message: "Error fetching videos" });
  }
});

app.get("/user-videos", async (req, res) => {
  const username = req.query.username;

  try {
    const videos = await Video.find({ username });
    res.json(videos);
  } catch (error) {
    console.error("❌ Error fetching user videos:", error);
    res.status(500).json({ message: "Error fetching user videos" });
  }
});

app.get("/videos/:videoName/details", async (req, res) => {
  const videoName = req.params.videoName;

  try {
    const video = await Video.findOne({ filename: videoName });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    console.error("❌ Error fetching video details:", error);
    res.status(500).json({ message: "Error fetching video details" });
  }
});

app.listen(port, () => {
  registerService(port, serviceConfig);
  console.log(`Video Search Service running on port ${port}`);
});

process.on("SIGINT", async () => {
  await unregisterService(port, serviceConfig);
  process.exit(0);
});