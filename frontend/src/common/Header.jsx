import React, { useEffect, useState } from "react";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { Link } from "react-router";

const Header = () => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsBlurred(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Contact", href: "#contact" },
  ];

  const onScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans ${
        isBlurred
          ? "backdrop-blur-2xl bg-white/40 border-b border-white/10 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <div className="text-3xl md:text-4xl font-black tracking-tighter text-blue-600 drop-shadow-sm">
          <Link to="/" onClick={onScrollToTop}>SOLEASE</Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8 uppercase text-sm font-bold tracking-[0.06em]">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className={`relative transition-colors duration-300 group ${isBlurred ? "text-gray-900 hover:text-blue-700" : "text-white hover:text-blue-400"}`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/auth/login"
            className={`text-sm font-bold transition-all px-4 ${isBlurred ? "text-gray-900 hover:text-blue-700" : "text-white hover:text-blue-400"}`}
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="flex items-center gap-2 bg-blue-600 text-white text-sm px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:-translate-y-0.5 transition-all duration-300 font-bold"
          >
            Get Started
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`p-2 md:hidden transition-colors ${isBlurred ? "text-gray-900" : "text-white"}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <div 
        className={`absolute top-0 left-0 w-full h-screen md:hidden transition-all duration-500 ease-in-out -z-10 ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        {/* Semi-transparent background overlay */}
        <div className="absolute inset-5 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Menu Content Container */}
         <div className="relative bg-[#0a0a0a]/80 h-auto max-h-[80vh] rounded-b-[2rem] shadow-2xl px-8 pt-24 pb-12 flex flex-col border-b border-white/10">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center justify-between py-4 text-xl font-bold text-white hover:text-blue-600 border-b border-white/10 transition-all"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.name}
                <ArrowRight size={18} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <Link
              to="/auth/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-gray-800 hover:bg-gray-700 transition-all active:scale-95"
            >
              <User size={18} />
              Login
            </Link>
            <Link
              to="/auth/signup"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-blue-600 shadow-xl shadow-blue-500/20 active:scale-95"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;