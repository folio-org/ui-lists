import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import { Response, ListsRecord } from '../interfaces';
import { getListsFilterUrlParams } from '../utils';
import { PULLING_STATUS_DELAY } from './useRefresh/constants';

let pageCount = 0;
let totalRecordCount = 0;

export const useLists = (filters: Array<string>, idsToTrack?: Array<string>, size?: number, offset?: number) => {
  const ky = useOkapiKy();

  // If tracking IDs, don't use offset
  const urlParams = getListsFilterUrlParams(filters, size, (!idsToTrack?.length) ? offset : 0);

  if (idsToTrack?.length) {
    urlParams.append('ids', idsToTrack.join(','));
  }

  let url = 'lists';

  if (urlParams.size) {
    url += `?${urlParams.toString()}`;
  }

  const { data, isLoading, error } = useQuery<Response<ListsRecord[]>, Error>(
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

  // If tracking IDs response total records and pages are invalid, so use established values instead.
  if (!idsToTrack?.length) {
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
