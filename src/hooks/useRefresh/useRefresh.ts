import { useOkapiKy } from '@folio/stripes/core';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { HTTPError } from 'ky';
import { useCancelRefresh } from './useCancelRefresh';
import { ListsRecordDetails } from '../../interfaces';
import { PULLING_STATUS_DELAY } from './constants';

type UseRefreshProps = {
    listId: string,
    shouldStartPulling: boolean,
    onErrorPulling: (code: string) => void,
    onSuccessPulling: (data: ListsRecordDetails) => void,
    onRequestFailed?: () => void;
    onError: (error: HTTPError) => void;
    onCancelRefresh?: () => void;
    onCancelSuccess?: () => void;
    onCancelError?: (error: HTTPError) => void;
};

type InitRefreshResponse = {
    id: string,
    listId: string,
    refreshStartDate: string,
    refreshedBy: string,
    refreshedByUsername: string,
    status: string
}

export const useRefresh = ({
  listId,
  shouldStartPulling,
  onErrorPulling,
  onSuccessPulling,
  onError,
  onCancelRefresh = () => {},
  onCancelError = () => {},
  onCancelSuccess = () => {}
}: UseRefreshProps) => {
  const ky = useOkapiKy();
  const [isPullingEnabled, setIsPullingEnabled] = useState(shouldStartPulling);
  const [refreshId, setRefreshId] = useState<string>();
  const stopPulling = () => {
    setIsPullingEnabled(false);
    setRefreshId('');
  };

  useEffect(() => {
    if (shouldStartPulling && !isPullingEnabled) {
      setIsPullingEnabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldStartPulling]);

  // @ts-ignore:next-line
  const { mutate: initRefresh, reset } = useMutation(() => ky.post(`lists/${listId}/refresh`).json(),
    {
      retry: false,
      onSuccess: (data: InitRefreshResponse) => {
        setRefreshId(data.id);

        if (!isPullingEnabled) {
          setIsPullingEnabled(true);
        }

        reset();
      },
      onError: (error: HTTPError) => {
        onError(error);
        reset();
      }
    });


  const { refetch } = useQuery(
    {
      queryKey: ['listDetailsStatusPulling', listId],
      queryFn: async () => {
        const result = await ky.get(`lists/${listId}`);
        return result.json() as unknown as ListsRecordDetails;
      },
      cacheTime: 0,
      enabled: isPullingEnabled,
      refetchInterval: PULLING_STATUS_DELAY,
      refetchOnWindowFocus: false,
      onSuccess: (data: ListsRecordDetails) => {
        const { inProgressRefresh, failedRefresh, successRefresh } = data;
        const shouldUpdateID = inProgressRefresh && refreshId !== inProgressRefresh.id;
        const isRefreshCanceled = successRefresh && successRefresh.id !== refreshId;

        if (shouldUpdateID) {
          setRefreshId(inProgressRefresh.id);
        }

        if (inProgressRefresh) {
          return;
        }

        if (failedRefresh) {
          onErrorPulling(failedRefresh.error.code);
        } else if (isRefreshCanceled) {
          onCancelRefresh();
        } else {
          onSuccessPulling(data);
        }

        stopPulling();
      },
      onError: (error: HTTPError) => {
        stopPulling();
        onError(error);
      }
    },
  );


  const { cancelRefresh, cancelInProgress } = useCancelRefresh({
    listId,
    onSuccess: () => {
      onCancelSuccess();
      stopPulling();
    },
    onError: (error) => {
      onCancelError(error);
      refetch();
    }
  });

  return { initRefresh, isRefreshInProgress: isPullingEnabled, cancelRefresh, cancelInProgress };
};
