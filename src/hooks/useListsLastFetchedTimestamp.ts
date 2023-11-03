import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { ListsRequest, ListsResponse, ListsRecord } from '../interfaces';
import { buildListsUrl } from '../utils';
import { PULLING_STATUS_DELAY } from './useRefresh/constants';

export const useListsLastFetchedTimestamp = (request: ListsRequest) => {
  const ky = useOkapiKy();

  const url = buildListsUrl('lists', request);

  const { data, isLoading, error } = useQuery<ListsResponse<ListsRecord[]>, Error>(
    {
      queryKey: [url],
      refetchInterval: PULLING_STATUS_DELAY,
      queryFn: async () => {
        const response = await ky.get(url);

        return response.json();
      },
      refetchOnWindowFocus: false
    },
  );

  return ({
    listsData: data,
    isLoading,
    error
  });
};
