import React, { useState, useEffect, useCallback } from "react";
import { 
  Cookie, 
  Shield, 
  Lock, 
  Eye, 
  Settings, 
  ArrowRight, 
  ChevronRight,
  FileText,
  AlertCircle,
  Bell,
  Fingerprint,
  Zap,
  Globe,
  Cpu,
  RefreshCw,
  Search,
  Menu,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Database,
  Target,
  Clock,
  Trash2
} from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "../components/ui/drawer";

const CookiePolicy = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  const sections = [
    { id: "overview", title: "Policy Overview", icon: Cookie, color: "blue" },
    { id: "what-are-cookies", title: "What Are Cookies", icon: FileText, color: "cyan" },
    { id: "types-we-use", title: "Cookie Types We Use", icon: Database, color: "green" },
    { id: "purposes", title: "Cookie Purposes", icon: Target, color: "purple" },
    { id: "third-party", title: "Third-Party Cookies", icon: Globe, color: "orange" },
    { id: "manage", title: "Managing Cookies", icon: Settings, color: "yellow" },
    { id: "updates", title: "Policy Updates", icon: Bell, color: "pink" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 90,
        behavior: "smooth"
      });
    }
    setMobileNavOpen(false);
  }, []);

  const handlePreferenceChange = (key) => {
    if (key === 'necessary') return;
    setCookiePreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const cookieTypes = [
    {
      id: "essential",
      name: "Essential Cookies",
      description: "Required for core platform functionality",
      examples: ["Session authentication", "Security tokens", "Load balancing", "Shopping cart data"],
      duration: "Session / 24 hours",
      required: true,
      color: "blue"
    },
    {
      id: "functional",
      name: "Functional Cookies",
      description: "Enable enhanced functionality and personalization",
      examples: ["Language preferences", "Theme settings", "Recent activity", "Custom shortcuts"],
      duration: "30 days",
      required: false,
      color: "purple"
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description: "Help us understand platform usage patterns",
      examples: ["Page views", "Feature usage", "Error tracking", "Performance metrics"],
      duration: "12 months",
      required: false,
      color: "green"
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description: "Used for targeted communications (we don't use these)",
      examples: ["Ad targeting", "Cross-site tracking", "Profile building"],
      duration: "N/A",
      required: false,
      color: "red",
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#060b18] font-sans relative overflow-hidden text-white/90">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] -left-20 w-[40rem] h-[40rem] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] -right-20 w-[50rem] h-[50rem] bg-cyan-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02]" 
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '48px 48px' }} 
        />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent opacity-20" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-20" />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between p-4 bg-[#060b18]/80 backdrop-blur-md border-b border-white/[0.06]">
        <button 
          onClick={() => setMobileNavOpen(true)}
          className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60"
        >
          <Menu size={20} />
        </button>
        <span className="text-xs font-bold text-white uppercase tracking-widest">Cookie Protocol</span>
        <Cookie size={18} className="text-cyan-500" />
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} placement="left">
        <DrawerOverlay />
        <DrawerContent className="bg-[#060b18] border-r border-white/[0.06]">
          <DrawerHeader className="border-b border-white/[0.06]">
            <DrawerTitle className="text-white">
              <div className="flex items-center gap-3">
                <Cookie className="text-cyan-500" size={20} />
                <span className="text-sm font-bold uppercase tracking-wider">Navigation</span>
              </div>
            </DrawerTitle>
            <DrawerClose className="text-white/60 hover:text-white" />
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeSection === section.id
                      ? 'bg-cyan-600 text-white'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                  }`}
                >
                  <section.icon size={18} />
                  <span className="text-sm font-semibold">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="max-w-7xl mx-auto px-6 lg:pt-32 pt-12 pb-24 relative z-10">
        
        {/* Main Container */}
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Desktop Sidebar - Sticky */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0 lg:sticky lg:top-32 h-fit self-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-white/20" /> NAVIGATION
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        activeSection === section.id
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                          : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                      }`}
                    >
                      <section.icon size={18} className={activeSection === section.id ? 'text-white' : 'text-white/40 group-hover:text-cyan-400'} />
                      <span className="text-xs font-semibold">{section.title}</span>
                      {activeSection === section.id && (
                        <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-600/10 via-transparent to-transparent border border-white/[0.05] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full" />
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Shield className="text-cyan-500" size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cookie Control Center</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    SolEase uses only essential cookies. No behavioral tracking or third-party marketing cookies.
                  </p>
                  <Link to="/contact" className="text-[10px] text-cyan-400 font-extrabold flex items-center gap-2 hover:gap-3 transition-all tracking-widest uppercase">
                    CONTACT DPO <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 mb-20"
            >
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-cyan-500/50" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">Cookie Governance</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                Cookie Policy & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500">Tracking Transparency</span>
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <Lock className="text-cyan-500 shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Essential Only</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Only technically necessary cookies for core platform functionality.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <Eye className="text-blue-400 shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Full Transparency</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Clear breakdown of every cookie we set and why we set it.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <Settings className="text-purple-400 shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">User Control</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">You decide which optional cookies to enable or disable.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Policy Sections */}
            <div className="space-y-12">
              <section id="overview">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] relative group"
                >
                  <div className="flex flex-col md:flex-row gap-10">
                    <div className="md:w-1/3 space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                        <Cookie size={28} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Cookie Policy at a Glance</h2>
                      <p className="text-sm text-white/40 leading-relaxed">
                        This policy explains how SolEase uses cookies and similar tracking technologies to power our IT support platform.
                      </p>
                    </div>
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { t: "Minimal Collection", d: "We collect only essential cookies required for platform operation." },
                        { t: "No Marketing Cookies", d: "We never use cookies for advertising or cross-site tracking." },
                        { t: "Your Choices Matter", d: "Control which optional cookies are set through preferences." },
                        { t: "Clear Explanations", d: "Every cookie has a documented purpose in this policy." }
                      ].map(p => (
                        <div key={p.t} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">{p.t}</h4>
                          <p className="text-xs text-white/50 leading-relaxed">{p.d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </section>

              <section id="what-are-cookies">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group p-8 rounded-[2rem] bg-white/[0.015] border border-white/[0.05] hover:border-cyan-500/30 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity">
                    <Cookie size={160} />
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">What Are Cookies?</h2>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Technical Definition</p>
                    </div>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <p className="text-sm text-white/50 leading-relaxed">
                      Cookies are small text files that are stored on your device when you visit a website. They serve various purposes, from enabling essential features to providing analytics insights. SolEase uses a minimal cookie approach—prioritizing only those necessary for platform functionality.
                    </p>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                      <h3 className="text-xs font-bold text-white/80 uppercase mb-3">Key Points</h3>
                      <ul className="space-y-2 text-xs text-white/50">
                        <li className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                          <span>Cookies are stored locally on your browser, not on our servers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                          <span>You can view, manage, and delete cookies at any time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                          <span>Most cookies are "session" cookies that expire when you close your browser</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              <section id="types-we-use">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-bold text-white mb-2">Cookie Types We Use</h2>
                  <p className="text-sm text-white/40 mb-8">Comprehensive breakdown of all tracking technologies deployed on our platform</p>
                  
                  <div className="space-y-4">
                    {cookieTypes.map((type, idx) => (
                      <motion.div 
                        key={type.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-6 rounded-2xl border transition-all duration-300 ${
                          type.disabled 
                            ? 'bg-red-500/[0.02] border-red-500/10 opacity-60' 
                            : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              type.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                              type.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                              type.color === 'green' ? 'bg-green-500/20 text-green-400' :
                              type.color === 'red' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {type.disabled ? <XCircle size={20} /> : <CheckCircle size={20} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-white">{type.name}</h3>
                                {type.required && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[8px] font-bold uppercase border border-blue-500/20">
                                    Required
                                  </span>
                                )}
                                {type.disabled && (
                                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[8px] font-bold uppercase border border-red-500/20">
                                    Not Used
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/40 mt-1">{type.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <Clock size={14} className="text-white/30" />
                            <span className="text-white/50">{type.duration}</span>
                          </div>
                        </div>
                        {!type.disabled && (
                          <div className="mt-4 pt-4 border-t border-white/[0.05]">
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Examples:</p>
                            <div className="flex flex-wrap gap-2">
                              {type.examples.map((ex, i) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-white/[0.03] text-white/50 text-xs">
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>

              <section id="purposes">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-[2.5rem] bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-500/20"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                      <Target size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Detailed Cookie Purposes</h2>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Why We Use Each Type</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Essential / Strictly Necessary</h3>
                      <ul className="space-y-3 text-sm text-white/50">
                        <li className="flex items-start gap-2">
                          <ArrowRight size={14} className="text-blue-400 mt-1 shrink-0" />
                          <span><strong className="text-white">Authentication:</strong> Maintain your logged-in session across page navigations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight size={14} className="text-blue-400 mt-1 shrink-0" />
                          <span><strong className="text-white">Security:</strong> CSRF tokens to prevent cross-site request forgery attacks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight size={14} className="text-blue-400 mt-1 shrink-0" />
                          <span><strong className="text-white">Load Balancing:</strong> Distribute traffic across servers for optimal performance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight size={14} className="text-blue-400 mt-1 shrink-0" />
                          <span><strong className="text-white">Accessibility:</strong> Remember your UI preferences (theme, language)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Functional Cookies (Optional)</h3>
                      <ul className="space-y-3 text-sm text-white/50">
                        <li className="flex items-start gap-2">
                          <ArrowRight size={14} className="text-purple-400 mt-1 shrink-0" />
                          <span><strong className="text-white">Preferences:</strong> Remember your selected language and display settings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight size={14} className="text-purple-400 mt-1 shrink-0" />
                          <span><strong className="text-white">Recent Activity:</strong> Quick access to recently viewed tickets and articles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight size={14} className="text-purple-400 mt-1 shrink-0" />
                          <span><strong className="text-white">Form Data:</strong> Save draft responses to prevent data loss</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              <section id="third-party">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-[2.5rem] bg-gradient-to-br from-orange-900/10 to-transparent border border-orange-500/20"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-orange-600/20 flex items-center justify-center text-orange-400">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Third-Party Cookies</h2>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">External Services & Data Sharing</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-green-500/[0.05] border border-green-500/20 mb-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="text-sm font-bold text-green-400 mb-1">No Third-Party Marketing Cookies</h4>
                        <p className="text-xs text-white/50">
                          SolEase does not use any third-party cookies for advertising, behavioral targeting, or cross-site tracking. We do not share cookie data with external advertisers or data brokers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">Limited Third-Party Services</h3>
                    {[
                      { 
                        name: "Analytics (Optional)", 
                        provider: "Self-hosted Matomo / Plausible",
                        purpose: "Aggregate, anonymized usage statistics",
                        cookies: ["_pk_id", "_pk_ses", "plausible_id"],
                        dataShared: "Anonymized page views only, no PII"
                      },
                      { 
                        name: "Content Delivery", 
                        provider: "Cloudflare",
                        purpose: "Security protection and DDoS mitigation",
                        cookies: ["__cf_bm", "_cf_bm"],
                        dataShared: "Technical traffic data only"
                      }
                    ].map((service, i) => (
                      <div key={i} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-xs font-bold text-white">{service.name}</h4>
                          <span className="text-[10px] text-white/30">Optional</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-white/30">Provider:</span>
                            <span className="text-white/60 ml-2">{service.provider}</span>
                          </div>
                          <div>
                            <span className="text-white/30">Purpose:</span>
                            <span className="text-white/60 ml-2">{service.purpose}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-white/30">Data Shared:</span>
                            <span className="text-white/60 ml-2">{service.dataShared}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </section>

              <section id="manage">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-[2.5rem] bg-gradient-to-br from-yellow-900/10 to-transparent border border-yellow-500/20"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-600/20 flex items-center justify-center text-yellow-400">
                      <Settings size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Managing Your Cookie Preferences</h2>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Control What We Store</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {[
                      { key: 'necessary', label: 'Essential Cookies', desc: 'Required for platform to function. Cannot be disabled.', required: true },
                      { key: 'functional', label: 'Functional Cookies', desc: 'Enable personalized features and preferences.', required: false },
                      { key: 'analytics', label: 'Analytics Cookies', desc: 'Help us understand how the platform is used.', required: false },
                      { key: 'marketing', label: 'Marketing Cookies', desc: 'Not used by SolEase - these are always off.', required: false, disabled: true }
                    ].map((pref) => (
                      <div 
                        key={pref.key}
                        className={`p-5 rounded-xl border flex items-center justify-between ${
                          pref.disabled 
                            ? 'bg-red-500/[0.02] border-red-500/10' 
                            : 'bg-white/[0.02] border-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                            cookiePreferences[pref.key] ? 'bg-cyan-500' : 'bg-white/10'
                          }`}>
                            {cookiePreferences[pref.key] && <CheckCircle size={12} className="text-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{pref.label}</h4>
                              {pref.required && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[8px] font-bold uppercase border border-blue-500/20">
                                  Always On
                                </span>
                              )}
                              {pref.disabled && (
                                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[8px] font-bold uppercase border border-red-500/20">
                                  Not Used
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/40 mt-1">{pref.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange(pref.key)}
                          disabled={pref.required || pref.disabled}
                          className={`w-12 h-6 rounded-full transition-all ${
                            cookiePreferences[pref.key] 
                              ? 'bg-cyan-500' 
                              : 'bg-white/10'
                          } ${pref.required || pref.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            cookiePreferences[pref.key] ? 'translate-x-7' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-3 mb-3">
                        <Trash2 size={16} className="text-white/40" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Browser Settings</h4>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">
                        You can manage cookies through your browser settings. Most browsers allow you to block all cookies, delete existing cookies, or receive notifications when new cookies are set.
                      </p>
                    </div>
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle size={16} className="text-yellow-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Important Note</h4>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">
                        Disabling essential cookies will prevent you from logging in, submitting tickets, and accessing core platform features. These are required for platform operation.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              <section id="updates">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-[2rem] bg-gradient-to-br from-cyan-600/10 to-transparent border border-cyan-500/20"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <Bell size={32} className="text-cyan-500" />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2">Policy Updates</h2>
                      <p className="text-sm text-white/60">Last Updated: April 17, 2026</p>
                      <p className="text-xs text-white/40 mt-4 leading-relaxed">
                        We may update this Cookie Policy to reflect changes in our practices or for operational, legal, or regulatory reasons. When we make material changes, we will notify you through the platform and update the "Last Updated" date at the top of this page.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

            </div>
          </main>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-16 rounded-[3rem] bg-[#080e1e] border border-white/[0.05] relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/[0.07] to-transparent" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl font-bold text-white">Questions About Cookies?</h2>
            <p className="text-white/50 max-w-xl mx-auto">Our Data Protection Officer can help with any questions about our cookie practices or privacy commitments.</p>
            <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-[1.25rem] bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-all">
              Contact DPO <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CookiePolicy;
