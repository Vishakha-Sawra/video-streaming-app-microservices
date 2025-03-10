import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { registerService, unregisterService } from "./serviceHandler.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(bodyParser.json());

const port = process.env.PORT || 5050;
const serviceConfig = { name: "comment-service", version: "1.0.0" };

// MongoDB connection
mongoose.connect(process.env.MONGO_URI_COMMENT_SERVICE);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Comment schema and model
const commentSchema = new mongoose.Schema({
  videoName: String,
  username: String,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

app.get("/", (req, res) => {
  res.send("Comment Service");
})
// API endpoint to add a comment
app.post("/comments", async (req, res) => {
  const { videoName, username, comment } = req.body;

  if (!videoName || !username || !comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newComment = new Comment({ videoName, username, comment });
  try {
    await newComment.save();
    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
});

// API endpoint to get comments for a video
app.get("/comments/:videoName", async (req, res) => {
  const { videoName } = req.params;
  try {
    const comments = await Comment.find({ videoName });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

// Start the service
app.listen(port, () => {
  registerService(port, serviceConfig);
  console.log(`Comment Service running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await unregisterService(port, serviceConfig);
  process.exit(0);
});