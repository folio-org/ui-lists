import { useQuery } from 'react-query';
import type { UseQueryOptions } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { HTTPError } from 'ky';
import { ListsRecordDetails } from '../interfaces';

export const useListDetails = (
  id: string,
  queryOptions: Partial<UseQueryOptions<ListsRecordDetails>> = {},
) => {
  const ky = useOkapiKy();
  const { data, isLoading, refetch, error } = useQuery<ListsRecordDetails>({
    queryKey: ['listDetails', id],
    queryFn: () => ky.get(`lists/${id}`).json<ListsRecordDetails>(),
    refetchOnWindowFocus: false,
    retry: false,
    ...queryOptions,
  });
  return {
    refetchDetails: refetch,
    isLoading,
    data,
    detailsError: error as HTTPError,
  };
};
