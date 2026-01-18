import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassForm = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isSending, setIsSending] = useState(false);
  const { isLoading, forgotPassword } = useAuthenticationStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(formData.email);
      setIsSending(true);
    } catch (error) {
      // Handle error if necessary
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden px-4 font-sans">

      {/* --- BACKGROUND DECORATIONS --- */}
      {/* Large central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Corner accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px] bg-[#121212]/80 backdrop-blur-xl p-8 md:p-10 rounded-[32px] border border-white/5 shadow-2xl"
      >
        {/* Header with Logo Link */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <motion.div className="w-10 h-10 bg-[#121212] border border-white/10 rounded-xl flex items-center justify-center shadow-lg group hover:border-blue-500/50 transition-colors">
              <img src="/solease.svg" alt="Solease" className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </motion.div>
            <Link to="/" className="text-white text-xl font-bold tracking-tight hover:text-blue-400 transition-colors">
              SOLEASE
            </Link>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSending ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
               <div className="text-center mb-8">
                 <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                 <p className="text-gray-400 text-sm">Enter your email to receive a reset link</p>
               </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. user@example.com"
                      className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Send Reset Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-[#0a0a0a] rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-widest text-xs">Send Reset Link</span>
                      <Send size={18} className="group-hover:translate-x-1 transition-transform opacity-70" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                <CheckCircle2 size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check your inbox</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                If an account exists for <span className="text-blue-500 font-semibold">{formData.email}</span>, you will receive a password reset link shortly.
              </p>
              
              <motion.button 
                onClick={() => setIsSending(false)}
                className="mt-8 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Didn't get the email? Try again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Back to Login?{" "}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>


    </section>
  );
};

export default ForgotPassForm;