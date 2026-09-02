import React from 'react'
import { motion } from 'motion/react'
import { Terminal, X } from 'lucide-react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase.js'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'

const LoginModal = ({ open, onClose }) => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = React.useState(false)

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
            onClose()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            {open &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className='fixed inset-0 flex z-100 items-center justify-center bg-black/80 backdrop-blur-md px-4 font-sans'>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className='relative w-full max-w-md p-8 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Cyber Grid Background */}
                        <div
                            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                                backgroundSize: '16px 16px'
                            }}
                        />

                        <button onClick={onClose} className='absolute top-5 right-5 z-20 text-zinc-500 hover:text-white transition'><X size={20} /></button>

                        <div className='relative z-10 text-center pt-4 pb-2'>

                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-white/10 bg-white/5 rounded-full"
                            >
                                <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                                <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">
                                    WEBMAXER
                                </span>
                            </div>

                            <h2 className='text-3xl font-extrabold tracking-tight leading-tight mb-2'>
                                <span className='text-white'>Welcome Back</span>
                            </h2>
                            <p className='text-sm text-zinc-400 font-light mb-8'>Log in to your account to continue building.</p>

                            <motion.button
                                onClick={handleGoogleAuth}
                                disabled={isLoading}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className={`group relative w-full h-12 bg-white text-black font-semibold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 transition-all ${isLoading ? "opacity-70 cursor-not-allowed scale-100 hover:scale-100" : ""}`}>
                                <div className='relative flex items-center justify-center gap-3'>
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            Logging in...
                                        </div>
                                    ) : (
                                        <>
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="" className='h-5 w-5' />
                                            Continue with Google
                                        </>
                                    )}
                                </div>
                            </motion.button>

                            <div className='flex items-center gap-4 my-8'>
                                <div className='h-px flex-1 bg-zinc-800' />
                                <span className='text-[10px] tracking-widest text-zinc-600 uppercase font-bold'>Secure Login</span>
                                <div className='h-px flex-1 bg-zinc-800' />
                            </div>

                            <p className='text-xs text-zinc-500 leading-relaxed font-light'>
                                By continuing, you agree to our{" "}
                                <span className='underline cursor-pointer hover:text-zinc-300'>Terms of Service</span>{" "}
                                and{" "}
                                <span className='underline cursor-pointer hover:text-zinc-300'>Privacy Policy</span>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            }
        </div>
    )
}

export default LoginModal