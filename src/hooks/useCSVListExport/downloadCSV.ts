import { downloadBase64 } from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

interface DownloadCSVArguments {
  ky: ReturnType<typeof useOkapiKy>;
  listId: string;
  exportId: string;
  listName: string;
  onSuccess?: () => void;
  onError?: () => void;
}

export const downloadCSV = async ({
  listId,
  exportId,
  ky,
  listName,
  onSuccess = () => {},
  onError = () => {}
}: DownloadCSVArguments) => {
  await ky.get(`lists/${listId}/exports/${exportId}/download`, {
    headers: { accept: 'application/octet-stream' },
  })
    .blob()
    .then(data => {
      downloadBase64(listName + '.csv', URL.createObjectURL(data));
      onSuccess();
    })
    .catch(() => {
      onError();
    });
};
