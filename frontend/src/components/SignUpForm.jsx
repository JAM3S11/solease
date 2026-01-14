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
    <section
      className="relative min-h-screen flex items-center justify-center px-4 bg-[#fafbfc] overflow-hidden"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] -left-20 w-[40rem] h-[40rem] bg-blue-400/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] -right-20 w-[30rem] h-[30rem] bg-indigo-400/10 rounded-full blur-[150px] -z-10" />

      <div className="relative w-full max-w-5xl bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-100">
        
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col justify-center p-10 md:p-16 bg-white"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-blue-600 text-[12px] font-bold uppercase tracking-[0.08em] mb-2 block antialiased">Join the network</span>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter mb-3">Register</h2>
              <div className="relative h-[2px] w-32 overflow-hidden rounded-full bg-slate-100">
                <div className="absolute inset-0 bg-blue-500 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="p-3 rounded-2xl hover:bg-slate-50 text-slate-300 hover:text-red-500 transition-all duration-300 border border-transparent hover:border-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form className="space-y-2" onSubmit={handleSubmit}>
            {[
              { name: "username", icon: <User size={18}/>, label: "Username", placeholder: "e.g. JDoe" },
              { name: "name", icon: <CircleUser size={18}/>, label: "Full Name", placeholder: "e.g. John Doe" },
              { name: "email", icon: <Mail size={18}/>, label: "Email Address", placeholder: "jdoe@company.com", type: "email" },
              { name: "password", icon: <KeyRound size={18}/>, label: "Password", placeholder: "••••••••", type: "password" }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-[12px] font-bold text-slate-400 uppercase ml-1 tracking-wide">{field.label}</label>
                <div className="flex items-center gap-3 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all duration-300 group">
                  <span className="text-slate-400 group-focus-within:text-blue-600 transition-colors">{field.icon}</span>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="grow bg-transparent outline-none text-slate-700 text-sm font-medium placeholder:text-slate-300"
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              </div>
            ))}

            {error?.toLowerCase().includes("sign") && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              disabled={isLoading}
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black shadow-2xl shadow-slate-950/20 hover:bg-blue-600 transition-all duration-300 uppercase tracking-widest text-sm mt-6 flex items-center justify-center gap-3 disabled:bg-slate-400"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ShieldCheck size={18} className="opacity-50" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-10 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Login here</Link>
          </p>
        </motion.div>

        {/* Branding Side Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col justify-center items-center bg-slate-950 text-white p-16 relative overflow-hidden"
        >
          {/* Animated Background Decor */}
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10 backdrop-blur-xl">
              <Sparkles className="text-blue-400" size={32} />
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tighter text-center leading-tight">
              Start your <br />
              <span className="text-blue-500 font-serif italic font-normal tracking-normal">journey</span> with us
            </h1>
            <p className="text-slate-400 text-center leading-relaxed max-w-xs font-medium opacity-80">
              Streamline your support operations, manage every user effectively, and join thousands of connected members.
            </p>
            
            <div className="mt-12 flex items-center gap-6">
               <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                     U{i}
                   </div>
                 ))}
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Join 10k+ Users</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SignUpForm;