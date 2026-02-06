import React, { useEffect, useState } from "react";
import { ArrowRight, Mail, Sparkles, ChevronDown } from "lucide-react";

const Homepage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] font-sans"
    >
      <div 
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background: "linear-gradient(120deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 58, 138, 0.6) 100%), url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop) center/cover no-repeat",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 max-w-5xl w-full px-4 sm:px-8 lg:px-10 py-20 sm:py-24 lg:py-32 flex flex-col items-center text-center">
        
        <div className={`mb-10 flex flex-col items-center group transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-blue-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full uppercase tracking-[0.15em] mb-8 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5" />
            New Era of Business
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.15]">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              SOLEASE
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-300/95 mb-12 font-medium max-w-3xl leading-[1.8]">
            Empowering your business with{" "}
            <span className="text-white font-semibold border-b-2 border-blue-400/60 pb-1">
              modern solutions
            </span>
            . Discover our services and see how we can help you grow.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <a href="#about" className="w-full sm:w-auto group focus:outline-none">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 text-white px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 font-semibold text-base flex items-center justify-center gap-2">
              Get Started 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </a>
          
          <a href="#contact" className="w-full sm:w-auto group focus:outline-none">
            <button className="w-full sm:w-auto bg-white/10 backdrop-blur-xl hover:bg-white/15 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-slate-950 text-white border border-white/25 px-8 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 font-semibold text-base flex items-center justify-center gap-2">
              Contact Us
              <Mail className="w-5 h-5 text-blue-300 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </a>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 delay-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <button 
          onClick={() => window.scrollBy({ top: window.innerHeight * 0.5, behavior: "smooth" })}
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors duration-700 animate-bounce focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-2"
          aria-label="Scroll down to see more"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Animated Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none opacity-70" style={{animation: "pulse 8s ease-in-out infinite"}}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none opacity-70" style={{animation: "pulse 10s ease-in-out 2s infinite"}}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.9)_100%)] pointer-events-none"></div>
    </div>
  );
};

export default Homepage;