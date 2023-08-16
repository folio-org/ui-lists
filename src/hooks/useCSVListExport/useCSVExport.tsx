import { useMutation } from 'react-query';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { useOkapiKy } from '@folio/stripes/core';
import { HTTPError } from 'ky';
import { useCSVExportPolling } from './useCSVExportPolling';
import { useCSVExportCancel } from './useCSVExportCancel';
import { ListExport } from '../../interfaces';
import { useMessageContext } from '../../contexts/MessageContext';
import { computeErrorMessage, t } from '../../services';

export const useCSVExport = ({
  listId,
  listName
}: {listId: string; listName: string}) => {
  const { showSuccessMessage, showErrorMessage } = useMessageContext();
  const ky = useOkapiKy();
  const [values] = useLocalStorage<{[key: string]: string}>('listIdsToExport', {});
  const unlinkedValue = { ...values };

  const removeListFromStorage = () => {
    delete unlinkedValue[listId];
    writeStorage('listIdsToExport', unlinkedValue);
  };

  const getExportIdFormStorage = () => {
    return values[listId];
  };

  const poll = useCSVExportPolling(listName, () => {
    removeListFromStorage();
  });

  const { isLoading, mutateAsync, data } = useMutation<ListExport, HTTPError>({
    mutationFn: async () => {
      return ky.post(`lists/${listId}/exports`).json();
    },
    onSuccess: async ({ exportId }) => {
      showSuccessMessage({
        message: t('callout.list.csv-export.begin', {
          listName
        })
      });

      writeStorage('listIdsToExport', { ...values, [listId]: exportId });

      poll(listId, exportId);
    },
    onError: async (error: HTTPError) => {
      const errorMessage = await computeErrorMessage(error, 'callout.list.csv-export.error', {
        listName
      });

      showErrorMessage({ message: errorMessage });

      removeListFromStorage();
    }
  });

  const { cancelInProgress, cancelExport } = useCSVExportCancel({ listId,
    exportId: data?.exportId || getExportIdFormStorage(),
    onSuccess: () => {
      showSuccessMessage({
        message: t('callout.list.csv-export.cancel', { listName })
      });
      removeListFromStorage();
    },
    onError: async (error: HTTPError) => {
      const errorMessage = await computeErrorMessage(error, 'callout.list.csv-export.cancel-error', {
        listName
      });

      showErrorMessage({ message: errorMessage });

      removeListFromStorage();
    } });

  return {
    requestExport: mutateAsync,
    isExportInProgress: isLoading || Boolean(values[listId]),
    cancelExport,
    cancelInProgress
  };
};
