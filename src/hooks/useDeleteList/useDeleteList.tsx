import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';
import { HTTPError, KyResponse } from 'ky';

export const useDeleteList = (props: { id: string, onError?: (e:HTTPError) => void, onSuccess?: () => void }) => {
  const {
    id,
    onSuccess = () => {},
    onError = () => {}
  } = props;
  const ky = useOkapiKy();

  const { mutate: deleteList, isLoading } = useMutation<KyResponse, HTTPError>(
    ['listDelete', id],
    async () => ky.delete(`lists/${id}`),
    {
      onSuccess,
      onError
    }
  );

  return {
    isDeleteInProgress: isLoading,
    deleteList
  };
};
