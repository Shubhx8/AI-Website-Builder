import { ArrowLeft, Check, Coins, Zap } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'


const plans = [
    {
        id: "free",
        name: "Free",
        price: '₹0',
        credits: 100,
        description: "Perfect to explore WEBMAXER",
        features: [
            "AI website generation",
            "Responsive html outputs",
            "Basic animations"
        ],
        popular: false,
        button: "Get Started"
    },
    {
        id: "pro",
        name: "Pro",
        price: '₹499',
        credits: 500,
        description: "For serious creators and freelancers",
        features: [
            "Everything in Free",
            "Faster Generations",
            "Edit and regenerate",
            "Download Source code"
        ],
        popular: true,
        button: "Upgrade to Pro"
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: '₹1499',
        credits: 1000,
        description: "For teams and power users",
        features: [
            "Unlimited Iterations",
            "Highest Priority",
            "Team Collaboration",
            "Dedicated Support"
        ],
        popular: false,
        button: "Contact Sales"
    },
]

const Pricing = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    const handlePayment = async (plan) => {
        if (!userData) {
            navigate("/signup")
            return
        }

        if (plan.id === "free") {
            navigate("/dashboard")
            return
        }
        try {  
            const amount = plan.id === "enterprise" ? 1499 : 499
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/payment/order`, {
                planId: plan.id,
                amount: amount,
                credits: plan.credits
            })
           

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: result.data.amount,
                currency: 'INR',
                name: "WEBMAXER",
                description: `${plan.name} - ${plan.credits} Credits`,
                order_id: result.data.id,

                handler: async function (response) {
                    console.log(response)
                    const verify = await axios.post(
                        `${import.meta.env.VITE_SERVER_URL}/api/payment/verify`,
                        response
                    )

                    console.log(verify.data)
                    dispatch(setUserData(verify.data.user))

                },
                theme: {
                    color: "#19173d"
                }
            }
            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.log(error)
            
        }
    }
    return (
        <div className='relative min-h-screen overflow-hidden bg-[#09090b] text-white pt-16 pb-32 font-sans'>
            
            {/* Ambient Glow Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-tr from-blue-600/10 via-cyan-500/10 to-emerald-500/10 blur-[100px] rounded-[100%] pointer-events-none z-0"></div>

            {/* Cyber Grid Background */}
            <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
              <button onClick={() => navigate(-1)} className='mb-12 flex items-center gap-2 text-sm text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md transition-all w-fit'>
                  <ArrowLeft size={16} />
                  Back
              </button>

              <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center mb-20'
              >
                  <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-4'>Choose your plan. Go live today.</h1>
                  <p className='text-zinc-400 font-light flex flex-wrap items-center justify-center gap-6'>
                    <span className="flex items-center gap-2"><Check className="text-emerald-400 w-4 h-4" /> 30-day money-back guarantee</span>
                    <span className="flex items-center gap-2"><Check className="text-emerald-400 w-4 h-4" /> Cancel anytime</span>
                  </p>
              </motion.div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                  {plans.map((p, i) => (
                      <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                          whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                          className={`relative p-8 rounded-3xl flex flex-col transition-all duration-300 ${p.popular ? "bg-white/5 backdrop-blur-3xl border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)] z-10" : "bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-white/20 hover:shadow-2xl"}`}
                      >
                          {p.popular && <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-[10px] font-black tracking-widest uppercase rounded-full text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]">Most Popular</div>}
                          
                          <div className='mb-6'>
                              <h3 className="text-2xl font-bold mb-2 text-white">
                                {p.name}
                              </h3>
                              <p className='text-zinc-400 text-sm font-light'>{p.description}</p>
                          </div>

                          <div className='mb-4'>
                              <span className="text-5xl font-black text-white">{p.price}</span>
                              <span className='text-zinc-500 text-sm'>/one-time</span>
                          </div>

                          <div className='flex items-center gap-2 mb-8'>
                              <Coins size={18} className='text-yellow-500' />
                              <span className='font-bold text-sm text-white'>{p.credits} Credits</span>
                          </div>
                          
                          <ul className='space-y-4 text-sm text-zinc-300 flex-1 mb-8'>
                              {p.features.map((f) => (
                                  <li key={f} className='flex items-center gap-3 font-light'>
                                      <Check size={16} className="shrink-0 text-emerald-500" />
                                      {f}
                                  </li>
                              ))}
                          </ul>

                          <button
                              onClick={() => handlePayment(p)}
                              disabled={userData?.plan === p.id}
                              className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 ${
                                userData?.plan === p.id 
                                  ? 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5'
                                  : p.popular 
                                    ? 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]' 
                                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                              }`}
                          >
                              {userData?.plan === p.id ? "Current Plan" : p.button}
                          </button>
                      </motion.div>
                  ))}
              </div>
            </div>
        </div>
    )
}

export default Pricing
