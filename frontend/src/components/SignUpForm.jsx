import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CircleUser, KeyRound, Mail, User, Eye, EyeOff, Check, AlertCircle, ArrowRight} from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { toast } from "sonner"
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSignupAction, ActionExpiredPage } from "@/hooks/useSensitiveAction.jsx";

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

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthenticationStore();
  const { isBlocked, error: blockError, refreshCount, trackRefresh, completeAction, setActionError } = useSignupAction();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasword, setConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [validationSuccess, setValidationSuccess] = useState({});
  const [touched, setTouched] = useState({});

  const isUseMobile = useIsMobile();
  const position = isUseMobile ? 'top-center' : 'top-right';
  const [oauthLoading, setOauthLoading] = useState(false);

  // Validation rules
  const VALIDATION_RULES = {
    username: {
      pattern: /^[a-zA-Z0-9_-]{3,}$/,
      message: "Username must be at least 3 characters (letters, numbers, _, -)"
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address"
    },
    password: {
      minLength: 6,
      message: "Password must be at least 6 characters"
    },
    confirmPasword: {
      message: "Password does not match"
    },
    name: {
      minLength: 2,
      message: "Name must be at least 2 characters"
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
      const fieldNames = { username: 'Username', name: 'Full Name', email: 'Email', password: 'Password', confirmPasword: 'Confirm Password' };
      errors[name] = `${fieldNames[name]} is required`;
      delete success[name];
    } else if (name === 'username') {
      if (!VALIDATION_RULES.username.pattern.test(value)) {
        errors[name] = VALIDATION_RULES.username.message;
        delete success[name];
      } else {
        delete errors[name];
        success[name] = true;
      }
    } else if (name === 'email') {
      if (!VALIDATION_RULES.email.pattern.test(value)) {
        errors[name] = VALIDATION_RULES.email.message;
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
    } else if(name === 'confirmPassword') {
      if(value !== formData.password){
        errors[name] = VALIDATION_RULES.confirmPasword.message;
        delete success[name];
      } else {
        delete errors[name];
        success[name] = true;
      }
    } else if (name === 'name') {
      if (value.length < VALIDATION_RULES.name.minLength) {
        errors[name] = VALIDATION_RULES.name.message;
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

  const handleOAuthSignup = (provider) => {
    setOauthLoading(true);
    window.location.href = `http://localhost:5001/api/auth/${provider}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      return;
    }

    setTouched({ username: true, name: true, email: true, password: true });
    validateField('username', formData.username);
    validateField('name', formData.name);
    validateField('email', formData.email);
    validateField('password', formData.password);
    validateField('confirmPasswrd', formData.confirmPassword);

    if (validationErrors.username || validationErrors.name || validationErrors.email || validationErrors.password || validationErrors.confirmPassword) {
      toast.error("Please fix validation errors before submitting", { 
        position,
        description: "Check the form fields highlighted in red"
      });
      return;
    }

    trackRefresh();

    try {
      await signup(formData.username, formData.name, formData.email, formData.password);
      
      completeAction();
      setFormData({ username: "", name: "", email: "", password: "", confirmPassword: "" });
      setValidationErrors({});
      setValidationSuccess({});
      setTouched({});
      
      navigate("/auth/verify-email", { replace: true });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || error || "Sign up failed!";
      setActionError(errorMessage);
      toast.error(errorMessage, {
        position,
        description: "Please try again or contact support."
      });
    }
  }

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
    return <ActionExpiredPage message={blockError || "Signup session expired. Please try again."} />;
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#060b18] overflow-hidden px-4 font-sans gap-2 py-6" aria-busy={isLoading}>

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
        className="relative z-10 w-full max-w-[440px] bg-[#080e1e]/90 backdrop-blur-2xl px-6 md:px-8 py-8 md:py-9 rounded-[32px] shadow-2xl shadow-blue-500/10 ring-1 ring-white/10"
      >
        {/* Subtle top light highlight */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent mx-12" />

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">Create Account</h2>
          <p className="text-white/60 text-sm">Join SOLEASE and get started today</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Username Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="username" className="text-sm font-medium text-white/80">
                Username <span className="text-red-500">*</span>
              </label>
              {validationSuccess.username && !validationErrors.username && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-green-500 flex items-center gap-1">
                  <Check size={14} /> Valid
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                validationErrors.username ? 'text-red-500' : 
                validationSuccess.username ? 'text-green-500' : 
                'text-white/40 group-focus-within:text-blue-500'
              }`}>
                <User size={18} />
              </div>
              <input
                id="username"
                type="text"
                name="username"
                autoComplete="off"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. JDoe"
                aria-label="Username"
                aria-required="true"
                aria-invalid={!!validationErrors.username}
                aria-describedby={validationErrors.username ? "username-error" : undefined}
                className={`w-full bg-white/5 border-2 rounded-xl py-3 md:py-4 pl-12 pr-4 text-white placeholder:text-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                  validationErrors.username 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : validationSuccess.username
                    ? 'border-green-500/50 focus:border-green-500'
                    : 'border-white/10 focus:border-blue-500/50'
                }`}
                disabled={isLoading}
                required
              />
            </div>
            {validationErrors.username && touched.username && (
              <motion.div 
                id="username-error"
                role="status"
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-500 ml-1"
              >
                <AlertCircle size={14} /> {validationErrors.username}
              </motion.div>
            )}
            {!validationErrors.username && (
              <p className="text-xs text-white/30 ml-1">3+ characters (letters, numbers, _, -)</p>
            )}
          </motion.div>

          {/* Full Name Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="name" className="text-sm font-medium text-white/80">
                Full Name <span className="text-red-500">*</span>
              </label>
              {validationSuccess.name && !validationErrors.name && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-green-500 flex items-center gap-1">
                  <Check size={14} /> Valid
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                validationErrors.name ? 'text-red-500' : 
                validationSuccess.name ? 'text-green-500' : 
                'text-white/40 group-focus-within:text-blue-500'
              }`}>
                <CircleUser size={18} />
              </div>
              <input
                id="name"
                type="text"
                name="name"
                autoComplete="off"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. John Doe"
                aria-label="Full Name"
                aria-required="true"
                aria-invalid={!!validationErrors.name}
                aria-describedby={validationErrors.name ? "name-error" : undefined}
                className={`w-full bg-white/5 border-2 rounded-xl py-3 md:py-4 pl-12 pr-4 text-white placeholder:text-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                  validationErrors.name 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : validationSuccess.name
                    ? 'border-green-500/50 focus:border-green-500'
                    : 'border-white/10 focus:border-blue-500/50'
                }`}
                disabled={isLoading}
                required
              />
            </div>
            {validationErrors.name && touched.name && (
              <motion.div 
                id="name-error"
                role="status"
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-500 ml-1"
              >
                <AlertCircle size={14} /> {validationErrors.name}
              </motion.div>
            )}
            {!validationErrors.name && (
              <p className="text-xs text-white/30 ml-1">Minimum 2 characters</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="text-sm font-medium text-white/80">
                Email Address <span className="text-red-500">*</span>
              </label>
              {validationSuccess.email && !validationErrors.email && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-green-500 flex items-center gap-1">
                  <Check size={14} /> Valid
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                validationErrors.email ? 'text-red-500' : 
                validationSuccess.email ? 'text-green-500' : 
                'text-white/40 group-focus-within:text-blue-500'
              }`}>
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@company.com"
                aria-label="Email Address"
                aria-required="true"
                aria-invalid={!!validationErrors.email}
                aria-describedby={validationErrors.email ? "email-error" : undefined}
                className={`w-full bg-white/5 border-2 rounded-xl py-3 md:py-4 pl-12 pr-4 text-white placeholder:text-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                  validationErrors.email 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : validationSuccess.email
                    ? 'border-green-500/50 focus:border-green-500'
                    : 'border-white/10 focus:border-blue-500/50'
                }`}
                disabled={isLoading}
                required
              />
            </div>
            {validationErrors.email && touched.email && (
              <motion.div 
                id="email-error"
                role="status"
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-500 ml-1"
              >
                <AlertCircle size={14} /> {validationErrors.email}
              </motion.div>
            )}
            {!validationErrors.email && (
              <p className="text-xs text-white/30 ml-1">We'll send a verification link to this email</p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-white/80">
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
                'text-white/40 group-focus-within:text-blue-500'
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
                placeholder="••••••••"
                aria-label="Password"
                aria-required="true"
                aria-invalid={!!validationErrors.password}
                aria-describedby={validationErrors.password ? "password-error" : undefined}
                className={`w-full bg-white/5 border-2 rounded-xl py-3 md:py-4 pl-12 pr-12 text-white placeholder:text-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                  validationErrors.password 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : validationSuccess.password
                    ? 'border-green-500/50 focus:border-green-500'
                    : 'border-white/10 focus:border-blue-500/50'
                }`}
                disabled={isLoading}
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
            {validationErrors.password && touched.password && (
              <motion.div 
                id="password-error"
                role="status"
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-500 ml-1"
              >
                <AlertCircle size={14} /> {validationErrors.password}
              </motion.div>
            )}
            {!validationErrors.password && (
              <p className="text-xs text-white/30 ml-1">Use 6+ characters with 4+ lowercase letters, 1+ uppercase, 1+ number, 1+ symbol</p>
            )}
            {formData.password && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength.percent}%` }}
                    transition={{ duration: 0.3 }}
                    className={`h-2 rounded-full transition-colors ${strengthColor[passwordStrength.level] || 'bg-white/20'}`}
                  />
                </div>

                {/* Password Requirements */}
                <div className="flex items-start flex-col text-xs">
                  <div className={`flex items-center gap-1 ${formData.password.length >= 6 ? 'text-green-500' : 'text-white/30'}`}>
                    <Check size={12} className={formData.password.length >= 6 ? 'opacity-100' : 'opacity-30'} />
                    Use at least 6 characters to protect against brute-force attacks
                  </div>
                  <div className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-white/30'}`}>
                    <Check size={12} className={/[A-Z]/.test(formData.password) ? 'opacity-100' : 'opacity-30'} />
                    At least one capital letter <span className="font-bold">(A–Z)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${(formData.password.match(/[a-z]/g) || []).length >= 4 ? 'text-green-500' : 'text-white/30'}`}>
                    <Check size={12} className={(formData.password.match(/[a-z]/g) || []).length >= 4 ? 'opacity-100' : 'opacity-30'} />
                    At least 4 small letters <span className="font-bold">(a–z)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-white/30'}`}>
                    <Check size={12} className={/[0-9]/.test(formData.password) ? 'opacity-100' : 'opacity-30'} />
                    At least one numerical digit <span className="font-bold">(0–9)</span>
                  </div>
                  <div className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-white/30'}`}>
                    <Check size={12} className={/[^A-Za-z0-9]/.test(formData.password) ? 'opacity-100' : 'opacity-30'} />
                    At least one symbol <span className="font-bold">(e.g., **! @ # $ % ^ & ***)</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/30 text-xs mt-2 font-bold">
                    Restrictions against easily guessable strings like password123 or sequences like 12345
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              {validationSuccess.confirmPassword && !validationErrors.confirmPassword
              && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs text-green-500 flex items-center gap-1"
                >
                  <Check size={14} />
                </motion.span>
              )}
            </div>
            <div className="relative group">
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  validationErrors.confirmPassword ? 'text-red-500' :
                  validationSuccess.confirmPassword ? 'text-green-500':
                  'text-white/40 group-focus-within:text-blue-500'
                }`}
              >
                <KeyRound size={18} />
              </div>
              <input
                id="confirmPassword"
                type={confirmPasword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                aria-label="Confirm Password"
                aria-required="true"
                aria-invalid={!!validationErrors.confirmPassword}
                aria-describedby={validationErrors.confirmPassword ? "Confirm-Password Error": undefined}
                className={`w-full bg-white/5 border-2 rounded-xl py-3 md:py-4 pl-12 pr-12 text-white
                  placeholder:text-white/30 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
                    validationErrors.confirmPassword
                    ? "border-red-500/50 focus:border-red-500"
                    : validationSuccess.confirmPassword
                    ? "border-green-500/50 focus:border-green-500"
                    : "border-white/10 focus:border-blue-500/50"
                  }`}
                disabled={isLoading}
                required
               />
              <motion.button
                type="button"
                onClick={() => setConfirmPassword(!confirmPasword)}
                aria-label={confirmPasword ? "Hide Confirm Password" : "Show Confirm Password"}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-white/40 hover:text-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
                disabled={isLoading}
              >
                {confirmPasword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
            {validationErrors.confirmPassword && touched.confirmPassword && (
              <motion.div
                id="confirmPassword-error"
                role="status"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-xs text-red-500 ml-1"
              >
                <AlertCircle size={18} /> {validationErrors.confirmPassword}
              </motion.div>
            )}
            {!validationErrors.confirmPassword && (
              <p className="text-xs text-white/30 ml-1">Re-enter your password to confirm</p>
            )}
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium text-center border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          {/* Sign Up Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        {/* OAuth Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-[#080e1e]/90 text-white/40">or continue with</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={() => handleOAuthSignup('google')}
            disabled={oauthLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white text-sm font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.38 8.55 1 10.22 1 12s.38 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => handleOAuthSignup('github')}
            disabled={oauthLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.114-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>GitHub</span>
          </motion.button>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-500 font-semibold hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default SignUpForm;