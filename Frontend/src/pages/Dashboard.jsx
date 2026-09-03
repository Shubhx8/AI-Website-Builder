import { ArrowLeft, Check, Rocket, Share2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate()
  const [websites, setWebsites] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)
  const { userData } = useSelector(state => state.user)

  const handleDeploy = async (id) => {
    try {
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${id}`, { withCredentials: true })
      const dynamicUrl = result.data.url.replace(/^https?:\/\/[^\/]+/, window.location.origin)
      window.open(dynamicUrl, "_blank")
      setWebsites((prev) => prev.map((w) => w._id === id ? { ...w, deployed: true, deployUrl: dynamicUrl } : w))
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/website/delete/${id}`, { withCredentials: true })
        setWebsites((prev) => prev.filter((w) => w._id !== id))
      } catch (error) {
        console.log(error)
        setError(error.response?.data?.message || "Failed to delete project.")
      }
    }
  }

  useEffect(() => {
    const handleGetAllWebsite = async () => {
      try {
        setLoading(true)
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/getall`, { withCredentials: true })
        setWebsites(result.data)
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch websites.")
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    handleGetAllWebsite()
  }, [])

  const handleCopy = async (site) => {
    const dynamicUrl = site.deployUrl.replace(/^https?:\/\/[^\/]+/, window.location.origin)
    await navigator.clipboard.writeText(dynamicUrl)
    setCopiedId(site._id)
    setTimeout(() => setCopiedId(null), 2000)
  }
  
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans overflow-hidden relative">
      
      {/* Ambient Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-tr from-blue-600/10 via-cyan-500/10 to-emerald-500/10 blur-[100px] rounded-[100%] pointer-events-none z-0"></div>
      
      {/* Cyber Grid Background */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '24px 24px'
        }}
      />
      
      {/* header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#09090b]/60 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition rounded-xl">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-sm tracking-widest uppercase font-bold text-zinc-300">Dashboard</h1>
          </div>

          <button onClick={() => navigate("/generate")} className="px-5 py-2 bg-white text-black text-xs uppercase tracking-widest font-bold hover:scale-105 transition shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-xl">
            + New Project
          </button>
        </div>
      </div>

      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-white/10 bg-white/5 backdrop-blur-md rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
            <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase">Command Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{userData?.name?.split(' ')[0] || 'Creator'}</span>
          </h1>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col animate-pulse">
                <div className="h-48 bg-white/5" />
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="h-5 bg-white/10 rounded-xl w-3/4" />
                  <div className="h-3 bg-white/5 rounded-xl w-1/2" />
                  <div className="mt-6 h-10 bg-white/10 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && !loading && (
          <div className="mt-24 text-center text-blue-400 font-mono border border-blue-500/20 bg-blue-500/10 py-6 w-full max-w-md mx-auto rounded-2xl backdrop-blur-md shadow-xl">
            {error}
          </div>
        )}
        
        {websites?.length === 0 && !loading && !error && (
          <div className="mt-32 text-center flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
            <div className="w-20 h-20 border border-white/20 rounded-2xl flex items-center justify-center text-zinc-500 mb-6 bg-black/40 shadow-inner">
              <Rocket size={32} className="text-cyan-500/50" />
            </div>
            <h2 className="text-xl font-bold mb-2">No projects found</h2>
            <p className="text-zinc-500 mb-8 max-w-sm">You haven't built any websites yet. Start generating your first AI-powered site now.</p>
            <button onClick={() => navigate("/generate")} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Generate New Website
            </button>
          </div>
        )}
        
        {websites?.length > 0 &&
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {websites.map((w, i) => {
              const copied = copiedId === w._id
              return <motion.div
                key={w._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/editor/${w._id}`)}
                className="group bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all flex flex-col cursor-pointer"
              >
                <div className="relative h-48 bg-black/80 cursor-pointer border-b border-white/10 group-hover:border-cyan-500/30 transition-colors overflow-hidden">
                  <iframe srcDoc={w.latestCode} className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold tracking-tight line-clamp-2 text-white group-hover:text-cyan-400 transition-colors">{w.title}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(w._id); }}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                    UPDATED: {new Date(w.updatedAt).toLocaleDateString()}
                  </p>
                  
                  <div className="mt-auto pt-4">
                    {!w.deployed ? (
                      <button onClick={(e) => { e.stopPropagation(); handleDeploy(w._id); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] transition shadow-lg">
                        <Rocket size={14} />
                        Deploy to Live
                      </button>
                    ) : (
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); handleCopy(w); }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all border 
                        ${copied ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-black/40 text-zinc-300 hover:bg-white/10 hover:text-white border-white/10"}
                        `}
                      >
                        {copied ? <><Check size={14} /> Link Copied</> : <><Share2 size={14} /> Share Link</>}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            })}
          </div>
        }
      </div>
    </div>
  );
}

export default Dashboard;
