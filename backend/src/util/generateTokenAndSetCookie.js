import jwt from "jsonwebtoken";
import crypto from "crypto";

// Token creation page
export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

    res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

    return token;
};

// Remember Me token - generates secure token and sets httpOnly cookie
export const generateRememberTokenAndCookie = async (res, prisma, userId) => {
    // Generate secure token
    const rememberToken = crypto.randomBytes(64).toString("hex");
    
    // Set expiry: 30 days from now
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Save to database
    await prisma.user.update({
        where: { id: userId },
        data: {
            rememberToken,
            rememberTokenExpiresAt: expiresAt
        }
    });
    
    // Set httpOnly cookie - 30 days
    res.cookie("rememberMe", rememberToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    return rememberToken;
};

// Clear remember token and cookie
export const clearRememberTokenAndCookie = async (res, prisma, userId) => {
    // Clear database
    await prisma.user.update({
        where: { id: userId },
        data: {
            rememberToken: null,
            rememberTokenExpiresAt: null
        }
    });
    
    // Clear cookie
    res.clearCookie("rememberMe");
};

// Validate remember token from cookie
export const validateRememberToken = async (prisma, rememberToken) => {
    if (!rememberToken) return null;
    
    const user = await prisma.user.findFirst({
        where: {
            rememberToken: rememberToken,
            rememberTokenExpiresAt: { gt: new Date() }
        }
    });
    
    return user;
};