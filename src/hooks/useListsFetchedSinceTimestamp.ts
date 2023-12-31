import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useOkapiKy } from '@folio/stripes/core';

import { ListsResponse, ListsRecord } from '../interfaces';
import { buildListsUrl } from '../utils';
import { PULLING_STATUS_DELAY } from './useRefresh/constants';
import { useMessages } from './useMessages';
import { t } from '../services';

dayjs.extend(utc);

let listsLastFetchedTimestamp = dayjs.utc().format();

export const useListsFetchedSinceTimestamp = () => {
  const { showSuccessMessage } = useMessages();
  const ky = useOkapiKy();

  const url = buildListsUrl('lists', { listsLastFetchedTimestamp });

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

  const updatedListsContent = data?.content;

  // Created lists don't include update or refresh date
  const createdLists = updatedListsContent?.filter(list => !list.updatedDate && !list.refreshedDate);

  if (createdLists?.length) {
    listsLastFetchedTimestamp = dayjs.utc().format();

    if (createdLists.length > 1) {
      showSuccessMessage({ message: t('callout.list.multiple-created') });
    } else {
      const listName = createdLists[0].name;

      showSuccessMessage({ message: t('callout.list.created', { listName }) });
    }
  }

  return ({
    listsData: data,
    isLoading,
    error
  });
};
