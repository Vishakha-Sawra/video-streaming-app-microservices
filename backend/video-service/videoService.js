import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Video from "./videoModel.js";
import { registerService, unregisterService } from "./serviceHandler.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 4000;
// const VIDEO_STORAGE_PATH = path.resolve("videos") || process.env.VIDEO_STORAGE_PATH;
const VIDEO_STORAGE_PATH =  process.env.VIDEO_STORAGE_PATH;


const serviceConfig = { name: "video-service", version: "1.0.0" };

app.use(cors());
app.use(express.json());
app.use("/videos", express.static(VIDEO_STORAGE_PATH)); // Ensure this path is correct

// Get all videos from MongoDB
app.get("/videos", async (req, res) => {
  try {
    let videos = await Video.find().sort({ uploadedAt: -1 }); // Sort by uploadedAt in descending order
    console.log("📋 Retrieved Videos from DB:", videos); // Debugging log

    // Apply search filter
    if (req.query.search) {
      const searchQuery = req.query.search.toLowerCase();
      videos = videos.filter(video => video.title.toLowerCase().includes(searchQuery));
    }

    res.json(videos);
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    res.status(500).json({ message: "Error fetching videos" });
  }
});

// Serve a specific video file
app.get("/video/:filename", (req, res) => {
  const filePath = path.resolve(VIDEO_STORAGE_PATH, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Video not found" });

  res.sendFile(filePath);
});

app.get("/videos/:filename/details", async (req, res) => {
  try {
    const video = await Video.findOne({ filename: req.params.filename });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    console.error("❌ Error fetching video details:", error);
    res.status(500).json({ message: "Error fetching video details" });
  }
});

app.get("/user-videos", async (req, res) => {
  try {
    const username = req.query.username;
    const videos = await Video.find({ username });
    res.json(videos);
  } catch (error) {
    console.error("❌ Error fetching user videos:", error);
    res.status(500).json({ message: "Error fetching user videos" });
  }
});

app.listen(port, () => {
  registerService(port, serviceConfig);
  console.log(`📺 Video Streaming Service running on port ${port}`);
});

process.on("SIGINT", async () => {
  await unregisterService(port, serviceConfig);
  process.exit(0);
});