import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

type RecordsLimit = {
    maxListSize: number
}

export const useRecordsLimit = () => {
  const ky = useOkapiKy();

  const { data } = useQuery<RecordsLimit, unknown, number>({
    queryKey: ['refreshLimit'],
    queryFn: () => ky.get('lists/configuration').json(),
    retry: false,
    refetchInterval: false,
    select: ({ maxListSize }: RecordsLimit) => maxListSize
  });

  return data;
};
