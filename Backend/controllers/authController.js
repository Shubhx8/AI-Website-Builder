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