import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { ListsResponse, ListsRecord, FQMError, ListsSortQuery } from '../interfaces';
import { buildListsUrl, injectLabelsIntoListsResponse, throwingFqmError } from '../utils';
import { PULLING_STATUS_DELAY } from './useRefresh/constants';
import { useRecordTypes } from './useRecordTypes';

export const useListsIdsToTrack = (sortQuery?: ListsSortQuery) => {
  const [recordIds, setRecordIds] = useState<string[]>([]);

  const ky = useOkapiKy();
  const { labelMapping } = useRecordTypes();

  const hasIdsToTrack = Boolean(recordIds?.length);
  const url = buildListsUrl('lists', { idsToTrack: recordIds, ...sortQuery });

  const { data, isLoading, error } = useQuery<ListsResponse<ListsRecord[]>, FQMError>({
    queryKey: [url],
    refetchInterval: PULLING_STATUS_DELAY,
    queryFn: async () => {
      const response = await throwingFqmError(() => ky.get(url));

      return response.json();
    },
    refetchOnWindowFocus: false,
    enabled: hasIdsToTrack,
  });

  return {
    setRecordIds,
    updatedListsData: useMemo(
      () => injectLabelsIntoListsResponse(data, labelMapping),
      [data, labelMapping],
    ),
    isLoading,
    error,
  };
};
