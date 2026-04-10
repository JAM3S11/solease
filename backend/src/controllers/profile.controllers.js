import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        notificationsEnabled: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const condetails = await prisma.contactUserProfile.findFirst({ where: { userId } });

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

export const putProfile = async (req, res) => {
  try {
    const { personal, contact } = req.body;

    const updatedFields = {};
    if (personal?.name) updatedFields.name = personal.name;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: updatedFields,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        notificationsEnabled: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true
      }
    });

    let contactProfile = await prisma.contactUserProfile.findFirst({ where: { userId: req.userId } });

    if (contactProfile) {
      contactProfile = await prisma.contactUserProfile.update({
        where: { id: contactProfile.id },
        data: {
          address: contact?.address || "",
          country: contact?.country || "",
          county: contact?.county || "",
          telephoneNumber: contact?.telephoneNumber || "",
        }
      });
    } else {
      contactProfile = await prisma.contactUserProfile.create({
        data: {
          userId: req.userId,
          address: contact?.address || "",
          country: contact?.country || "",
          county: contact?.county || "",
          telephoneNumber: contact?.telephoneNumber || "",
        }
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

export const uploadProfilePhoto = async (req, res) => {
  try {
    console.log("Upload request received, userId:", req.userId);
    console.log("Request file:", req.file);
    console.log("Request body:", req.body);

    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      console.log("User not found for userId:", req.userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User found:", user.id, "Current profilePhoto:", user.profilePhoto);

    // Delete old photo if exists
    if (user.profilePhoto) {
      try {
        let oldPhotoPath = user.profilePhoto;
        if (!oldPhotoPath.startsWith("/uploads/")) {
          oldPhotoPath = `/uploads/profile-photos/${oldPhotoPath}`;
        }
        const fullOldPhotoPath = path.join(process.cwd(), oldPhotoPath);
        console.log("Deleting old photo at:", fullOldPhotoPath);
        if (fs.existsSync(fullOldPhotoPath)) {
          fs.unlinkSync(fullOldPhotoPath);
          console.log("Old photo deleted successfully");
        } else {
          console.log("Old photo file not found on disk");
        }
      } catch (err) {
        console.warn("Could not delete old photo:", err.message);
      }
    }

    // Store relative path (works with both PostgreSQL and other DBs)
    const profilePhotoPath = `/uploads/profile-photos/${req.file.filename}`;
    console.log("New photo path to save:", profilePhotoPath);
    
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { profilePhoto: profilePhotoPath }
    });

    console.log("Database updated, new profilePhoto:", updatedUser.profilePhoto);

    return res.status(200).json({
      success: true,
      message: "Profile photo uploaded successfully",
      profilePhoto: profilePhotoPath
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};

export const deleteProfilePhoto = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.profilePhoto) {
      try {
        // Handle both old format (just filename) and new format (full path)
        let photoPath = user.profilePhoto;
        if (!photoPath.startsWith("/uploads/")) {
          photoPath = `/uploads/profile-photos/${photoPath}`;
        }
        const fullPhotoPath = path.join(process.cwd(), photoPath);
        if (fs.existsSync(fullPhotoPath)) {
          fs.unlinkSync(fullPhotoPath);
        }
      } catch (err) {
        console.warn("Could not delete photo file:", err.message);
      }

      await prisma.user.update({
        where: { id: req.userId },
        data: { profilePhoto: null }
      });

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
