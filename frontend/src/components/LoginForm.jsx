import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check, AlertCircle, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion } from "framer-motion";
import { toast } from "sonner"

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

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [validationSuccess, setValidationSuccess] = useState({});
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();
  const { isLoading, login } = useAuthenticationStore();

  // Validation rules
  const VALIDATION_RULES = {
    username: {
      pattern: /^[a-zA-Z0-9_-]{3,}$/,
      message: "Username must be at least 3 characters (letters, numbers, _, -)"
    },
    password: {
      minLength: 6,
      message: "Password must be at least 6 characters"
    }
  };

  // Calculate password strength
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

  // Validate single field
  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    const success = { ...validationSuccess };

    if (!value.trim()) {
      errors[name] = `${name === 'username' ? 'Username' : 'Password'} is required`;
      delete success[name];
    } else if (name === 'username') {
      if (!VALIDATION_RULES.username.pattern.test(value)) {
        errors[name] = VALIDATION_RULES.username.message;
        delete success[name];
      } else {
        delete errors[name];
        success[name] = true;
      }
    } else if (name === 'password') {
      if (value.length < VALIDATION_RULES.password.minLength) {
        errors[name] = VALIDATION_RULES.password.message;
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
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Real-time validation only for touched fields
    if (touched[name]) {
      validateField(name, fieldValue);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    setTouched({ username: true, password: true });
    validateField('username', formData.username);
    validateField('password', formData.password);

    // Check if there are any errors
    if (validationErrors.username || validationErrors.password) {
      toast.error("Please fix validation errors before submitting", {
        position: "bottom-right",
        description: "Check the form fields highlighted in red",
        action: {
          label: "Fix Now!"
        }
      });
      return;
    }

    try {
      const user = await login(formData.username, formData.password);
      toast.success(`Welcome back, ${user.name || "User"}. Pleasure seeing you back`, {
        position: "bottom-right",
        description: `Its about time ${new Date().getTime()}`,
        action: {
          label: "Welcome back"
        }
      });

      switch (user.role) {
        case "Client": navigate("/client-dashboard"); break;
        case "Reviewer": navigate("/reviewer-dashboard"); break;
        case "Manager": navigate("/admin-dashboard"); break;
        default: navigate("/");
      }
    } catch (err) {
      toast.error(err.message || "Invalid credentials.");
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

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] overflow-hidden px-4 font-sans gap-2 py-6">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Added corner accents */}
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
        className="relative z-10 w-full max-w-[440px] backdrop-blur-xl px-6 md:px-8 py-8 md:py-9 rounded-[32px] border border-gray-300/5 shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 text-sm">Sign in to continue using SOLEASE</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          
          {/* Username/Email Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              {validationSuccess.username && !validationErrors.username && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-green-600 flex items-center gap-1">
                  <Check size={14} /> Valid
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                validationErrors.username ? 'text-red-500' : 
                validationSuccess.username ? 'text-green-500' : 
                'text-gray-600 group-focus-within:text-blue-500'
              }`}>
                <Mail size={18} />
              </div>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your username"
                aria-label="Username"
                aria-required="true"
                aria-invalid={!!validationErrors.username}
                aria-describedby={validationErrors.username ? "username-error" : undefined}
                className={`w-full bg-gray-50 border-2 rounded-xl py-3 md:py-4 pl-12 pr-4 text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                  validationErrors.username 
                    ? 'border-red-300 focus:border-red-500' 
                    : validationSuccess.username
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-gray-200 focus:border-blue-500/50'
                }`}
                disabled={isLoading}
                required
              />
            </div>
            {validationErrors.username && touched.username && (
              <motion.div 
                id="username-error"
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-600 ml-1"
              >
                <AlertCircle size={14} /> {validationErrors.username}
              </motion.div>
            )}
            {!validationErrors.username && (
              <p className="text-xs text-gray-500 ml-1">3+ characters (letters, numbers, _, -)</p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
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
                <Lock size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                aria-label="Password"
                aria-required="true"
                aria-invalid={!!validationErrors.password}
                aria-describedby={validationErrors.password ? "password-error" : undefined}
                className={`w-full bg-gray-50 border-2 rounded-xl py-3 md:py-4 pl-12 pr-12 text-gray-900 placeholder:text-gray-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                  validationErrors.password 
                    ? 'border-red-300 focus:border-red-500' 
                    : validationSuccess.password
                    ? 'border-green-300 focus:border-green-500'
                    : 'border-gray-200 focus:border-blue-500/50'
                }`}
                disabled={isLoading}
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>

            {/* Password Strength Meter */}
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

                {/* Password Requirements */}
                <div className="flex items-start flex-col text-xs">
                  <div className={`flex items-center gap-1 ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                    <Check size={12} className={formData.password.length >= 6 ? 'opacity-100' : 'opacity-30'} />
                    Use at least 6 characters to protect against brute-force attacks
                  </div>
                  <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <Check size={12} className={/[A-Z]/.test(formData.password) ? 'opacity-100' : 'opacity-30'} />
                    At least one capital letter <span className="font-bold">(A–Z)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${(formData.password.match(/[a-z]/g) || []).length >= 4 ? 'text-green-600' : 'text-gray-500'}`}>
                    <Check size={12} className={(formData.password.match(/[a-z]/g) || []).length >= 4 ? 'opacity-100' : 'opacity-30'} />
                    At least 4 small letters <span className="font-bold">(a–z)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <Check size={12} className={/[0-9]/.test(formData.password) ? 'opacity-100' : 'opacity-30'} />
                    At least one numerical digit <span className="font-bold">(0–9)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                    <Check size={12} className={/[^A-Za-z0-9]/.test(formData.password) ? 'opacity-100' : 'opacity-30'} />
                    At least one symbol <span className="font-bold">(e.g., **! @ # $ % ^ & ***)</span>
                  </div>
                  <div></div>
                </div>
              </motion.div>
            )}

            {validationErrors.password && touched.password && (
              <motion.div 
                id="password-error"
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-600 ml-1"
              >
                <AlertCircle size={14} /> {validationErrors.password}
              </motion.div>
            )}
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <motion.div 
            className="flex items-center justify-between px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                aria-label="Remember me on this device"
                disabled={isLoading}
                className="w-4 h-4 rounded border-gray-300 bg-gray-50 text-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer accent-blue-500 transition-all" 
              />
              <span className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors">Remember me</span>
            </label>
            <Link 
              to="/auth/forgot-password" 
              className="text-xs font-semibold text-blue-500 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors rounded px-1"
              aria-label="Go to forgot password page"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            disabled={isLoading || validationErrors.username || validationErrors.password}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full py-3 md:py-4 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-gray-600 text-sm">
            New to the platform?{" "}
            <Link 
              to="/auth/signup" 
              className="text-blue-500 font-semibold hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-1 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LoginForm;