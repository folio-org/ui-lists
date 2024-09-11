import ky from 'ky';
// @ts-ignore:next-line
import { downloadBase64 } from '@folio/stripes-acq-components';

type downloadCSVArguments = {
  ky: typeof ky,
  listId: string,
  exportId: string,
  listName: string
  onSuccess?: () => void,
  onError?: () => void,
};

export const downloadCSV = async ({
  listId,
  exportId,
  ky,
  listName,
  onSuccess = () => {},
  onError = () => {}
}: downloadCSVArguments) => {
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
