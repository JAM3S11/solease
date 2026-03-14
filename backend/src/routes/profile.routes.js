//backend>src>routes>profile.routes.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getProfile, putProfile, uploadProfilePhoto, deleteProfilePhoto } from "../controllers/profile.controllers.js";
import { uploadProfilePhoto as uploadMiddleware } from "../middleware/uploadProfilePhoto.js";

const router = express.Router();

router.get("/get-profile", verifyToken, getProfile);
router.put("/put-profile", verifyToken, putProfile);
router.post("/upload-photo", verifyToken, uploadMiddleware, uploadProfilePhoto);
router.delete("/delete-photo", verifyToken, deleteProfilePhoto);

export default router;