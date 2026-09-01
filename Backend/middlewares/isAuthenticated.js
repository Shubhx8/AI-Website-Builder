import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                message: "Token not found"
            })
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Invalid Token"
        })
    }
}