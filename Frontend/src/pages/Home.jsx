import { ArrowRight, Terminal, Zap, Code2, Download, Check, Star, ChevronDown, Rocket, Layers, Image as ImageIcon, MessageSquare, Globe, Mail, MessageCircle, Sparkles, Coins, ArrowDown, Undo2, Redo2, ChevronRight, Mic, MousePointer2, Plus, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import LoginModal from "../components/LoginModal"

const SecondaryNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navItems = [
    { name: 'Build anything', id: 'build-anything' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'How it works', id: 'how-it-works' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'FAQ', id: 'faq' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      
      // Determine active section
      let current = "";
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is at or above the middle of the viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = item.id;
          }
        }
      }
      setActiveSection(current);
    };
    
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for navbar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: scrolled ? 0 : -50, opacity: scrolled ? 1 : 0 }}
      className="fixed top-20 left-0 right-0 z-40 flex justify-center pointer-events-none"
    >
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-full p-2 flex items-center pointer-events-auto">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={(e) => scrollToSection(e, item.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                isActive 
                  ? "bg-white text-black shadow-lg scale-105" 
                  : "text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-t border-white/10 first:border-t-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex justify-between items-center text-left focus:outline-none group"
      >
        <span className="text-xl font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors pr-8">{question}</span>
        <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/20 text-zinc-400 group-hover:border-white group-hover:text-white'}`}>
          <ArrowDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-zinc-400 font-light leading-relaxed text-lg pr-12">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const pricingPlans = [
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

const Home = () => {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  const [openLogin, setOpenLogin] = useState(false)
  const [promptText, setPromptText] = useState("")
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false)
  const [placeholderText, setPlaceholderText] = useState("")
  const [promptIndex, setPromptIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const PLACEHOLDER_PROMPTS = [
    "Build a portfolio for a freelance photographer...",
    "Create a landing page for a cozy coffee shop...",
    "Design a tech blog with dark mode...",
    "Make an e-commerce site for handmade jewelry...",
    "Build a dashboard for an AI startup..."
  ];

  useEffect(() => {
    const currentPrompt = PLACEHOLDER_PROMPTS[promptIndex];
    let typingSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && placeholderText === currentPrompt) {
      const pauseTimeout = setTimeout(() => setIsDeleting(true), 2500);
      return () => clearTimeout(pauseTimeout);
    }

    if (isDeleting && placeholderText === "") {
      setIsDeleting(false);
      setPromptIndex((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
      return;
    }

    const timeout = setTimeout(() => {
      setPlaceholderText((prev) => 
        isDeleting 
          ? currentPrompt.substring(0, prev.length - 1)
          : currentPrompt.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, promptIndex]);

  const rawPlan = userData?.plan || "Free"
  const currentPlan = rawPlan.charAt(0).toUpperCase() + rawPlan.slice(1).toLowerCase()
  
  // Initialize selected plan based on user's actual plan
  const [selectedPlan, setSelectedPlan] = useState(currentPlan)

  const planRank = {
    "Free": 0,
    "Pro": 1,
    "Enterprise": 2
  }

  const handlePlanSelect = (plan) => {
    setPlanDropdownOpen(false)
    if (planRank[plan] > planRank[currentPlan]) {
      navigate('/pricing')
    } else {
      setSelectedPlan(plan)
    }
  }

  const handleStart = () => {
    if (userData) {
      navigate('/generate', { state: { initialPrompt: promptText, autoStart: true } })
    } else {
      setOpenLogin(true)
    }
  }

  return (
    <div className="bg-[#09090b] text-white overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <SecondaryNav />

      {/* HERO SECTION */}
      <section id="build-anything" className="relative min-h-screen pt-40 pb-20 flex flex-col items-center justify-start overflow-hidden">
        {/* Glow Orb Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/20 to-emerald-500/20 blur-[120px] rounded-[100%] pointer-events-none z-0"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.05)_1px,transparent_0)]" style={{ backgroundSize: '32px 32px' }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 max-w-4xl">
            Build your website <br className="hidden md:block" /> with Webmaxer
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Describe your idea and get a fully functional website instantly. We handle the design, content, and structure for you.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative w-full max-w-3xl mx-auto">
            <div className="flex flex-col bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.05)] transition-all focus-within:border-white/30 focus-within:bg-white/[0.05] hover:bg-white/[0.05]">
              <input 
                type="text" 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder={placeholderText || " "}
                className="w-full bg-transparent text-white placeholder-zinc-500 px-6 pt-4 pb-2 md:px-8 md:pt-5 md:pb-2 text-lg md:text-xl outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
              <div className="flex items-center justify-between px-6 pb-5 md:px-8 md:pb-5 pt-0">
                <div></div>
                <div className="flex items-center gap-2 md:gap-3 ml-auto">
                   <div className="relative">
                     <div 
                       onClick={() => setPlanDropdownOpen(!planDropdownOpen)}
                       className="flex items-center gap-2 text-zinc-300 font-medium hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer"
                     >
                       {selectedPlan} <ChevronDown size={16}/>
                     </div>
                     
                     <AnimatePresence>
                       {planDropdownOpen && (
                         <motion.div 
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -10 }}
                           className="absolute top-full right-0 mt-2 w-32 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col"
                         >
                           {["Free", "Pro", "Enterprise"].map(plan => (
                             <button
                               key={plan}
                               onClick={() => handlePlanSelect(plan)}
                               className="text-left px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 flex items-center justify-between"
                             >
                               {plan}
                               {selectedPlan === plan && <Check size={14} className="text-emerald-400" />}
                             </button>
                           ))}
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                   <button onClick={handleStart} className="bg-[#FF5A1F] hover:bg-[#FF7A4F] text-white p-2 rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ml-2 flex-shrink-0">
                     <ArrowUpRight size={18} />
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Auto-scrolling Templates Row */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="mt-16 md:mt-24 w-full relative z-10 mx-auto overflow-hidden pb-10">
          {/* Edge fade masks */}
          <div className="absolute top-0 bottom-0 left-0 w-8 md:w-40 bg-gradient-to-r from-[#09090b] to-transparent z-20 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-8 md:w-40 bg-gradient-to-l from-[#09090b] to-transparent z-20 pointer-events-none"></div>

          <motion.div 
            className="flex gap-4 md:gap-6 w-max px-4 hover:[animation-play-state:paused]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((num, i) => (
              <div key={i} className="w-[280px] h-[180px] md:w-[340px] md:h-[220px] rounded-xl overflow-hidden shadow-2xl border border-white/10 relative flex-shrink-0 bg-white/5 flex items-center justify-center group">
                 <img 
                    src={`/hero-template-${num}.png`} 
                    alt={`Template ${num}`}
                    className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                 />
                 {/* Fallback visible only if image fails to load */}
                 <div className="absolute inset-0 hidden flex-col items-center justify-center p-4 text-center border-2 border-dashed border-white/20 rounded-xl m-1">
                    <span className="text-white/50 text-xs font-medium">Missing Image</span>
                    <code className="text-white bg-black/40 px-2 py-1 rounded mt-1 text-[10px]">public/hero-template-{num}.png</code>
                 </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-32 relative bg-[#09090b] overflow-hidden">
        {/* Subtle indigo atmospheric glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-[120px] rounded-[100%] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Choose your plan. Go live today.</h2>
            <p className="text-zinc-400 font-light flex items-center justify-center gap-6">
              <span className="flex items-center gap-2"><Check className="text-emerald-400 w-4 h-4" /> 30-day money-back guarantee</span>
              <span className="flex items-center gap-2"><Check className="text-emerald-400 w-4 h-4" /> Cancel anytime</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((p, i) => (
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

                <ul className="space-y-4 text-sm text-zinc-300 flex-1 mb-8">
                  {p.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 font-light">
                      <Check size={16} className="shrink-0 text-emerald-500" /> 
                      {feature}
                    </li>
                  ))}
                </ul>

                <button onClick={() => navigate('/pricing')} className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 ${
                  userData?.plan === p.id 
                    ? 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5'
                    : p.popular 
                      ? 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]' 
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                }`}>
                  {userData?.plan === p.id ? "Current Plan" : p.button}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-32 relative bg-[#09090b] overflow-hidden">
        {/* Subtle cyan glow from bottom-left */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-500/8 to-transparent blur-[130px] rounded-[100%] pointer-events-none"></div>
        {/* Subtle violet glow from top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-gradient-to-bl from-violet-500/8 to-transparent blur-[130px] rounded-[100%] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">No experience? No problem.</h2>
          <p className="text-zinc-400 font-light max-w-3xl mx-auto text-lg mb-20">
            No coding, design skills, or complicated setup needed. Just start with your idea, and AI helps with the rest.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Card 1 */}
            <div className="relative rounded-3xl bg-[#15151e] border border-white/5 overflow-hidden flex flex-col group hover:border-white/10 transition-colors">
              <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/20 to-transparent opacity-50"></div>
              
              <div className="h-72 relative flex items-center justify-center p-8">
                {/* Mockup 1: Prompt Box */}
                <div className="w-full bg-white rounded-2xl p-6 shadow-2xl relative z-10 translate-y-4 group-hover:-translate-y-1 transition-transform duration-500">
                  <p className="text-zinc-800 text-sm font-medium mb-8 leading-relaxed">
                    Create a modern website for my design portfolio with a clean design, use minimal
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-zinc-700">
                       <ImageIcon size={18} />
                       <Mic size={18} />
                       <Sparkles size={18} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#f4f4f5] flex items-center justify-center text-[#4F46E5]">
                       <ChevronRight size={18} />
                    </div>
                  </div>
                  {/* Subtle 3D shadow block */}
                  <div className="absolute -bottom-2 left-4 right-4 h-4 bg-white/50 rounded-b-xl -z-10 blur-[2px]"></div>
                </div>
              </div>

              <div className="p-8 pt-0 relative z-10">
                <h3 className="text-xl font-bold mb-2 text-white">1. Describe your idea</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">Write a prompt or choose a template, and AI creates the first version.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative rounded-3xl bg-[#15151e] border border-white/5 overflow-hidden flex flex-col group hover:border-white/10 transition-colors">
              <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/20 to-transparent opacity-50"></div>
              
              <div className="h-72 relative flex items-center justify-center pt-12 px-6 overflow-hidden">
                {/* Mockup 2: Builder Interface */}
                <div className="w-full h-full bg-white rounded-t-xl shadow-2xl relative z-10 translate-y-4 group-hover:-translate-y-1 transition-transform duration-500 flex flex-col">
                   {/* Top nav */}
                   <div className="h-12 border-b border-zinc-100 flex items-center justify-center gap-6 px-4 text-[8px] font-bold tracking-widest text-zinc-500 uppercase">
                      <span>About</span><span>Portfolio</span><span>Contacts</span>
                   </div>
                   {/* Hero Area */}
                   <div className="flex-1 bg-[#8baee0] m-3 rounded-lg relative flex items-center justify-center border border-[#7a9dcf]">
                      <div className="absolute -top-3 left-4 bg-white shadow-md rounded-full px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold text-zinc-700 border border-zinc-100">
                         <Sparkles size={12} className="text-[#8baee0] fill-[#8baee0]" /> AI Writer
                      </div>
                      <span className="text-4xl font-bold text-white tracking-tight border-l border-r border-white/50 px-4">Welcome</span>
                   </div>
                </div>
              </div>

              <div className="p-8 pt-0 relative z-10 mt-4">
                <h3 className="text-xl font-bold mb-2 text-white">2. Make it yours</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">Edit the design, text, images, and layout to match your idea.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative rounded-3xl bg-[#15151e] border border-white/5 overflow-hidden flex flex-col group hover:border-white/10 transition-colors">
              <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-500/20 to-transparent opacity-50"></div>
              
              <div className="h-72 relative flex items-center justify-center pt-12 px-6 overflow-hidden">
                {/* Mockup 3: Publish Bar */}
                <div className="w-full h-full bg-white rounded-t-xl shadow-2xl relative z-10 translate-y-4 group-hover:-translate-y-1 transition-transform duration-500 flex flex-col">
                   {/* Top Bar */}
                   <div className="h-16 border-b border-zinc-100 flex items-center justify-between px-3">
                      <div className="flex gap-2 text-zinc-300">
                        <Undo2 size={16} />
                        <Redo2 size={16} />
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-zinc-800">
                        <span>Save</span>
                        <div className="w-px h-4 bg-zinc-200"></div>
                        <span>Preview</span>
                        <Globe size={14} className="text-zinc-400" />
                        <button className="bg-[#6B46C1] text-white px-3 py-1.5 rounded-md relative shadow-md">
                           Go live
                           <MousePointer2 size={32} className="absolute -bottom-6 -right-4 text-zinc-800 fill-zinc-800 rotate-[-15deg] z-50 drop-shadow-xl" />
                        </button>
                      </div>
                   </div>
                   {/* Content */}
                   <div className="flex-1 bg-zinc-100 relative overflow-hidden flex">
                      <div className="w-1/2 bg-[#5e82b4]"></div>
                      <div className="w-1/2 bg-[#e0d3bc]"></div>
                   </div>
                </div>
              </div>

              <div className="p-8 pt-0 relative z-10 mt-4">
                <h3 className="text-xl font-bold mb-2 text-white">3. Take it online</h3>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">Publish with hosting, a domain, and email included.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-32 overflow-hidden bg-[#09090b] relative">
        {/* Subtle warm glow centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gradient-to-r from-orange-500/6 via-amber-400/6 to-orange-500/6 rounded-[100%] blur-[140px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Built by people like you</h2>
          <p className="text-zinc-400 font-light max-w-2xl mx-auto">See how people turned their ideas into websites, stores, portfolios, and more with Webmaxer. Your story could be next.</p>
        </div>

        <div className="relative w-full flex overflow-hidden py-4">
          {/* Edge fade masks */}
          <div className="absolute top-0 bottom-0 left-0 w-12 md:w-40 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-12 md:w-40 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none"></div>

          <motion.div 
            className="flex gap-6 w-max px-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {[
              { name: "Sanjukta Paul", role: "Co-founder", text: "Webmaxer is so user-friendly – even without technical knowledge. Developing a website doesn't feel so intimidating when I have access to AI tools from Webmaxer." },
              { name: "Alex Chen", role: "Indie Hacker", text: "Webmaxer AI Builder makes development incredibly fast. I can quickly design, prototype, and launch ideas without wasting time on tedious code." },
              { name: "Karine Nguyen", role: "Artist", text: "I created my first portfolio with AI. It’s very simple. Now it takes me no effort to change something or upload new art to my gallery." },
              { name: "David Ramjohn", role: "Director", text: "These AI tools have become my built-in tech team. If I'm stuck, I just ask the Engine, and it's sorted instantly." },
              { name: "Sanjukta Paul", role: "Co-founder", text: "Webmaxer is so user-friendly – even without technical knowledge. Developing a website doesn't feel so intimidating when I have access to AI tools from Webmaxer." },
              { name: "Alex Chen", role: "Indie Hacker", text: "Webmaxer AI Builder makes development incredibly fast. I can quickly design, prototype, and launch ideas without wasting time on tedious code." },
              { name: "Karine Nguyen", role: "Artist", text: "I created my first portfolio with AI. It’s very simple. Now it takes me no effort to change something or upload new art to my gallery." },
              { name: "David Ramjohn", role: "Director", text: "These AI tools have become my built-in tech team. If I'm stuck, I just ask the Engine, and it's sorted instantly." }
            ].map((review, i) => (
              <div key={i} className="w-[350px] md:w-[480px] p-8 md:p-10 rounded-2xl bg-[#111113] border border-white/5 flex flex-col justify-between shrink-0 hover:border-white/10 transition-colors">
                <p className="text-zinc-300 text-lg font-light leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-12">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-lg shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-white">{review.name}</h4>
                    <p className="text-xs text-zinc-500 font-light">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-32 relative bg-[#09090b] overflow-hidden">
        {/* Subtle emerald glow from center-right */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[600px] bg-gradient-to-l from-emerald-500/7 to-transparent blur-[130px] rounded-[100%] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-start">
            
            {/* Left Column - Large Title */}
            <div className="md:col-span-5 md:sticky md:top-32">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6">
                Building a <br className="hidden md:block"/>
                website with <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Webmaxer FAQ</span>
              </h2>
              <p className="text-zinc-400 text-lg font-light leading-relaxed mb-8 max-w-md">
                Everything you need to know about how our engine works, what you can build, and how to get started today.
              </p>
              <button onClick={() => navigate('/pricing')} className="hidden md:inline-flex px-8 py-3 bg-white text-black font-extrabold rounded-xl hover:scale-105 transition-all shadow-lg text-sm items-center gap-2">
                Get Started Now <ArrowRight size={16} />
              </button>
            </div>

            {/* Right Column - FAQ List */}
            <div className="md:col-span-7 bg-[#111113] rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl">
              <FAQItem question="How does the Webmaxer engine work?" answer="Webmaxer uses advanced artificial intelligence to instantly generate a complete, working website based on a simple text description. Instead of designing pages manually, you describe your business, and our engine creates tailored layouts, copy, and structure in seconds." />
              <FAQItem question="Do I need to know how to code?" answer="No! Webmaxer is completely no-code friendly. You simply chat with the AI to make changes, update colors, or rewrite sections. However, if you are a developer, you can download the clean React source code to customize it further." />
              <FAQItem question="How much does a generated website cost?" answer="You can generate and preview websites for free! To publish, connect a custom domain, or download the source code, you can choose one of our affordable one-time pricing plans starting at just ₹149. Check our pricing page for full details." />
              <FAQItem question="Can I use my own custom domain?" answer="Yes. Once you generate and deploy your website on our platform, you can attach a custom domain name seamlessly from your dashboard on any paid plan." />
              <FAQItem question="Is the generated code mobile-friendly?" answer="Absolutely. Every website generated by our engine uses modern CSS (Tailwind) and is completely responsive, ensuring it looks perfect on mobile phones, tablets, and desktop computers." />
            </div>
            
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 md:py-32 relative flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-b from-black via-[#161310] to-black">
        {/* Warm glow to blend with the collage */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[700px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d4b886]/15 via-[#d4b886]/5 to-transparent blur-3xl pointer-events-none z-0"></div>

        <div className="relative z-10 w-full px-6">
          <h2 className="text-5xl md:text-[5.5rem] font-bold text-white mb-12 md:mb-16 leading-[1.05] tracking-tight">
            Go ahead.<br />
            Build it yourself.
          </h2>

          {/* Collage Area */}
          <div className="w-full max-w-[1100px] mx-auto flex justify-center items-center relative mb-16 md:mb-20">
            <img 
              src="/cta-collage.png" 
              alt="Design Collage" 
              className="w-full h-auto object-contain relative z-10 rounded-2xl md:rounded-[2rem] shadow-2xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Fallback visible only if image fails to load */}
            <div className="absolute inset-0 hidden flex-col items-center justify-center p-10">
               <span className="text-white/70 font-medium">Please place your collage image at</span>
               <code className="text-white bg-black/40 px-3 py-1.5 rounded-lg mt-3 text-sm">public/cta-collage.png</code>
               <span className="text-zinc-600 text-xs mt-4">Recommended size: 1200x600px</span>
            </div>
          </div>

          <button onClick={handleStart} className="group flex items-center justify-center gap-4 mx-auto text-4xl md:text-[4rem] font-bold text-white transition-all hover:scale-[1.02]">
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-[3px] border-white flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-2">
               <ArrowRight className="w-5 h-5 md:w-7 md:h-7" strokeWidth={3} />
            </div>
            <span className="border-b-[4px] md:border-b-[6px] border-white pb-1">Start building</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white/[0.02] backdrop-blur-3xl border-t border-white/5 pt-20 pb-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img src="/robot-only.png" alt="Logo" className="h-8 object-contain" style={{ filter: 'grayscale(1) sepia(1) hue-rotate(160deg) saturate(1.5) brightness(1.3)' }} />
                <span className="font-extrabold text-xl tracking-tighter text-white">WEBMAXER</span>
              </div>
              <p className="text-zinc-500 text-sm font-light mb-6">Building the future of web design with artificial intelligence. High-end code generation for everyone.</p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition"><MessageCircle size={14} /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition"><Globe size={14} /></a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition"><Mail size={14} /></a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-zinc-400 hover:text-cyan-400 transition">Build Anything</a></li>
                <li><button onClick={() => navigate('/dashboard')} className="text-sm text-zinc-400 hover:text-cyan-400 transition">Dashboard</button></li>
                <li><a href="#how-it-works" className="text-sm text-zinc-400 hover:text-cyan-400 transition">Features</a></li>
                <li><button onClick={() => navigate('/pricing')} className="text-sm text-zinc-400 hover:text-cyan-400 transition">Pricing</button></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Community</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition">Discord Server</a></li>
                <li><a href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition">Twitter / X</a></li>
                <li><a href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition">Showcase</a></li>
                <li><a href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition">Blog</a></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Account</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setOpenLogin(true)} className="text-sm text-zinc-400 hover:text-emerald-400 transition">Login Now</button></li>
                <li><button onClick={() => navigate('/signup')} className="text-sm text-zinc-400 hover:text-emerald-400 transition">Create Account</button></li>
                <li><a href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition">Reset Password</a></li>
                <li><a href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition">Billing Status</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-600">© 2026 Webmaxer AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-zinc-600 hover:text-zinc-300">Privacy Policy</a>
              <a href="#" className="text-xs text-zinc-600 hover:text-zinc-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {openLogin && (
        <LoginModal
          open={openLogin}
          onClose={() => setOpenLogin(false)}
        />
      )}
    </div>
  )
}

export default Home
