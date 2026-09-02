import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, X, Mail, Lock } from 'lucide-react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase.js'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'

const LoginModal = ({ open, onClose }) => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleGoogleAuth = async () => {
        try {
            setIsLoading(true)
            setError('')
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
            setError('Google login failed.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        try {
            setIsLoading(true)
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, formData)
            if (res.data.success) {
                dispatch(setUserData(res.data))
                onClose()
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed')
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
                    className='fixed inset-0 flex z-50 items-center justify-center bg-black/80 backdrop-blur-md px-4 font-sans'>
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
                            className="absolute inset-0 z-0 opacity-20 pointer-events-none rounded-3xl"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                                backgroundSize: '16px 16px'
                            }}
                        />

                        <button onClick={onClose} className='absolute top-5 right-5 z-20 text-zinc-500 hover:text-white transition'><X size={20} /></button>

                        <div className='relative z-10 pt-4 pb-2'>

                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-white/10 bg-white/5 rounded-full">
                                    <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                                    <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">
                                        WEBMAXER
                                    </span>
                                </div>

                                <h2 className='text-3xl font-extrabold tracking-tight leading-tight mb-2'>
                                    <span className='text-white'>Welcome Back</span>
                                </h2>
                                <p className='text-sm text-zinc-400 font-light mb-8'>Log in to your account to continue building.</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-4 mb-6">
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

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center disabled:opacity-50"
                                >
                                    {isLoading ? 'Logging in...' : 'Log In'}
                                </button>
                            </form>

                            <div className='flex items-center gap-4 my-6'>
                                <div className='h-px flex-1 bg-zinc-800' />
                                <span className='text-[10px] tracking-widest text-zinc-600 uppercase font-bold'>Or Secure Login</span>
                                <div className='h-px flex-1 bg-zinc-800' />
                            </div>

                            <motion.button
                                onClick={handleGoogleAuth}
                                disabled={isLoading}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                className={`group relative w-full h-12 bg-white text-black font-semibold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.02] transition-all ${isLoading ? "opacity-70 cursor-not-allowed scale-100 hover:scale-100" : ""}`}>
                                <div className='relative flex items-center justify-center gap-3'>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="" className='h-5 w-5' />
                                    Continue with Google
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            }
        </div>
    )
}

export default LoginModal