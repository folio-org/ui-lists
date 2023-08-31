import { useOkapiKy } from '@folio/stripes/core';
import { KyInstance } from 'ky/distribution/types/ky';
import { ListExport } from '../../interfaces';
import { useMessages } from '../useMessages';
import { t } from '../../services';
import { downloadCSV } from './downloadCSV';
import { POLLING_DELAY } from './constants';
import { isSuccess, isFailed, isCancelled } from './helpers';

export const useCSVExportPolling = (listName: string, clearStorage: () => void) => {
  // todo: solve issue with different type versions in Ky

  // @ts-ignore:next-line
  const ky = useOkapiKy() as KyInstance;
  const { showSuccessMessage, showErrorMessage } = useMessages();

  const poll = (listID: string, exportId: string) => {
    setTimeout(() => {
      (async () => {
        const { listId, status } = await ky.get(`lists/${listID}/exports/${exportId}`).json() as ListExport;

        if (isFailed(status)) {
          showErrorMessage({
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
                message: t('callout.list.csv-export.success', {
                  listName
                })
              });

              clearStorage();
            },
            onError: () => {
              showErrorMessage({
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
