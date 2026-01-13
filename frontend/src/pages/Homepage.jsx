import React from "react";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

const Homepage = () => {
  return (
    <div
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* Optimized Background using Tailwind v4 Arbitrary Values */}
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background: "linear-gradient(120deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 58, 138, 0.5) 100%), url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop) center/cover no-repeat",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 max-w-5xl w-full px-6 sm:px-10 py-16 sm:py-20 flex flex-col items-center text-center">
        
        {/* Modernized Tagline */}
        <div className="mb-8 flex flex-col items-center group">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-blue-200 text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 border border-white/20 shadow-2xl transition-all duration-500 hover:bg-white/20">
            <Sparkles className="w-3 h-3" />
            New Era of Business
          </span>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent uppercase">
              SOLEASE
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-200/90 mb-10 font-medium max-w-2xl leading-relaxed">
            Empowering your business with{" "}
            <span className="text-white border-b-2 border-blue-500/50 pb-0.5">
              modern solutions
            </span>
            . Discover our services and see how we can help you grow.
          </p>
        </div>

        {/* Updated Buttons with Glassmorphism */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
          <a href="#about" className="w-full sm:w-auto group">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-1 font-bold text-lg flex items-center justify-center gap-2">
              Get Started 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </a>
          
          <a href="#contact" className="w-full sm:w-auto group">
            <button className="w-full sm:w-auto bg-white/5 backdrop-blur-xl text-white border border-white/20 px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 font-bold text-lg flex items-center justify-center gap-2">
              Contact Us
              <Mail className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            </button>
          </a>
        </div>
      </div>

      {/* Animated Decorative Blobs (Enhanced for v4) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)] pointer-events-none"></div>
    </div>
  );
};

export default Homepage;