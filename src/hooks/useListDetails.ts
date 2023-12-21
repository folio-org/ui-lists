import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { HTTPError } from 'ky';
import { ListsRecordDetails } from '../interfaces';

export const useListDetails = (id: string, queryOptions = {}) => {
  const ky = useOkapiKy();
  const { data, isLoading, refetch, error } = useQuery(
    {
      queryKey: ['listDetails', id],
      queryFn: async () => {
        const result = await ky.get(`lists/${id}`);

        return result.json() as unknown as ListsRecordDetails;
      },
      refetchOnWindowFocus: false,
      retry: false,
      ...queryOptions
    },
  );
  return ({
    refetchDetails: refetch,
    isLoading,
    data,
    detailsError: error as HTTPError
  });
};
