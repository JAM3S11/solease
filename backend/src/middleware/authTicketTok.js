// backend/src/middleware/authTicketTok.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    // 1. Get token (cookie OR header)
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey"); 
    // 👆 fallback to "mysecretkey" if env missing

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    // 3. Fetch user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized - user not found" });
    }

    // 4. Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protect middleware:", error.message);
    res.status(500).json({ success: false, message: "Server error in authentication" });
  }
};