import expres from "express";
import axios from "axios";
import { Octokit } from "@octokit/rest";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/user.model.js";

const router = expres.Router();

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const API_URL = process.env.VITE_API_URL || "http://localhost:5001";
const SOL_API = API_URL + "/sol";

// Generate JWT token
const generateToken = (user) => {
    const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
    return token;
};

// Send verification email for OAuth users
const sendVerificationEmail = async (user, verificationToken) => {
    const nodemailer = await import("nodemailer");
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD_APP
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Verify your SOLEASE email",
        html: `
            <h2>Welcome to SOLEASE!</h2>
            <p>Please verify your email address to complete your registration.</p>
            <p>Click the link below to verify:</p>
            <a href="${CLIENT_URL}/auth/verify-email?token=${verificationToken}">Verify Email</a>
            <p>This link expires in 24 hours.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

// Google OAuth - Redirect to Google
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

// Google OAuth Callback
router.get("/google/callback", async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.redirect(`${CLIENT_URL}/auth/login?error=google_auth_failed`);
    }
    
    try {
        // Exchange code for tokens
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `${API_URL}/api/auth/google/callback`
        });
        
        const { access_token } = tokenResponse.data;
        
        // Get user info from Google
        const userResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            { headers: { Authorization: `Bearer ${access_token}` } }
        );
        
        const { id: googleId, email, name, picture } = userResponse.data;
        
        // Check if user exists
        let user = await User.findOne({ email });
        
        let isNewUser = false;
        let verificationToken = null;
        
        if (!user) {
            // Create new user
            isNewUser = true;
            verificationToken = crypto.randomBytes(32).toString("hex");
            
            // Generate unique username
            const baseUsername = name?.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() || "user";
            let username = baseUsername;
            let counter = 1;
            
            while (await User.findOne({ username })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }
            
            user = new User({
                username,
                name: name || username,
                email,
                password: crypto.randomBytes(16).toString("hex"), // Random password for OAuth users
                googleId,
                oauthProvider: 'google',
                isVerified: false,
                verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                profilePhoto: picture
            });
            
            await user.save();
            
            // Send verification email
            await sendVerificationEmail(user, verificationToken);
        } else {
            // Link Google account if not already linked
            if (!user.googleId) {
                user.googleId = googleId;
                user.oauthProvider = user.oauthProvider || 'google';
                if (picture && !user.profilePhoto) {
                    user.profilePhoto = picture;
                }
                await user.save();
            }
        }
        
        // Generate JWT
        const token = generateToken(user);
        
        // Redirect to client with token
        if (isNewUser) {
            res.redirect(`${CLIENT_URL}/auth/verify-email?from=google&token=${token}`);
        } else if (!user.isVerified && user.verificationToken) {
            res.redirect(`${CLIENT_URL}/auth/verify-email?from=google&token=${token}`);
        } else {
            res.redirect(`${CLIENT_URL}/auth/login?token=${token}&provider=google`);
        }
        
    } catch (error) {
        console.error("Google OAuth Error:", error.response?.data || error.message);
        res.redirect(`${CLIENT_URL}/auth/login?error=google_auth_failed`);
    }
});

// GitHub OAuth - Redirect to GitHub
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

// GitHub OAuth Callback
router.get("/github/callback", async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.redirect(`${CLIENT_URL}/auth/login?error=github_auth_failed`);
    }
    
    try {
        // Exchange code for access token
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
        
        // Get user info from GitHub
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
        
        // Check if user exists
        let user = await User.findOne({ email });
        
        let isNewUser = false;
        let verificationToken = null;
        
        if (!user) {
            // Create new user
            isNewUser = true;
            verificationToken = crypto.randomBytes(32).toString("hex");
            
            const baseUsername = githubLogin || "user";
            let username = baseUsername;
            let counter = 1;
            
            while (await User.findOne({ username })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }
            
            user = new User({
                username,
                name: name || username,
                email,
                password: crypto.randomBytes(16).toString("hex"),
                githubId,
                oauthProvider: 'github',
                isVerified: false,
                verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                profilePhoto: avatar_url
            });
            
            await user.save();
            
            await sendVerificationEmail(user, verificationToken);
        } else {
            if (!user.githubId) {
                user.githubId = githubId;
                user.oauthProvider = user.oauthProvider || 'github';
                if (avatar_url && !user.profilePhoto) {
                    user.profilePhoto = avatar_url;
                }
                await user.save();
            }
        }
        
        const token = generateToken(user);
        
        if (isNewUser) {
            res.redirect(`${CLIENT_URL}/auth/verify-email?from=github&token=${token}`);
        } else if (!user.isVerified && user.verificationToken) {
            res.redirect(`${CLIENT_URL}/auth/verify-email?from=github&token=${token}`);
        } else {
            res.redirect(`${CLIENT_URL}/auth/login?token=${token}&provider=github`);
        }
        
    } catch (error) {
        console.error("GitHub OAuth Error:", error.response?.data || error.message);
        res.redirect(`${CLIENT_URL}/auth/login?error=github_auth_failed`);
    }
});

// Link OAuth account to existing user
router.post("/link/:provider", async (req, res) => {
    try {
        const { provider } = req.params;
        const { code, userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID required" });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let oauthId, oauthEmail, oauthName, oauthPhoto;
        
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
            oauthEmail = userResponse.data.email;
            oauthName = userResponse.data.name;
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
            
            const [userData] = await Promise.all([
                octokit.request("GET /user"),
                octokit.request("GET /user/emails")
            ]);
            
            oauthId = userData.data.id;
            oauthEmail = userData.data.emails?.[0]?.email;
            oauthName = userData.data.name;
            oauthPhoto = userData.data.avatar_url;
        }
        
        // Check if OAuth account is already linked to another user
        const existingUser = provider === 'google' 
            ? await User.findOne({ googleId: oauthId })
            : await User.findOne({ githubId: oauthId });
        
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ message: "This OAuth account is already linked to another user" });
        }
        
        // Link the account
        if (provider === 'google') {
            user.googleId = oauthId;
        } else {
            user.githubId = oauthId;
        }
        user.oauthProvider = user.oauthProvider || provider;
        if (oauthPhoto && !user.profilePhoto) {
            user.profilePhoto = oauthPhoto;
        }
        
        await user.save();
        
        res.json({ message: "OAuth account linked successfully" });
        
    } catch (error) {
        console.error("Link OAuth Error:", error);
        res.status(500).json({ message: "Failed to link OAuth account" });
    }
});

export default router;