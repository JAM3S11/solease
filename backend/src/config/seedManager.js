import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

//Default manager created
export async function createDefaultManager() {
  try {
    const existingManager = await User.findOne({ role: "Manager" });
    if (existingManager) {
      console.log("✅ Default Manager already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const manager = new User({
      username: "adminManager",
      name: "System Manager",
      email: "juniorjames324@gmail.com",
      password: hashedPassword,
      role: "Manager",
      status: "Active",
      isVerified: true,
      verificationToken: undefined,
      verificationTokenExpiresAt: undefined,
    });

    await manager.save();
    console.log("Default Manager created successfully");
  } catch (error) {
    console.error("Error creating default Manager:", error);
    throw new Error(`Error creating default Manager: ${error}`);
    
  }
}
