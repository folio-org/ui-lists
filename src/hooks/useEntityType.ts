import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { EntityType } from '../interfaces';

export const useEntityType = (id?: string) => {
  const ky = useOkapiKy();
  const { data, isLoading, error } = useQuery<EntityType, Error>({
    queryKey: ['queryDetails', id],
    queryFn: async () => {
      const response = await ky.get(`entity-types/${id}`);

      return response.json();
    },
    enabled: !!id
  });

  return ({
    recordTypes: data,
    isLoading,
    error
  });
};
