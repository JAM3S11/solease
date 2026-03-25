import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("📧 Loading email configuration...");
console.log("  EMAIL_USER:", process.env.EMAIL_USER ? `${process.env.EMAIL_USER.substring(0, 3)}***@${process.env.EMAIL_USER.split('@')[1]}` : "NOT SET");
console.log("  EMAIL_PASSWORD_APP:", process.env.EMAIL_PASSWORD_APP ? "✅ Loaded (length: " + process.env.EMAIL_PASSWORD_APP.length + ")" : "❌ NOT SET");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD_APP,
  },
  connectionTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("📧 Transporter verification FAILED:", error.message);
    console.log("  Error code:", error.code);
    console.log("  Error errno:", error.errno);
    console.log("  Error syscall:", error.syscall);
  } else {
    console.log("📧 Transporter verified successfully!");
  }
});

console.log("📧 Email transporter created with host: smtp.gmail.com, port: 587");

export const sender = {
  email: process.env.EMAIL_USER,
  name: "SolEase Support",
};

console.log("📧 Sender config:", sender);