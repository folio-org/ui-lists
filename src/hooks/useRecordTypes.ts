import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { EntityType } from '../interfaces';

const ENTITY_TYPE_HASH = 'entityType';

export const useRecordTypes = () => {
  const ky = useOkapiKy();
  const { data, isLoading, error } = useQuery<EntityType[], Error>({
    queryKey: [ENTITY_TYPE_HASH],
    queryFn: async () => {
      const response = await ky.get('entity-types');

      return response.json();
    },
    refetchOnWindowFocus: false
  });

  return ({
    recordTypes: data,
    isLoading,
    error
  });
};
