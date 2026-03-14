// controllers/profile.controller.js
import { User } from "../models/user.model.js";
import { ContactUserProfile } from "../models/contactuser.model.js";
import fs from "fs";
import path from "path";

// Get profile
export const getProfile = async (req, res) => {
  try {
    const usid = req.userId;

    const user = await User.findById(usid).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const condetails = await ContactUserProfile.findOne({ user: usid });

    const contactData = condetails
      ? {
          address: condetails.address || "",
          country: condetails.country || "",
          county: condetails.county || "",
          telephoneNumber: condetails.telephoneNumber || "",
        }
      : {
          address: "",
          country: "",
          county: "",
          telephoneNumber: "",
        };

    return res.status(200).json({
      success: true,
      personal: user,
      contact: contactData || {},
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error in fetching user profile",
    });
  }
};

// Update profile
export const putProfile = async (req, res) => {
  try {
    const { personal, contact } = req.body;

    // Only updates the user's name field
    const updatedFields = {};
    if (personal?.name) updatedFields.name = personal.name;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updatedFields },
      { new: true }
    ).select("-password");

    // Update or create contact info
    let contactProfile = await ContactUserProfile.findOne({ user: req.userId });

    if (contactProfile) {
      contactProfile.address = contact?.address || "";
      contactProfile.country = contact?.country || "";
      contactProfile.county = contact?.county || "";
      contactProfile.telephoneNumber = contact?.telephoneNumber || "";
      await contactProfile.save();
    } else {
      contactProfile = await ContactUserProfile.create({
        user: req.userId,
        address: contact?.address,
        country: contact?.country,
        county: contact?.county,
        telephoneNumber: contact?.telephoneNumber,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      personal: updatedUser,
      contact: contactProfile,
    });
  } catch (error) {
    console.error("Error in putProfile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete old profile photo if exists
    if (user.profilePhoto) {
      const oldPhotoPath = path.join(process.cwd(), "uploads", "profile-photos", path.basename(user.profilePhoto));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update user with new profile photo path
    const profilePhotoPath = `/uploads/profile-photos/${req.file.filename}`;
    user.profilePhoto = profilePhotoPath;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      profilePhoto: profilePhotoPath
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete profile photo
export const deleteProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.profilePhoto) {
      // Delete the photo file
      const photoPath = path.join(process.cwd(), "uploads", "profile-photos", path.basename(user.profilePhoto));
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }

      // Set profilePhoto to null
      user.profilePhoto = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Profile photo deleted successfully"
      });
    }

    return res.status(200).json({
      success: true,
      message: "No profile photo to delete"
    });
  } catch (error) {
    console.error("Error deleting profile photo:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};