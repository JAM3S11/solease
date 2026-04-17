import React from "react";
import { FileText, Shield, AlertCircle, Users, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const TermsOfService = () => {
  return (
    <div className="min-h-screen w-full bg-[#060b18] font-sans relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glow-orb glow-orb-teal w-96 h-96 top-[-10%] -left-20 pointer-events-none animate-pulse" />
        <div className="glow-orb glow-orb-blue w-[40rem] h-[40rem] bottom-[-10%] -right-20 pointer-events-none" />
      </div>
      <div className="px-6 md:px-12 w-full max-w-5xl mx-auto pt-24 pb-16 relative z-10">

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 backdrop-blur-sm rounded-full mb-4 border border-green-500/30">
            <FileText className="w-4 h-4 text-green-500" />
            <span className="text-xs font-medium uppercase tracking-widest text-green-500">
              Legal Agreement
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight tracking-tight">
            Terms of <span className="text-green-500">Service</span>
          </h1>
          
          <p className="text-white/60 max-w-3xl mx-auto text-sm md:text-base leading-relaxed mb-6">
            These Terms of Service govern your use of the SOLEASE platform and outline the rights and responsibilities for all users.
          </p>

          <div className="text-xs text-white/40">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#080e1e]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-500/20 shadow-sm hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-green-600/20 rounded-xl">
                <FileText className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-white mb-3">Acceptance of Terms</h2>
                <div className="space-y-3 text-white/60 text-xs md:text-sm">
                  <p className="leading-relaxed">
                    By accessing and using the SOLEASE platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                  </p>
                  <p className="leading-relaxed">
                    If you do not agree to these terms, you may not access or use our services.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Service Description */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#080e1e]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-500/20 shadow-sm hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-blue-600/20 rounded-xl">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-white mb-3">Service Description</h2>
                <div className="space-y-2 text-white/60 text-xs md:text-sm">
                  <p className="leading-relaxed">
                    SOLEASE is an IT support and ticket management platform:
                  </p>
                  <ul className="space-y-1 ml-3">
                    <li>• <strong className="text-white/80">Ticket Management:</strong> Creation, assignment, tracking</li>
                    <li>• <strong className="text-white/80">User Management:</strong> Role-based access control</li>
                    <li>• <strong className="text-white/80">Analytics:</strong> Data insights and metrics</li>
                    <li>• <strong className="text-white/80">Support:</strong> Technical assistance</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* User responsibilities */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-[#080e1e]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-500/20 shadow-sm hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-purple-600/20 rounded-xl">
                <Shield className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-white mb-3">User Responsibilities</h2>
                <div className="space-y-2 text-white/60 text-xs md:text-sm">
                  <p>As a user, you agree to:</p>
                  <ul className="space-y-1 ml-3">
                    <li>• Provide accurate information</li>
                    <li>• Maintain account confidentiality</li>
                    <li>• Use for legitimate purposes only</li>
                    <li>• Comply with applicable laws</li>
                    <li>• Not attempt unauthorized access</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Intellectual Property */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-[#080e1e]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-500/20 shadow-sm hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-orange-600/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-white mb-3">Intellectual Property</h2>
                <div className="space-y-2 text-white/60 text-xs md:text-sm">
                  <p className="leading-relaxed">
                    The SOLEASE platform is owned by SOLEASE and protected by intellectual property laws.
                  </p>
                  <p className="leading-relaxed">
                    You retain ownership of content you submit, but grant SOLEASE a license to use it for providing services.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Limitations and Disclaimers */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-[#080e1e]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-500/20 shadow-sm hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-red-600/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-white mb-3">Limitations and Disclaimers</h2>
                <div className="space-y-2 text-white/60 text-xs md:text-sm">
                  <p className="leading-relaxed">
                    The platform is provided "as is" without warranties.
                  </p>
                  <p className="leading-relaxed">
                    We are not liable for indirect, incidental, or consequential damages.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Termination */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="bg-[#080e1e]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-500/20 shadow-sm hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <Clock className="w-5 h-5 text-white/70" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-white mb-3">Termination</h2>
                <div className="space-y-2 text-white/60 text-xs md:text-sm">
                  <p className="leading-relaxed">
                    You may terminate your account at any time.
                  </p>
                  <p className="leading-relaxed">
                    We may suspend or terminate accounts for violations or security threats.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Contact Information */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-6 md:p-8 border border-green-500/20"
          >
            <div className="text-center">
              <h2 className="text-sm sm:text-base md:text-lg font-medium text-white mb-3">Questions About Terms?</h2>
              <p className="text-white/60 mb-4 max-w-2xl mx-auto text-xs md:text-sm">
                Contact our legal team for questions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="text-xs text-white/60">
                  <p>📧 legal@solease.com</p>
                </div>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg transition-all duration-300 font-medium text-xs"
                >
                  Contact Legal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;