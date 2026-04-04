import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const submitContactForm = async (req, res) => {
    const { fullName, email, message } = req.body;

    try {
        if(!fullName || !email || !message){
            throw new Error("All Fields are required for one to proceed");
        };

        const contactUs = await prisma.contactUs.create({
            data: {
                fullName,
                email,
                message,
            }
        });

        res.status(200).json({
            success: true,
            message: "Thank you for reach out to us!",
            data: contactUs,
        })
    } catch (error) {
        console.log("Error is filling the contact us page", error);
        res.status(400).json({ success: false, message: error.message });
    }
}
