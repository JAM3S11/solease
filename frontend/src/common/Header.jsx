import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { Link, useLocation } from "react-router";

export const CanvasLogo = ({ isBlurred }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if(!canvas) return;

    const ctx = canvas.getContext('2d');

    // CLear for redrawing
    ctx.clearRect(0, 0, 40, 40);

    // Background gradient based on the scroll state
    const gradient = ctx.createLinearGradient(0, 0, 40, 40);
    if(isBlurred){
      gradient.addColorStop(0, '#2563EB');
      gradient.addColorStop(1, '#06B6D4');
    } else {
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, '#93C5FD');
    }

    ctx.fillStyle = gradient;

    // Drew the S-shape layer
    const drawChevron = (yOffset, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(10, yOffset + 8);
      ctx.lineTo(20, yOffset);
      ctx.lineTo(30, yOffset + 8);
      ctx.lineTo(20, yOffset + 16);
      ctx.fill();
    }

    drawChevron(18, 0.6); // Bottom
    drawChevron(10, 0.8); // Middle
    drawChevron(2, 1);    // Top

    ctx.globalAlpha = 1;
  }, [isBlurred]);

  return <canvas ref={canvasRef} width='40' height='40' className="w-8 h-8 md:w-10 md:h-10" />
}

const Header = () => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsBlurred(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
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
        isHomepage
          ? isBlurred
            ? "backdrop-blur-2xl bg-white/90 border-b border-gray-200 py-3 shadow-sm"
            : "bg-transparent py-5"
          : "backdrop-blur-2xl bg-white/90 border-b border-gray-200 py-3 shadow-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <div className={`text-3xl md:text-4xl font-black tracking-tighter drop-shadow-sm ${
          isHomepage && !isBlurred ? "text-white" : "text-blue-600"
        }`}>
          <Link to="/" onClick={onScrollToTop} className="flex m-0">
            <CanvasLogo isBlurred={isHomepage ? isBlurred : true} />{" "}
            <span className="hidden md:block">SOLEASE</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8 uppercase text-sm font-bold tracking-[0.06em]">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                onClick={onScrollToTop}
                className={`relative transition-colors duration-300 group ${
                  isHomepage && !isBlurred
                    ? "text-white hover:text-blue-300"
                    : "text-gray-900 hover:text-blue-700"
                }`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/auth/login"
            className={`text-sm font-bold transition-all px-4 ${
              isHomepage && !isBlurred
                ? "text-white hover:text-blue-300"
                : "text-gray-900 hover:text-blue-700"
            }`}
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
          className={`p-2 md:hidden transition-colors ${
            isHomepage && !isBlurred ? "text-white" : "text-gray-900"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} className="hover:text-white" /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <div 
        className={`absolute top-0 left-0 w-full h-screen md:hidden transition-all duration-500 ease-in-out -z-10 ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        {/* Semi-transparent background overlay */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-lg" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Menu Content Container */}
         <div className="relative bg-white/5 backdrop-blur-2xl h-auto max-h-[80vh] rounded-b-[2rem] shadow-2xl px-8 pt-24 pb-12 flex flex-col border-b border-white/20 border-t border-white/10">
          <div className="flex flex-col space-y-0">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center justify-between py-5 px-2 text-lg font-semibold text-white hover:text-blue-400 border-b border-white/8 transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="tracking-wide">{link.name}</span>
                <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-blue-400" />
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-12">
            <Link
              to="/auth/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 active:scale-95"
            >
              <User size={18} />
              Login
            </Link>
            <Link
              to="/auth/signup"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600/80 backdrop-blur-md shadow-lg shadow-blue-500/20 border border-blue-400/30 hover:bg-blue-600 hover:border-blue-400/50 transition-all duration-300 active:scale-95"
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