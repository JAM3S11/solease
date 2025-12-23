import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const { error, isLoading, verifyEmail } = useAuthenticationStore();
  const navigate = useNavigate();

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
      toast.success("Email verified successfully!");
      navigate("/login");
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
    <section
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(120deg, rgba(173, 194, 230, 0.57) 0%, rgba(133, 175, 242, 0.43) 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
            Verify Your Email
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-blue-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Code Input Boxes */}
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
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full btn btn-primary text-white rounded-lg shadow-md uppercase tracking-wide hover:scale-[1.02] transition transform"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EmailVerificationPage;
