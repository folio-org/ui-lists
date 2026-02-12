import { useOkapiKy } from '@folio/stripes/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { FQMError, ListsRecord, ListsResponse } from '../interfaces';
import { t } from '../services';
import { buildListsUrl, injectLabelsIntoListsResponse, throwingFqmError } from '../utils';
import { useMessages } from './useMessages';
import { useRecordTypes } from './useRecordTypes';
import { PULLING_STATUS_DELAY } from './useRefresh/constants';

dayjs.extend(utc);

let listsLastFetchedTimestamp = dayjs.utc().format();

export const useListsFetchedSinceTimestamp = () => {
  const { showSuccessMessage } = useMessages();
  const ky = useOkapiKy();
  const { labelMapping } = useRecordTypes();

  const url = buildListsUrl('lists', { listsLastFetchedTimestamp });

  const { data, isLoading, error } = useQuery<ListsResponse<ListsRecord[]>, FQMError>({
    queryKey: [url],
    refetchInterval: PULLING_STATUS_DELAY,
    queryFn: async () => {
      const response = await throwingFqmError(() => ky.get(url));

      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const updatedListsContent = data?.content;

  // Created lists don't include update or refresh date
  const createdLists = updatedListsContent?.filter(
    (list) => !list.updatedDate && !list.refreshedDate,
  );

  if (createdLists?.length) {
    listsLastFetchedTimestamp = dayjs.utc().format();

    if (createdLists.length > 1) {
      showSuccessMessage({ message: t('callout.list.multiple-created') });
    } else {
      const listName = createdLists[0].name;

      showSuccessMessage({ message: t('callout.list.created', { listName }) });
    }
  }

  return {
    listsData: useMemo(
      () => injectLabelsIntoListsResponse(data, labelMapping),
      [data, labelMapping],
    ),
    isLoading,
    error,
  };
};
