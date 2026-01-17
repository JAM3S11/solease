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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
    app.use(cors({ 
        origin: "http://localhost:5173", 
        credentials: true 
    }));
}
  

app.use(express.json()); // middleware for :req.body
app.use(express.urlencoded({ extended: true })) // 👈 parses form data
app.use(cookieParser()); // allows us to parse incoming cookies

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/sol/contact", contactRoutes);

app.use("/sol/auth", authRoutes);

app.use("/sol/admin", adminRoutes);

app.use("/sol/ticket", ticketRoutes);

app.use("/sol/user", userRoutes);

app.use("/sol/profile", profileRoutes);

connectDB().then(async () => {
    await createDefaultManager();
    app.listen(PORT, () => {
        console.log("Server started on port", PORT);
    });
});