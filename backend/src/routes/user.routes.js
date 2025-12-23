//backend>src>routes>user.routes.js
import express from "express";
import { protect } from "../middleware/authTicketTok.js";
import { getITSupportUsers } from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/get-it-support", protect, getITSupportUsers);

export default router;