import { User } from "../models/userModel.js"
import jwt from 'jsonwebtoken'
export const googleAuth = async (req, res) => {
    try {
        const { name, email, avatar } = req.body
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, avatar })
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" })
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)
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
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
        })
        return res.status(200).json({ message: "User Logout Successfully" })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}