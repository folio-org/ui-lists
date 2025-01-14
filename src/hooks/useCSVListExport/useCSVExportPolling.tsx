import { useOkapiKy } from '@folio/stripes/core';
import { ListExport } from '../../interfaces';
import { useMessages } from '../useMessages';
import { t } from '../../services';
import { downloadCSV } from './downloadCSV';
import { POLLING_DELAY } from './constants';
import { isSuccess, isFailed, isCancelled } from './helpers';

export const useCSVExportPolling = (listName: string, clearStorage: () => void) => {
  const ky = useOkapiKy();
  const { showSuccessMessage, showErrorMessage } = useMessages();

  const poll = (listID: string, exportId: string) => {
    setTimeout(() => {
      (async () => {
        const { listId, status } : ListExport = await ky.get(`lists/${listID}/exports/${exportId}`).json();

        if (isFailed(status)) {
          showErrorMessage({
            timeout: 10000,
            message: t('callout.list.csv-export.error', {
              listName
            })
          });
        } else if (isSuccess(status)) {
          downloadCSV({
            ky,
            listId,
            exportId,
            listName,
            onSuccess: () => {
              showSuccessMessage({
                timeout: 10000,
                message: t('callout.list.csv-export.success', {
                  listName
                })
              });

              clearStorage();
            },
            onError: () => {
              showErrorMessage({
                timeout: 10000,
                message: t('callout.list.csv-export.error', {
                  listName
                })
              });

              clearStorage();
            }
          });
        } else if (isCancelled(status)) {
          // collapse recursion
        } else {
          poll(listId, exportId);
        }
      })();
    }, POLLING_DELAY);
  };

  return poll;
};
