import { useState } from 'react';

export const usePollingToggle = (shouldStartPolling: boolean) => {
  const [isPollingEnabled, setIsPollingEnabled] = useState(shouldStartPolling);
  const [previousShouldStartPolling, setPreviousShouldStartPolling] = useState(shouldStartPolling);

  // Polling is switched on while rendering instead of in an effect: an effect would let one render be committed
  // with the refresh already known but polling (and so the "refresh in progress" state) still off, which flashes
  // the list's previous record count before "Query in progress".
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
