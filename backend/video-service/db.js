import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_VIDEO_SERVICE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("📦 MongoDB Connected for video-service");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
