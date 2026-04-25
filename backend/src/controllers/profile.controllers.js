import prisma from "../config/db.js";
import fs from "fs";
import path from "path";

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("getProfile called for userId:", userId);

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
      console.log("User not found for userId:", userId);
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

export const getAvailability = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        timezone: true,
        workingHoursStart: true,
        workingHoursEnd: true,
        workingDays: true,
        preferredContactTime: true,
        autoResponseEnabled: true,
        responseDelayMinutes: true,
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const availability = {
      timezone: user.timezone || "UTC",
      workingHoursStart: user.workingHoursStart || "09:00",
      workingHoursEnd: user.workingHoursEnd || "17:00",
      workingDays: user.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      preferredContactTime: user.preferredContactTime || "business-hours",
      autoResponseEnabled: user.autoResponseEnabled !== false,
      responseDelayMinutes: user.responseDelayMinutes || 0,
    };

    return res.status(200).json({
      success: true,
      availability
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const putAvailability = async (req, res) => {
  try {
    const {
      timezone,
      workingHoursStart,
      workingHoursEnd,
      workingDays,
      preferredContactTime,
      autoResponseEnabled,
      responseDelayMinutes
    } = req.body;

    const updatedFields = {};

    if (timezone !== undefined) updatedFields.timezone = timezone;
    if (workingHoursStart !== undefined) updatedFields.workingHoursStart = workingHoursStart;
    if (workingHoursEnd !== undefined) updatedFields.workingHoursEnd = workingHoursEnd;
    if (workingDays !== undefined) updatedFields.workingDays = workingDays;
    if (preferredContactTime !== undefined) updatedFields.preferredContactTime = preferredContactTime;
    if (autoResponseEnabled !== undefined) updatedFields.autoResponseEnabled = autoResponseEnabled;
    if (responseDelayMinutes !== undefined) updatedFields.responseDelayMinutes = responseDelayMinutes;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: updatedFields,
      select: {
        timezone: true,
        workingHoursStart: true,
        workingHoursEnd: true,
        workingDays: true,
        preferredContactTime: true,
        autoResponseEnabled: true,
        responseDelayMinutes: true,
      }
    });

    return res.status(200).json({
      success: true,
      message: "Availability settings updated successfully",
      availability: updatedUser
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkAvailabilityStatus = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        timezone: true,
        workingHoursStart: true,
        workingHoursEnd: true,
        workingDays: true,
        preferredContactTime: true,
        isOnline: true,
        onlineAt: true,
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const timezone = user.timezone || "UTC";
    const now = new Date();
    const userTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = dayNames[userTime.getDay()];
    const currentTime = `${String(userTime.getHours()).padStart(2, '0')}:${String(userTime.getMinutes()).padStart(2, '0')}`;

    const workingDays = user.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const isWorkingDay = workingDays.includes(currentDay);

    const startTime = user.workingHoursStart || "09:00";
    const endTime = user.workingHoursEnd || "17:00";
    const isWithinWorkingHours = currentTime >= startTime && currentTime <= endTime;

    const status = {
      isAvailable: isWorkingDay && isWithinWorkingHours,
      isWorkingDay,
      isWithinWorkingHours,
      currentDay,
      currentTime,
      userTimezone: timezone,
      isOnline: user.isOnline,
      preferredContactTime: user.preferredContactTime || "business-hours",
    };

    return res.status(200).json({
      success: true,
      status
    });
  } catch (error) {
    console.error("Error checking availability status:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
