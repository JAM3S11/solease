import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Fixed import
import { KeyRound, User, LogIn, ArrowRight, Mail, Lock } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { isLoading, login } = useAuthenticationStore();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.username, formData.password);
      toast.success(`Welcome back, ${user.name || "User"}!`);

      switch (user.role) {
        case "Client": navigate("/client-dashboard"); break;
        case "Reviewer": navigate("/reviewer-dashboard"); break;
        case "Manager": navigate("/admin-dashboard"); break;
        default: navigate("/");
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials.");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] overflow-hidden px-4 font-sans gap-2 py-6">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Added corner accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header with Logo Link - Outside Form */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 border border-gray-300/10 rounded-xl flex items-center justify-center shadow-lg group hover:border-blue-500/50 transition-colors">
            <img src="/solease.svg" alt="Solease" className="h-8 w-8 group-hover:scale-110 transition-transform" />
          </div>
          <Link to="/" className="text-gray-900 text-2xl font-bold tracking-tight hover:text-blue-400 transition-colors">
            SOLEASE
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px] bg-white/40 backdrop-blur-xl px-8 md:px-10 py-7 rounded-[32px] border border-gray-300/5 shadow-2xl"
      >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600 text-sm">Sign in to continue using SOLEASE</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. adminManager"
                  className="w-full bg-gray-100 border border-gray-300/5 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-100 border border-gray-300/5 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300/10 bg-gray-100 text-blue-500 focus:ring-blue-500/20" />
                <span className="text-xs text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" size={16} className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-[#0a0a0a] rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            New to the platform?{" "}
            <Link to="/signup" className="text-blue-500 font-semibold hover:underline underline-offset-4">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginForm;