import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect } from "react"
import LoginModal from "./LoginModal"
import { useDispatch, useSelector } from "react-redux"
import { Coins } from "lucide-react"
import axios from "axios"
import { setUserData } from "../redux/userSlice"
import { useNavigate } from "react-router-dom"

const Navbar = () => {

  const [openLogin, setOpenLogin] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const { userData } = useSelector(state => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`)
    } catch (error) {
      console.log("Logout API Error:", error)
    } finally {
      dispatch(setUserData(null))
      setOpenProfile(false)
      navigate("/")
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#09090b]/70 border-b border-white/5 font-sans"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer p-1"
          >
            <img
              src={isOnline ? "/robot-only.png" : "/logo-gray.png"}
              className="h-9 object-contain transition-all"
              style={{ filter: isOnline ? 'grayscale(1) sepia(1) hue-rotate(160deg) saturate(1.5) brightness(1.3)' : 'none' }}
              alt="WEBMAXER"
            />
            <span className="font-extrabold text-xl tracking-tighter text-white">
              WEBMAXER
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">

            {/* Credits and Plan Badge */}
            {userData && (
              <div className="flex items-center gap-3">
                {userData.plan && userData.plan !== "free" && (
                  <span className="hidden md:inline-block px-2.5 py-1 text-[10px] rounded-xl font-bold bg-cyan-500 text-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    {userData.plan} Plan
                  </span>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/pricing")}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm cursor-pointer hover:border-cyan-500/50 transition"
                >
                  <Coins size={14} className="text-cyan-400" />
                  <span className="text-white font-mono">{userData.credits}</span>
                  <span className="text-zinc-400 uppercase text-[10px] tracking-wider font-bold">Credits</span>
                  <span className="font-semibold text-zinc-400">+</span>
                </motion.div>
              </div>
            )}

            {/* Profile OR Login */}
            {userData ? (

              <div className="relative">

                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center"
                >
                  <img
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border border-zinc-700 object-cover hover:border-cyan-400 transition"
                    src={
                      userData?.avatar ||
                      `https://ui-avatars.com/api/?name=${userData.name}`
                    }
                  />
                </button>

                <AnimatePresence>
                  {openProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-60 bg-black/40 backdrop-blur-2xl border rounded-xl border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden z-50"
                    >

                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-sm font-semibold tracking-tight truncate text-white">
                          {userData.name}
                        </p>

                        <p className="text-xs text-zinc-500 font-light truncate">
                          {userData.email}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-900 text-zinc-300 hover:text-white transition"
                      >
                        Dashboard
                      </button>

                      <button
                        onClick={() => navigate("/pricing")}
                        className="md:hidden w-full px-4 py-3 flex items-center gap-2 text-zinc-300 text-sm hover:bg-zinc-900 hover:text-white transition"
                      >
                        <Coins size={14} className="text-cyan-400" />
                        <span className="font-mono">{userData.credits}</span> Credits
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-900 text-red-500 transition"
                      >
                        Log Out
                      </button>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            ) : (

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setOpenLogin(true)}
                  className="hidden sm:block px-4 py-2 text-sm rounded-xl font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition"
                >
                  Log in
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2 bg-white hover:bg-zinc-200 rounded-xl font-semibold text-sm transition text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Sign up
                </motion.button>
              </div>

            )}

          </div>

        </div>
      </motion.nav>

      {openLogin && (
        <LoginModal
          open={openLogin}
          onClose={() => setOpenLogin(false)}
        />
      )}
    </>
  )
}

export default Navbar