import { HTTPError } from 'ky';
import { useRefreshStatusPolling } from './useRefreshStatusPolling';
import { useInitRefresh } from './useInitRefresh';
import { useCancelRefresh } from './useCancelRefresh';
import { InProgressRefresh, ListsRecordDetails } from '../../interfaces';


type UseRefreshProps = {
    listId: string,
    inProgressRefresh?: InProgressRefresh,
    onErrorPolling: (code: string) => void,
    onSuccessPolling: (data: ListsRecordDetails) => void,
    onRequestFailed?: () => void;
    onError: (error: HTTPError) => void;
    onCancelRefresh?: () => void;
    onCancelSuccess?: () => void;
    onCancelError?: (error: HTTPError) => void;
};

export const useRefresh = ({
  listId,
  inProgressRefresh,
  onErrorPolling,
  onSuccessPolling,
  onError,
  onCancelRefresh = () => {},
  onCancelError = () => {},
  onCancelSuccess = () => {},
}: UseRefreshProps) => {
  const {
    stopPolling,
    startPolling,
    isPollingInProgress,
    polledData,
    poolStatus
  } = useRefreshStatusPolling({
    listId,
    inProgressRefresh,
    onErrorPolling,
    onSuccessPolling,
    onCancelRefresh,
    onError
  });

  const { initRefresh } = useInitRefresh({
    onSuccess(data) {
      startPolling(data.id);
    },
    onError
  });

  const { cancelRefresh, cancelInProgress } = useCancelRefresh({
    listId,
    onSuccess: () => {
      onCancelSuccess();
      stopPolling();
    },
    onError: (error) => {
      onCancelError(error);
      poolStatus();
    }
  });

  return {
    initRefresh: () => {
      initRefresh(listId);
    },
    isRefreshInProgress: isPollingInProgress,
    cancelRefresh,
    isCancelRefreshInProgress: cancelInProgress,
    polledData,
  };
};
