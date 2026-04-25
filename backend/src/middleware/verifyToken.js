import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const verifyToken = async (req, res, next) => {
	console.log("verifyToken - headers:", req.headers.authorization?.substring(0, 30) + "...");
	console.log("verifyToken - cookies:", req.cookies);
	
	const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
	const rememberMeToken = req.cookies.rememberMe;
	
	console.log("verifyToken - token:", token?.substring(0, 30) + "...");
	
	// Try JWT token first (from cookie or Authorization header)
	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log("verifyToken - decoded:", decoded);
			if (decoded) {
				req.userId = decoded.userId;
				return next();
			}
		} catch (error) {
			console.log("Token verification failed:", error.message);
		}
	}
	
	// Try rememberMe cookie as fallback
	if (rememberMeToken) {
		try {
			const user = await prisma.user.findFirst({
				where: {
					rememberToken: rememberMeToken,
					rememberTokenExpiresAt: { gt: new Date() }
				}
			});
			
			if (user) {
				// Regenerate JWT token for the user
				const newToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
					expiresIn: "7d",
				});
				
				res.cookie("token", newToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: 7 * 24 * 60 * 60 * 1000,
				});
				
				req.userId = user.id;
				return next();
			}
		} catch (error) {
			console.log("Error in verifyToken with rememberMe ", error);
		}
	}
	
	return res.status(401).json({ 
        success: false, 
        message: "Unauthorized - no token provided" 
    });
};