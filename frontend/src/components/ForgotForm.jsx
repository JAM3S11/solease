import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px] bg-white/40 backdrop-blur-xl px-8 md:px-10 py-7 rounded-[32px] border border-gray-300/5 shadow-2xl"
      >
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
                 <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                 <p className="text-gray-600 text-sm">Enter your email to receive a reset link</p>
               </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. user@example.com"
                      className="w-full bg-gray-100 border border-gray-300/5 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300/5">
                <CheckCircle2 size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                If an account exists for <span className="text-blue-500 font-semibold">{formData.email}</span>, you will receive a password reset link shortly.
              </p>

              <motion.button
                onClick={() => setIsSending(false)}
                className="mt-8 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-widest"
              >
                Didn't get the email? Try again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 text-sm">
            Back to Login?{" "}
            <Link to="/auth/login" className="text-blue-500 font-semibold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>


    </section>
  );
};

export default ForgotPassForm;