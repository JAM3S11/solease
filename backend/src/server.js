import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { connectDB } from "./config/db.js"
import { createDefaultManager } from "./config/seedManager.js";
import authRoutes from "./routes/auth.routes.js"
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import personalNoteRoutes from "./routes/personalNote.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import oauthRoutes from "./routes/oauth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"];
app.use(cors({ 
    origin: allowedOrigins, 
    credentials: true 
}));
  

app.use(express.json({ limit: "50mb" })); // middleware for :req.body - increased for image uploads
app.use(express.urlencoded({ extended: true, limit: "50mb" })) // 👈 parses form data
app.use(cookieParser()); // allows us to parse incoming cookies

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/sol/contact", contactRoutes);

app.use("/sol/auth", authRoutes);

app.use("/sol/admin", adminRoutes);

app.use("/sol/ticket", ticketRoutes);

app.use("/sol/user", userRoutes);

app.use("/sol/profile", profileRoutes);

app.use("/sol/notifications", notificationRoutes);

app.use("/sol/personal-notes", personalNoteRoutes);

app.use("/sol/subscribe", subscriptionRoutes);

app.use("/sol/ai", aiRoutes);

app.use("/api/auth", oauthRoutes);

connectDB().then(async () => {
    await createDefaultManager();
    app.listen(PORT, () => {
        console.log("Server started on port", PORT);
    });
});