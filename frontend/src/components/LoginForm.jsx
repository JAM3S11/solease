import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { KeyRound, User, X, LogIn, ShieldCheck } from "lucide-react";
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
          background: "rgba(255, 255, 255, 0.8)",
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
      const message = err.message;
      if (message.toLowerCase().includes("awaiting admin approval")) {
        toast.error("Account pending approval");
      } else if (message.toLowerCase().includes("rejected")) {
        toast.error("Account access denied");
      } else {
        toast.error("Invalid credentials. Try again.");
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#fafbfc] px-4 overflow-hidden">
      {/* Modern Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      <div className="relative w-full max-w-5xl bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-100">
        
        {/* Visual Welcome Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden md:flex flex-col justify-center items-center bg-slate-950 text-white p-16 relative overflow-hidden"
        >
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/20 blur-[80px] rounded-full" />
          
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-10 border border-white/10 backdrop-blur-xl">
                <LogIn className="text-blue-400" size={32} />
             </div>
             
             <h1 className="text-5xl font-black mb-6 tracking-tighter text-center leading-[1.1]">
               Welcome to<br />
               <span className="text-blue-500">SOLEASE.</span>
             </h1>
             
             <p className="text-slate-400 text-center leading-relaxed max-w-xs font-medium opacity-80 mb-12">
               Access your workspace to streamline IT support and manage operations with ease.
             </p>

             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <ShieldCheck size={14} className="text-green-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Secure Access Point</span>
             </div>
          </div>
        </motion.div>

        {/* Form section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center p-10 md:p-16 bg-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">System Login</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Sign In</h2>
            </div>
            <button
              onClick={() => navigate("/")}
              className="p-3 rounded-2xl hover:bg-slate-50 text-slate-300 hover:text-red-500 transition-all duration-300 border border-transparent hover:border-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">Username</label>
              <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-300 group">
                <User size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="grow bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-300 text-sm"
                  placeholder="e.g. JDoe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">Password</label>
              <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-300 group">
                <KeyRound size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="grow bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-300 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to={"/forgot-password"}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {error?.toLowerCase().includes("invalid credentials") && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="bg-red-50 border border-red-100 p-3 rounded-xl"
              >
                <p className="text-red-500 text-xs font-bold text-center">{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black shadow-2xl shadow-slate-950/20 hover:bg-blue-600 transition-all duration-300 uppercase tracking-widest text-sm mt-4 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Authenticating</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn size={18} className="opacity-50" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm font-medium">
              New to the platform?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-black hover:text-blue-700 transition-colors"
              >
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