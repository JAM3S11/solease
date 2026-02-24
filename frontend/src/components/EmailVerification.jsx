import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthenticationStore } from "../store/authStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useIsMobile } from "./ui/hook/useIsMobile";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const { error, isLoading, verifyEmail } = useAuthenticationStore();
  const navigate = useNavigate();

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
    e.preventDefault();
    //Join the arrays
    const verificationCode = code.join("");
    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully!", {
        position,
        description: "Email verification process was a success.",
        action: {
          label: "Email verified"
        }
      });
      navigate("/auth/login");
    } catch (err) {
      toast.error(error || "Email verification failed")
    }
  };

  // To auto submit
  useEffect(() => {
    if(code.every((digit) => digit !== "")){
      handleSubmit(new Event("Submit"));
    }
  }, [code]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] overflow-hidden px-4 font-sans gap-2 py-6">

      {/* --- BACKGROUND DECORATIONS --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Corner accents */}
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

      <div className="relative z-10 w-full max-w-[440px] bg-white/40 backdrop-blur-xl px-8 md:px-10 py-7 rounded-[32px] border border-gray-300/5 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600 text-sm">Enter the 6-digit code sent to your email</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold bg-gray-100 border-2 border-gray-300/5 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all"
              />
            ))}
          </div>

          {/* Button */}
          <motion.button
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-[#0a0a0a] rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group uppercase tracking-wider"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Email</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </section>
  );
};

export default EmailVerificationPage;
