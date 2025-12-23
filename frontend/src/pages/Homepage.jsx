import React from "react";
import { ArrowLeft } from "lucide-react";

const Homepage = () => {
  return (
    <div
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, rgba(173, 194, 230, 0.3) 0%, rgba(133, 175, 242, 0.2) 100%), url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0) center/cover no-repeat",
        filter: "blur(0.5px)",
      }}
    >
      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full px-6 sm:px-10 py-16 sm:py-20 flex flex-col items-center text-center">
        {/* Tagline */}
        <div className="mb-6 sm:mb-10 flex flex-col items-center">
          <span className="inline-block bg-blue-600/80 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 rounded-full uppercase tracking-widest mb-4 shadow-lg">
            New Era of Business
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-xl leading-tight">
            Welcome to{" "}
            <span className="text-blue-400 uppercase">SOLEASE</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 font-medium max-w-2xl">
            Empowering your business with{" "}
            <span className="text-blue-200 font-semibold">
              modern solutions
            </span>
            . Discover our services and see how we can help you grow.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto justify-center">
          <a href="#about" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-800 hover:-translate-y-1 md:hover:-translate-x-1 md:hover:translate-y-0 font-bold text-base sm:text-lg tracking-wide flex items-center justify-center gap-2">
              Get Started 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </a>
          <a href="#contact" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-white/80 text-blue-700 px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:bg-white transition-all font-bold text-base sm:text-lg tracking-wide border border-blue-100 hover:translate-y-1 md:hover:translate-x-1 md:hover:translate-y-0 flex items-center justify-center gap-2">
              Contact Us
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </a>
        </div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-blue-400 opacity-30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-indigo-500 opacity-20 rounded-full blur-2xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 bg-white opacity-10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    </div>
  );
};

export default Homepage;
