import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { Lock, KeyRound, CheckCircle } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const CanvasLogo = ({ isBlurred }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if(!canvas) return;

    const ctx = canvas.getContext('2d');

    // CLear for redrawing
    ctx.clearRect(0, 0, 40, 40);

    // Background gradient based on the scroll state
    const gradient = ctx.createLinearGradient(0, 0, 40, 40);
    if(isBlurred){
      gradient.addColorStop(0, '#2563EB');
      gradient.addColorStop(1, '#06B6D4');
    } else {
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, '#93C5FD');
    }

    ctx.fillStyle = gradient;

    // Drew the S-shape layer
    const drawChevron = (yOffset, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(10, yOffset + 8);
      ctx.lineTo(20, yOffset);
      ctx.lineTo(30, yOffset + 8);
      ctx.lineTo(20, yOffset + 16);
      ctx.fill();
    }

    drawChevron(18, 0.6); // Bottom
    drawChevron(10, 0.8); // Middle
    drawChevron(2, 1);    // Top

    ctx.globalAlpha = 1;
  }, [isBlurred]);

  return <canvas ref={canvasRef} width='40' height='40' className="w-8 h-8 md:w-10 md:h-10" />
}

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthenticationStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Logic preserved as per your original code
    if(formData.password !== confirmPassword){
        toast.error("Passwords don't match! Try again..");
        return;
    }

    try {
        await resetPassword(token, formData.password);
        toast.success("Password reset successfully! Redirecting to login page...");

        setFormData({ password: "" });
        setConfirmPassword("");

        setTimeout(() => {
            navigate("/auth/login");
        }, 2000);
    } catch (error) {
        console.error(error);
        toast.error("Error resetting your password.");
    }
  };
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] overflow-hidden px-4 font-sans gap-2 py-6">

      {/* --- BACKGROUND DECORATIONS --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Corner accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center mb-6"
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <Link
            to="/"
            aria-label="SOLEASE - Home"
            className="flex items-center gap-1.5 md:gap-2 text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 transition-all duration-300 rounded-lg px-2 py-1"
          >
            <CanvasLogo />
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-400 dark:hover:from-blue-300 dark:hover:to-blue-200 transition-all duration-300">
              SOLEASE
            </span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[440px] bg-white/40 backdrop-blur-xl px-8 md:px-10 py-7 rounded-[32px] border border-gray-300/5 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600 text-sm">Create a strong new password for your account</p>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium mb-4 text-center border border-red-500/20">
            {error}
          </motion.div>
        )}
        {message && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium mb-4 text-center border border-blue-500/20">
            {message}
          </motion.div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 ml-1">New Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-100 border border-gray-300/5 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                placeholder="Enter new password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300/5 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          {/* Reset Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-[#0a0a0a] rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group uppercase tracking-wider"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
            ) : (
              <>
                <span>Set New Password</span>
                <CheckCircle size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ResetPassword;