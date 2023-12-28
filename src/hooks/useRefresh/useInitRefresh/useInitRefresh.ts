import { useMutation } from 'react-query';
import { HTTPError } from 'ky';
import { useOkapiKy } from '@folio/stripes/core';
import { InitRefreshResponse } from '../../../interfaces';

type useInitRefreshProps = {
  onSuccess?: (data: InitRefreshResponse) => void,
  onError?: (data: HTTPError) => void
}

export const useInitRefresh = ({ onSuccess, onError }: useInitRefreshProps) => {
  const ky = useOkapiKy();

  const {
    mutate: initRefresh,
    reset,
    isLoading,
  } = useMutation<InitRefreshResponse, HTTPError, string>(
    (listId: string) => ky.post(`lists/${listId}/refresh`).json(),
    {
      retry: false,
      onSuccess: (data: InitRefreshResponse) => {
        onSuccess?.(data);
        reset();
      },
      onError: (error: HTTPError) => {
        onError?.(error);
        reset();
      },
    },
  );

  return {
    initRefresh,
    reset,
    initRefreshInProgress: isLoading
  };
};
