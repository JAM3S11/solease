import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { Lock, KeyRound, CheckCircle, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useResetPasswordAction, ActionExpiredPage } from "@/hooks/useSensitiveAction.jsx";

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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, error, isLoading, message } = useAuthenticationStore();
  const { isBlocked, error: blockError, refreshCount, trackRefresh, completeAction, setActionError } = useResetPasswordAction();

  const [formData, setFormData] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [validationSuccess, setValidationSuccess] = useState({});
  const [touched, setTouched] = useState({});

  const VALIDATION_RULES = {
    oldPassword: {
      minLength: 6,
      message: "Current password must be at least 6 characters"
    },
    password: {
      minLength: 6,
      message: "New password must be at least 6 characters"
    },
    confirmPassword: {
      message: "Passwords do not match"
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 'none', label: '', percent: 0 };
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 1) return { level: 'weak', label: 'Weak', percent: 33 };
    if (strength <= 3) return { level: 'medium', label: 'Medium', percent: 66 };
    return { level: 'strong', label: 'Strong', percent: 100 };
  };

  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    const success = { ...validationSuccess };

    if (!value.trim()) {
      const fieldNames = { 
        oldPassword: 'Current password', 
        password: 'New password', 
        confirmPassword: 'Confirm password' 
      };
      errors[name] = `${fieldNames[name]} is required`;
      delete success[name];
    } else if (name === 'oldPassword') {
      if (value.length < VALIDATION_RULES.oldPassword.minLength) {
        errors[name] = VALIDATION_RULES.oldPassword.message;
        delete success[name];
      } else {
        delete errors[name];
        success[name] = true;
      }
    } else if (name === 'password') {
      if (value.length < VALIDATION_RULES.password.minLength) {
        errors[name] = VALIDATION_RULES.password.message;
        delete success[name];
      } else if (value === formData.oldPassword) {
        errors[name] = "New password must be different from current password";
        delete success[name];
      } else {
        delete errors[name];
        success[name] = true;
      }
    } else if (name === 'confirmPassword') {
      if (value !== formData.password) {
        errors[name] = VALIDATION_RULES.confirmPassword.message;
        delete success[name];
      } else {
        delete errors[name];
        success[name] = true;
      }
    }

    setValidationErrors(errors);
    setValidationSuccess(success);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isBlocked) {
      return;
    }

    setTouched({ oldPassword: true, password: true, confirmPassword: true });
    validateField('oldPassword', formData.oldPassword);
    validateField('password', formData.password);
    validateField('confirmPassword', formData.confirmPassword);

    if (validationErrors.oldPassword || validationErrors.password || validationErrors.confirmPassword) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    trackRefresh();

    try {
      await resetPassword(token, formData.password, formData.oldPassword);
      completeAction();
      toast.success("Password reset successfully! Redirecting to login page...");

      setFormData({ oldPassword: "", password: "", confirmPassword: "" });
      setValidationErrors({});
      setValidationSuccess({});
      setTouched({});

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error) {
      setActionError(error?.response?.data?.message || "Error resetting your password.");
      console.error(error);
      toast.error(error?.response?.data?.message || "Error resetting your password.");
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColor = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500'
  };
  const strengthTextColor = {
    weak: 'text-red-600',
    medium: 'text-yellow-600',
    strong: 'text-green-600'
  };

  if (isBlocked) {
    return <ActionExpiredPage message={blockError || "Password reset session expired. Please try again."} />;
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] overflow-hidden px-4 font-sans gap-2 py-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

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
            className="flex items-center gap-1.5 md:gap-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 transition-all duration-300 rounded-lg px-2 py-1"
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600 text-sm">Create a strong new password for your account</p>
        </div>

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

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Old Password Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="oldPassword" className="text-sm font-medium text-gray-700">
                Current Password <span className="text-red-500">*</span>
              </label>
              {validationSuccess.oldPassword && !validationErrors.oldPassword && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-green-600 flex items-center gap-1">
                  <Check size={14} /> Valid
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                validationErrors.oldPassword ? 'text-red-500' : 
                validationSuccess.oldPassword ? 'text-green-500' : 
                'text-gray-600 group-focus-within:text-blue-500'
              }`}>
                <Lock size={18} />
              </div>
              <input
                id="oldPassword"
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                autoComplete="current-password"
                value={formData.oldPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-gray-50 border-2 rounded-xl py-3 md:py-4 pl-12 pr-12 text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                  validationErrors.oldPassword 
                    ? 'border-red-300 focus:border-red-500' 
                    : validationSuccess.oldPassword
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-gray-200 focus:border-blue-500/50'
                }`}
                placeholder="Enter current password"
                required
                disabled={isLoading}
              />
              <motion.button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                aria-label={showOldPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                disabled={isLoading}
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
            {validationErrors.oldPassword && touched.oldPassword && (
              <motion.div 
                role="status"
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-600 ml-1"
              >
                <AlertCircle size={14} /> {validationErrors.oldPassword}
              </motion.div>
            )}
            {!validationErrors.oldPassword && (
              <p className="text-xs text-gray-500 ml-1">Enter your current password to verify identity</p>
            )}
          </motion.div>

          {/* New Password Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                New Password <span className="text-red-500">*</span>
              </label>
              {passwordStrength.level !== 'none' && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }}
                  className={`text-xs font-medium ${strengthTextColor[passwordStrength.level]}`}
                >
                  {passwordStrength.label}
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                validationErrors.password ? 'text-red-500' : 
                validationSuccess.password ? 'text-green-500' : 
                'text-gray-600 group-focus-within:text-blue-500'
              }`}>
                <KeyRound size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-gray-50 border-2 rounded-xl py-3 md:py-4 pl-12 pr-12 text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                  validationErrors.password 
                    ? 'border-red-300 focus:border-red-500' 
                    : validationSuccess.password
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-gray-200 focus:border-blue-500/50'
                }`}
                placeholder="Enter new password"
                required
                disabled={isLoading}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
            {validationErrors.password && touched.password && (
              <motion.div 
                role="status"
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-600 ml-1"
              >
                <AlertCircle size={14} /> {validationErrors.password}
              </motion.div>
            )}
            {!validationErrors.password && (
              <p className="text-xs text-gray-500 ml-1">Use 6+ characters with uppercase, number, and symbol</p>
            )}
            {formData.password && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength.percent}%` }}
                    transition={{ duration: 0.3 }}
                    className={`h-2 rounded-full transition-colors ${strengthColor[passwordStrength.level] || 'bg-gray-300'}`}
                  />
                </div>
                <div className="flex items-start flex-col text-xs">
                  <div className={`flex items-center gap-1 ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                    <Check size={12} className={formData.password.length >= 6 ? 'opacity-100' : 'opacity-30'} />
                    At least 6 characters
                  </div>
                  <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <Check size={12} className={/[A-Z]/.test(formData.password) ? 'opacity-100' : 'opacity-30'} />
                    At least one capital letter
                  </div>
                  <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <Check size={12} className={/[0-9]/.test(formData.password) ? 'opacity-100' : 'opacity-30'} />
                    At least one number
                  </div>
                  <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <Check size={12} className={/[^A-Za-z0-9]/.test(formData.password) ? 'opacity-100' : 'opacity-30'} />
                    At least one symbol
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Confirm Password Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              {validationSuccess.confirmPassword && !validationErrors.confirmPassword && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-green-600 flex items-center gap-1">
                  <Check size={14} />
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                validationErrors.confirmPassword ? 'text-red-500' : 
                validationSuccess.confirmPassword ? 'text-green-500' : 
                'text-gray-600 group-focus-within:text-blue-500'
              }`}>
                <KeyRound size={18} />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-gray-50 border-2 rounded-xl py-3 md:py-4 pl-12 pr-12 text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                  validationErrors.confirmPassword 
                    ? 'border-red-300 focus:border-red-500' 
                    : validationSuccess.confirmPassword
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-gray-200 focus:border-blue-500/50'
                }`}
                placeholder="Confirm new password"
                required
                disabled={isLoading}
              />
              <motion.button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
            {validationErrors.confirmPassword && touched.confirmPassword && (
              <motion.div 
                role="status"
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-600 ml-1"
              >
                <AlertCircle size={14} /> {validationErrors.confirmPassword}
              </motion.div>
            )}
            {!validationErrors.confirmPassword && (
              <p className="text-xs text-gray-500 ml-1">Re-enter your new password to confirm</p>
            )}
          </motion.div>

          {/* Reset Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
