import { useState } from 'react';
import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { ListsResponse, ListsRecord } from '../interfaces';
import { buildListsUrl } from '../utils';
import { PULLING_STATUS_DELAY } from './useRefresh/constants';

export const useListsIdsToTrack = () => {
  const [recordIds, setRecordIds] = useState<string[]>([]);

  const ky = useOkapiKy();

  const hasIdsToTrack = Boolean(recordIds?.length);
  const url = buildListsUrl('lists', {idsToTrack: recordIds});

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
    setRecordIds,
    updatedListsData: data,
    isLoading,
    error
  });
};
