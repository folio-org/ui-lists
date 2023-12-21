import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { ListsRequest, ListsResponse, ListsRecord } from '../interfaces';
import { buildListsUrl } from '../utils';
import { PULLING_STATUS_DELAY } from './useRefresh/constants';

export const useListsIdsToTrack = (request: ListsRequest) => {
  const ky = useOkapiKy();

  const hasIdsToTrack = Boolean(request.idsToTrack?.length);
  const url = buildListsUrl('lists', request);

  const { data, isLoading, error } = useQuery<ListsResponse<ListsRecord[]>, Error>(
    {
      queryKey: [url],
      refetchInterval: PULLING_STATUS_DELAY,
      queryFn: async () => {
        const response = await ky.get(url);

        return response.json();
      },
      refetchOnWindowFocus: false,
      enabled: hasIdsToTrack
    },
  );

  return ({
    updatedListsData: data,
    isLoading,
    error
  });
};
