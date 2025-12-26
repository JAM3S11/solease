import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Lock, KeyRound, CheckCircle } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
            navigate("/login");
        }, 2000);
    } catch (error) {
        console.error(error);
        toast.error("Error resetting your password.");
    }
  };
  
  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)", // Softer, modern gradient
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] rounded-2xl p-8 relative border border-gray-100"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-blue-600 size-8" />
          </div>
          <h2 className="text-3xl font-bold text-blue-600 tracking-tight">
            Reset Password
          </h2>
          {!message && !error && (
            <p className="text-sm text-gray-500 mt-2">
              Create a strong new password for your account
            </p>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium mb-4 text-center border border-red-100">
            {error}
          </motion.div>
        )}
        {message && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-green-50 text-green-600 rounded-lg text-xs font-medium mb-4 text-center border border-green-100">
            {message}
          </motion.div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-800"
                placeholder="Enter new password"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <KeyRound size={18} />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-800"
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          {/* Button with Framer Motion */}
          <motion.button
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Resetting...
              </span>
            ) : (
              <>Set New Password <CheckCircle size={18} /></>
            )}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ResetPassword;