import React from 'react'
import { Users, 
  LayoutDashboard, 
  ShieldCheck, Users2, 
  TicketCheck, Zap, 
  BarChart3, Bot, 
  Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';

const Aboutpage = () => {
  const navigate = useNavigate();
  
  return (
    <div
      id="about"
      className="min-h-screen w-full bg-[#fafbfc] flex items-center justify-center pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden selection:bg-blue-600 selection:text-white font-sans"
    >
      <div className="px-6 md:px-12 w-full max-w-7xl relative">
        {/* Background Atmosphere */}
        <div className="absolute top-[-10%] -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] -right-20 w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-[150px] -z-10" />

        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-6 border border-blue-500/20 bg-blue-500/10 rounded-full animate-bounce duration-700"
          >
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Universal Support Engine
            </span>
          </motion.div>
          
           <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-[1.05] tracking-tight">
             Seamlessly managing <br className="hidden md:block" /> 
             every <span className="text-blue-600 relative">connected user
               <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
               </svg>
             </span>
           </h2>
           <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Bridging the gap between modern users and complex technology with a centralized, human-centric support system.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <FeatureCard 
            Icon={Users} 
            title="Growing Communities" 
            desc="Empower your members with a direct line to expert help, fostering trust and long-term engagement." 
          />
          <FeatureCard 
            Icon={LayoutDashboard} 
            title="Digital Workplaces" 
            desc="Keep your team productive by eliminating technical friction through automated reporting and tracking." 
          />
          <FeatureCard 
            Icon={ShieldCheck} 
            title="Secure User Networks" 
            desc="Ensure every user interaction is safe, private, and resolved with total accountability." 
          />
        </div>

        {/* AI Capabilities Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 p-10 md:p-20 bg-white/40 rounded-[4rem] text-gray-900 shadow-3xl shadow-blue-900/40 overflow-hidden relative border border-gray-300/5"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/5 backdrop-blur-2xl rounded-2xl mb-8 border border-gray-300/10">
                <Bot size={20} className="text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-100">
                  Intelligent Infrastructure
                </span>
              </div>
               <h4 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-8 tracking-tight text-gray-900">
                 Smarter Support <span className="text-blue-400 font-serif italic">for Everyone</span>
               </h4>
               <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl">
                Whether you're a startup or a global network, SOLEASE uses **AI-driven logic** to route requests instantly, ensuring no user is left waiting.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {["Human-Centric AI", "Predictive Support", "Instant Routing"].map((tag) => (
                   <span key={tag} className="px-6 py-2.5 bg-gray-100/5 rounded-xl text-xs font-bold border border-gray-300/10 hover:border-blue-500/50 hover:bg-gray-100/10 transition-all duration-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Agenda */}
        <div className="relative group p-12 md:p-24 bg-white/40 backdrop-blur-3xl border border-gray-300/5 rounded-[4rem] flex flex-col gap-10 items-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_-20px_rgba(59,130,246,0.08)] transition-all duration-700 max-w-6xl mx-auto ring-1 ring-gray-300/5">

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-blue-500/10 blur-[100px] -z-10 rounded-full" />

           <h4 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 text-center tracking-tight leading-tight">
             Our mission at <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent px-1">SOLEASE</span>
           </h4>

           <p className="text-gray-600 text-base sm:text-lg md:text-xl text-center leading-relaxed max-w-4xl font-normal tracking-tight">
              We provide the <span className="text-gray-900 font-semibold">digital backbone</span> 
              for communities and organizations across the region, making professional IT support accessible, secure and efficient for all.
           </p>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/signup')}
            className="group relative flex items-center gap-3 bg-white/40 text-gray-900 px-12 py-5 rounded-2xl shadow-2xl shadow-slate-900/30 hover:bg-white/60 transition-all duration-300 font-bold tracking-tight text-base overflow-hidden"
          >
            {/* Button "Shine" Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform" />

            <Link to='/signup' className="relative z-10">
              Join the Movement
            </Link>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300 text-blue-400" />
          </motion.button>
        </div>

        {/* Stats Section */}
        <div className="mt-40">
             <div className="flex items-center gap-4 mb-16">
              <div className="h-px flex-1 bg-gray-300/10" />
              <h4 className="text-sm font-bold text-gray-600 uppercase tracking-[0.5em]">
                Global Reach
              </h4>
              <div className="h-px flex-1 bg-gray-300/10" />
            </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard icon={<Users2 size={28} />} value="10k+" label="Daily Users" />
            <StatCard icon={<TicketCheck size={28} />} value="99%" label="Uptime Goal" />
            <StatCard icon={<Zap size={28} />} value="24/7" label="Real-Time Alerts" />
            <StatCard icon={<BarChart3 size={28} />} value="1M+" label="Data Points" />
          </div>
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ Icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -15, scale: 1.02 }}
    className="bg-white/40 border border-gray-300/5 rounded-[3rem] p-12 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] transition-all duration-500 group"
  >
    <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-600 mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 group-hover:shadow-xl group-hover:shadow-blue-500/40">
      <Icon size={36} strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-bold text-gray-600 mb-5 tracking-tight">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed font-normal">
      {desc}
    </p>
  </motion.div>
);

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white/40 border border-gray-300/5 rounded-[2.5rem] p-10 flex flex-col items-center group hover:border-blue-400/30 hover:shadow-2xl transition-all duration-500">
    <div className="mb-6 text-blue-500 p-4 bg-blue-500/10 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">
      {value}
    </span>
    <span className="text-gray-400 mt-4 text-xs sm:text-sm font-bold uppercase tracking-[0.15em]">
      {label}
    </span>
  </div>
);

export default Aboutpage;