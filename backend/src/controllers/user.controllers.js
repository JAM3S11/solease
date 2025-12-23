// controllers/user.controller.js
import { User } from "../models/user.model.js";

export const getITSupportUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "IT Support" }).select("username email");
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching IT Support users:", err);
    res.status(500).json({ message: "Failed to fetch IT Support users" });
  }
};