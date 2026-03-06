import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, X, Clock } from "lucide-react";
import { useAuthenticationStore } from "../../store/authStore";

const PasswordWarningBanner = () => {
  const { passwordUpdateRequired, passwordUpdateDeadline, user } = useAuthenticationStore();
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!passwordUpdateRequired || !passwordUpdateDeadline) return;

    const updateTimeRemaining = () => {
      const deadline = new Date(passwordUpdateDeadline);
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeRemaining("Expired - Update now");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s remaining`);
      } else {
        setTimeRemaining(`${seconds}s remaining`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [passwordUpdateRequired, passwordUpdateDeadline]);

  if (!passwordUpdateRequired || !isVisible) return null;

  const isExpired = timeRemaining.includes("Expired");

  return (
    <div className={`relative ${isExpired ? 'bg-red-500' : 'bg-orange-500'} text-white px-4 py-3`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className="flex-shrink-0" size={20} />
          <div className="flex-1 flex items-center justify-between gap-4">
            <p className="text-sm font-medium">
              Your password does not meet security requirements. Please update it to continue using the system.
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Clock size={16} />
              <span className="text-sm font-semibold">{timeRemaining}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/auth/change-password"
            className="px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            Update Now
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordWarningBanner;
