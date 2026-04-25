import expres from "express";
import axios from "axios";
import { Octokit } from "@octokit/rest";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { OAUTH_VERIFICATION_EMAIL_TEMPLATE } from "../mailtrap/emailsTemplate.js";

const router = expres.Router();

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const API_URL = process.env.VITE_API_URL || "http://localhost:5001";
const SOL_API = API_URL + "/sol";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const generateToken = (user) => {
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch {
        return null;
    }
};

const sendVerificationEmail = async (user, verificationToken, provider) => {
    console.log("Sending OAuth verification email to:", user.email, "with token:", verificationToken?.substring(0, 10) + "...");
    
    const nodemailer = await import("nodemailer");
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD_APP
        }
    });

    const providerName = provider === 'google' ? 'Google' : 'GitHub';
    const verificationLink = `${CLIENT_URL}/auth/verify-email?from=${provider}&token=${verificationToken}`;
    
    console.log("Verification link created:", verificationLink);
    
    const emailHtml = OAUTH_VERIFICATION_EMAIL_TEMPLATE
        .replace('{verificationLink}', verificationLink);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Verify your SOLEASE account with ${providerName}`,
        html: emailHtml
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", user.email);
};

router.get("/google", (req, res) => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
        return res.status(500).json({ message: "Google OAuth not configured" });
    }
    
    const redirectUri = `${API_URL}/api/auth/google/callback`;
    const scope = "openid email profile";
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}` +
        `&access_type=offline` +
        `&prompt=consent`;
    
    res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.redirect(`${CLIENT_URL}/auth/login?error=google_auth_failed`);
    }
    
    try {
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `${API_URL}/api/auth/google/callback`
        });
        
        const { access_token } = tokenResponse.data;
        
        const userResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            { headers: { Authorization: `Bearer ${access_token}` } }
        );
        
        const { id: googleId, email, name, picture } = userResponse.data;
        
        let user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            const verificationToken = crypto.randomBytes(32).toString("hex");
            
            const baseUsername = name?.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() || "user";
            let username = baseUsername;
            let counter = 1;
            
            while (await prisma.user.findUnique({ where: { username } })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }
            
            // For OAuth, auto-verify since Google/GitHub already verified the email
            user = await prisma.user.create({
                data: {
                    username,
                    name: name || username,
                    email,
                    password: crypto.randomBytes(16).toString("hex"),
                    googleId,
                    oauthProvider: 'google',
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    verificationToken: null,
                    verificationTokenExpiresAt: null,
                    profilePhoto: picture
                }
            });
            
            console.log("Auto-verified Google OAuth user:", user.email);
            
            // User is already verified, log them in directly
            const token = generateToken(user);
            res.redirect(`${CLIENT_URL}/auth/login?token=${token}&provider=google&new_user=true`);
        } else {
            // Existing user - link Google account and auto-verify
            const wasNotVerified = !user.isVerified;
            
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    googleId,
                    oauthProvider: user.oauthProvider || 'google',
                    profilePhoto: user.profilePhoto || picture,
                    isVerified: true,
                    emailVerifiedAt: wasNotVerified ? new Date() : user.emailVerifiedAt,
                    verificationToken: null,
                    verificationTokenExpiresAt: null
                }
            });
            
            console.log("Linked Google account for existing user:", user.email, "wasVerified:", !wasNotVerified);
            
            const token = generateToken(user);
            res.redirect(`${CLIENT_URL}/auth/login?token=${token}&provider=google${wasNotVerified ? '&new_user=true' : ''}`);
        }
    } catch (error) {
        console.error("Google OAuth Error:", error.response?.data || error.message);
        res.redirect(`${CLIENT_URL}/auth/login?error=google_auth_failed`);
    }
});

router.get("/github", (req, res) => {
    const githubClientId = process.env.GITHUB_CLIENT_ID;
    if (!githubClientId) {
        return res.status(500).json({ message: "GitHub OAuth not configured" });
    }
    
    const redirectUri = `${API_URL}/api/auth/github/callback`;
    const scope = "user:email";
    
    const authUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${githubClientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent(scope)}`;
    
    res.redirect(authUrl);
});

router.get("/github/callback", async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.redirect(`${CLIENT_URL}/auth/login?error=github_auth_failed`);
    }
    
    try {
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            },
            { headers: { Accept: "application/json" } }
        );
        
        const accessToken = tokenResponse.data.access_token;
        
        if (!accessToken) {
            return res.redirect(`${CLIENT_URL}/auth/login?error=github_auth_failed`);
        }
        
        const octokit = new Octokit({ auth: accessToken });
        
        const [userData, emailsData] = await Promise.all([
            octokit.request("GET /user"),
            octokit.request("GET /user/emails")
        ]);
        
        const { id: githubId, login: githubLogin, name, avatar_url } = userData.data;
        const primaryEmail = emailsData.data.find(e => e.primary)?.email;
        const email = primaryEmail || emailsData.data[0]?.email;
        
        if (!email) {
            return res.redirect(`${CLIENT_URL}/auth/login?error=github_email_required`);
        }
        
        let user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            const verificationToken = crypto.randomBytes(32).toString("hex");
            
            const baseUsername = githubLogin || "user";
            let username = baseUsername;
            let counter = 1;
            
            while (await prisma.user.findUnique({ where: { username } })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }
            
            // For OAuth, auto-verify since GitHub already verified the email
            user = await prisma.user.create({
                data: {
                    username,
                    name: name || username,
                    email,
                    password: crypto.randomBytes(16).toString("hex"),
                    githubId,
                    oauthProvider: 'github',
                    isVerified: true,
                    emailVerifiedAt: new Date(),
                    verificationToken: null,
                    verificationTokenExpiresAt: null,
                    profilePhoto: avatar_url
                }
            });
            
            console.log("Auto-verified GitHub OAuth user:", user.email);
            
            const token = generateToken(user);
            res.redirect(`${CLIENT_URL}/auth/login?token=${token}&provider=github&new_user=true`);
} else {
            // Existing user - link GitHub account and auto-verify
            const wasNotVerified = !user.isVerified;
            
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    githubId,
                    oauthProvider: user.oauthProvider || 'github',
                    profilePhoto: user.profilePhoto || avatar_url,
                    isVerified: true,
                    emailVerifiedAt: wasNotVerified ? new Date() : user.emailVerifiedAt,
                    verificationToken: null,
                    verificationTokenExpiresAt: null
                }
            });
            
            console.log("Linked GitHub account for existing user:", user.email, "wasVerified:", !wasNotVerified);
            
            const token = generateToken(user);
            res.redirect(`${CLIENT_URL}/auth/login?token=${token}&provider=github${wasNotVerified ? '&new_user=true' : ''}`);
        }
    } catch (error) {
        console.error("GitHub OAuth Error:", error.response?.data || error.message);
        res.redirect(`${CLIENT_URL}/auth/login?error=github_auth_failed`);
    }
});

router.post("/link/:provider", async (req, res) => {
    try {
        const { provider } = req.params;
        const { code, userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID required" });
        }
        
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let oauthId, oauthPhoto;
        
        if (provider === 'google') {
            const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_uri: `${API_URL}/api/auth/google/callback`
            });
            
            const userResponse = await axios.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                { headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` } }
            );
            
            oauthId = userResponse.data.id;
            oauthPhoto = userResponse.data.picture;
        } else if (provider === 'github') {
            const tokenResponse = await axios.post(
                "https://github.com/login/oauth/access_token",
                {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code
                },
                { headers: { Accept: "application/json" } }
            );
            
            const octokit = new Octokit({ auth: tokenResponse.data.access_token });
            const [userData] = await Promise.all([octokit.request("GET /user")]);
            
            oauthId = userData.data.id;
            oauthPhoto = userData.data.avatar_url;
        }
        
        const existingUser = provider === 'google' 
            ? await prisma.user.findFirst({ where: { googleId: oauthId, NOT: { id: userId } } })
            : await prisma.user.findFirst({ where: { githubId: oauthId, NOT: { id: userId } } });
        
        if (existingUser) {
            return res.status(400).json({ message: "This OAuth account is already linked to another user" });
        }
        
        if (provider === 'google') {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    googleId: oauthId,
                    oauthProvider: user.oauthProvider || provider,
                    profilePhoto: user.profilePhoto || oauthPhoto
                }
            });
        } else {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    githubId: oauthId,
                    oauthProvider: user.oauthProvider || provider,
                    profilePhoto: user.profilePhoto || oauthPhoto
                }
            });
        }
        
        res.json({ message: "OAuth account linked successfully" });
        
    } catch (error) {
        console.error("Link OAuth Error:", error);
        res.status(500).json({ message: "Failed to link OAuth account" });
    }
});

router.post("/verify-oauth-token", async (req, res) => {
    try {
        const { token } = req.body;
        
        console.log("OAuth Verify Token Request:", { 
            tokenProvided: !!token, 
            tokenLength: token?.length,
            tokenPrefix: token?.substring(0, 10) + "...",
            expiresAtCheck: new Date() 
        });
        
        if (!token) {
            return res.status(400).json({ message: "Verification token is required" });
        }
        
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpiresAt: { gt: new Date() }
            }
        });
        
        console.log("OAuth Verify - Found user:", user ? { 
            id: user.id, 
            email: user.email, 
            verificationToken: user.verificationToken?.substring(0, 10) + "...",
            verificationTokenExpiresAt: user.verificationTokenExpiresAt 
        } : "NO USER FOUND - checking all recent users");
        
        if (!user) {
            // Debug: check if token exists but expired
            const anyUserWithToken = await prisma.user.findFirst({
                where: { verificationToken: token }
            });
            if (anyUserWithToken) {
                console.log("Token found but expired:", anyUserWithToken.verificationTokenExpiresAt);
            }
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }
        
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                emailVerifiedAt: new Date(),
                verificationToken: null,
                verificationTokenExpiresAt: null
            }
        });
        
        const newToken = generateToken(updatedUser);
        
        res.json({ 
            message: "Email verified successfully",
            token: newToken,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                name: updatedUser.name,
                profilePhoto: updatedUser.profilePhoto
            }
        });
        
    } catch (error) {
        console.error("Verify OAuth Token Error:", error);
        res.status(500).json({ message: "Failed to verify email" });
    }
});

export default router;
