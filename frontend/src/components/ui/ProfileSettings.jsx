import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { User, Mail, MapPin, Phone, Globe, ShieldCheck, Fingerprint, Save, Lock, CheckCircle, AlertCircle, Eye, EyeOff, Upload, X, LogOut, Shield, Bell, BellOff, Calendar, Clock, BadgeCheck, Award, Edit3, ExternalLink, Camera, XCircle, Menu } from "lucide-react";
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "./drawer"
import ComboboxInput, { COUNTRIES, getStatesByCountry, getAreasByState } from "./ComboboxInput"
import MFASetupModal from "./MFASetupModal"
import toast from 'react-hot-toast';
import useNotificationStore from "../../store/notificationStore";

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

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
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
      <label className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider mb-2 ml-1 transition-colors duration-200 ${error
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
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${disabled
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
      <label className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider mb-2 ml-1 transition-colors duration-200 ${error
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
          className={`w-full px-4 py-3 pr-10 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${error
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

const PHASES = [
  { id: 'overview', label: 'Overview', icon: User, description: 'View your profile status and basic identity' },
  { id: 'personal', label: 'Identity', icon: Shield, description: 'Manage your personal legal identity' },
  { id: 'contact', label: 'Communication', icon: MapPin, description: 'Your communication and location details' },
  { id: 'security', label: 'Security', icon: Lock, description: 'Protect your account with advanced measures' },
  { id: 'preferences', label: 'Preferences', icon: Bell, description: 'Control how we communicate with you' },
];

const ProfileSettings = ({
  role = 'client',
  user,
  personalData,
  contactData,
  onPersonalChange,
  onContactChange,
  onSave,
  loading,
  verified = false,
  createdAt = null,
  avatar = null,
  lastLogin = null,
  profilePhoto = null,
  onUploadProfilePhoto,
  onDeleteProfilePhoto,
  profilePhotoLoading = false,
}) => {
  const { notificationsEnabled, fetchNotificationPreference, toggleNotifications } = useNotificationStore();
  const fileInputRef = React.useRef(null);
  const [activePhase, setActivePhase] = useState('overview');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const currentAvatar = profilePhoto || avatar || user?.profilePhoto;

  const completionStats = useMemo(() => {
    let score = 0;
    if (personalData.name && personalData.email) score += 20;
    if (currentAvatar) score += 20;
    if (contactData.address && contactData.telephoneNumber) score += 20;
    if (notificationsEnabled) score += 20;
    if (verified) score += 20; // Or 2FA if we had it fully
    return score;
  }, [personalData, contactData, currentAvatar, notificationsEnabled, verified]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    console.log("ProfileSettings: File input changed", file);
    if (file) {
      console.log("ProfileSettings: Selected file:", file.name, file.type, file.size);
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB', toastConfig);
        e.target.value = '';
        return;
      }
      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      console.log("ProfileSettings: Photo selected, preview set");
      e.target.value = '';
    }
  };

  const handlePhotoUpload = async () => {
    console.log("ProfileSettings: handlePhotoUpload called, selectedPhoto:", selectedPhoto);
    if (!selectedPhoto) {
      console.log("ProfileSettings: No photo selected, returning");
      return;
    }
    console.log("ProfileSettings: Uploading photo:", selectedPhoto.name, selectedPhoto.type, selectedPhoto.size);
    try {
      await onUploadProfilePhoto(selectedPhoto);
      toast.success('Profile photo updated successfully!', toastConfig);
      setSelectedPhoto(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error("ProfileSettings: Upload error:", error);
      toast.error(error.message || 'Failed to upload photo', toastConfig);
    }
  };

  const handlePhotoCancel = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  const handleDeletePhoto = async () => {
    try {
      await onDeleteProfilePhoto();
      toast.success('Profile photo removed successfully!', toastConfig);
    } catch (error) {
      toast.error(error.message || 'Failed to delete photo', toastConfig);
    }
  };

  const [validationErrors, setValidationErrors] = useState({});
  const [validationSuccess, setValidationSuccess] = useState({});
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(verified);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isDirty, setIsDirty] = useState(false);
  const [togglingNotif, setTogglingNotif] = useState(false);
  const [showPersonalDrawer, setShowPersonalDrawer] = useState(false);
  const [showContactDrawer, setShowContactDrawer] = useState(false);

  useEffect(() => {
    fetchNotificationPreference();
  }, [fetchNotificationPreference]);

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

    if (name === 'country') {
      const states = getStatesByCountry(value)
      if (states.length > 0) {
        const countyEvent = {
          target: {
            name: 'county',
            value: states[0]
          }
        }
        onContactChange(countyEvent)
      }
    }

    if (name === 'county' && contactData.country) {
      const areas = getAreasByState(contactData.country, value)
      if (areas.length > 0) {
        const addressEvent = {
          target: {
            name: 'address',
            value: areas[0]
          }
        }
        onContactChange(addressEvent)
      }
    }

    const validationType = name === 'telephoneNumber' ? 'phone' : null;
    handleValidation(name, value, validationType);
  }, [onContactChange, handleValidation, contactData.country]);

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
      toast.success('Password changed successfully!', toastConfig);
      setPasswordData({ current: '', new: '', confirm: '' });
      setShowPasswordSection(false);
    } catch (error) {
      toast.error('Failed to change password', toastConfig);
    }
  }, [passwordData]);

  const handleNotificationToggle = useCallback(async () => {
    setTogglingNotif(true);
    try {
      await toggleNotifications(!notificationsEnabled);
      toast.success(
        notificationsEnabled ? 'Notifications turned off' : 'Notifications turned on',
        toastConfig
      );
    } catch {
      toast.error('Failed to update notification preference', toastConfig);
    } finally {
      setTogglingNotif(false);
    }
  }, [toggleNotifications, notificationsEnabled]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Mobile Header - Only visible on small screens < 768px */}
      <div className="md:hidden flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h1>
        <div className="w-10" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 min-h-[600px]">
        
        {/* Phase-Based Sidebar */}
        <aside className="w-full md:w-72 flex-shrink-0 space-y-6 lg:space-y-8">
          {/* Mobile: Always visible (no hidden class), Desktop: Always visible */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Settings
            </h1>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Profile Score
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {completionStats}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionStats}%` }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
              <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete your profile to unlock full platform features and enhanced support.
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {PHASES.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activePhase === phase.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <phase.icon size={18} className={activePhase === phase.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} />
                <span className="text-sm font-semibold">{phase.label}</span>
                {activePhase === phase.id && (
                  <motion.div layoutId="activePhase" className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Active Phase Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {PHASES.find(p => p.id === activePhase)?.label}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {PHASES.find(p => p.id === activePhase)?.description}
                </p>
              </div>

              {/* Phase: OVERVIEW */}
              {activePhase === 'overview' && (
                <div className="space-y-8">
                  {role === 'client' ? (
                    <div className='relative overflow-hidden w-full bg-gradient-to-br from-slate-800 to-slate-900 dark:from-blue-600 dark:to-blue-800 shadow-2xl rounded-2xl p-6 sm:p-8 text-white'>
                      <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                      <div className="relative z-10 flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start">
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative">
                            <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 overflow-hidden shadow-xl">
                              {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                              ) : currentAvatar ? (
                                <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-white/5">
                                  {getInitials(personalData.name || user?.name)}
                                </div>
                              )}
                            </div>
                            {(selectedPhoto || photoPreview) && (
                              <div className="absolute -right-2 -top-2 flex gap-1">
                                <button
                                  onClick={handlePhotoUpload}
                                  disabled={profilePhotoLoading}
                                  className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg touch-manipulation disabled:opacity-50"
                                >
                                  {profilePhotoLoading ? <Clock size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                </button>
                                <button
                                  onClick={handlePhotoCancel}
                                  className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg touch-manipulation"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2 bg-white text-blue-600 rounded-lg flex items-center gap-2 shadow-lg text-sm font-medium touch-manipulation"
                              aria-label="Change profile photo"
                            >
                              <Camera size={16} />
                              <span className="hidden sm:inline">Change</span>
                            </button>
                            {currentAvatar && (
                              <button
                                type="button"
                                onClick={handleDeletePhoto}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 shadow-lg text-sm font-medium touch-manipulation"
                                aria-label="Remove profile photo"
                              >
                                <X size={16} />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-4">
                          <div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                              <h3 className="text-xl font-bold tracking-tight">{personalData.name || user?.name}</h3>
                              {verified && <BadgeCheck size={20} className="text-blue-400" />}
                            </div>
                            <p className="text-sm text-blue-100/70">{personalData.email}</p>
                          </div>
                          <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 flex items-center gap-2">
                              <Fingerprint size={14} className="text-blue-200" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">ID: {user?._id?.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 flex items-center gap-2">
                              <Clock size={14} className="text-blue-200" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Joined {formatDate(createdAt || user?.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                         <div className="flex flex-col items-center gap-2">
                           <div className="relative">
                             <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden">
                                {currentAvatar ? <img src={currentAvatar} className="w-full h-full object-cover" /> : <User size={24} className="text-blue-600" />}
                             </div>
                             {(selectedPhoto || photoPreview) && (
                               <div className="absolute -right-1 -top-1 flex gap-0.5">
                                 <button
                                   onClick={handlePhotoUpload}
                                   disabled={profilePhotoLoading}
                                   className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg touch-manipulation disabled:opacity-50"
                                 >
                                   {profilePhotoLoading ? <Clock size={10} className="animate-spin" /> : <CheckCircle size={10} />}
                                 </button>
                                 <button
                                   onClick={handlePhotoCancel}
                                   className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg touch-manipulation"
                                 >
                                   <XCircle size={10} />
                                 </button>
                               </div>
                             )}
                           </div>
                           <div className="flex gap-1">
                             <button
                               type="button"
                               onClick={() => fileInputRef.current?.click()}
                               className="px-3 py-1.5 bg-white text-blue-600 rounded-lg flex items-center gap-1 shadow text-xs font-medium touch-manipulation"
                               aria-label="Change profile photo"
                             >
                               <Camera size={12} />
                               <span>Change</span>
                             </button>
                             {currentAvatar && (
                               <button
                                 type="button"
                                 onClick={handleDeletePhoto}
                                 className="px-3 py-1.5 bg-red-500 text-white rounded-lg flex items-center gap-1 shadow text-xs font-medium touch-manipulation"
                                 aria-label="Remove profile photo"
                               >
                                 <X size={12} />
                                 <span>Remove</span>
                               </button>
                             )}
                           </div>
                         </div>
                         <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{user?.name}</h3>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-0.5">{role} Account</p>
                         </div>
                      </div>
                    </div>
                  )}
                  
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    className="hidden" 
                    onChange={handlePhotoSelect} 
                    accept="image/*"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                       <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">System Information</h4>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                             <span className="text-xs text-slate-500">Account Type</span>
                             <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{role}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                             <span className="text-xs text-slate-500">Registration Date</span>
                             <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatDate(createdAt)}</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                             <span className="text-xs text-slate-500">Last Session</span>
                             <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatRelativeTime(lastLogin)}</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                       <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Verification</h4>
                       <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
                          {verified ? (
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                               <CheckCircle size={20} />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                               <AlertCircle size={20} />
                            </div>
                          )}
                          <div>
                             <p className="text-sm font-bold text-slate-900 dark:text-white">{verified ? 'Identity Verified' : 'Action Required'}</p>
                             <p className="text-xs text-slate-500">{verified ? 'Your account is fully vetted.' : 'Verify your email to secure your account.'}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Phase: PERSONAL */}
              {activePhase === 'personal' && (
                <div className="space-y-6">
                  {/* Editable Section */}
                  <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <ProfileInput
                      label='Legal Full Name'
                      icon={User}
                      name="name"
                      placeholder="Enter your full name"
                      value={personalData.name || ""}
                      onChange={handlePersonalChange}
                      error={validationErrors.name}
                      success={validationSuccess.name}
                      required
                      validationType="name"
                      helpText="This name will appear on official documents and invoices."
                    />
                  </div>

                  {/* Read-Only System Section */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">System Identity Metadata</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Email with Verified Badge */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Primary Network ID</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{personalData.email}</span>
                          {verified && (
                            <div className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md flex items-center gap-1 flex-shrink-0">
                              <BadgeCheck size={10} />
                              <span className="text-[9px] font-black">VERIFIED</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Role */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Organization Role</p>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <Award size={14} className="text-blue-500" />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 capitalize">{personalData.role || 'Member'}</span>
                        </div>
                      </div>

                      {/* Status Pill */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Account Status</p>
                        <div>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${
                            personalData.status?.toLowerCase() === 'active'
                              ? 'bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50'
                              : 'bg-amber-100/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 animate-pulse ${
                              personalData.status?.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-amber-500'
                            }`} />
                            {personalData.status || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic flex items-center gap-2">
                        <Lock size={12} className="text-slate-400" />
                        System-managed identity traits. Request modifications through your organization administrator.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Phase: CONTACT */}
              {activePhase === 'contact' && (
                <div className="space-y-6">
                  {/* Geographic Location Card */}
                  <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Geographic Location</h4>
                    </div>

                    <div className="space-y-6">
                      <ProfileInput
                        label='Physical Street Address'
                        icon={MapPin}
                        name="address"
                        placeholder="e.g., 123 Business Way"
                        value={contactData.address || ""}
                        onChange={handleContactChange}
                        error={validationErrors.address}
                        success={validationSuccess.address}
                        required
                        helpText="Required for service delivery and regional tax compliance."
                      />
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                        <ComboboxInput
                          label="Country / Region"
                          icon={Globe}
                          name="country"
                          value={contactData.country || ""}
                          onChange={handleContactChange}
                          options={COUNTRIES}
                          placeholder="Select or type country..."
                          allowCustom
                          onEnterPress={(value) => {
                            const states = getStatesByCountry(value)
                            if (states.length > 0) {
                              const countyEvent = {
                                target: {
                                  name: 'county',
                                  value: states[0]
                                }
                              }
                              onContactChange(countyEvent)
                            }
                          }}
                          helpText="Select your primary residence. Press Enter to add custom."
                        />
                        <ComboboxInput
                          label="State / County"
                          name="county"
                          value={contactData.county || ""}
                          onChange={handleContactChange}
                          options={contactData.country ? getStatesByCountry(contactData.country) : []}
                          placeholder="Select or type state/county..."
                          allowCustom
                          onEnterPress={(value) => {
                            const event = {
                              target: {
                                name: 'county',
                                value: value
                              }
                            }
                            onContactChange(event)
                            const areas = getAreasByState(contactData.country, value)
                            if (areas.length > 0) {
                              const addressEvent = {
                                target: {
                                  name: 'address',
                                  value: areas[0]
                                }
                              }
                              onContactChange(addressEvent)
                            }
                          }}
                          helpText="Auto-filled based on Country/Region."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Card */}
                  <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                        <Phone size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Direct Contact</h4>
                    </div>

                    <ProfileInput
                      label='Telephone Contact'
                      icon={Phone}
                      name="telephoneNumber"
                      placeholder="+254 --- --- ---"
                      type="tel"
                      value={contactData.telephoneNumber ?? ""}
                      onChange={handleContactChange}
                      error={validationErrors.telephoneNumber}
                      success={validationSuccess.telephoneNumber}
                      validationType="phone"
                      helpText="Used for urgent account recovery and security verification."
                    />
                  </div>
                </div>
              )}

              {/* Phase: SECURITY */}
              {activePhase === 'security' && (
                <div className="space-y-6">
                   {/* Security Health Summary Card */}
                   <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5">
                         {verified ? <ShieldCheck size={120} /> : <AlertCircle size={120} />}
                      </div>
                      
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${verified ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                              {verified ? <ShieldCheck size={24} /> : <AlertCircle size={24} />}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Security Health</h3>
                              <p className="text-sm text-slate-500">{verified ? 'Your account is well-protected.' : 'Some security measures require attention.'}</p>
                            </div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border ${
                            verified ? 'bg-green-500/10 text-green-600 border-green-200' : 'bg-amber-500/10 text-amber-600 border-amber-200'
                          }`}>
                            {verified ? 'Protected' : 'Action Required'}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                           <div className="flex items-center gap-3">
                              <CheckCircle size={16} className={verified ? 'text-green-500' : 'text-slate-300'} />
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Verified</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <CheckCircle size={16} className="text-slate-300" />
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">2FA (Coming Soon)</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <CheckCircle size={16} className="text-green-500" />
                              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Standard Password</span>
                           </div>
                        </div>
                      </div>
                   </div>

                   {/* Credentials Management Card */}
                   <div className='bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6'>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                               <Lock size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                               <h4 className="text-base font-bold text-slate-900 dark:text-white">Credentials Management</h4>
                               <p className="text-[11px] text-slate-500 font-medium">Last updated: {formatRelativeTime(user?.passwordChangedAt || createdAt)}</p>
                            </div>
                         </div>
                         {!showPasswordSection && (
                            <button 
                               onClick={() => setShowPasswordSection(true)}
                               className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                            >
                               <Edit3 size={14} />
                               Change Password
                            </button>
                         )}
                      </div>

                      <AnimatePresence>
                        {showPasswordSection && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-700"
                          >
                             <PasswordInput label="Current Password" name="current" value={passwordData.current} onChange={handlePasswordChange} error={validationErrors.current} required />
                             
                             <div className="space-y-4">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <PasswordInput 
                                    label="New Password" 
                                    name="new" 
                                    value={passwordData.new} 
                                    onChange={handlePasswordChange} 
                                    error={validationErrors.new} 
                                    success={validationSuccess.new} 
                                    required 
                                  />
                                  <PasswordInput 
                                    label="Confirm New Password" 
                                    name="confirm" 
                                    value={passwordData.confirm} 
                                    onChange={handlePasswordChange} 
                                    error={passwordData.confirm && passwordData.new !== passwordData.confirm ? 'Passwords do not match' : ''} 
                                    success={validationSuccess.confirm && passwordData.new === passwordData.confirm} 
                                    required 
                                  />
                               </div>

                               {/* Password Strength Meter */}
                               {passwordData.new && (
                                 <div className="space-y-2">
                                   <div className="flex justify-between items-center">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strength Meter</span>
                                     <span className={`text-[10px] font-black uppercase tracking-widest ${
                                       VALIDATION_RULES.password.test(passwordData.new) ? 'text-green-500' : 
                                       passwordData.new.length >= 8 ? 'text-amber-500' : 'text-red-500'
                                     }`}>
                                       {VALIDATION_RULES.password.test(passwordData.new) ? 'Strong' : 
                                        passwordData.new.length >= 8 ? 'Fair' : 'Weak'}
                                     </span>
                                   </div>
                                   <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
                                      <div className={`h-full rounded-full transition-all duration-500 ${passwordData.new.length > 0 ? (passwordData.new.length >= 8 ? 'bg-amber-500 w-1/3' : 'bg-red-500 w-1/3') : 'w-0'}`} />
                                      <div className={`h-full rounded-full transition-all duration-500 ${passwordData.new.length >= 8 ? (/[0-9]/.test(passwordData.new) ? 'bg-amber-500 w-1/3' : 'w-0') : 'w-0'}`} />
                                      <div className={`h-full rounded-full transition-all duration-500 ${VALIDATION_RULES.password.test(passwordData.new) ? 'bg-green-500 w-1/3' : 'w-0'}`} />
                                   </div>
                                 </div>
                               )}
                             </div>

                             <div className="flex gap-3">
                                <button onClick={handlePasswordSubmit} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
                                   Update Security Credentials
                                </button>
                                <button onClick={() => setShowPasswordSection(false)} className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold">
                                   Discard
                                </button>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>

                   {/* MFA Card (Refined Consistency) */}
                   <div className='bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm'>
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mfaEnabled ? 'bg-green-100 text-green-600 dark:bg-green-900/40' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40'}`}>
                               {mfaEnabled ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                            </div>
                            <div>
                               <h4 className="text-base font-bold text-slate-900 dark:text-white">Two-Factor Authentication (MFA)</h4>
                               <p className="text-xs text-slate-500 italic">{mfaEnabled ? 'Your account is protected.' : 'Enhance protection with multi-layered verification.'}</p>
                            </div>
                         </div>
                         {mfaEnabled ? (
                           <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
                             <ShieldCheck size={14} className="text-green-600 dark:text-green-400" />
                             <span className="text-xs font-bold text-green-700 dark:text-green-400">Enabled</span>
                           </div>
                         ) : (
                           <button 
                             onClick={() => setShowMFA(true)}
                             className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-colors"
                           >
                             Setup MFA
                           </button>
                         )}
                      </div>
                      {mfaEnabled ? (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 flex items-center gap-3">
                           <CheckCircle size={16} className="text-green-500" />
                           <p className="text-xs text-green-700 dark:text-green-400">Your account is protected with Two-Factor Authentication.</p>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 flex items-start gap-3">
                           <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                           <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">MFA is highly recommended for all accounts. By enabling it, you reduce the risk of unauthorized access even if your password is compromised.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {/* Phase: PREFERENCES */}
              {activePhase === 'preferences' && (
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                   <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 mb-6">
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${notificationsEnabled ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                            {notificationsEnabled ? <Bell size={24} /> : <BellOff size={24} />}
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ticket Activity Alerts</h4>
                            <p className="text-xs text-slate-500">Get notified about status updates and technician comments.</p>
                         </div>
                      </div>
                      <button
                        onClick={handleNotificationToggle}
                        disabled={togglingNotif}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl">
                         <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Channel</h5>
                         <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Enabled</p>
                      </div>
                      <div className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl">
                         <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">In-App Banner</h5>
                         <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Active</p>
                      </div>
                   </div>
                </div>
              )}

{/* Action Bar (Global for relevant phases) */}
              {(activePhase === 'personal' || activePhase === 'contact') && (
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                   {isDirty && (
                     <p className="text-xs font-bold text-amber-500 flex items-center gap-2">
                        <AlertCircle size={14} /> Unsaved Changes
                     </p>
                   )}
                   <button
                     onClick={handleSave}
                     disabled={loading || !isDirty}
                     className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
                   >
                    {loading ? <Clock size={18} className="animate-pulse" /> : <Save size={18} />}
                    {loading ? 'Synchronizing...' : 'Save All Changes'}
                   </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <MFASetupModal 
        isOpen={showMFA} 
        onClose={() => setShowMFA(false)} 
        userEmail={personalData.email || user?.email}
        onMfaSetupComplete={(enabled) => {
          setMfaEnabled(enabled);
        }}
      />

      {/* Mobile Menu Drawer - Only on small screens < md */}
      {mobileMenuOpen && createPortal(
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-slate-800 z-50 md:hidden shadow-2xl overflow-y-auto"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h2>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Profile Score
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {completionStats}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionStats}%` }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => {
                    setActivePhase(phase.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activePhase === phase.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <phase.icon size={18} />
                  <span className="text-sm font-semibold">{phase.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        </>,
        document.body
      )}
    </div>
  );
};

export default ProfileSettings;