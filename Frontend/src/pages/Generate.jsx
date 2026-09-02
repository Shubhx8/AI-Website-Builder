import { ArrowLeft, Terminal } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const PHASES = [
    "Analyzing your request...",
    "Designing layout and structure...",
    "Writing code...",
    "Adding styling and interactions...",
    "Finalizing website..."
]

const Generate = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const [prompt, setPrompt] = useState(location.state?.initialPrompt || "")
    const hasStarted = useRef(false)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")
    const { userData } = useSelector(state => state.user)

    const handleGenerateWebsite = async () => {

        try {

            setLoading(true)

            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/website/generate`,
                { prompt },
                { withCredentials: true }
            )

            setProgress(100)
            console.log(res)
            dispatch(setUserData({ ...userData, credits: res.data.remainingCredits }))
            navigate(`/editor/${res.data.websiteId}`)

        } catch (error) {

            setError(error.response?.data?.message || "Something went wrong")

        } finally {

            setLoading(false)

        }

    }

    useEffect(() => {
        if (location.state?.autoStart && prompt && !hasStarted.current) {
            hasStarted.current = true;
            handleGenerateWebsite();
            window.history.replaceState({}, document.title);
        }
    }, [location.state, prompt]);

    useEffect(() => {

        if (!loading) {
            setPhaseIndex(0)
            setProgress(0)
            return
        }

        let value = 0
        let phase = 0

        const interval = setInterval(() => {

            const increment =
                value < 20
                    ? Math.random() * 1.5
                    : value < 60
                        ? Math.random() * 1.2
                        : Math.random() * 0.6

            value += increment

            if (value >= 93) value = 93

            phase = Math.min(
                Math.floor((value / 100) * PHASES.length),
                PHASES.length - 1
            )

            setProgress(Math.floor(value))
            setPhaseIndex(phase)

        }, 1200)

        return () => clearInterval(interval)

    }, [loading])

    return (

        <div className='relative min-h-screen bg-[#09090b] text-white overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200'>

            {/* Ambient Glow Background */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/15 to-emerald-500/15 blur-[120px] rounded-[100%] pointer-events-none z-0"></div>

            {/* Cyber Grid Background */}
            <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }}
            />

            {/* header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#09090b]/80 border-b border-zinc-800">

                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => navigate("/")}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        >
                            <ArrowLeft size={16} />
                        </button>

                        <h1 className="text-sm font-bold tracking-widest uppercase">WEBMAXER</h1>

                    </div>

                </div>

            </div>

            <div className='max-w-4xl mx-auto px-6 py-16 relative z-10'>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-12'
                >

                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-full">
                        <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">
                            AI ENGINE READY
                        </span>
                    </div>

                    <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight mb-4'>
                        Generate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Website</span>
                    </h1>

                    <p className='text-zinc-400 font-mono text-xs uppercase tracking-widest'>
                        Describe your vision in detail, and our AI will build a complete website in seconds.
                    </p>

                </motion.div>

                <div className='mb-10'>

                    <h1 className='text-sm font-bold tracking-widest uppercase text-zinc-300 mb-3'>
                        Website Description
                    </h1>

                    <div className='relative'>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className='w-full h-56 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 outline-none resize-none font-mono text-sm leading-relaxed focus:border-cyan-500/50 focus:bg-white/10 transition-colors placeholder:text-zinc-500 text-zinc-200 shadow-xl'
                            placeholder='Describe your website in detail...'
                        />

                    </div>

                    {error && (
                        <p className='mt-4 text-xs font-mono text-red-500 uppercase tracking-widest bg-red-500/10 border border-red-500/30 p-3 text-center'>
                            {error}
                        </p>
                    )}

                </div>

                <div className='flex justify-center'>

                    <motion.button
                        onClick={handleGenerateWebsite}
                        whileTap={{ scale: 0.98 }}
                        disabled={!prompt.trim() || loading}
                        className={`px-12 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-lg
                        ${prompt.trim() && !loading
                                ? "bg-white text-black hover:scale-105"
                                : "bg-white/5 text-zinc-500 cursor-not-allowed border border-white/10 backdrop-blur-md"
                            }`}
                    >

                        {loading ? "Generating Website..." : "Generate Website"}

                    </motion.button>

                </div>

                {loading && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='max-w-xl mx-auto mt-16 p-6 border border-blue-500/30 bg-blue-500/5 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(217,70,239,0.15)] relative overflow-hidden'
                    >

                        <div className='flex justify-between mb-3 text-xs font-mono tracking-widest uppercase relative z-10'>
                            <span className="text-blue-400">{PHASES[phaseIndex]}</span>
                            <span className="text-white">{progress}%</span>
                        </div>

                        <div className='h-1.5 w-full bg-white/10 overflow-hidden relative rounded-full z-10'>

                            <motion.div
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut", duration: 0.8 }}
                                className='absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_10px_rgba(217,70,239,0.8)]'
                            />

                        </div>

                        <div className='text-center text-xs font-mono tracking-widest uppercase text-zinc-500 mt-6 flex items-center justify-center gap-2'>
                            <div className="w-2 h-2 bg-zinc-500 animate-pulse rounded-full" />
                            Estimated time remaining: <span className='text-zinc-300'>~1-2 MINUTES</span>
                        </div>

                    </motion.div>

                )}

            </div>

        </div>
    )
}

export default Generate
