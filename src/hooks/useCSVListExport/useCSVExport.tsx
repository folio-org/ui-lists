import { useOkapiKy } from '@folio/stripes/core';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { HTTPError } from 'ky';
import { useMutation } from 'react-query';
import { ListExport, ListsRecordDetails } from '../../interfaces';
import { computeErrorMessage, t } from '../../services';
import { useMessages } from '../useMessages';
import { useCSVExportCancel } from './useCSVExportCancel';
import { useCSVExportPolling } from './useCSVExportPolling';
import { useVisibleColumns } from '../useVisibleColumns';
import { MESSAGE_DELAY } from './constants';

export const useCSVExport = ({ listId, listName, listDetails, columns }: { listId: string; listName: string, listDetails?: ListsRecordDetails, columns?: string[] }) => {
  const { showSuccessMessage, showErrorMessage } = useMessages();
  const ky = useOkapiKy();
  const [values] = useLocalStorage<{ [key: string]: string }>('listIdsToExport', {});
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

  const visibleColumns = useVisibleColumns(listId).visibleColumns ?? listDetails?.fields ?? [];

  const { isLoading, mutateAsync, data } = useMutation<ListExport, HTTPError, {allColumns?: boolean}>({
    mutationFn: ({ allColumns = false }) => {
      const columnsToExport = allColumns ? columns : visibleColumns;

      return ky.post(`lists/${listId}/exports`, { json: columnsToExport }).json<ListExport>();
    },
    onSuccess: async ({ exportId }) => {
      showSuccessMessage({
        message: t('callout.list.csv-export.begin', {
          listName,
        }),
        timeout: MESSAGE_DELAY,
      });

      writeStorage('listIdsToExport', { ...values, [listId]: exportId });

      poll(listId, exportId);
    },
    onError: async (error: HTTPError) => {
      const errorMessage = await computeErrorMessage(error, 'callout.list.csv-export.error', { listName });

      showErrorMessage({ message: errorMessage, timeout: 0 });

      removeListFromStorage();
    },
  });

  const { cancelInProgress, cancelExport } = useCSVExportCancel({
    listId,
    exportId: data?.exportId ?? getExportIdFormStorage(),
    onSuccess: () => {
      showSuccessMessage({ message: t('callout.list.csv-export.cancel', { listName }) });
      removeListFromStorage();
    },
    onError: (error: HTTPError) => {
      (async () => {
        const errorMessage = await computeErrorMessage(
          error,
          'callout.list.csv-export.cancel-error',
          { listName },
        );

        showErrorMessage({ message: errorMessage, timeout: MESSAGE_DELAY });

        removeListFromStorage();
      })();
    },
  });

  return {
    requestExport: mutateAsync,
    isExportInProgress: isLoading || Boolean(values[listId]),
    cancelExport,
    isCancelExportInProgress: cancelInProgress,
  };
};
