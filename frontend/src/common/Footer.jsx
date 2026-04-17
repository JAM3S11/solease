import React, { useState } from "react";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  Ticket,
  BarChart3,
  UserCog,
  ShieldCheck,
  Zap,
  Globe,
  ArrowUpRight,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Link } from "react-router";
import { CanvasLogo } from "./CanvasLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  
  // Mobile accordion state
  const [openSections, setOpenSections] = useState({
    navigation: false,
    offerings: false,
    getInTouch: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("http://localhost:5001/sol/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to connect. Please try again.");
    }
  };

  const navigation = {
    main: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Services", href: "/services" },
      { name: "Contact", href: "/contact" },
      { name: "Help Center", href: "/help-support" },
    ],
    offerings: [
      { name: "Ticket Management", href: "/help-support/ticket-management" },
      { name: "AI-Powered Triage", href: "/services#ai-powered-triage", isAI: true },
      { name: "Analytics Dashboard", href: "/services#analytics-dashboard" },
      { name: "User Management", href: "/services#user-management" },
      { name: "Automation Workflows", href: "/help-support/workflow-tools" },
      { name: "Security & Compliance", href: "/help-support/account-security" },
    ],
    resources: [
      { name: "Getting Started", href: "/help-support/getting-started" },
      { name: "Documentation", href: "/client-dashboard/knowledge" },
      { name: "Integrations", href: "/help-support/integrations" },
      { name: "Billing & Payments", href: "/help-support/billing" },
      { name: "System Status", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
      { name: "Cookie Policy", href: "/cookie-policy" },
    ],
    social: [
      { name: "Facebook", icon: Facebook, href: "#" },
      { name: "Twitter", icon: Twitter, href: "#" },
      { name: "LinkedIn", icon: Linkedin, href: "#" },
      { name: "GitHub", icon: Github, href: "https://github.com/JAM3S11/solease.git" },
    ],
  };

  return (
    <footer className="w-full bg-[#060b18] text-white/[0.48] pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 border-t border-white/[0.06] font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px]" 
          style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 0%, rgba(37,99,235,0.08) 0%, transparent 70%)' }} 
        />
        <div 
          className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-10" 
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)' }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12">
          {/* Brand Column - Full width on mobile */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] group-hover:border-blue-500/30 transition-all">
                  <CanvasLogo isBlurred={true} />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tighter">
                  SOLEASE<span className="text-blue-500">.</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed max-w-sm text-white/[0.48]">
                Empowering your business with modern AI-driven IT solutions to streamline workflows and enhance support efficiency for every user worldwide.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.1em]">Stay Updated</h3>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  disabled={status === "loading"}
                  className="flex-1 h-10 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/[0.2] focus:border-blue-500/50 focus:outline-none transition-all disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={status === "loading"}
                  className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(37,99,235,0.2)] disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span className="hidden sm:inline">Subscribing...</span>
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
              {message && (
                <div className={`flex items-center gap-2 text-xs ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                  {status === "success" ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  <span>{message}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {navigation.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-white/[0.48] hover:bg-blue-600 hover:text-white transition-all duration-300 border border-white/[0.06] hover:border-transparent group"
                  aria-label={social.name}
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Accordion Sections */}
          <div className="lg:hidden col-span-1 md:col-span-2 space-y-0">
            {/* Navigation */}
            <div className="border-b border-white/[0.06]">
              <button 
                onClick={() => toggleSection('navigation')}
                className="w-full flex items-center justify-between py-4 text-[11px] font-bold text-white uppercase tracking-[0.1em]"
              >
                Navigation
                {openSections.navigation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSections.navigation && (
                <ul className="space-y-3 pb-4">
                  {navigation.main.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-white/[0.48] hover:text-blue-400 transition-colors flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Offerings */}
            <div className="border-b border-white/[0.06]">
              <button 
                onClick={() => toggleSection('offerings')}
                className="w-full flex items-center justify-between py-4 text-[11px] font-bold text-white uppercase tracking-[0.1em]"
              >
                Offerings
                {openSections.offerings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSections.offerings && (
                <ul className="space-y-3 pb-4">
                  {navigation.offerings.map((offering) => (
                    <li key={offering.name}>
                      <Link
                        to={offering.href}
                        className="text-sm text-white/[0.48] hover:text-blue-400 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center">
                          <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                          {offering.name}
                        </div>
                        {offering.isAI && (
                          <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[8px] font-bold uppercase border border-blue-500/20">AI</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Get In Touch */}
            <div className="border-b border-white/[0.06]">
              <button 
                onClick={() => toggleSection('getInTouch')}
                className="w-full flex items-center justify-between py-4 text-[11px] font-bold text-white uppercase tracking-[0.1em]"
              >
                Get In Touch
                {openSections.getInTouch ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSections.getInTouch && (
                <div className="space-y-4 pb-4">
                  <a href="#" className="flex items-start gap-3 group text-sm text-white/[0.48] hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <MapPin size={14} />
                    </div>
                    <span>Crossways, Westlands<br />Nairobi, Kenya</span>
                  </a>
                  <a href="tel:+254700123456" className="flex items-center gap-3 group text-sm text-white/[0.48] hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <Phone size={14} />
                    </div>
                    <span>+254 700 123 456</span>
                  </a>
                  <a href="mailto:support@solease.com" className="flex items-center gap-3 group text-sm text-white/[0.48] hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <Mail size={14} />
                    </div>
                    <span>support@solease.com</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Columns - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-2 space-y-6">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.1em]">Navigation</h3>
            <ul className="space-y-3">
              {navigation.main.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/[0.48] hover:text-blue-400 transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.1em]">Offerings</h3>
            <ul className="space-y-3">
              {navigation.offerings.map((offering) => (
                <li key={offering.name}>
                  <Link
                    to={offering.href}
                    className="text-sm text-white/[0.48] hover:text-blue-400 transition-colors flex items-center justify-between group pr-4"
                  >
                    <div className="flex items-center">
                      <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                      {offering.name}
                    </div>
                    {offering.isAI && (
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[8px] font-bold uppercase border border-blue-500/20">AI</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block lg:col-span-3 space-y-8">
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.1em]">Get In Touch</h3>
              <div className="space-y-4">
                <a href="#" className="flex items-start gap-3 group text-sm text-white/[0.48] hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span>Crossways, Westlands<br />Nairobi, Kenya</span>
                </a>
                <a href="tel:+254700123456" className="flex items-center gap-3 group text-sm text-white/[0.48] hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <Phone size={14} />
                  </div>
                  <span>+254 700 123 456</span>
                </a>
                <a href="mailto:support@solease.com" className="flex items-center gap-3 group text-sm text-white/[0.48] hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <Mail size={14} />
                  </div>
                  <span>support@solease.com</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <Globe size={14} strokeWidth={3} className="text-blue-400" />
                GLOBAL AVAILABILITY
              </div>
              <p className="text-[11px] leading-relaxed text-white/[0.4]">
                Enterprise-grade support and localized solutions for clients across East Africa and beyond.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-white/[0.06]">
          {/* Desktop: All in one line */}
          <div className="hidden lg:flex flex-wrap items-center justify-between gap-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/[0.3]">
              &copy; {currentYear} SOLEASE. ALL RIGHTS RESERVED.
            </p>
            
            <div className="flex items-center gap-6">
              {navigation.legal.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className="text-[10px] font-bold uppercase tracking-widest text-white/[0.3] hover:text-blue-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/[0.2] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                SYSTEM STATUS: OPERATIONAL
              </div>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/[0.2] hover:text-white hover:border-white/[0.2] transition-all"
                aria-label="Scroll to top"
              >
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>

          {/* Mobile: Stacked layout */}
          <div className="lg:hidden flex flex-col items-center gap-3">
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-white/[0.3] text-center">
              &copy; {currentYear} SOLEASE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {navigation.legal.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/[0.3] hover:text-blue-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/[0.2] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="hidden sm:inline">SYSTEM STATUS: OPERATIONAL</span>
              <span className="sm:hidden">OPERATIONAL</span>
            </div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/[0.2] hover:text-white hover:border-white/[0.2] transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUpRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
