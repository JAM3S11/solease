import React from "react";
import { Shield, Lock, Eye, Database, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen w-full bg-[#fafbfc] font-sans">
      <div className="px-6 md:px-12 w-full max-w-5xl mx-auto pt-24 pb-16">
        {/* Background Atmosphere */}
        <div className="absolute top-[-10%] -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] -right-20 w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-[150px] -z-10" />

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 backdrop-blur-sm rounded-full mb-4 border border-blue-200/30">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium uppercase tracking-widest text-blue-600">
              Privacy Protection
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight tracking-tight">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base leading-relaxed mb-6">
            Your privacy is fundamental to our mission. This policy outlines how we collect, use, and protect your information within the SOLEASE platform.
          </p>

          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Information Collection */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200/20 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-blue-100/50 rounded-xl">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-3">Information We Collect</h2>
                <div className="space-y-3 text-gray-600 text-xs md:text-sm">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Personal Information</h3>
                    <p className="leading-relaxed">When you register, we collect your name, email address, phone number, and role within your organization.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Usage Data</h3>
                    <p className="leading-relaxed">We collect information about how you interact with our platform.</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Technical Information</h3>
                    <p className="leading-relaxed">Device information, IP addresses, browser type, and operating system details.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Data Usage */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200/20 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-green-100/50 rounded-xl">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-3">How We Use Your Information</h2>
                <div className="space-y-2 text-gray-600 text-xs md:text-sm">
                  <p>• <strong>Service Delivery:</strong> Ticket management and support</p>
                  <p>• <strong>Platform Security:</strong> Protect against security threats</p>
                  <p>• <strong>Service Improvement:</strong> Enhance platform functionality</p>
                  <p>• <strong>Communication:</strong> Send important updates</p>
                  <p>• <strong>Compliance:</strong> Meet legal requirements</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Data Protection */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200/20 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-purple-100/50 rounded-xl">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-3">Data Protection & Security</h2>
                <div className="space-y-2 text-gray-600 text-xs md:text-sm">
                  <p>We implement industry-standard security measures:</p>
                  <ul className="space-y-1 ml-3">
                    <li>• <strong>Encryption:</strong> AES-256 encryption</li>
                    <li>• <strong>Access Controls:</strong> Role-based access</li>
                    <li>• <strong>Regular Audits:</strong> Security testing</li>
                    <li>• <strong>Backup Systems:</strong> Redundant backups</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* User Rights */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200/20 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-orange-100/50 rounded-xl">
                <UserCheck className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-3">Your Rights</h2>
                <div className="space-y-2 text-gray-600 text-xs md:text-sm">
                  <p>• <strong>Access:</strong> Request your personal data</p>
                  <p>• <strong>Correction:</strong> Update information</p>
                  <p>• <strong>Deletion:</strong> Request data deletion</p>
                  <p>• <strong>Portability:</strong> Transfer data</p>
                  <p>• <strong>Consent:</strong> Withdraw consent</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Contact Information */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-200/20"
          >
            <div className="text-center">
              <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-3">Questions About Privacy?</h2>
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-xs md:text-sm">
                If you have questions about this Privacy Policy, please contact our privacy team.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="text-xs text-gray-600">
                  <p>📧 privacy@solease.com</p>
                </div>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-all duration-300 font-medium text-xs"
                >
                  Contact Us
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

export default PrivacyPolicy;