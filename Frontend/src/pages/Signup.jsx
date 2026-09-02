import React from 'react'
import { motion } from 'framer-motion'
import { Terminal, ArrowLeft } from 'lucide-react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase.js'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LoginModal from '../components/LoginModal'

const Signup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = React.useState(false)
    const [openLogin, setOpenLogin] = React.useState(false)

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
        } finally {
            setIsLoading(false)
        }
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

            <div className="flex-1 flex items-center justify-center relative z-10 px-4 mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md p-8 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl"
                >
                    <div className="relative">
                        <button onClick={() => navigate("/")} className='absolute -top-4 -left-4 text-zinc-400 hover:text-white transition flex items-center gap-1 text-xs uppercase tracking-widest font-bold'><ArrowLeft size={14} /> Back</button>

                        <div className="text-center mt-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-white/10 bg-white/5 rounded-full">
                                <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                                <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">
                                    JOIN WEBMAXER
                                </span>
                            </div>

                            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                                Start Building for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Free</span>
                            </h2>
                            <p className="text-zinc-400 mb-8 text-sm font-light">
                                Create stunning websites in seconds using AI. No credit card required.
                            </p>

                            <motion.button
                                onClick={handleGoogleAuth}
                                disabled={isLoading}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className={`group relative w-full h-12 bg-white text-black font-semibold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-105 transition-all ${isLoading ? "opacity-70 cursor-not-allowed scale-100 hover:scale-100" : ""}`}
                            >
                                <div className='relative flex items-center justify-center gap-3'>
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            Signing up...
                                        </div>
                                    ) : (
                                        <>
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="Google" className='h-5 w-5' />
                                            Sign up with Google
                                        </>
                                    )}
                                </div>
                            </motion.button>

                            <div className='flex items-center gap-4 my-8'>
                                <div className='h-px flex-1 bg-white/10' />
                                <span className='text-[10px] tracking-widest text-zinc-500 uppercase font-bold'>Secure Authentication</span>
                                <div className='h-px flex-1 bg-white/10' />
                            </div>

                            <p className="text-sm text-zinc-400 font-light">
                                Already have an account?{" "}
                                <button onClick={() => setOpenLogin(true)} className="text-white hover:text-cyan-400 font-bold transition">
                                    Log in instead
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {openLogin && (
                <LoginModal
                    open={openLogin}
                    onClose={() => setOpenLogin(false)}
                />
            )}
        </div>
    )
}

export default Signup
