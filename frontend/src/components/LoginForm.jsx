import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { KeyRound, User, X } from "lucide-react";
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
          background: "#0093FF3D",
          backdropFilter: "blur(10px)",
        },
        icon: "✔️" 
      });

      switch (user.role) {
        case "Client": 
          navigate("/client-dashboard"); 
          break;
        case "IT Support": 
          navigate("/itsupport-dashboard"); 
          break;
        case "Service Desk": 
          navigate("/servicedesk-dashboard"); 
          break;
        case "Manager": navigate("/admin-dashboard"); break;
        default: navigate("/");
      }

      setFormData({ 
        username: "", 
        password: "" 
      });
    } catch (err) {
      const message = err.message;
      if (message.toLowerCase().includes("awaiting admin approval")) {
        toast.error("Your account is awaiting admin approval");
      } else if (message.toLowerCase().includes("rejected")) {
        toast.error("Your account has been rejected");
      } else {
        toast.error("Invalid email or password! Please try again");
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-sky-500 to-emerald-500 px-4">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
      
      <div className="relative w-full max-w-5xl bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 via-blue-600 to-emerald-600 text-white p-12 relative overflow-hidden"
        >
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome to SOLEASE</h1>
          <p className="text-lg text-center leading-relaxed max-w-sm opacity-90">
            Streamline your IT support operations, manage tickets efficiently, 
            and empower your team with smart solutions.
          </p>
          <div className="mt-10 border-t border-white/20 pt-6 text-sm font-medium tracking-widest uppercase opacity-70">
            <p>Smart • Reliable • Efficient</p>
          </div>
        </motion.div>

        {/* Form section */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col justify-center p-10 md:p-14 bg-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                Login
              </h2>
              <div className="h-1 w-17 bg-blue-600 rounded-full mt-1"></div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <p className="text-base mb-8 text-gray-500 font-medium">
            Enter your credentials to access the SolEase platform.
          </p>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-[14px] font-bold text-gray-400 uppercase ml-1">Username</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                <User size={20} className="text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="grow bg-transparent outline-none text-gray-700 placeholder:text-gray-300"
                  placeholder="e.g. JDoe"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[14px] font-bold text-gray-400 uppercase ml-1">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                <KeyRound size={20} className="text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="grow bg-transparent outline-none text-gray-700 placeholder:text-gray-300"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to={"/forgot-password"}
                className="text-[15px] font-medium text-blue-600 hover:text-blue-800 transition"
              >
                Forgot Password?
              </Link>
            </div>

            {error?.toLowerCase().includes("invalid credentials") && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[14px] font-medium text-center">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold 
              shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 
              active:scale-95 transition-all transform uppercase tracking-widest text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Authenticating
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-base">
              New to the platform?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoginForm;