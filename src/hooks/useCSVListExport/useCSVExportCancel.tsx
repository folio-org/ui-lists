import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';
import { HTTPError } from 'ky';

export const useCSVExportCancel = ({
  listId,
  exportId,
  onSuccess = () => {},
  onError = () => {}

}: { listId: string, exportId: string, onSuccess: () => void, onError: (error: HTTPError) => void }) => {
  const ky = useOkapiKy();

  const { isLoading, mutate } = useMutation({
    mutationFn: async () => {
      return ky.post(`lists/${listId}/exports/${exportId}/cancel`).json();
    },
    onSuccess,
    onError
  });


  return { cancelExport: mutate, cancelInProgress: isLoading };
};
