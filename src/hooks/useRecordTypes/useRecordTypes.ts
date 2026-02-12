import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { EntityTypesResponse, FQMError } from '../../interfaces';
import { deduplicateRecordTypeLabels, injectLabelsIntoRecordTypes, throwingFqmError } from '../../utils';

const ENTITY_TYPE_HASH = 'entityType';

export const useRecordTypes = () => {
  const intl = useIntl();
  const ky = useOkapiKy();

  const { data, isLoading, error } = useQuery<EntityTypesResponse, FQMError>({
    queryKey: [ENTITY_TYPE_HASH],
    queryFn: async () => {
      const response = await throwingFqmError(() => ky.get('entity-types'));

      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  return useMemo(() => {
    const recordTypes = data?.entityTypes || [];
    const labelMapping = deduplicateRecordTypeLabels(recordTypes, intl);

    return {
      recordTypes: injectLabelsIntoRecordTypes(recordTypes, labelMapping),
      labelMapping,
      isLoading,
      error,
    };
  }, [data, isLoading, error, intl]);
};
