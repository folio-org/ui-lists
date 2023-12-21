import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { ListsRequest, ListsResponse, ListsRecord } from '../interfaces';
import { buildListsUrl } from '../utils';

export const useLists = (request: ListsRequest) => {
  const ky = useOkapiKy();

  const url = buildListsUrl('lists', request);

  const { data, isLoading, error } = useQuery<ListsResponse<ListsRecord[]>, Error>(
    {
      queryKey: [url],
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
