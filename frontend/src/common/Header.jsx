import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // icons
import { Link } from "react-router";

const Header = () => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsBlurred(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition ${
        isBlurred ? "backdrop-blur-lg bg-white/70 shadow" : "bg-transparent"
      } md:gap-2`}
    >
      <nav className="flex items-center justify-between px-5 md:px-9 py-4">
        {/* Logo */}
        <div className="text-xl md:text-3xl font-bold text-blue-600 drop-shadow">
          SOLEASE
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-1 md:space-x-6">
          <li>
            <a href="#home" className="text-gray-800 hover:text-blue-500 transition font-medium">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="text-gray-800 hover:text-blue-500 transition font-medium">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="text-gray-800 hover:text-blue-500 transition font-medium">
              Services
            </a>
          </li>
          <li>
            <a href="#contact" className="text-gray-800 hover:text-blue-500 transition font-medium">
              Contact
            </a>
          </li>
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex space-x-3">
          <Link 
            to={"/login"} 
            className="bg-white text-blue-500 text-sm md:text-base px-2 md:px-4 py-1 md:py-2 rounded-lg shadow hover:bg-blue-100 transition-all duration-200 ease-in-out font-semibold">
            Login
          </Link>
          <Link
            to={"/signup"}
            className="bg-blue-500 text-white text-sm md:text-base px-2 md:px-4 py-1 md:py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 ease-in-out font-semibold"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="block md:hidden text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-lg shadow-lg px-6 py-4 space-y-4">
          <a href="#home" className="block text-gray-800 hover:text-blue-500 font-medium">
            Home
          </a>
          <a href="#about" className="block text-gray-800 hover:text-blue-500 font-medium">
            About
          </a>
          <a href="#services" className="block text-gray-800 hover:text-blue-500 font-medium">
            Services
          </a>
          <a href="#contact" className="block text-gray-800 hover:text-blue-500 font-medium">
            Contact
          </a>
          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
            <Link 
              to={"/login"} 
              className="bg-white/50 text-blue-500 px-4 py-2 rounded-lg shadow hover:bg-blue-100 transition font-semibold">
              Contact Sales
            </Link>
            <Link
              to={"/signup"}
              className="bg-blue-500/50 text-white text-center px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;