import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { KeyRound, User, X, LogIn, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { error, isLoading, login } = useAuthenticationStore();

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

      toast.success(`Welcome back, ${user.name || "User"}!`, { 
        duration: 2000,
        style: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 147, 255, 0.2)",
          color: "#1e293b",
          fontWeight: "600"
        },
        icon: "✨" 
      });

      switch (user.role) {
        case "Client": navigate("/client-dashboard"); break;
        case "IT Support": navigate("/itsupport-dashboard"); break;
        case "Service Desk": navigate("/servicedesk-dashboard"); break;
        case "Manager": navigate("/admin-dashboard"); break;
        default: navigate("/");
      }

      setFormData({ username: "", password: "" });
    } catch (err) {
      toast.error(err.message || "Invalid credentials. Try again.");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#e3e6e9] px-2 overflow-hidden font-sans">
      {/* Background Decorative Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="relative w-full max-w-5xl bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] rounded-[3rem] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-100">
        
        {/* Left Side: Visual Welcome Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col justify-center items-center bg-[#050a18] text-white p-14 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-10 border border-white/10 backdrop-blur-xl">
                <LogIn className="text-blue-400" size={28} />
             </div>
             
             <h1 className="text-5xl font-bold mb-6 tracking-tighter text-center leading-[1.1]">
               Welcome to<br />
               <span className="text-[#3b82f6]">SOLEASE.</span>
             </h1>
             
             <p className="text-slate-400 text-center leading-relaxed max-w-xs font-medium opacity-80 mb-14">
               Access your workspace to streamline IT support and manage operations with ease.
             </p>

             <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-full border border-white/10 shadow-inner">
                <ShieldCheck size={14} className="text-green-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Secure Access Point</span>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Form section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center p-10 md:p-20 bg-white relative"
        >
          {/* Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-8 right-8 p-2 rounded-full text-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-9">
            <span className="text-[#3b82f6] text-[12px] font-bold uppercase tracking-[0.08em] mb-3 block">System Login</span>
            <h2 className="text-5xl font-extrabold text-slate-900 tracking-tighter">Sign In</h2>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Username Field */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">Username</label>
              <div className="flex items-center gap-4 px-6 py-5 bg-[#f0f7ff] border border-transparent rounded-[1.5rem] focus-within:border-blue-400/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-300 group">
                <User size={18} className="text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="grow bg-transparent outline-none text-slate-800 font-semibold placeholder:text-slate-300 text-base"
                  placeholder="e.g. JDoe"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">Password</label>
              <div className="flex items-center gap-4 px-6 py-5 bg-[#f0f7ff] border border-transparent rounded-[1.5rem] focus-within:border-blue-400/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-300 group">
                <KeyRound size={18} className="text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="grow bg-transparent outline-none text-slate-800 font-semibold placeholder:text-slate-300 text-base"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pr-2">
              <Link
                to={"/forgot-password"}
                className="text-xs font-bold text-[#3b82f6] hover:text-blue-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-[#050a18] text-white rounded-[1.5rem] font-black shadow-2xl shadow-[#050a18]/20 hover:bg-blue-600 transition-all duration-300 uppercase tracking-widest text-sm mt-4 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} className="opacity-50" />
                </>
              )}
            </motion.button>
          </form>

          {/* Create Account Link */}
          <div className="mt-14 text-center">
            <p className="text-slate-400 text-sm font-medium">
              New to the platform?{" "}
              <Link to="/signup" className="text-[#3b82f6] font-black ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoginForm;