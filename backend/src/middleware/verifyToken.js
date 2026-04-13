import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

export const verifyToken = async (req, res, next) => {
	const token = req.cookies.token;
	const rememberMeToken = req.cookies.rememberMe;
	
	// Try JWT token first
	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			if (decoded) {
				req.userId = decoded.userId;
				return next();
			}
		} catch (error) {
			// Token invalid, try rememberMe cookie
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