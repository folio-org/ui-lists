import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { ListsRequest, ListsResponse, ListsRecord } from '../interfaces';
import { getListsFilterUrlParams as buildListsUrl } from '../utils';
import { PULLING_STATUS_DELAY } from './useRefresh/constants';

let pageCount = 0;
let totalRecordCount = 0; 

export const useLists = (request: ListsRequest) => {
  const ky = useOkapiKy();
  const { idsToTrack, listsLastFetchedTimestamp: updatedAsOf } = request;

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

  // If tracking IDs response or checking for updates since last timestamp:
  // total records and pages are invalid, so use established values instead.
  if (!idsToTrack?.length && !updatedAsOf) {
    totalRecordCount = data?.totalRecords ?? 0;
    pageCount = data?.totalPages ?? 0;
  } else if (data) {
    data.totalRecords = totalRecordCount;
    data.totalPages = pageCount;
  }

  return ({
    listsData: data,
    isLoading,
    error
  });
};
