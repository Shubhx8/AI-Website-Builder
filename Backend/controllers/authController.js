import { User } from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendOTP } from '../utils/sendEmail.js'

export const googleAuth = async (req, res) => {
    try {
        const { name, email, avatar } = req.body
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, avatar, isVerified: true })
        } else {
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" })
        return res.status(200).json({ ...user._doc, token })
    }
    catch (error) {
        console.error("Auth Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const logoutUser = async (req, res) => {
    try {
        return res.status(200).json({ message: "User Logout Successfully" })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                return res.status(400).json({ success: false, message: "User already exists with this email" });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

        if (existingUser && !existingUser.isVerified) {
             existingUser.name = name;
             existingUser.password = hashedPassword;
             existingUser.otp = otp;
             existingUser.otpExpires = otpExpires;
             await existingUser.save();
        } else {
             await User.create({
                 name,
                 email,
                 password: hashedPassword,
                 otp,
                 otpExpires,
                 isVerified: false
             });
        }

        const emailSent = await sendOTP(email, otp);
        if (!emailSent) {
            return res.status(500).json({ success: false, message: "Failed to send OTP email. Please try again." });
        }

        return res.status(201).json({ success: true, message: "OTP sent successfully to email" });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        if (user.isVerified) return res.status(400).json({ success: false, message: "User is already verified" });
        if (user.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
        if (Date.now() > user.otpExpires) return res.status(400).json({ success: false, message: "OTP has expired" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
        return res.status(200).json({ success: true, ...user._doc, token });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.isVerified) return res.status(400).json({ success: false, message: "User is already verified" });

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const emailSent = await sendOTP(email, otp);
        if (!emailSent) return res.status(500).json({ success: false, message: "Failed to send OTP email." });

        return res.status(200).json({ success: true, message: "OTP resent successfully" });

    } catch (error) {
        console.error("Resend OTP Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "Invalid email or password" });

        if (!user.isVerified) return res.status(403).json({ success: false, message: "Please verify your email first", notVerified: true });

        if (!user.password) {
            return res.status(400).json({ success: false, message: "This account uses Google Login. Please sign in with Google." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
        return res.status(200).json({ success: true, ...user._doc, token });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}