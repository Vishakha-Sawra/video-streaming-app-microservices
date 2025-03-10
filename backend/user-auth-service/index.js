import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { registerUser, loginUser, refreshAccessToken, logoutUser, checkAuthStatus } from "./serviceHandler.js";
import { registerService, unregisterService } from "./serviceHandler.js";
import refreshTokenRoutes from "./refreshToken.js"; 

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,  // ✅ Allow cookies to be sent/received
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],  // ✅ Define allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // ✅ Allow headers
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing
app.use("/", refreshTokenRoutes);

// Ensure routes are defined after middleware
app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/check-auth", checkAuthStatus); // Add check-auth endpoint
app.post("/refresh", refreshAccessToken);
app.post("/logout", logoutUser);  // Ensure logout is properly configured

const port = process.env.PORT || 8080;
const serviceConfig = { name: "user-auth-service", version: "1.0.0" };

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI_AUTH_SERVICE)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.listen(port, () => {
  registerService(port, serviceConfig);
  console.log(`User Authentication Service running on port ${port}`);
});

process.on("SIGINT", async () => {
  await unregisterService(port, serviceConfig);
  process.exit(0);
});