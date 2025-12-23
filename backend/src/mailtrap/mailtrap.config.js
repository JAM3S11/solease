import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Nodemailer transporter for Gmail
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,     // Your Gmail address
    pass: process.env.EMAIL_PASSWORD_APP,     // Your App Password
  },
});

// Default sender details
export const sender = {
  email: process.env.EMAIL_USER,
  name: "SolEase Support",
};
