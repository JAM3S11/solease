// controllers/admin.controller.js
import { User } from "../models/user.model.js";

// Get all users in the system
export const getAllUsers = async (req, res) => {
  try {
    // The select part removes the highlighted regments in the User model
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpiresAt");

    // Return a response
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
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