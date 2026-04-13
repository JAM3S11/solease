import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { Link, useLocation } from "react-router";

export const CanvasLogo = ({ isBlurred }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 40, 40);

    const gradient = ctx.createLinearGradient(0, 0, 40, 40);
    gradient.addColorStop(0, "#2563eb");
    gradient.addColorStop(1, "#06b6d4");

    ctx.fillStyle = gradient;

    const drawChevron = (yOffset, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(10, yOffset + 8);
      ctx.lineTo(20, yOffset);
      ctx.lineTo(30, yOffset + 8);
      ctx.lineTo(20, yOffset + 16);
      ctx.fill();
    };

    drawChevron(18, 0.6);
    drawChevron(10, 0.8);
    drawChevron(2, 1);

    ctx.globalAlpha = 1;
  }, [isBlurred]);

  return (
    <canvas
      ref={canvasRef}
      width="40"
      height="40"
      className="w-8 h-8 md:w-10 md:h-10"
    />
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
      behavior: "smooth",
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans ${
        isHomepage
          ? isScrolled
            ? "bg-[rgba(6,11,24,0.92)] backdrop-blur-xl border-b border-white/[0.06] py-3"
            : "bg-transparent py-5"
          : "bg-[rgba(6,11,24,0.92)] backdrop-blur-xl border-b border-white/[0.06] py-3"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
        <div className="text-xl md:text-2xl font-bold tracking-tighter">
          <Link to="/" onClick={onScrollToTop} className="flex m-0">
            <CanvasLogo isBlurred={true} />
            <span className="hidden md:block text-white">SOLEASE</span>
          </Link>
        </div>

        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-[0.01rem]">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                onClick={onScrollToTop}
                className="text-white/[0.6] hover:text-white transition-colors duration-300"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/auth/login"
            className="text-sm font-medium text-white/[0.6] hover:text-white transition-all px-4"
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="flex items-center gap-2 bg-blue-600 text-white text-sm px-6 py-2.5 rounded-full font-medium shadow-[0_0_0_1px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300"
          >
            Get Started
            <ArrowRight size={15} />
          </Link>
        </div>

        <button
          className="p-2 md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X size={28} className="hover:text-white" />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </nav>

      <div
        className={`absolute top-0 left-0 w-full md:hidden transition-all duration-500 ease-in-out -z-10 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#060b18]/95 backdrop-blur-xl"
          onClick={() => setIsMenuOpen(false)}
        ></div>

        <div className="relative bg-[#080e1e] h-auto max-h-[80vh] rounded-b-[2rem] shadow-2xl px-8 pt-24 pb-12 flex flex-col border-b border-white/[0.06] border-t border-white/[0.06]">
          <div className="flex flex-col space-y-0">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center justify-between py-4 px-2 text-base font-medium text-white/[0.6] hover:text-white border-b border-white/[0.06] transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="tracking-normal">{link.name}</span>
                <ArrowRight
                  size={18}
                  className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-blue-400"
                />
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-12">
            <Link
              to="/auth/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white bg-white/[0.06] backdrop-blur-md border border-white/[0.12] hover:bg-white/[0.1] hover:border-white/[0.2] transition-all duration-300 active:scale-95"
            >
              <User size={18} />
              Login
            </Link>
            <Link
              to="/auth/signup"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.3)] border border-blue-400/30 hover:bg-blue-700 hover:border-blue-400/50 transition-all duration-300 active:scale-95"
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