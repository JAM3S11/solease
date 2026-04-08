import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function createDefaultManager() {
  try {
    const existingManager = await prisma.user.findFirst({ where: { role: "MANAGER" } });
    if (existingManager) {
      console.log("✅ Default Manager already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const manager = await prisma.user.create({
      data: {
        username: "adminManager",
        name: "System Manager",
        email: "juniorjames324@gmail.com",
        password: hashedPassword,
        role: "MANAGER",
        status: "ACTIVE",
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        planTier: "ENTERPRISE"
      }
    });

    console.log("Default Manager created successfully");
  } catch (error) {
    console.error("Error creating default Manager:", error);
    throw new Error(`Error creating default Manager: ${error}`);
  }
}
