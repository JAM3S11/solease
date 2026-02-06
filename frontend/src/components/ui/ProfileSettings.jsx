import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, MapPin, Phone, Globe, ShieldCheck, Fingerprint, Save, Lock, CheckCircle, AlertCircle, Eye, EyeOff, Upload, X, LogOut, Shield } from "lucide-react";
import toast from 'react-hot-toast';

// Toast configuration with theme awareness
const toastConfig = {
  position: 'top-right',
  duration: 5000,
  style: {
    background: 'var(--toast-bg, white)',
    color: 'var(--toast-text, #000)',
  }
};

// Input validation patterns
const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\-\s\+\(\)]{7,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-Z\s]{2,}$/,
};

// Enhanced Input Field Component with validation
const ProfileInput = React.memo(({ 
  label, 
  icon: Icon, 
  disabled, 
  error,
  success,
  required,
  validationType,
  helpText,
  ...props 
}) => {
  const isValid = success && !error;
  
  return (
    <div className="w-full">
      <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ml-1 transition-colors duration-200 ${
        error 
          ? 'text-red-600 dark:text-red-400' 
          : isValid
          ? 'text-green-600 dark:text-green-400'
          : 'text-slate-500 dark:text-slate-400'
      }`}>
        {Icon && <Icon size={14} className={error ? 'text-red-600 dark:text-red-400' : isValid ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'} />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          disabled={disabled}
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.name}-error` : undefined}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
            disabled
              ? 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : error
              ? 'bg-white dark:bg-slate-800 border-red-500 dark:border-red-500 focus:ring-red-500 text-slate-700 dark:text-slate-200'
              : isValid
              ? 'bg-white dark:bg-slate-800 border-green-500 dark:border-green-500 focus:ring-green-500 text-slate-700 dark:text-slate-200'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-transparent shadow-sm text-slate-700 dark:text-slate-200'
          }`}
        />
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <CheckCircle size={20} className="text-green-500" />
            </motion.div>
          )}
          {error && !disabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <AlertCircle size={20} className="text-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            id={`${props.name}-error`}
            className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
          >
            {error}
          </motion.p>
        )}
        {helpText && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
          >
            {helpText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

ProfileInput.displayName = 'ProfileInput';

// Password Input Component
const PasswordInput = React.memo(({ label, error, success, required, helpText, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isValid = success && !error;

  return (
    <div className="w-full">
      <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 ml-1 transition-colors duration-200 ${
        error 
          ? 'text-red-600 dark:text-red-400' 
          : isValid
          ? 'text-green-600 dark:text-green-400'
          : 'text-slate-500 dark:text-slate-400'
      }`}>
        <Lock size={14} className={error ? 'text-red-600 dark:text-red-400' : isValid ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'} />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          aria-label={label}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.name}-error` : undefined}
          className={`w-full px-4 py-3 pr-10 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
            error
              ? 'bg-white dark:bg-slate-800 border-red-500 dark:border-red-500 focus:ring-red-500'
              : isValid
              ? 'bg-white dark:bg-slate-800 border-green-500 dark:border-green-500 focus:ring-green-500'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-transparent shadow-sm'
          } text-slate-700 dark:text-slate-200`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            id={`${props.name}-error`}
            className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
          >
            {error}
          </motion.p>
        )}
        {helpText && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1.5 text-xs text-slate-500 dark:text-slate-400"
          >
            {helpText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

// Validation function
const validateField = (name, value, validationType) => {
  if (!value && name.includes('address')) return 'This field is required';
  if (!value && validationType) return `${name.replace(/([A-Z])/g, ' $1').trim()} is required`;
  
  if (validationType === 'email' && value && !VALIDATION_RULES.email.test(value)) {
    return 'Please enter a valid email address';
  }
  if (validationType === 'phone' && value && !VALIDATION_RULES.phone.test(value)) {
    return 'Please enter a valid phone number';
  }
  if (validationType === 'password' && value && !VALIDATION_RULES.password.test(value)) {
    return 'Password must be 8+ chars with uppercase, lowercase, number, and symbol';
  }
  
  return '';
};

const ProfileSettings = ({
  role = 'client',
  user,
  personalData,
  contactData,
  onPersonalChange,
  onContactChange,
  onSave,
  loading
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [validationSuccess, setValidationSuccess] = useState({});
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isDirty, setIsDirty] = useState(false);

  const handleValidation = useCallback((name, value, validationType) => {
    const error = validateField(name, value, validationType);
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));

    if (!error && value) {
      setValidationSuccess(prev => ({
        ...prev,
        [name]: true
      }));
    } else {
      setValidationSuccess(prev => ({
        ...prev,
        [name]: false
      }));
    }
  }, []);

  const handlePersonalChange = useCallback((e) => {
    const { name, value } = e.target;
    setIsDirty(true);
    onPersonalChange(e);
    
    const validationType = name === 'email' ? 'email' : name === 'name' ? 'name' : null;
    handleValidation(name, value, validationType);
  }, [onPersonalChange, handleValidation]);

  const handleContactChange = useCallback((e) => {
    const { name, value } = e.target;
    setIsDirty(true);
    onContactChange(e);
    
    const validationType = name === 'telephoneNumber' ? 'phone' : null;
    handleValidation(name, value, validationType);
  }, [onContactChange, handleValidation]);

  const handleSave = useCallback(async () => {
    try {
      await onSave();
      toast.success('Changes saved successfully!', toastConfig);
      setIsDirty(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save changes', toastConfig);
    }
  }, [onSave]);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    handleValidation(name, value, 'password');
  }, [handleValidation]);

  const handlePasswordSubmit = useCallback(async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Passwords do not match', toastConfig);
      return;
    }
    
    try {
      // API call would go here
      toast.success('Password changed successfully!', toastConfig);
      setPasswordData({ current: '', new: '', confirm: '' });
      setShowPasswordSection(false);
    } catch (error) {
      toast.error('Failed to change password', toastConfig);
    }
  }, [passwordData]);

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8`}>

      {/* Header */}
      <header className='flex flex-col items-start space-y-3 mb-8'>
        <h2 className={`font-bold text-slate-900 dark:text-white tracking-tight ${
          role === 'client' ? 'text-3xl font-black' : 'text-2xl md:text-3xl'
        }`}>
          {role === 'client' ? 'Account Settings' : 'Profile Settings'}
        </h2>
        <p className={`font-normal text-slate-600 dark:text-slate-400 ${
          role === 'client' ? 'font-medium text-sm' : 'text-sm sm:text-base'
        }`}>
          {role === 'client'
            ? 'Manage your personal identity, contact details, and account security.'
            : 'Manage your personal information and account settings'
          }
        </p>
      </header>

      {/* User Identity Card */}
      {role === 'client' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='relative overflow-hidden w-full flex items-center bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg rounded-2xl p-8 text-white group mb-8'>

          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all duration-700" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-inner">
              <Fingerprint size={40} className="text-white" />
            </div>
            <div>
              <h2 className='text-2xl font-bold tracking-wide uppercase'>
                {user?.name || user?.username}
              </h2>
              <div className="flex items-center gap-2 mt-2 opacity-90">
                <ShieldCheck size={16} className="text-blue-100" />
                <span className="text-sm font-semibold tracking-tight">
                  {role === 'client' ? 'CLIENT' : 'ADMIN'} ID: #{user?._id?.slice(-6).toUpperCase() || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='w-full flex flex-col items-start bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800/40 dark:to-slate-800 border border-blue-200 dark:border-slate-700 shadow-sm rounded-2xl mb-8 p-6'
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200 dark:bg-blue-900/30 rounded-lg">
              <User size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className='text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight'>
                {user?.name || user?.username}
              </h2>
              <p className='text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 tracking-wider'>
                {role.toUpperCase()} ID: #{user?._id?.slice(-6).toUpperCase() || "N/A"}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Information Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${role === 'admin' ? 'mb-8' : ''}`}
      >

        {/* Personal Information Card */}
        <motion.div
          initial={role === 'client' ? { opacity: 0, x: -20 } : { opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`space-y-6 ${role === 'client'
            ? 'bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700'
            : 'bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm'
          }`}
        >

          {/* Section Header */}
          <div className="space-y-2 border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <User size={20} className="text-blue-600 dark:text-blue-400" /> 
              Personal Information
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Update your basic profile information. Your full name is displayed across the platform and helps other users identify you.
            </p>
          </div>

          <div className='space-y-4'>
            <ProfileInput
              key="personal-name"
              label='Full Name'
              icon={User}
              name="name"
              placeholder="Enter your full name"
              value={personalData.name || ""}
              onChange={handlePersonalChange}
              error={validationErrors.name}
              success={validationSuccess.name}
              required
              validationType="name"
              helpText="Used to personalize your profile and communications"
            />
            <ProfileInput
              key="personal-email"
              label='Email Address'
              icon={Mail}
              disabled
              value={personalData.email || ""}
              error={validationErrors.email}
              success={validationSuccess.email}
              helpText="Your verified email address used for account recovery and notifications"
            />
            <div className={role === 'client' ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "grid grid-cols-1 sm:grid-cols-2 gap-4"}>
              <ProfileInput
                key="personal-role"
                label='Account Role'
                disabled
                value={personalData.role || ""}
                helpText="Your role determines what features and permissions you have"
              />
              <ProfileInput
                key="personal-status"
                label='Account Status'
                disabled
                value={personalData.status || ""}
                helpText="Shows whether your account is active, suspended, or under review"
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Information Card */}
        <motion.div
          initial={role === 'client' ? { opacity: 0, x: 20 } : { opacity: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`space-y-6 ${role === 'client'
            ? 'bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700'
            : 'bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm'
          }`}
        >

          {/* Section Header */}
          <div className="space-y-2 border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <MapPin size={20} className="text-blue-600 dark:text-blue-400" /> 
              Contact Details
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Provide your contact information so support teams and collaborators can reach you when needed.
            </p>
          </div>

          <div className='space-y-4'>
            <ProfileInput
              key="contact-address"
              label='Physical Address'
              icon={MapPin}
              name="address"
              placeholder="Enter your address"
              value={contactData.address || ""}
              onChange={handleContactChange}
              error={validationErrors.address}
              success={validationSuccess.address}
              required
              helpText="Used for verification purposes and service delivery in your location"
            />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <ProfileInput
                key="contact-country"
                label="Country"
                icon={Globe}
                name="country"
                placeholder="Your country"
                value={contactData.country || ""}
                onChange={handleContactChange}
                error={validationErrors.country}
                success={validationSuccess.country}
                helpText="Helps determine applicable regulations and services"
              />
              <ProfileInput
                key="contact-county"
                label="County"
                name="county"
                placeholder="Your county"
                value={contactData.county || ""}
                onChange={handleContactChange}
                error={validationErrors.county}
                success={validationSuccess.county}
                helpText="Your local administrative region"
              />
            </div>
            <ProfileInput
              key="contact-telephone"
              label='Telephone Number'
              icon={Phone}
              name="telephoneNumber"
              placeholder="+1 (555) 000-0000"
              type="tel"
              value={contactData.telephoneNumber ?? ""}
              onChange={handleContactChange}
              error={validationErrors.telephoneNumber}
              success={validationSuccess.telephoneNumber}
              validationType="phone"
              helpText="Used for urgent communications and account verification. Keep it updated!"
            />
           </div>
        </motion.div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='space-y-4'
      >
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Shield size={20} className="text-blue-600 dark:text-blue-400" /> 
            Security & Privacy
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Protect your account with strong passwords and advanced security features. We recommend enabling two-factor authentication for additional security.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Password Change Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4'
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock size={18} className="text-blue-600 dark:text-blue-400" />
                  Change Password
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Update your password regularly to keep your account secure. Use a strong, unique password.
                </p>
              </div>
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors whitespace-nowrap ml-2"
              >
                {showPasswordSection ? 'Cancel' : 'Update'}
              </button>
            </div>

            <AnimatePresence>
              {showPasswordSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700'
                >
                  <PasswordInput
                    label="Current Password"
                    name="current"
                    value={passwordData.current}
                    onChange={handlePasswordChange}
                    error={validationErrors.current}
                    required
                    helpText="Enter your current password to verify your identity"
                  />
                  <PasswordInput
                    label="New Password"
                    name="new"
                    value={passwordData.new}
                    onChange={handlePasswordChange}
                    error={validationErrors.new}
                    success={validationSuccess.new}
                    required
                    helpText="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
                  />
                  <PasswordInput
                    label="Confirm Password"
                    name="confirm"
                    value={passwordData.confirm}
                    onChange={handlePasswordChange}
                    error={passwordData.confirm && passwordData.new !== passwordData.confirm ? 'Passwords do not match' : ''}
                    success={validationSuccess.confirm && passwordData.new === passwordData.confirm}
                    required
                  />
                  <button
                    onClick={handlePasswordSubmit}
                    disabled={loading || !passwordData.current || !passwordData.new || !passwordData.confirm}
                    className="w-full mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition-all active:scale-95"
                  >
                    Update Password
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!showPasswordSection && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Change your account password regularly for better security.
              </p>
            )}
          </motion.div>

          {/* Two-Factor Authentication Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4'
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-600 dark:text-green-400" />
                  Two-Factor Authentication
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Add an extra security layer by requiring a code from your phone during login.
                </p>
              </div>
              <button
                onClick={() => setShowTwoFA(!showTwoFA)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors whitespace-nowrap ml-2"
              >
                {showTwoFA ? 'Cancel' : 'Setup'}
              </button>
            </div>

            <AnimatePresence>
              {showTwoFA && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700'
                >
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Step 1:</strong> Download an authenticator app (Google Authenticator, Microsoft Authenticator, Authy)
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Step 2:</strong> Scan this QR code with your authenticator app:
                  </p>
                  <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-6 rounded-lg">
                    <div className="w-40 h-40 bg-white dark:bg-slate-800 flex items-center justify-center rounded">
                      <ShieldCheck size={60} className="text-slate-300" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Step 3:</strong> Enter the 6-digit code from your authenticator:
                  </p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    className="w-full px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:border-blue-500 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Verify & Enable 2FA
                  </button>
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
                    💡 <strong>Tip:</strong> Save your backup codes in a safe place. You'll need them if you lose access to your authenticator app.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!showTwoFA && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Add an extra security layer by requiring a code from your phone during login.
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex flex-col sm:flex-row gap-4 ${role === 'client' ? 'justify-center md:justify-end' : 'justify-end'} pt-6 border-t border-slate-200 dark:border-slate-700`}
      >
        {isDirty && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-amber-600 dark:text-amber-400 self-center"
          >
            You have unsaved changes
          </motion.p>
        )}
        <button
          onClick={handleSave}
          disabled={loading || !isDirty}
          className={`group flex items-center justify-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold shadow-md hover:shadow-lg dark:shadow-none transition-all active:scale-95 min-h-12 sm:min-h-auto`}
          aria-label="Save changes"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {role === 'client' ? 'Syncing...' : 'Updating...'}
            </span>
          ) : (
            <>
              <Save size={18} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </>
          )}
        </button>
      </motion.div>

    </div>
  );
};

export default ProfileSettings;