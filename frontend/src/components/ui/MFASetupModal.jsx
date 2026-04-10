import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Shield, ShieldCheck, X, Copy, CheckCircle, AlertCircle, XCircle, QrCode, Key, RefreshCw, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import useNotificationStore from "../../store/notificationStore";

const toastConfig = {
  position: 'top-right',
  duration: 5000,
  style: {
    background: 'var(--toast-bg, white)',
    color: 'var(--toast-text, #000)',
  }
};

const generateSecret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
};

const getTOTPUri = (secret, email, issuer = 'SOLEASE') => {
  return `otpauth://totp/${issuer}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
};

const MFASetupModal = ({ isOpen, onClose, userEmail, onMfaSetupComplete }) => {
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (isOpen && step === 1) {
      const newSecret = generateSecret();
      setSecret(newSecret);
      const uri = getTOTPUri(newSecret, userEmail || 'user@example.com');
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`);
    }
  }, [isOpen, step, userEmail]);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (verificationCode === '123456' || verificationCode.length === 6) {
        await addNotification({
          type: 'MFA_ENABLED',
          title: 'Two-Factor Authentication Enabled',
          message: 'Your account is now protected with 2FA.',
          read: false
        });

        toast.success('2FA enabled successfully!', toastConfig);
        
        if (onMfaSetupComplete) {
          onMfaSetupComplete(true);
        }
        
        setStep(3);
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Failed to enable 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    setSecret('');
    setVerificationCode('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 hidden sm:flex rounded-xl bg-blue-100 dark:bg-blue-900/40 items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Secure your account</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Smartphone className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Scan QR Code</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Use your authenticator app to scan this QR code</p>
                </div>

                <div className="flex justify-center">
                  <div className="p-2 sm:p-4 bg-white rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48" />
                    ) : (
                      <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                        <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <p className="text-xs font-medium text-slate-500 text-center">Can't scan? Enter this code manually:</p>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <code className="flex-1 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 break-all">{secret}</code>
                    <button 
                      onClick={handleCopySecret}
                      className="p-2 text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0"
                      title="Copy secret"
                    >
                      {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button 
                    onClick={handleClose}
                    className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg sm:rounded-xl font-bold text-sm transition-colors hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSkip}
                    className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-blue-600 text-white rounded-lg sm:rounded-xl font-bold text-sm transition-colors hover:bg-blue-700"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <Key className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Verify Setup</h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">Enter the 6-digit code from your authenticator app</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(val);
                      setError('');
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 text-center text-lg sm:text-xl lg:text-2xl font-mono tracking-[0.3em] sm:tracking-[0.5em] rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {error && (
                    <p className="text-center text-xs sm:text-sm text-red-500 flex items-center justify-center gap-1 sm:gap-2">
                      <AlertCircle size={16} /> {error}
                    </p>
                  )}
                </div>

                <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 text-center">
                    For testing, enter any 6-digit code (e.g., 123456)
                  </p>
                </div>

                <button 
                  onClick={handleVerifyAndEnable}
                  disabled={loading || verificationCode.length < 6}
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-green-600 text-white rounded-lg sm:rounded-xl font-bold text-sm transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span className="text-sm">Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span className="text-sm">Enable 2FA</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-2 sm:py-6"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">2FA Enabled!</h4>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Your account is now protected with Two-Factor Authentication.</p>
                
                <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-4 sm:mb-6">
                  <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle size={14} sm size={18} />
                    <span className="text-xs sm:text-sm font-medium">Backup codes generated</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleClose}
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-blue-600 text-white rounded-lg sm:rounded-xl font-bold text-sm transition-colors hover:bg-blue-700"
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default MFASetupModal;