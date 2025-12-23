import express from "express";
import { submitContactForm } from "../controllers/contact.controllers.js";

const router = express.Router();

// Contact form router
router.post("/", submitContactForm)

export default router;