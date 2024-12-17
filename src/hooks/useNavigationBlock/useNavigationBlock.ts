import {
  useState,
  useEffect,
  useCallback
} from 'react';
import { useHistory } from 'react-router-dom';

export const useNavigationBlock = (showModalOnCancel: boolean, isSaving = false) => {
  const [showConfirmCancelEditModal, setShowConfirmCancelEditModal] = useState(false);
  const [nextLocation, setNextLocation] = useState<any>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const history = useHistory();

  const continueNavigation = useCallback(() => {
    if (nextLocation) {
      setShowConfirmCancelEditModal(false);
      history.push(nextLocation.pathname + nextLocation.search);
      setIsBlocked(false);
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
      unblock = history.block((next) => {
        setShowConfirmCancelEditModal(true);
        setNextLocation(next);
        setIsBlocked(true);

        return false;
      });
    }

    return () => {
      if (unblock) unblock();
    };
  }, [showModalOnCancel, history, isBlocked, isSaving]);

  return {
    showConfirmCancelEditModal,
    continueNavigation,
    keepEditHandler,
    setShowConfirmCancelEditModal,
    setNextLocation
  };
};
