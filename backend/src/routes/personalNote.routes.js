import express from "express";
import { protect } from "../middleware/authTicketTok.js";
import { 
    createPersonalNote, 
    getPersonalNotes, 
    updatePersonalNote, 
    deletePersonalNote,
    sharePersonalNote,
    unsharePersonalNote 
} from "../controllers/personalNote.controllers.js";

const router = express.Router();

router.use(protect);

router.post("/", createPersonalNote);
router.get("/", getPersonalNotes);
router.put("/:id", updatePersonalNote);
router.delete("/:id", deletePersonalNote);
router.put("/:id/share", sharePersonalNote);
router.put("/:id/unshare", unsharePersonalNote);

export default router;