import React from 'react'
import { Users, ChartColumn, Medal, Users2, TicketCheck, Zap, BarChart3, Bot, Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Aboutpage = () => {
  return (
    <div
      id="about"
      className="min-h-screen w-full bg-[#fdfdfd] flex items-center justify-center pt-16 md:pt-24 pb-10 md:pb-16 overflow-hidden selection:bg-blue-100 selection:text-blue-600"
    >
      <div className="px-4 md:px-10 w-full max-w-7xl relative">
        {/* Background Elements */}
        <div className="absolute top-0 -left-20 w-80 h-80 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 -right-20 w-[30rem] h-[30rem] bg-gradient-to-tr from-indigo-100/30 to-blue-100/30 rounded-full blur-[120px] -z-10" />

        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-blue-500 mb-4 block"
          >
            Digital Transformation
          </motion.p>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Manage your entire community <br className="hidden md:block" /> 
            in a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">single system</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg font-medium">
            Tailored solutions for organizations looking to bridge the gap between complex IT issues and seamless resolution.
          </p>
        </div>

        {/* Cards Section - Bento Style influence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 mb-24">
          <FeatureCard 
            Icon={Users} 
            title="Membership Organisations" 
            desc="Automate IT support requests, ensuring timely resolutions without manual follow-ups." 
          />
          <FeatureCard 
            Icon={ChartColumn} 
            title="National Associations" 
            desc="Centralize issue reporting for efficient tracking, assignment, and resolution." 
          />
          <FeatureCard 
            Icon={Medal} 
            title="Clubs And Groups" 
            desc="Simplify support processes, digitize submissions, and improve total accountability." 
          />
        </div>

        {/* AI Capabilities Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-24 p-8 md:p-16 bg-slate-900 rounded-[3rem] text-white shadow-2xl shadow-blue-900/20 overflow-hidden relative border border-white/10"
        >
          <Sparkles className="absolute top-10 right-10 text-blue-400/20 size-32 rotate-12 blur-sm" />
          <BrainCircuit className="absolute bottom-[-40px] left-[-40px] text-indigo-500/10 size-64" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-xl rounded-full mb-6 border border-blue-500/30">
                <Bot size={18} className="text-blue-400" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Intelligent Infrastructure</span>
              </div>
              <h4 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
                Smarter Support <span className="italic font-serif text-blue-400">with AI</span>
              </h4>
              <p className="text-slate-300 text-base md:text-xl leading-relaxed mb-8 max-w-xl">
                SOLEASE leverages **Natural Language Processing** and **Predictive Logic** to ensure support requests are understood and routed to the right expert instantly.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {["Smart Routing", "Anomaly Detection", "Auto-Drafting"].map((tag) => (
                  <span key={tag} className="px-5 py-2 bg-white/5 rounded-full text-xs font-semibold border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main - Ultra Modern Glassmorphism */}
        <div className="relative group p-10 md:p-20 bg-white/60 backdrop-blur-2xl border border-white rounded-[4rem] flex flex-col gap-8 items-center shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)]">
          <h4 className="text-3xl md:text-4xl font-black text-gray-900 text-center uppercase tracking-tight">
            Main agenda of <span className="text-blue-600">SOLEASE</span>
          </h4>
          <p className="text-gray-500 text-base md:text-xl text-center leading-relaxed max-w-4xl font-medium">
            Adopted by ministries and public sector partners across Kenya, we streamline IT support to improve service delivery through a secure, centralized system.
          </p>
          <motion.a
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="#"
            className="group flex items-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all font-bold tracking-wide"
          >
            Learn More
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        {/* Stats Section - Clean & Geometric */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h4 className="text-3xl font-bold text-gray-900 mb-2">Platform Impact</h4>
            <div className="h-1.5 w-12 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Users2 size={24} />} value="1,000+" label="Active Users" />
            <StatCard icon={<TicketCheck size={24} />} value="128" label="Tickets Solved" />
            <StatCard icon={<Zap size={24} />} value="267" label="Real-Time Alerts" />
            <StatCard icon={<BarChart3 size={24} />} value="436" label="Reports Generated" />
          </div>
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({ Icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -12 }}
    className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.12)] transition-all duration-500 group"
  >
    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center group hover:border-blue-200 transition-all duration-300">
    <div className="mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <span className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{value}</span>
    <span className="text-gray-400 mt-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">{label}</span>
  </div>
);

export default Aboutpage;