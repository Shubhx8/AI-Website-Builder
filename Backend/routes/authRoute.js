import express from 'express';
import { googleAuth, logoutUser, registerUser, verifyOtp, resendOtp, loginUser } from '../controllers/authController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 requests per windowMs
    message: { success: false, message: "Too many requests, please try again later." }
});

router.post('/google', googleAuth)
router.get('/logout', logoutUser)

// New email/password and OTP routes
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/verify-otp', otpLimiter, verifyOtp)
router.post('/resend-otp', otpLimiter, resendOtp)

export default router;