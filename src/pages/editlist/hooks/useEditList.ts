import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';
import { HTTPError } from 'ky';
import { ListsRecordBase, FormStateType } from '../../../interfaces';
import { prepareDataForRequest } from '../../createlist/hooks/helpers';

type UseEditListProps = {
    id: string,
    version: number,
    listObject: FormStateType & {fqlQuery?: string},
    onSuccess: (list: ListsRecordBase) => void,
    onError: (error: HTTPError) => void,
    onChangeVersionError: () => void
}

export const useEditList = (config: UseEditListProps) => {
  const ky = useOkapiKy();
  const { listObject, onSuccess, onChangeVersionError, onError = () => {}, id, version: originalVersion } = config;

  const preparedObject = prepareDataForRequest(listObject);

  const { mutate: saveList, isLoading: savingList } = useMutation<ListsRecordBase, HTTPError>(
    ['saveEditedList', preparedObject.name],
    () => ky.put('lists/' + id,
      { json: {
        ...preparedObject, version: originalVersion
      } }).json(),
    {
      onSuccess,
      onError
    }
  );

  const { mutate: checkVersionAndSave, isLoading: compareVersionInProgress, data } = useMutation<ListsRecordBase, HTTPError>(
    ['checkEditedVersion', preparedObject.name],
    () => ky.get('lists/' + id).json(),
    {
      onSuccess: ({ version }) => {
        if (originalVersion === version) {
          saveList();
        } else {
          onChangeVersionError();
        }
      },
      onError
    }
  );

  return ({
    saveList: () => {
      checkVersionAndSave();
    },
    data,
    isLoading: compareVersionInProgress || savingList,
  });
};
