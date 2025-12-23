// controllers/profile.controller.js
import { User } from "../models/user.model.js";
import { ContactUserProfile } from "../models/contactuser.model.js";

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