import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";

import connectDB from "./db.js";
import Video from "./videoModel.js"; // Import the Video model
import { saveVideoMetadata } from "./uploadService.js";
import { registerService, unregisterService } from "./serviceHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6969;
// const VIDEO_STORAGE_PATH =  path.resolve("../video-service/videos") 
const VIDEO_STORAGE_PATH =  process.env.VIDEO_STORAGE_PATH;


// Connect to MongoDB
connectDB();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(VIDEO_STORAGE_PATH)) fs.mkdirSync(VIDEO_STORAGE_PATH, { recursive: true });
    cb(null, VIDEO_STORAGE_PATH);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    const randomString = Math.floor(Math.random() * 10000);
    const newFilename = `${timestamp}_${randomString}${ext}`;
    console.log("📂 Saving file as:", newFilename);
    cb(null, newFilename);
  },
});

const upload = multer({ storage });

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  console.log("Cookies received at /upload:", req.cookies);

  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired" });
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    console.log("✅ Decoded JWT:", decoded);
    req.user = decoded; // Ensure username is present in the decoded token

    if (!req.user.username) {
      return res.status(400).json({ message: "Invalid token: Missing username" });
    }

    next();
  });
};

// Upload API
app.post("/upload", authenticateUser, upload.single("video"), async (req, res) => {
  console.log("🚀 Upload request received!");
  console.log("User data from token:", req.user); // Debugging log

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const { title, description } = req.body;

  try {
    const video = await saveVideoMetadata(
      req.file,
      req.user.id, 
      req.user.username, 
      title,
      description
    );

    res.json({ message: "Upload successful", video });
  } catch (error) {
    console.error("❌ Error during upload:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all videos
app.get("/videos", async (req, res) => {
  try {
    const sortOrder = req.query.sort === "oldest" ? 1 : -1; // Default to newest first
    const videos = await Video.find().sort({ uploadedAt: sortOrder });
    res.json(videos);
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    res.status(500).json({ message: "Error retrieving videos" });
  }
});

app.use("/videos", express.static(VIDEO_STORAGE_PATH)); // Ensure this path is correct

const serviceConfig = { name: "upload-service", version: "1.0.0" };

app.listen(PORT, () => {
  registerService(PORT, serviceConfig);
  console.log(`📤 Upload Service running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await unregisterService(PORT, serviceConfig);
  process.exit(0);
});