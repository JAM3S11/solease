import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthenticationStore } from "../store/authStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVerifyEmailAction, ActionExpiredPage } from "@/hooks/useSensitiveAction.jsx";

const CanvasLogo = ({ isBlurred }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if(!canvas) return;

    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 40, 40);

    const gradient = ctx.createLinearGradient(0, 0, 40, 40);
    if(isBlurred){
      gradient.addColorStop(0, '#2563EB');
      gradient.addColorStop(1, '#06B6D4');
    } else {
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(1, '#93C5FD');
    }

    ctx.fillStyle = gradient;

    const drawChevron = (yOffset, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(10, yOffset + 8);
      ctx.lineTo(20, yOffset);
      ctx.lineTo(30, yOffset + 8);
      ctx.lineTo(20, yOffset + 16);
      ctx.fill();
    }

    drawChevron(18, 0.6);
    drawChevron(10, 0.8);
    drawChevron(2, 1);

    ctx.globalAlpha = 1;
  }, [isBlurred]);

  return <canvas ref={canvasRef} width='40' height='40' className="w-8 h-8 md:w-10 md:h-10" />
}

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const { error, isLoading, verifyEmail } = useAuthenticationStore();
  const navigate = useNavigate();
  const { isBlocked, error: blockError, refreshCount, trackRefresh, completeAction, setActionError } = useVerifyEmailAction();

  const isUseMobile = useIsMobile();
  const position = isUseMobile ? 'top-center' : 'top-right';

  // Focus functionality
  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1); // only 1 digit
    setCode(newCode);

    // auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (isBlocked) {
      return;
    }

    //Join the arrays
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      return;
    }

    trackRefresh();
    try {
      await verifyEmail(verificationCode);
      completeAction();
      toast.success("Email verified successfully!", {
        position,
        description: "Email verification process was a success.",
        action: {
          label: "Email verified"
        }
      });
      navigate("/auth/login");
    } catch (err) {
      setActionError(err?.response?.data?.message || "Email verification failed");
      toast.error(error || "Email verification failed");
    }
  };

  // To auto submit
  useEffect(() => {
    if(code.every((digit) => digit !== "") && !isBlocked){
      handleSubmit();
    }
  }, [code, isBlocked]);

  if (isBlocked) {
    return <ActionExpiredPage message={blockError || "Verification session expired. Please try again."} />;
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] overflow-hidden px-4 font-sans gap-2 py-6" aria-busy={isLoading}>

      {/* Background Decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
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
            className="flex items-center gap-1.5 md:gap-2 text-lg font-semibold tracking-tight text-gray-900 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-300 rounded-lg px-2 py-1"
          >
            <CanvasLogo />
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-400 transition-all duration-300">
              SOLEASE
            </span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px] backdrop-blur-xl px-6 md:px-8 py-8 md:py-9 rounded-[32px] border border-gray-300/5 shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600 text-sm">Enter the 6-digit code sent to your email</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 md:w-14 md:h-14 text-center text-lg font-semibold bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
              />
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/10 text-red-600 rounded-lg text-sm font-medium text-center border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          {/* Button */}
          <motion.button
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 md:py-4 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Email</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive code?{" "}
            <button className="text-blue-500 font-semibold hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 transition-colors">
              Resend
            </button>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default EmailVerificationPage;
