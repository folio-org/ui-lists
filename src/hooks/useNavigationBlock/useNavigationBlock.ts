import {
  useState,
  useEffect,
  useCallback
} from 'react';
import { useHistory } from 'react-router-dom';

export const useNavigationBlock = (
  showModalOnCancel: boolean,
  isSaving = false,
  blockListPath = false,
) => {
  const [showConfirmCancelEditModal, setShowConfirmCancelEditModal] = useState(false);
  const [nextLocation, setNextLocation] = useState<any>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const history = useHistory();

  const continueNavigation = useCallback(() => {
    if (nextLocation) {
      setShowConfirmCancelEditModal(false);
      setIsBlocked(false);
      history.push({
        pathname: nextLocation.pathname,
        search: nextLocation.search
      });
      setNextLocation(null);
    }
  }, [history, nextLocation]);

  const keepEditHandler = useCallback(() => {
    setShowConfirmCancelEditModal(false);
    setIsBlocked(false);
  }, []);

  useEffect(() => {
    let unblock: (() => void) | undefined;

    if (!showModalOnCancel || isSaving) {
      return;
    }

    if (showModalOnCancel && !isBlocked) {
      // @ts-ignore
      unblock = history.block((next) => {
        const isListPath = /^\/lists\/list\/[0-9a-fA-F-]+$/.test(next.pathname);

        if (isListPath && !blockListPath) {
          return true;
        }

        setShowConfirmCancelEditModal(true);
        setNextLocation(next);
        setIsBlocked(true);

        return false;
      });
    }

    // here we need a clean-up function for useEffect
    // eslint-disable-next-line consistent-return
    return () => {
      if (unblock) unblock();
    };
  }, [showModalOnCancel, history, isBlocked, isSaving, blockListPath]);

  return {
    showConfirmCancelEditModal,
    continueNavigation,
    keepEditHandler,
    setShowConfirmCancelEditModal,
    setNextLocation
  };
};
