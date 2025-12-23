import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../util/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

export const signup = async (req, res) => {
    const { username, name, email, password } = req.body;

    try {
        //Check if the fields are empty
        if(!username || !name || !email || !password){
            throw new Error("All Fields are required for one to proceed");
        }

        // Check if user exists
        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);

        if(userAlreadyExists){
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        //Hashing a password
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        //Object for the user
        const user = new User({
            username,
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        //Save
        await user.save();

        //create a token
        generateTokenAndSetCookie(res, user._id);

        //Send verification to email
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
    } catch (error) {
        console.log("Error in sign up", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        //Get the user
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() } //greater than the current date
        });

        if(!user){
            return res.status(400).json({ 
                success: false, message: "Invalid or expired verification code" 
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        //Save the user operations
        await user.save();

        //Send a welcome email
        await sendWelcomeEmail(user.email, user.name);

        //return response
        res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
    } catch (error) {
        console.log("Error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		};

        if (user.status === "Pending") {
            return res.status(403).json({
              success: false,
              message: "Your account is awaiting admin approval"
            });
        }
          
        if (user.status === "Rejected") {
          return res.status(403).json({
            success: false,
            message: "Your account has been rejected"
          });
        }          

        //Check on the password validity
        const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

        generateTokenAndSetCookie(res, user._id);

        //Update last login
        user.lastLogin = new Date();
        
        //Save the login details
        await user.save();

        //Return thre response
        res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
    } catch (error) {
        console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        //Generate a reset jwt token
        const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        //Save
        await user.save();

        //Send email for forgot password
        await sendPasswordResetEmail(
            user.email, 
            `${process.env.CLIENT_URL}/reset-password/${resetToken}`
        );
        

        // Return response
        res.status(200).json({ 
            success: true, 
            message: "Password reset link sent to your email" 
        });
    } catch (error) {
        console.log("Error in the process of forgot password", error);
        throw new Error(`Error in the process of forgetting password ${error}`);
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: new Date() }
        });

        if(!user){
            return res.status(400).json({ 
                success: false, 
                message: "Invalid or expired reset token" 
            });
        }

        // update password
		const hashedPassword = await bcryptjs.hash(password, 10);

        // Update the following
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        //Save
        await user.save();

        //Send a successfull reset password email
        await sendResetSuccessEmail(user.email);

        // Return a response
        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
    }
}

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ 
                success: false, 
                message: "User not found" 
            });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};