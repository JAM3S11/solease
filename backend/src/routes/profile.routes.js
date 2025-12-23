//backend>src>routes>profile.routes.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getProfile, putProfile } from "../controllers/profile.controllers.js";

const router = express.Router();

router.get("/get-profile", verifyToken, getProfile);
router.put("/put-profile", verifyToken, putProfile);

export default router;