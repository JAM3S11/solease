import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, X, ArrowBigRight, Send, CheckCircle2 } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion"; // Added for motion

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
    await forgotPassword(formData.email);
    setIsSending(true);
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, rgba(173, 194, 230, 0.57) 0%, rgba(133, 175, 242, 0.43) 100%)",
      }}
    >
      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl p-8 relative border border-white/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600 tracking-tight">
            Reset Password
          </h2>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <X size={24} />
          </motion.button>
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
              <p className="text-xs md:text-sm -mt-4 mb-6 text-gray-500 font-medium">
                Enter your email address and we'll send a link to reset your password.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="form-control group">
                  <label className="input input-bordered flex items-center gap-3 rounded-xl bg-white/50 border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-blue-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="grow outline-none text-gray-700 bg-transparent"
                      placeholder="Email Address"
                      required
                    />
                  </label>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary text-white rounded-xl shadow-lg shadow-blue-500/30 uppercase tracking-widest font-bold border-none transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      Send Reset Link <Send size={18} />
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
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Check your inbox</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                If an account exists for <span className="text-blue-600 font-semibold">{formData.email}</span>, you will receive a password reset link shortly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm md:text-base text-center text-gray-500 mt-8 flex items-center justify-center gap-2 group"
        >
          Back to Login?{" "}
          <a
            href="/login"
            className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            Go back <ArrowBigRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.p>
      </motion.div>
    </section>
  );
};

export default ForgotPassForm;