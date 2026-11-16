import { HTTPError } from 'ky';
import { useOkapiKy } from '@folio/stripes/core';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { usePollingToggle } from '../usePollingToggle';
import { InProgressRefresh, ListsRecordDetails } from '../../../interfaces';
import { PULLING_STATUS_DELAY } from '../constants';

type useRefreshStatusPollingPops = {
  listId: string,
  inProgressRefresh?: InProgressRefresh,
  onErrorPolling: (code: string) => void,
  onSuccessPolling: (data: ListsRecordDetails) => void,
  onError: (error: HTTPError) => void;
  onCancelRefresh?: () => void;
}

export const useRefreshStatusPolling = ({
  listId,
  inProgressRefresh,
  onErrorPolling,
  onSuccessPolling,
  onError,
  onCancelRefresh,
}: useRefreshStatusPollingPops) => {
  const ky = useOkapiKy();
  const {
    isPollingEnabled,
    setPollingOff,
    setPollingOn
  } = usePollingToggle(Boolean(inProgressRefresh?.id));

  const [currentRefreshId, setCurrentRefreshId] = useState<string>(inProgressRefresh?.id ?? '');

  const stopPolling = () => {
    setCurrentRefreshId('');
    setPollingOff();
  };

  const startPolling = (refreshId: string) => {
    setCurrentRefreshId(refreshId);
    setPollingOn();
  };

  const { refetch, data: polledData, isLoading } = useQuery<ListsRecordDetails, HTTPError>(
    {
      queryKey: ['listDetailsStatusPulling', listId],
      queryFn: async () => {
        const result = await ky.get(`lists/${listId}`);
        return result.json() as unknown as ListsRecordDetails;
      },
      cacheTime: 0,
      enabled: isPollingEnabled,
      refetchInterval: PULLING_STATUS_DELAY,
      refetchOnWindowFocus: false,
      onSuccess: (data: ListsRecordDetails) => {
        const { failedRefresh, successRefresh } = data;
        const shouldUpdateID = data.inProgressRefresh && currentRefreshId !== data.inProgressRefresh.id;
        const isRefreshCanceled = !data.inProgressRefresh && successRefresh && successRefresh.id !== currentRefreshId;

        if (data.inProgressRefresh && shouldUpdateID) {
          setCurrentRefreshId(data.inProgressRefresh.id);
        }

        if (data.inProgressRefresh) {
          return;
        }

        if (failedRefresh) {
          onErrorPolling(failedRefresh.error.code);
        } else if (isRefreshCanceled) {
          onCancelRefresh?.();
        } else {
          onSuccessPolling(data);
        }

        stopPolling();
      },
      onError: (error: HTTPError) => {
        onError?.(error);
      }
    },
  );

  return {
    startPolling,
    stopPolling,
    isPollingInProgress: isPollingEnabled || isLoading,
    poolStatus: refetch,
    polledData
  };
};
