import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';
import { HTTPError } from 'ky';
import { ListsRecordBase, FormStateType } from '../../interfaces';
import { prepareDataForRequest } from '../../pages/createlist/hooks/helpers';

type UseCreateListProps = {
  listObject: FormStateType,
  onSuccess: (list: ListsRecordBase) => void,
  onError: (error: HTTPError) => void
}

export const useCreateList = (config: UseCreateListProps) => {
  const { listObject, onSuccess, onError } = config;
  const preparedObject = prepareDataForRequest(listObject);

  const ky = useOkapiKy();
  const { mutate: saveList, isLoading: savingList, data } = useMutation<ListsRecordBase, HTTPError>(
    ['createList', preparedObject.name],
    () => ky.post('lists', { json: preparedObject }).json(),
    {
      onSuccess,
      onError
    }
  );


  return ({
    saveList,
    data,
    isLoading: savingList,
  });
};
