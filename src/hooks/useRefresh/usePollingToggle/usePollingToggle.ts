import { useState } from 'react';

export const usePollingToggle = (shouldStartPolling: boolean) => {
  const [isPollingEnabled, setIsPollingEnabled] = useState(shouldStartPolling);
  const [previousShouldStartPolling, setPreviousShouldStartPolling] = useState(shouldStartPolling);

  if (shouldStartPolling !== previousShouldStartPolling) {
    setPreviousShouldStartPolling(shouldStartPolling);

    if (shouldStartPolling && !isPollingEnabled) {
      setIsPollingEnabled(true);
    }
  }

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
