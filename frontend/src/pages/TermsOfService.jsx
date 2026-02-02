import React from "react";
import { FileText, Shield, AlertCircle, Users, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const TermsOfService = () => {
  return (
    <div className="min-h-screen w-full bg-[#fafbfc] font-sans">
      <div className="px-6 md:px-12 w-full max-w-5xl mx-auto pt-32 pb-20">
        {/* Background Atmosphere */}
        <div className="absolute top-[-10%] -left-20 w-96 h-96 bg-green-400/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-[-10%] -right-20 w-[40rem] h-[40rem] bg-emerald-400/10 rounded-full blur-[150px] -z-10" />

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100/50 backdrop-blur-sm rounded-full mb-6 border border-green-200/30">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-green-600">
              Legal Agreement
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Terms of <span className="text-green-600">Service</span>
          </h1>
          
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            These Terms of Service govern your use of the SOLEASE platform and outline the rights and responsibilities for all users.
          </p>

          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Acceptance of Terms */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-green-100/50 rounded-2xl">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="leading-relaxed">
                    By accessing and using the SOLEASE platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                  </p>
                  <p className="leading-relaxed">
                    If you do not agree to these terms, you may not access or use our services. These terms apply to all users, including but not limited to clients, reviewers, and administrators.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Service Description */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-100/50 rounded-2xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Description</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="leading-relaxed">
                    SOLEASE is an IT support and ticket management platform that provides:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• <strong>Ticket Management:</strong> Creation, assignment, and tracking of support tickets</li>
                    <li>• <strong>User Management:</strong> Role-based access control and user administration</li>
                    <li>• <strong>Analytics & Reporting:</strong> Data insights and performance metrics</li>
                    <li>• <strong>Support Services:</strong> Technical assistance and issue resolution</li>
                  </ul>
                  <p className="leading-relaxed">
                    We reserve the right to modify, suspend, or discontinue any part of our service with or without notice.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* User Responsibilities */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-purple-100/50 rounded-2xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Responsibilities</h2>
                <div className="space-y-4 text-gray-600">
                  <p>As a user of the SOLEASE platform, you agree to:</p>
                  <ul className="space-y-2 ml-4">
                    <li>• Provide accurate, complete, and up-to-date information</li>
                    <li>• Maintain the confidentiality of your account credentials</li>
                    <li>• Use the platform only for legitimate business purposes</li>
                    <li>• Not engage in activities that could harm or disrupt the service</li>
                    <li>• Comply with all applicable laws and regulations</li>
                    <li>• Not attempt to gain unauthorized access to our systems</li>
                    <li>• Not share confidential or proprietary information inappropriately</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Intellectual Property */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-orange-100/50 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="leading-relaxed">
                    The SOLEASE platform, including its software, design, content, and trademarks, is owned by SOLEASE and protected by intellectual property laws.
                  </p>
                  <p className="leading-relaxed">
                    You retain ownership of any content you submit to the platform, but you grant SOLEASE a license to use, modify, and distribute this content for the purpose of providing our services.
                  </p>
                  <p className="leading-relaxed">
                    You may not copy, modify, distribute, or create derivative works based on our platform without explicit written permission.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Limitations and Disclaimers */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100/50 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations and Disclaimers</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="leading-relaxed">
                    The SOLEASE platform is provided "as is" and "as available" without warranties of any kind, either express or implied.
                  </p>
                  <p className="leading-relaxed">
                    We do not guarantee uninterrupted or error-free operation of our services. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of our platform.
                  </p>
                  <p className="leading-relaxed">
                    In no event shall our total liability exceed the fees paid by you for the services in the preceding twelve (12) months.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Termination */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200/20 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gray-100/50 rounded-2xl">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="leading-relaxed">
                    You may terminate your account at any time by contacting our support team or using the account deletion feature.
                  </p>
                  <p className="leading-relaxed">
                    We reserve the right to suspend or terminate your account for violation of these terms, fraudulent activity, or any reason that threatens the security or integrity of our platform.
                  </p>
                  <p className="leading-relaxed">
                    Upon termination, your right to use the services will cease immediately, and we may delete your account data in accordance with our Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Contact Information */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-200/20"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Terms?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                If you have questions about these Terms of Service or need clarification on any aspect, please contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="text-sm text-gray-600">
                  <p>📧 legal@solease.com</p>
                  <p>📞 +254 700 123 456</p>
                </div>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold"
                >
                  Contact Legal
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

export default TermsOfService;