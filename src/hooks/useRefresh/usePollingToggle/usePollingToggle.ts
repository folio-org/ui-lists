import { useEffect, useState } from 'react';

export const usePollingToggle = (shouldStartPolling: boolean) => {
  const [isPollingEnabled, setIsPollingEnabled] = useState(shouldStartPolling);

  useEffect(() => {
    if (shouldStartPolling && !isPollingEnabled) {
      setIsPollingEnabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldStartPolling]);

  return {
    isPollingEnabled,
    setPollingOff() {
      setIsPollingEnabled(false);
    },
    setPollingOn() {
      setIsPollingEnabled(true);
    }
  };
};
