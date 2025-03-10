import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "./userModel.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);
    // Assign default profile picture
    const profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    console.log("Generated profile picture URL:", profilePicture); // Log the URL
    // Save user to MongoDB
    const newUser = new User({
      username,
      password: hashedPassword,
      profilePicture,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ message: "Invalid password" });
    // Generate Tokens
    const accessToken = jwt.sign(
      { id: user._id, username: user.username }, // Include username in the token
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();
    // Store tokens in cookies
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    res.status(200).json({
      accessToken,
      username: user.username,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(403).json({ message: "Invalid refresh token" });
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token expired. Please log in again." });
    // Generate new access & refresh tokens
    const newAccessToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    // Save new refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();
    // Set cookies properly
    res.cookie("jwt", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    res.json({ message: "Token refreshed", accessToken: newAccessToken });
  });
};

export const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(204).json({ message: "No content" });
  // Remove refresh token from DB
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
  res.clearCookie("jwt", { httpOnly: true, sameSite: "Lax" });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Lax" });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuthStatus = (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    res.status(200).json({ message: "Authenticated", username: decoded.username });
  });
};

export const registerService = (port, config) => {
  const url = `http://localhost:3000/register/${config.name}/${config.version}/${port}`;
  fetch(url, { method: "PUT" })
    .then((res) => res.json())
    .then((data) => console.log(`Service registered: ${data.serviceKey}`))
    .catch(console.error);
};

export const unregisterService = (port, config) => {
  const url = `http://localhost:3000/register/${config.name}/${config.version}/${port}`;
  fetch(url, { method: "DELETE" })
    .then(() => console.log(`Service unregistered from port ${port}`))
    .catch(console.error);
};