import React from "react";
import { Shield, Lock, Eye, Database, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen w-full bg-[#fafbfc] font-sans">
      <div className="px-6 md:px-12 w-full max-w-5xl mx-auto pt-32 pb-20">
        {/* Background Atmosphere */}
        <div className="absolute top-[-10%] -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] -right-20 w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full blur-[150px] -z-10" />

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 backdrop-blur-sm rounded-full mb-6 border border-blue-200/30">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Privacy Protection
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Privacy <span className="text-blue-600">Policy</span>
          </h1>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            Your privacy is fundamental to our mission. This policy outlines how we collect, use, and protect your information within the SOLEASE platform.
          </p>

          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Information Collection */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-100/50 rounded-2xl">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <div className="space-y-4 text-gray-600">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Personal Information</h3>
                    <p className="leading-relaxed">When you register, we collect your name, email address, phone number, and role within your organization. This information is essential for account creation and service delivery.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Usage Data</h3>
                    <p className="leading-relaxed">We collect information about how you interact with our platform, including login times, ticket submissions, support requests, and system usage patterns to improve our services.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Technical Information</h3>
                    <p className="leading-relaxed">Device information, IP addresses, browser type, and operating system details help us ensure compatibility and security across all platforms.</p>
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
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100/50 rounded-2xl">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <div className="space-y-3 text-gray-600">
                  <p>• <strong>Service Delivery:</strong> To provide ticket management, user support, and analytics services</p>
                  <p>• <strong>Platform Security:</strong> To monitor for unauthorized access and protect against security threats</p>
                  <p>• <strong>Service Improvement:</strong> To analyze usage patterns and enhance platform functionality</p>
                  <p>• <strong>Communication:</strong> To send important updates about your account and our services</p>
                  <p>• <strong>Compliance:</strong> To meet legal and regulatory requirements</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Data Protection */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-purple-100/50 rounded-2xl">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection & Security</h2>
                <div className="space-y-4 text-gray-600">
                  <p>We implement industry-standard security measures including:</p>
                  <ul className="space-y-2 ml-4">
                    <li>• <strong>Encryption:</strong> All data is encrypted in transit and at rest using AES-256 encryption</li>
                    <li>• <strong>Access Controls:</strong> Strict role-based access controls limit data access to authorized personnel</li>
                    <li>• <strong>Regular Audits:</strong> Security audits and penetration testing conducted regularly</li>
                    <li>• <strong>Backup Systems:</strong> Redundant backup systems ensure data integrity and availability</li>
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
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-orange-100/50 rounded-2xl">
                <UserCheck className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <div className="space-y-3 text-gray-600">
                  <p>• <strong>Access:</strong> Request access to your personal data at any time</p>
                  <p>• <strong>Correction:</strong> Update or correct inaccurate personal information</p>
                  <p>• <strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</p>
                  <p>• <strong>Portability:</strong> Transfer your data to another service provider</p>
                  <p>• <strong>Consent:</strong> Withdraw consent for data processing where consent-based</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Contact Information */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-200/20"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Privacy?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                If you have questions about this Privacy Policy or how we handle your data, please contact our privacy team.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="text-sm text-gray-600">
                  <p>📧 privacy@solease.com</p>
                  <p>📞 +254 700 123 456</p>
                </div>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
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