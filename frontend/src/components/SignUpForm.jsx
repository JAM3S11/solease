import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { CircleUser, KeyRound, Mail, User, X, Loader, ShieldCheck, Sparkles } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthenticationStore();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.username || !formData.name || !formData.email || !formData.password){
      toast.error("All fields are required!!");
      return;
    }

    try {
      await signup(formData.username, formData.name, formData.email, formData.password);
      toast.success("Signup successful! Please verify your email..");

      setFormData({ 
        username: "", 
        name: "", 
        email: "", 
        password: "", 
      });
      navigate("/verify-email");
    } catch (err) {
      toast.error(error || "Sign up failed!");
    }
  }

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
            <div className="w-10 h-10 bg-[#121212] border border-white/10 rounded-xl flex items-center justify-center shadow-lg group hover:border-blue-500/50 transition-colors">
              <img src="/solease.svg" alt="Solease" className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </div>
            <Link to="/" className="text-white text-xl font-bold tracking-tight hover:text-blue-400 transition-colors">
              SOLEASE
            </Link>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm">Join the network and get started</p>
        </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. JDoe"
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <CircleUser size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

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
                  placeholder="jdoe@company.com"
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <KeyRound size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium mb-4 text-center border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            {/* Sign Up Button */}
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
                  <span>Create Account</span>
                  <ShieldCheck size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default SignUpForm;