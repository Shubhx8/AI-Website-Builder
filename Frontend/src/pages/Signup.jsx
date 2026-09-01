import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase.js'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

const Signup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleAuth = async () => {
        try {
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
        }
    }

    return (
        <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col">
            <Navbar />
            
            {/* Glow background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px]" />
            </div>

            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, #ffffff15 1px, transparent 1px), linear-gradient(to bottom, #ffffff15 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="flex-1 flex items-center justify-center relative z-10 px-4 mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-px rounded-3xl bg-linear-to-br from-indigo-500/40 via-purple-500/30 to-transparent"
                >
                    <div className="relative rounded-3xl bg-[#0b0b0b] border border-white/10 p-8 sm:p-12 shadow-2xl">
                        <button onClick={() => navigate("/")} className='absolute top-5 left-5 text-zinc-400 hover:text-white transition flex items-center gap-1 text-sm'><ArrowLeft size={16}/> Back</button>
                        
                        <div className="text-center mt-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-gray-300">
                                    Join WEBMAXER Today
                                </span>
                            </div>
                            
                            <h2 className="text-3xl font-bold mb-4">
                                Start Building for <span className="bg-linear-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Free</span>
                            </h2>
                            <p className="text-zinc-400 mb-8 text-sm">
                                Create stunning, responsive websites in seconds using the power of AI. No credit card required.
                            </p>

                            <motion.button
                                onClick={handleGoogleAuth}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className='group relative w-full h-14 rounded-xl bg-white text-black font-semibold shadow-xl overflow-hidden'
                            >
                                <div className='relative flex items-center justify-center gap-3'>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="Google" className='h-5 w-5' />
                                    Sign up with Google
                                </div>
                            </motion.button>

                            <div className='flex items-center gap-4 my-8'>
                                <div className='h-px flex-1 bg-white/10' />
                                <span className='text-xs tracking-tight text-zinc-500'>Secure Authentication</span>
                                <div className='h-px flex-1 bg-white/10' />
                            </div>

                            <p className="text-sm text-zinc-400">
                                Already have an account?{" "}
                                <button onClick={() => navigate('/')} className="text-white hover:text-purple-400 font-semibold transition">
                                    Log in instead
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Signup
