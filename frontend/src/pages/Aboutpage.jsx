import React from 'react'
import { Users, ChartColumn, Medal, Users2, TicketCheck, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const Aboutpage = () => {
  return (
    <div
      id="about"
      className="min-h-screen w-full bg-[#fdfdfd] flex items-center justify-center pt-16 md:pt-24 pb-10 md:pb-16 overflow-hidden"
    >
      <div className="px-4 md:px-10 w-full max-w-7xl relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl -z-10" />

        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
            Manage your entire community <br className="hidden md:block" /> in a <span className="text-blue-600">single system</span>
          </h2>
          <p className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-blue-400">
            Who is SOLEASE suitable for?
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          <FeatureCard 
            Icon={Users} 
            title="Membership Organisations" 
            desc="Our SolEase Ticketing System automates IT support requests, ensuring timely resolutions without manual follow-ups." 
          />
          <FeatureCard 
            Icon={ChartColumn} 
            title="National Associations" 
            desc="SolEase centralizes issue reporting for associations, enabling efficient tracking, assignment, and resolution." 
          />
          <FeatureCard 
            Icon={Medal} 
            title="Clubs And Groups" 
            desc="SolEase empowers clubs to simplify their support process, digitize ticket submissions, and improve accountability." 
          />
        </div>

        {/* Main Agenda Section - Glassmorphism Style */}
        <div className="relative group p-8 md:p-12 bg-white/40 backdrop-blur-md border border-white/60 rounded-[2rem] flex flex-col gap-6 items-center shadow-2xl shadow-blue-900/5 ring-1 ring-black/5">
          <h4 className="text-2xl md:text-3xl font-bold text-black text-center uppercase tracking-tighter">
            Main agenda of <span className="text-blue-600">SOLEASE</span>
          </h4>
          <p className="text-gray-600 text-sm md:text-lg text-center leading-relaxed max-w-4xl font-medium">
            Our platform is adopted by ministries, agencies, and public sector partners across Kenya. 
            It streamlines IT support, resolves issues faster, and improves service delivery through a secure, centralized system.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#"
            className="bg-blue-600 text-white px-10 py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition font-bold tracking-wide"
          >
            Learn More
          </motion.a>
        </div>

        {/* Stats Section */}
        <div className="text-center mt-20">
          <div className="mb-10">
            <h4 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 tracking-tighter">
              Ticket Community Management
            </h4>
            <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full mb-4" />
            <p className="text-gray-500 text-sm md:text-base font-medium">
              Helping government institutions transform IT support <br className="hidden md:block" />
              into a seamless, centralized system
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            <StatCard icon={<Users2 className="text-blue-500" />} value="1,000+" label="Active Users" />
            <StatCard icon={<TicketCheck className="text-blue-500" />} value="128" label="Tickets Solved" />
            <StatCard icon={<Zap className="text-blue-500" />} value="267" label="Real-Time Alerts" />
            <StatCard icon={<BarChart3 className="text-blue-500" />} value="436" label="Reports Generated" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-components to keep code clean but same structure
const FeatureCard = ({ Icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
  >
    <div className="flex items-center justify-center mb-5">
      <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon size={32} />
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{title}</h3>
    <p className="text-gray-500 text-sm md:text-base text-center leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const StatCard = ({ icon, value, label }) => (
  <div className="bg-white border border-gray-50 rounded-2xl p-6 shadow-sm flex flex-col items-center group hover:border-blue-100 transition-colors">
    <div className="mb-2 p-2 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-2xl md:text-3xl font-bold text-gray-900">{value}</span>
    <span className="text-gray-400 mt-1 text-xs md:text-sm font-bold uppercase tracking-wider">{label}</span>
  </div>
);

export default Aboutpage;