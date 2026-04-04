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
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.profilePhoto) {
      const oldPhotoPath = path.join(process.cwd(), "uploads", "profile-photos", path.basename(user.profilePhoto));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    const profilePhotoPath = `/uploads/profile-photos/${req.file.filename}`;
    
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { profilePhoto: profilePhotoPath }
    });

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

export const deleteProfilePhoto = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.profilePhoto) {
      const photoPath = path.join(process.cwd(), "uploads", "profile-photos", path.basename(user.profilePhoto));
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
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
