// controllers/admin.controller.js
import { User } from "../models/user.model.js";

const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get("host")}`;
};

// Get all users in the system
export const getAllUsers = async (req, res) => {
  try {
    const INACTIVE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
    const now = new Date();
    const baseUrl = getBaseUrl(req);

    // First, find all users and update their isOnline status based on lastActivity
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpiresAt");

    // Update users who haven't been active in the last 5 minutes
    const updatePromises = users
      .filter(user => user.isOnline && user.lastActivity && (now - new Date(user.lastActivity) > INACTIVE_TIMEOUT))
      .map(user => 
        User.findByIdAndUpdate(user._id, { isOnline: false }, { new: true })
      );

    await Promise.all(updatePromises);

    // Fetch updated users
    const updatedUsers = await User.find().select("-password -resetPasswordToken -resetPasswordExpiresAt");

    // Add full URL for profilePhoto
    const usersWithFullPhotoUrl = updatedUsers.map(user => ({
      ...user.toObject(),
      profilePhoto: user.profilePhoto ? `${baseUrl}${user.profilePhoto}` : null
    }));

    // Return a response
    return res.status(200).json({
      success: true,
      count: updatedUsers.length,
      users: usersWithFullPhotoUrl,
    });
  } catch (error) {
    console.error("Error Fetching users from the admin panel:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users"
    });
  }
};

// Admin updates user role and status
export const updateUserRoleAndStatus = async (req, res) => {
  try {
    const { username } = req.params; // approve by username
    const { role, status } = req.body;

    // Ensure the caller is authenticated
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - no token" });
    }

    // Check if caller is an admin/manager
    const adminUser = await User.findById(req.userId);
    if (!adminUser || adminUser.role !== "Manager") {
      return res.status(403).json({ success: false, message: "Forbidden - you are not an admin." });
    }

    // Find the target user by username (they don’t need a token)
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { role, status, approvedBy: req.userId },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User role and status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role/status:", error);
    res.status(500).json({ success: false, message: "Server error..Error updating user" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    //If user not found
    if(!deleteUser){
      return res.status(404).json({
        success: false,
        message: "User not found. Try again"
      })
    }
    // return the response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully!"
    })
  } catch (error) {
    console.error("Error deleting in adminController", error);
    res.status(500).json({
      success: false,
      message: "Server error in deleting user"
    })
  }
};

// Get active users (users active in the last 5 minutes)
export const getActiveUsers = async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const activeUsers = await User.find({
      lastActivity: { $gte: fiveMinutesAgo }
    }).select("name email role lastActivity onlineAt");

    return res.status(200).json({
      success: true,
      count: activeUsers.length,
      activeUsers,
    });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching active users"
    });
  }
};

// Update user's last activity (called periodically from frontend)
export const updateUserActivity = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        lastActivity: new Date(),
        isOnline: true,
        onlineAt: new Date()
      },
      { new: true }
    ).select("name email role lastActivity isOnline onlineAt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating user activity:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating activity"
    });
  }
};

// Mark user as offline (called when user logs out or closes browser)
export const markUserOffline = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { isOnline: false },
      { new: true }
    ).select("name email role isOnline");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error marking user offline:", error);
    res.status(500).json({
      success: false,
      message: "Server error while marking offline"
    });
  }
};