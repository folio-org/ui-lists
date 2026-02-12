import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { useMemo } from 'react';
import { ListsRequest, ListsResponse, ListsRecord, FQMError } from '../interfaces';
import { buildListsUrl, injectLabelsIntoListsResponse, throwingFqmError } from '../utils';
import { useRecordTypes } from './useRecordTypes';

export const useLists = (request: ListsRequest) => {
  const ky = useOkapiKy();
  const { labelMapping } = useRecordTypes();

  const url = buildListsUrl('lists', request);

  const { data, isLoading, error } = useQuery<ListsResponse<ListsRecord[]>, FQMError>({
    queryKey: [url],
    queryFn: async () => {
      const response = await throwingFqmError(() => ky.get(url));

      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  return {
    listsData: useMemo(
      () => injectLabelsIntoListsResponse(data, labelMapping),
      [data, labelMapping],
    ),
    isLoading,
    error,
  };
};
