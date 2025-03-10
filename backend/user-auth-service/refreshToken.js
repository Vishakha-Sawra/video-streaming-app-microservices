import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import User from "./userModel.js";

dotenv.config();
const router = express.Router();
router.use(cookieParser());

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });
  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(403).json({ message: "Invalid refresh token" });
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Token expired. Please log in again." });
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "30d" }
    );
    user.refreshToken = newRefreshToken;
    await user.save();
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
});

export default router;
