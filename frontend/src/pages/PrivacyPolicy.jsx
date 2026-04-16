import React, { useState, useEffect, useCallback } from "react";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
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
  Menu
} from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "../components/ui/drawer";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("principles");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sections = [
    { id: "principles", title: "Our Core Principles", icon: Zap, color: "yellow" },
    { id: "collection", title: "Information We Collect", icon: Database, color: "blue" },
    { id: "usage", title: "How We Use Data", icon: Eye, color: "green" },
    { id: "protection", title: "Security Measures", icon: Lock, color: "purple" },
    { id: "rights", title: "Your Privacy Rights", icon: UserCheck, color: "orange" },
    { id: "cookies", title: "Cookies & Tracking", icon: Fingerprint, color: "cyan" },
    { id: "compliance", title: "Compliance Standards", icon: Globe, color: "indigo" },
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

  return (
    <div className="min-h-screen w-full bg-[#060b18] font-sans relative overflow-hidden text-white/90">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] -left-20 w-[40rem] h-[40rem] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] -right-20 w-[50rem] h-[50rem] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02]" 
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '48px 48px' }} 
        />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-20" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent opacity-20" />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between p-4 bg-[#060b18]/80 backdrop-blur-md border-b border-white/[0.06]">
        <button 
          onClick={() => setMobileNavOpen(true)}
          className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/60"
        >
          <Menu size={20} />
        </button>
        <span className="text-xs font-bold text-white uppercase tracking-widest">Privacy Protocol</span>
        <Shield size={18} className="text-blue-500" />
      </div>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} placement="left">
        <DrawerOverlay />
        <DrawerContent className="bg-[#060b18] border-r border-white/[0.06]">
          <DrawerHeader className="border-b border-white/[0.06]">
            <DrawerTitle className="text-white">
              <div className="flex items-center gap-3">
                <Shield className="text-blue-500" size={20} />
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
                      ? 'bg-blue-600 text-white'
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
        
        {/* Pinned-Release Container */}
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Desktop Sidebar - Sticky within this container */}
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
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                      }`}
                    >
                      <section.icon size={18} className={activeSection === section.id ? 'text-white' : 'text-white/40 group-hover:text-blue-400'} />
                      <span className="text-xs font-semibold">{section.title}</span>
                      {activeSection === section.id && (
                        <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-white/[0.05] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full" />
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Shield className="text-blue-500" size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Trust Dashboard</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Real-time transparency on how SolEase manages, encrypts, and audits your enterprise data.
                  </p>
                  <Link to="/contact" className="text-[10px] text-blue-400 font-extrabold flex items-center gap-2 hover:gap-3 transition-all tracking-widest uppercase">
                    VIEW COMPLIANCE <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area - Defines the Sticky boundary */}
          <main className="flex-1 min-w-0">
            
            {/* Architectural Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 mb-20"
            >
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-blue-500/50" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">Precision Governance</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                Data Privacy & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Infrastructure Trust</span>
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <Lock className="text-blue-500 shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Zero Trust</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Identity-driven security architecture across every touchpoint.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <Database className="text-indigo-400 shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Data Sovereignty</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Granular control over where and how your data resides.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <RefreshCw className="text-purple-400 shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Total Portability</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Your data belongs to you. Export or delete with one click.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Policy Sections */}
            <div className="space-y-12">
              <section id="principles">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] relative group"
                >
                  <div className="flex flex-col md:flex-row gap-10">
                    <div className="md:w-1/3 space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                        <Zap size={28} />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Our Privacy Philosophy</h2>
                      <p className="text-sm text-white/40 leading-relaxed">
                        At SolEase, we view privacy not as a compliance checkbox, but as a technical requirement of elite IT service.
                      </p>
                    </div>
                    <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { t: "Minimalism", d: "We only collect what is strictly necessary for service delivery." },
                        { t: "Transparency", d: "Plain-English explanations for every data point we process." },
                        { t: "Security by Default", d: "Encryption and protection are built into the source code." },
                        { t: "User Agency", d: "You have absolute control over your digital footprint." }
                      ].map(p => (
                        <div key={p.t} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                          <h4 className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">{p.t}</h4>
                          <p className="text-xs text-white/50 leading-relaxed">{p.d}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section id="collection">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group h-full p-8 rounded-[2rem] bg-white/[0.015] border border-white/[0.05] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity">
                      <Database size={160} />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <Database size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Information We Collect</h2>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Data Input Inventory</p>
                      </div>
                    </div>
                    <div className="space-y-4 relative z-10">
                      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <h3 className="text-xs font-bold text-white/80 uppercase mb-2">Identity & Access</h3>
                        <p className="text-xs text-white/40 leading-relaxed">Professional markers used to provision secure IT environments.</p>
                      </div>
                    </div>
                  </motion.div>
                </section>

                <section id="usage">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group h-full p-8 rounded-[2rem] bg-white/[0.015] border border-white/[0.05] hover:border-green-500/30 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-green-600/20 flex items-center justify-center text-green-400">
                        <Eye size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-white">Utilization Protocol</h2>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">We use telemetry to optimize system response and predictive maintenance.</p>
                  </motion.div>
                </section>

                <section id="protection">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group h-full p-8 rounded-[2rem] bg-white/[0.015] border border-white/[0.05] hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                        <Lock size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-white">Fortress Security</h2>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">Bank-grade encryption for all enterprise data at rest and in transit.</p>
                  </motion.div>
                </section>

                <section id="rights">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group h-full p-8 rounded-[2rem] bg-white/[0.015] border border-white/[0.05] hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-orange-600/20 flex items-center justify-center text-orange-400">
                        <UserCheck size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-white">Your Control</h2>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">Absolute right to access, export, or permanently delete your data.</p>
                  </motion.div>
                </section>
              </div>

              <section id="cookies">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-[2.5rem] bg-gradient-to-r from-cyan-900/10 to-transparent border border-cyan-500/20 flex flex-col md:flex-row items-center gap-10"
                >
                  <Fingerprint size={40} className="text-cyan-400" />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white">Cookie Governance</h2>
                    <p className="text-xs text-white/50 leading-relaxed">Technical cookies only. No third-party behavioral tracking.</p>
                  </div>
                </motion.div>
              </section>

              <section id="compliance">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-10 rounded-[2.5rem] bg-white/[0.015] border border-white/[0.05]"
                >
                  <h2 className="text-xl font-bold text-white mb-6">Compliance Standards</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["GDPR", "SOC2", "CCPA", "HIPAA"].map(c => (
                      <div key={c} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
                        <span className="text-xs font-bold text-white">{c}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </section>

              <section id="updates">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <Bell size={32} className="text-blue-500" />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2">Policy Synchronized</h2>
                      <p className="text-sm text-white/60">Last Updated: October 24, 2024</p>
                    </div>
                  </div>
                </motion.div>
              </section>

            </div>
          </main>
        </div>

        {/* Final CTA - Outside the sticky boundary */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-16 rounded-[3rem] bg-[#080e1e] border border-white/[0.05] relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.07] to-transparent" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl font-bold text-white">Need a Privacy Deep-Dive?</h2>
            <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 rounded-[1.25rem] bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all">
              Connect with DPO <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
