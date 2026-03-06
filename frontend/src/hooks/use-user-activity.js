import { useEffect, useRef } from 'react';
import useAdminStore from '../store/adminStore';

export const useUserActivity = (isAuthenticated) => {
  const { updateActivity, markOffline } = useAdminStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivityPeriodically = async () => {
      await updateActivity();
    };

    updateActivityPeriodically();

    intervalRef.current = setInterval(updateActivityPeriodically, 60000);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        updateActivityPeriodically();
        intervalRef.current = setInterval(updateActivityPeriodically, 60000);
      }
    };

    const handleBeforeUnload = () => {
      markOffline();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      markOffline();
    };
  }, [isAuthenticated, updateActivity, markOffline]);
};
