import express from "express";
import { sendSubscriptionConfirmationEmail } from "../mailtrap/emails.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    await sendSubscriptionConfirmationEmail(email);

    return res.status(200).json({ 
      message: "Successfully subscribed! Check your email for confirmation." 
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return res.status(500).json({ message: "Failed to subscribe. Please try again." });
  }
});

export default router;