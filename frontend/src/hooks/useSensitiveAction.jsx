import { useState, useEffect, useCallback } from "react";

const REFRESH_LIMIT = 5;
const BLOCK_TIMEOUT = 30000;

const createSensitiveAction = (actionName) => {
  const REFRESH_COUNT_KEY = `refresh_count_${actionName}`;
  const BLOCK_KEY = `blocked_${actionName}`;
  const INIT_KEY = `initialized_${actionName}`;

  const useSensitiveAction = () => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [error, setError] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);

    const blockUser = useCallback(() => {
      sessionStorage.setItem(BLOCK_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsBlocked(true);
      setError(`Too many refreshes (${REFRESH_LIMIT}). Please wait 30 seconds.`);
      
      const timer = setTimeout(() => {
        sessionStorage.removeItem(BLOCK_KEY);
        sessionStorage.removeItem(REFRESH_COUNT_KEY);
        setIsBlocked(false);
        setError(null);
        setRefreshCount(0);
      }, BLOCK_TIMEOUT);

      return () => clearTimeout(timer);
    }, [BLOCK_KEY, REFRESH_COUNT_KEY]);

    useEffect(() => {
      const blockData = sessionStorage.getItem(BLOCK_KEY);
      
      if (blockData) {
        const { timestamp } = JSON.parse(blockData);
        const elapsed = Date.now() - timestamp;

        if (elapsed < BLOCK_TIMEOUT) {
          const remaining = Math.ceil((BLOCK_TIMEOUT - elapsed) / 1000);
          setIsBlocked(true);
          setError(`Too many refreshes. Please wait ${remaining} seconds.`);
          
          const timer = setTimeout(() => {
            sessionStorage.removeItem(BLOCK_KEY);
            sessionStorage.removeItem(REFRESH_COUNT_KEY);
            setIsBlocked(false);
            setError(null);
            setRefreshCount(0);
          }, remaining * 1000);

          return () => clearTimeout(timer);
        } else {
          sessionStorage.removeItem(BLOCK_KEY);
          sessionStorage.removeItem(REFRESH_COUNT_KEY);
        }
      }

      const navTiming = performance.getEntriesByType("navigation")[0];
      const isPageRefresh = navTiming && navTiming.type === "reload";
      
      const initialized = sessionStorage.getItem(INIT_KEY);
      const countData = sessionStorage.getItem(REFRESH_COUNT_KEY);
      
      if (countData) {
        const { count, lastPath } = JSON.parse(countData);
        const currentPath = window.location.pathname;
        
        if (lastPath === currentPath && isPageRefresh) {
          const newCount = count + 1;
          setRefreshCount(newCount);
          sessionStorage.setItem(REFRESH_COUNT_KEY, JSON.stringify({ 
            count: newCount, 
            path: currentPath 
          }));
          
          if (newCount >= REFRESH_LIMIT) {
            return blockUser();
          }
        } else if (lastPath === currentPath && !isPageRefresh) {
          setRefreshCount(count);
        } else {
          sessionStorage.removeItem(REFRESH_COUNT_KEY);
        }
      }
      
      sessionStorage.setItem(INIT_KEY, "true");
    }, [actionName, blockUser]);

    const incrementCount = useCallback(() => {
      const countData = sessionStorage.getItem(REFRESH_COUNT_KEY);
      let currentCount = 0;
      
      if (countData) {
        const { count } = JSON.parse(countData);
        currentCount = count;
      }
      
      const newCount = currentCount + 1;
      setRefreshCount(newCount);
      sessionStorage.setItem(REFRESH_COUNT_KEY, JSON.stringify({ 
        count: newCount, 
        path: window.location.pathname 
      }));

      if (newCount >= REFRESH_LIMIT) {
        return blockUser();
      }
      
      return () => {};
    }, [REFRESH_COUNT_KEY, blockUser]);

    const trackRefresh = useCallback(() => {
      return incrementCount();
    }, [incrementCount]);

    const completeAction = useCallback(() => {
      sessionStorage.removeItem(REFRESH_COUNT_KEY);
      sessionStorage.removeItem(BLOCK_KEY);
      sessionStorage.removeItem(INIT_KEY);
      setIsBlocked(false);
      setError(null);
      setRefreshCount(0);
    }, [REFRESH_COUNT_KEY, BLOCK_KEY, INIT_KEY]);

    const setActionError = useCallback((message) => {
      sessionStorage.setItem(BLOCK_KEY, JSON.stringify({ timestamp: Date.now() }));
      sessionStorage.removeItem(REFRESH_COUNT_KEY);
      setIsBlocked(true);
      setError(message);
      
      const timer = setTimeout(() => {
        sessionStorage.removeItem(BLOCK_KEY);
        sessionStorage.removeItem(REFRESH_COUNT_KEY);
        sessionStorage.removeItem(INIT_KEY);
        setIsBlocked(false);
        setError(null);
        setRefreshCount(0);
      }, BLOCK_TIMEOUT);

      return () => clearTimeout(timer);
    }, [BLOCK_KEY, REFRESH_COUNT_KEY, INIT_KEY]);

    return {
      isBlocked,
      error,
      refreshCount,
      trackRefresh,
      completeAction,
      setActionError,
    };
  };

  return useSensitiveAction;
};

export const useSignupAction = createSensitiveAction("signup");
export const useVerifyEmailAction = createSensitiveAction("verify_email");
export const useForgotPasswordAction = createSensitiveAction("forgot_password");
export const useResetPasswordAction = createSensitiveAction("reset_password");

export const ActionExpiredPage = ({ message = "Too many refreshes. Please try again." }) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <p className="text-sm text-gray-500 mb-6">
          You can try again in <span className="font-semibold text-blue-500">{countdown}</span> seconds
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
            style={{ width: `${((30 - countdown) / 30) * 100}%` }}
          />
        </div>
        <button
          onClick={() => window.location.reload()}
          disabled={countdown > 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            countdown > 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {countdown > 0 ? "Please wait..." : "Try Again"}
        </button>
      </div>
    </div>
  );
};

export default ActionExpiredPage;
