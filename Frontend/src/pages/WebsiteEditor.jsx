import axios from 'axios'
import { Code2, MessageSquare, Monitor, Rocket, Send, X, Terminal } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react';

const WebsiteEditor = () => {
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const { id } = useParams()
    const iframeRef = useRef(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const thinkingSteps = [
        "Analyzing your request...",
        "Designing layout changes...",
        "Optimizing responsiveness...",
        "Applying updates...",
        "Finalizing code..."
    ]

    const handleDeploy = async (id) => {
        try {
            const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${website._id}`, { withCredentials: true })
            window.open(`${result.data.url}`, "_blank")

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % thinkingSteps.length)
        }, 1200)
        return () => clearInterval(intervalId)
    }, [updateLoading])

    const handleUpdate = async () => {
        setMessages((m) => [...m, { role: "user", content: prompt }])
        setUpdateLoading(true)
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/website/update/${id}`, { prompt }, { withCredentials: true })
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
        } catch (error) {
            console.log(error)
        } finally {
            setUpdateLoading(false)
            setPrompt("")
        }
    }

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/getbyid/${id}`, { withCredentials: true })
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load website")
                console.log(error)
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return;
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return () => URL.revokeObjectURL(url)
    }, [code])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-[#09090b] font-mono text-red-500 uppercase tracking-widest'>{error}</div>
        )
    }
    if (!website) {
        return (
            <div className='h-screen w-screen flex bg-[#09090b] text-white overflow-hidden font-sans'>
                {/* Sidebar Skeleton */}
                <aside className='hidden lg:flex w-95 flex-col border-r border-zinc-800 bg-[#09090b]'>
                    {/* Header Skeleton */}
                    <div className='h-14 px-4 flex items-center border-b border-zinc-800'>
                        <div className="h-4 bg-zinc-800 rounded-xl w-1/2 animate-pulse" />
                    </div>
                    {/* Chat Messages Skeleton */}
                    <div className='flex-1 p-4 space-y-6 mt-4'>
                        <div className='w-[80%] ml-auto h-12 bg-zinc-800 rounded-xl animate-pulse' />
                        <div className='w-[90%] mr-auto h-24 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800' />
                        <div className='w-[70%] ml-auto h-10 bg-zinc-800 rounded-xl animate-pulse' />
                    </div>
                    {/* Input Skeleton */}
                    <div className='p-3 border-t border-zinc-800 bg-[#09090b]'>
                        <div className='flex gap-2 animate-pulse'>
                            <div className='flex-1 h-12 bg-zinc-900 rounded-xl border border-zinc-800' />
                            <div className='w-14 h-12 rounded-xl bg-zinc-800' />
                        </div>
                    </div>
                </aside>
                {/* Preview Area Skeleton */}
                <div className='flex-1 flex flex-col'>
                    <div className='h-14 px-4 flex justify-between items-center border-b border-zinc-800 bg-[#09090b]'>
                        <div className="h-3 bg-zinc-800 rounded-xl w-24 animate-pulse" />
                        <div className='flex gap-2 animate-pulse'>
                            <div className='w-24 h-8 bg-zinc-800 rounded-xl' />
                            <div className='w-8 h-8 bg-zinc-800 rounded-xl hidden lg:block' />
                            <div className='w-8 h-8 bg-zinc-800 rounded-xl' />
                            <div className='w-8 h-8 bg-zinc-800 rounded-xl' />
                        </div>
                    </div>
                    <div className='flex-1 w-full bg-[#050505] flex flex-col items-center justify-center relative'>
                        {/* Cyber Grid Background */}
                        <div
                            className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                                backgroundSize: '16px 16px'
                            }}
                        />
                        <div className="w-12 h-12 border-[3px] border-zinc-800 border-l-cyan-500 rounded-full animate-spin z-10"></div>
                        <div className="mt-6 text-cyan-500 text-[11px] font-bold tracking-[0.3em] font-mono animate-pulse z-10">PREPARING PREVIEW</div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className='h-screen w-screen flex bg-[#09090b] text-white overflow-hidden font-sans relative'>
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-tr from-blue-600/10 via-cyan-500/10 to-emerald-500/10 blur-[100px] rounded-[100%] pointer-events-none z-0"></div>
            
            <aside className='hidden lg:flex w-96 flex-col border-r border-white/10 bg-white/5 backdrop-blur-xl z-10 shadow-2xl'>
                <Header />
                <>
                    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                        {messages.map((m, i) => {
                            return <div key={i} className={`max-w-[90%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-sans shadow-lg whitespace-pre-wrap
                            ${m.role === "user" ? "bg-blue-500 text-white shadow-blue-500/20" : "bg-white/10 backdrop-blur-md border border-white/10 text-zinc-200"}`}
                                >
                                    {m.role === "ai" && <div className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mb-2 flex items-center gap-1"><Terminal size={10} /> AI ENGINE</div>}
                                    {m.content}
                                </div>
                            </div>
                        })}
                        {updateLoading && <div className='max-w-[90%] mr-auto'>
                            <div className='px-4 py-3 rounded-2xl text-[10px] bg-white/5 backdrop-blur-md border border-white/10 text-emerald-400 font-mono tracking-widest uppercase flex items-center gap-2 shadow-lg'>
                                <div className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                {thinkingSteps[thinkingIndex]}
                            </div>
                        </div>}
                    </div>

                    <div className='p-4 border-t border-white/10 bg-black/20'>
                        <div className='flex gap-2 relative'>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={1}
                                placeholder='Describe changes...'
                                className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-zinc-200 outline-none font-sans text-sm focus:border-blue-500/50 focus:bg-white/10 transition-colors placeholder:text-zinc-500 shadow-inner' />
                            <button disabled={updateLoading} onClick={handleUpdate} className='px-4 py-3 rounded-2xl bg-white text-black hover:scale-105 transition-all shadow-lg disabled:bg-white/10 disabled:text-zinc-600 disabled:scale-100'><Send size={18} /></button>
                        </div>
                    </div>
                </>
            </aside>

            {/* preview */}
            <div className='flex-1 flex flex-col z-10'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-md'>
                    <span className='text-[10px] tracking-widest text-emerald-400 font-bold uppercase flex items-center gap-2'><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Live Preview</span>
                    <div className='flex gap-2 items-center'>
                        {website.deployed ? "" : <button
                            onClick={handleDeploy}
                            className='flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-[10px] uppercase font-bold tracking-widest hover:scale-105 transition shadow-lg'><Rocket size={14} />Deploy</button>}

                        <button onClick={() => setShowChat(true)} className='p-2 lg:hidden text-zinc-400 hover:text-white hover:bg-zinc-800 transition'><MessageSquare size={16} /></button>
                        <button onClick={() => setShowCode(true)} className='p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition'><Code2 size={16} /></button>
                        <button onClick={() => setShowFullPreview(true)} className='p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition'><Monitor size={16} /></button>
                    </div>

                </div>
                <iframe ref={iframeRef} className='flex-1 w-full bg-white border-0' sandbox='allow-scripts allow-same-origin allow-forms' />
            </div>

            {/* mobile chat preview */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className='fixed inset-0 z-50 flex flex-col bg-[#09090b]'
                    >
                        <Header />
                        <>
                            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                                {messages.map((m, i) => {
                                    return <div key={i} className={`max-w-[90%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                        <div className={`px-4 py-2.5 rounded-xl text-xs leading-relaxed font-mono whitespace-pre-wrap
                                    ${m.role === "user" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "bg-zinc-900 border border-zinc-800 text-zinc-300"}`}
                                        >
                                            {m.role === "ai" && <div className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-1 flex items-center gap-1"><Terminal size={10} /> AI</div>}
                                            {m.content}
                                        </div>
                                    </div>
                                })}
                                {updateLoading && <div className='max-w-[90%] mr-auto'>
                                    <div className='px-4 py-2.5 rounded-xl text-[10px] bg-zinc-900/50 border border-zinc-800 text-cyan-500 font-mono tracking-widest uppercase flex items-center gap-2'>
                                        <div className="w-2 h-2 bg-cyan-500 animate-pulse rounded-full" />
                                        {thinkingSteps[thinkingIndex]}
                                    </div>
                                </div>}
                            </div>

                            <div className='p-3 border-t border-zinc-800 bg-[#09090b]'>
                                <div className='flex gap-2 relative'>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        rows={1}
                                        placeholder='Describe changes...'
                                        className='flex-1 resize-none rounded-xl px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-200 outline-none font-sans text-sm focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600' />
                                    <button disabled={updateLoading} onClick={handleUpdate} className='px-4 py-3 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-colors disabled:bg-zinc-800 disabled:text-zinc-600'><Send size={16} /></button>
                                </div>
                            </div>
                        </>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-50 flex flex-col bg-[#09090b] border-l border-zinc-800'
                    >
                        <div className='h-12 px-4 flex justify-between items-center border-b border-zinc-800 bg-[#09090b]'>
                            <span className='text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold'>index.html</span>
                            <button onClick={() => setShowCode(false)} className='text-zinc-400 hover:text-white transition'><X size={18} /></button>
                        </div>
                        <Editor theme='vs-dark' value={code} language='html' onChange={(v) => setCode(v)} options={{ minimap: { enabled: false }, fontFamily: 'monospace' }} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div className='fixed inset-0 bg-[#09090b] z-50 flex flex-col'>
                        <div className='h-12 px-4 flex justify-between items-center border-b border-zinc-800 bg-[#09090b]'>
                            <span className='text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold'>Full Preview</span>
                            <button onClick={() => setShowFullPreview(false)} className='text-zinc-400 hover:text-white transition'><X size={18} /></button>
                        </div>
                        <iframe className='flex-1 w-full bg-white border-0' srcDoc={code} sandbox='allow-scripts allow-same-origin allow-forms'></iframe>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    function Header() {
        return (
            <div className='h-14 px-6 flex items-center justify-between border-b border-white/10 bg-black/20'>
                <span className='font-bold tracking-tight truncate flex items-center gap-2 text-white'>
                    <Terminal size={14} className="text-blue-400" />
                    {website.title}
                </span>
                <button onClick={() => setShowChat(false)} className='lg:hidden text-zinc-400 hover:text-white transition'><X size={18}/></button>
            </div>
        )
    }

}

export default WebsiteEditor
