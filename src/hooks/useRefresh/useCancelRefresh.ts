import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';
import { HTTPError } from 'ky';

type UseCancelRefreshType = {
  listId: string | null;
  onSuccess: () => void;
  onError: (error: HTTPError) => void;
}


export const useCancelRefresh = ({
  listId,
  onSuccess = () => {},
  onError = () => {}
}: UseCancelRefreshType) => {
  const ky = useOkapiKy();

  const { mutate: cancelRefresh, isLoading: cancelInProgress } = useMutation(() => ky.delete(`lists/${listId}/refresh`),
    { onError, onSuccess });

  return { cancelRefresh, cancelInProgress };
};
