import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, ArrowLeft, Mail, Lock, User as UserIcon, CheckCircle2 } from 'lucide-react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase.js'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Signup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [view, setView] = useState('register') // 'register' | 'verify'
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // Registration State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    // Verification State
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
    const otpRefs = useRef([])

    // Timer effect
    useEffect(() => {
        if (view === 'verify' && timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
            return () => clearInterval(timerId)
        }
    }, [view, timeLeft])

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    const handleGoogleAuth = async () => {
        try {
            setIsLoading(true)
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL
            }, { withCredentials: true })
            dispatch(setUserData(data))
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
            setError('Google sign up failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')
        
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match')
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters')
        }

        try {
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
            if (res.data.success) {
                setView('verify')
                setTimeLeft(600)
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async () => {
        const otpString = otp.join('')
        if (otpString.length < 6) {
            return setError('Please enter the full 6-digit code')
        }

        try {
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/verify-otp`, {
                email: formData.email,
                otp: otpString
            })
            if (res.data.success) {
                dispatch(setUserData(res.data))
                navigate('/dashboard')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Verification failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async () => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/resend-otp`, {
                email: formData.email
            })
            if (res.data.success) {
                setTimeLeft(600)
                setError('')
                setOtp(['', '', '', '', '', ''])
                otpRefs.current[0].focus()
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend OTP')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.substring(value.length - 1)
        setOtp(newOtp)

        if (value && index < 5) {
            otpRefs.current[index + 1].focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus()
        } else if (e.key === 'Enter') {
            handleVerify()
        }
    }

    const handleOtpPaste = (e) => {
        e.preventDefault()
        const pasteData = e.clipboardData.getData('text/plain').slice(0, 6).split('')
        if (pasteData.some(isNaN)) return
        const newOtp = [...otp]
        pasteData.forEach((char, i) => {
            newOtp[i] = char
        })
        setOtp(newOtp)
        
        const lastFilledIndex = Math.min(pasteData.length - 1, 5)
        otpRefs.current[lastFilledIndex].focus()
    }

    return (
        <div className="relative min-h-screen bg-[#09090b] text-white overflow-hidden flex flex-col font-sans">
            <Navbar />

            {/* Ambient Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-emerald-500/15 blur-[120px] rounded-[100%] pointer-events-none z-0"></div>

            {/* Cyber Grid Background */}
            <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '16px 16px'
                }}
            />

            <div className="flex-1 flex items-center justify-center relative z-10 px-4 mt-20 py-10">
                <AnimatePresence mode="wait">
                    {view === 'register' ? (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-md p-8 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl"
                        >
                            <div className="relative">
                                <button onClick={() => navigate("/")} className='absolute -top-4 -left-4 text-zinc-400 hover:text-white transition flex items-center gap-1 text-xs uppercase tracking-widest font-bold'><ArrowLeft size={14} /> Back</button>

                                <div className="text-center mt-6 mb-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/10 bg-white/5 rounded-full">
                                        <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                                        <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">
                                            JOIN WEBMAXER
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                                        Start Building for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Free</span>
                                    </h2>
                                </div>

                                {error && (
                                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                                        <input 
                                            type="text" 
                                            placeholder="Username" 
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                                        <input 
                                            type="email" 
                                            placeholder="Email Address" 
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                                        <input 
                                            type="password" 
                                            placeholder="Password" 
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                                        <input 
                                            type="password" 
                                            placeholder="Confirm Password" 
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50 transition-colors"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center disabled:opacity-50"
                                    >
                                        {isLoading ? 'Processing...' : 'Create Account'}
                                    </button>
                                </form>

                                <p className="mt-5 text-center text-zinc-400 text-sm">
                                    Already have an account? <span onClick={() => document.getElementById('navbar-login-btn')?.click()} className="text-cyan-400 font-semibold hover:underline cursor-pointer">Sign in</span>
                                </p>

                                <div className='flex items-center gap-4 my-6'>
                                    <div className='h-px flex-1 bg-zinc-800' />
                                    <span className='text-[10px] tracking-widest text-zinc-600 uppercase font-bold'>Or continue with</span>
                                    <div className='h-px flex-1 bg-zinc-800' />
                                </div>

                                <motion.button
                                    onClick={handleGoogleAuth}
                                    disabled={isLoading}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                    className={`group relative w-full h-12 bg-white text-black font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-zinc-100 transition-all ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    <div className='relative flex items-center justify-center gap-3'>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="Google" className='h-5 w-5' />
                                        Sign up with Google
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="verify"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full max-w-md p-10 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl"
                        >
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                                    <Mail className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h2 className="text-3xl font-extrabold tracking-tight mb-3">Check your email</h2>
                                <p className="text-zinc-400 text-sm font-light mb-8 px-4">
                                    We sent a verification code to <br/>
                                    <span className="text-white font-medium">{formData.email}</span>
                                </p>
                                
                                {error && (
                                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                {/* OTP Inputs */}
                                <div className="flex justify-center gap-3 mb-8" onPaste={handleOtpPaste}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={el => otpRefs.current[index] = el}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold text-white shadow-inner focus:bg-white/10 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                        />
                                    ))}
                                </div>

                                <button 
                                    onClick={handleVerify}
                                    disabled={isLoading || otp.join('').length < 6}
                                    className="w-full h-12 mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Verifying...' : (
                                        <>Verify Account <CheckCircle2 size={18} /></>
                                    )}
                                </button>

                                <div className="text-sm">
                                    {timeLeft > 0 ? (
                                        <p className="text-zinc-500">
                                            Code expires in <span className="font-mono text-cyan-400">{formatTime(timeLeft)}</span>
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-red-400/80">Verification code expired</p>
                                            <button 
                                                onClick={handleResendOtp}
                                                disabled={isLoading}
                                                className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4 transition"
                                            >
                                                Send new code
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={() => setView('register')}
                                    className="mt-8 text-xs text-zinc-500 hover:text-white transition flex items-center justify-center gap-1 mx-auto"
                                >
                                    <ArrowLeft size={12} /> Use a different email
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default Signup
