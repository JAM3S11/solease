//backend>src>routes>user.routes.js
import express from "express";
import { protect } from "../middleware/authTicketTok.js";
import { getITSupportUsers, getReviewers } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/get-it-support", protect, getITSupportUsers);
router.get("/get-reviewers", protect, getReviewers);

export default router;