import React, { useState, useEffect } from "react";
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
  Fingerprint
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "collection", title: "Information We Collect", icon: Database, color: "blue" },
    { id: "usage", title: "How We Use Data", icon: Eye, color: "green" },
    { id: "protection", title: "Security Measures", icon: Lock, color: "purple" },
    { id: "rights", title: "Your Privacy Rights", icon: UserCheck, color: "orange" },
    { id: "cookies", title: "Cookies & Tracking", icon: Fingerprint, color: "cyan" },
    { id: "updates", title: "Policy Updates", icon: Bell, color: "pink" }
  ];

  useEffect(() => {
    const sections = [
      { id: "collection", title: "Information We Collect", icon: Database, color: "blue" },
      { id: "usage", title: "How We Use Data", icon: Eye, color: "green" },
      { id: "protection", title: "Security Measures", icon: Lock, color: "purple" },
      { id: "rights", title: "Your Privacy Rights", icon: UserCheck, color: "orange" },
      { id: "cookies", title: "Cookies & Tracking", icon: Fingerprint, color: "cyan" },
      { id: "updates", title: "Policy Updates", icon: Bell, color: "pink" }
    ];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition && element.offsetTop + element.offsetHeight > scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 90,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#060b18] font-sans relative overflow-hidden">
        {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] -left-20 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] -right-20 w-[40rem] h-[40rem] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
          style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
{/* Left Sidebar - Navigation */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-20 space-y-8">
              <div>
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-6">On This Page</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                          activeSection === section.id 
                            ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                            : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]"
                      }`}
                    >
                      <section.icon size={16} className={activeSection === section.id ? "text-blue-400" : "text-inherit"} />
                      <span className="text-xs font-medium">{section.title}</span>
                      {activeSection === section.id && (
                        <motion.div layoutId="active-indicator" className="ml-auto">
                          <ChevronRight size={14} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent border border-white/[0.05] space-y-4">
                <Shield className="text-blue-500 w-8 h-8" />
                <h4 className="text-sm font-semibold text-white">Trust Center</h4>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Our commitment to security and transparency is at the core of everything we build at SOLEASE.
                </p>
                <Link to="/contact" className="text-[11px] text-blue-400 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  LEARN MORE <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 space-y-16">
            
            {/* Hero Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Security & Privacy First</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Policy</span>
              </h1>
              <p className="text-lg text-white/50 max-w-3xl leading-relaxed">
                We believe privacy is a fundamental right. This document explains how we handle your data with the highest standards of security and transparency.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#060b18] bg-blue-600/20 flex items-center justify-center">
                      <Shield size={12} className="text-blue-400" />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-white/30 italic">Trusted by 10,000+ organizations worldwide</span>
              </div>
            </motion.div>

            {/* Grid of Policy Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Information Collection */}
              <motion.section 
                id="collection"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <Database size={120} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Database size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-4">Information We Collect</h2>
                <p className="text-sm text-white/50 mb-6 leading-relaxed">We collect information to provide, improve, and personalize our services. The data we collect depends on how you use our platform.</p>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <h3 className="text-xs font-bold text-white/80 uppercase mb-2">Personal Identity</h3>
                    <p className="text-sm text-white/40 leading-relaxed">Full name, email address, phone number, and professional role within your organization.</p>
                    <ul className="mt-3 space-y-2">
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Account registration details</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Profile information you provide</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Organization affiliation</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <h3 className="text-xs font-bold text-white/80 uppercase mb-2">Technical Metadata</h3>
                    <p className="text-sm text-white/40 leading-relaxed">Device information, IP address, browser type, operating system, and access timestamps.</p>
                    <ul className="mt-3 space-y-2">
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Device identifiers and specifications</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Connection data and bandwidth</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Referral and exit pages</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <h3 className="text-xs font-bold text-white/80 uppercase mb-2">Usage Data</h3>
                    <p className="text-sm text-white/40 leading-relaxed">Features used, time spent on platform, and interaction patterns.</p>
                    <ul className="mt-3 space-y-2">
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Page views and navigation</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Workflow completion rates</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Service preferences</li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Data Usage */}
              <motion.section 
                id="usage"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-green-500/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <Eye size={120} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-600/20 flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Eye size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-4">How We Use Data</h2>
                <p className="text-sm text-white/50 mb-6 leading-relaxed">Your data powers our services and helps us deliver better experiences. Here's how we use it:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 mb-3">
                      <Shield size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white/80 mb-2">Service Optimization</h3>
                    <p className="text-xs text-white/40 leading-relaxed">To provide, maintain, and improve our platform's functionality and user experience.</p>
                    <ul className="mt-3 space-y-1.5">
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Processing transactions</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Personalizing content</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Troubleshooting issues</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 mb-3">
                      <Lock size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white/80 mb-2">Account Security</h3>
                    <p className="text-xs text-white/40 leading-relaxed">To verify identity, prevent fraud, and protect your account from unauthorized access.</p>
                    <ul className="mt-3 space-y-1.5">
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Authentication verification</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Security monitoring</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Suspicious activity alerts</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 mb-3">
                      <Eye size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white/80 mb-2">Platform Insights</h3>
                    <p className="text-xs text-white/40 leading-relaxed">To analyze usage patterns and improve our services based on aggregated data.</p>
                    <ul className="mt-3 space-y-1.5">
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Usage analytics</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Feature performance</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> User feedback analysis</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 mb-3">
                      <UserCheck size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white/80 mb-2">Legal Compliance</h3>
                    <p className="text-xs text-white/40 leading-relaxed">To comply with applicable laws, regulations, and legal requests.</p>
                    <ul className="mt-3 space-y-1.5">
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Tax obligations</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Regulatory reporting</li>
                      <li className="text-xs text-white/30 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500" /> Law enforcement requests</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/[0.05]">
                  <p className="text-xs text-white/30 italic leading-relaxed">
                    <span className="font-bold">Important:</span> We never sell your personal data to third-party advertisers or marketing companies. Your data is yours.
                  </p>
                </div>
              </motion.section>

              {/* Data Protection */}
              <motion.section 
                id="protection"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <Lock size={120} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Lock size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-4">Security Measures</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center text-purple-400 shrink-0">
                      <Fingerprint size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white/80">AES-256 Encryption</h4>
                      <p className="text-xs text-white/40">Bank-grade security for at-rest data.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center text-purple-400 shrink-0">
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white/80">Granular Access</h4>
                      <p className="text-xs text-white/40">Strict role-based permission system.</p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* User Rights */}
              <motion.section 
                id="rights"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                  <UserCheck size={120} />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-600/20 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <UserCheck size={24} />
                </div>
                <h2 className="text-xl font-bold text-white mb-4">Your Privacy Rights</h2>
                <div className="flex flex-wrap gap-2">
                  {["Right to Access", "Right to Erasure", "Data Portability", "Correction", "Objection"].map(tag => (
                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[10px] font-bold text-white/40 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-sm text-white/40 leading-relaxed">
                  You have full control over your data. You can request a full export or permanent deletion of your account at any time.
                </p>
              </motion.section>

              {/* Cookies & Tracking */}
              <motion.section 
                id="cookies"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group md:col-span-2 p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/30 transition-all duration-500 relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-cyan-600/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Fingerprint size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">Cookies & Tracking</h2>
                    <p className="text-sm text-white/40 leading-relaxed">
                      We use essential cookies to maintain your session and improve site performance. Non-essential tracking is only enabled with your explicit consent. You can manage your preferences in the Account Settings panel.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <button className="px-6 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xs font-bold text-white hover:bg-white/[0.1] transition-all">
                      MANAGE PREFERENCES
                    </button>
                  </div>
                </div>
              </motion.section>

              {/* Policy Updates */}
              <motion.section 
                id="updates"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-[0_8px_30px_rgb(37,99,235,0.3)]">
                    <Bell size={32} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2">Stay Informed</h2>
                    <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
                      We update this policy periodically to reflect changes in our practices or regulatory requirements. We will notify you of any significant changes via email or platform notifications.
                    </p>
                  </div>
                  <div className="shrink-0 space-y-2">
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Last Modified</div>
                    <div className="text-sm font-medium text-blue-400">October 24, 2024</div>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* Final Contact CTA */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-12 rounded-[3rem] bg-[#080e1e] border border-white/[0.05] relative overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-white">Questions About Privacy?</h2>
                <p className="text-white/40 max-w-xl mx-auto leading-relaxed">
                  Our dedicated privacy team is here to help you understand your rights and how we protect your information.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    to="/contact" 
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(37,99,235,0.25)]"
                  >
                    Contact Privacy Team
                    <ArrowRight size={18} />
                  </Link>
                  <a href="mailto:privacy@solease.com" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white font-bold hover:bg-white/[0.1] transition-all">
                    Email Support
                  </a>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
        </div>
      </div>
    );
};

export default PrivacyPolicy;
