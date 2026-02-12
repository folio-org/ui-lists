import { FilterGroupsConfig } from '@folio/stripes/components';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { useRecordTypes } from '../../../hooks';
import { tString } from '../../../services';
import { RECORD_TYPES_FILTER_KEY } from '../constants';
import { computeRecordTypeOptions } from '../../../utils';

export default function useFilterConfig() {
  const { recordTypes = [], isLoading } = useRecordTypes();
  const intl = useIntl();

  return useMemo(() => {
    const filterConfig: FilterGroupsConfig = [
      {
        label: tString(intl, 'filter-label.status'),
        name: 'status',
        cql: 'status',
        values: ['Active', 'Inactive'],
      },
      {
        label: tString(intl, 'filter-label.visibility'),
        name: 'visibility',
        cql: 'visibility',
        values: ['Shared', 'Private'],
      },
    ];

    const recordTypeConfig = {
      label: tString(intl, 'filter-label.record-types'),
      name: RECORD_TYPES_FILTER_KEY,
      values: computeRecordTypeOptions(recordTypes, 'record_types.'),
    };

    return {
      filterConfig,
      recordTypeConfig,
      isLoadingConfigData: isLoading,
    };
  }, [intl, recordTypes, isLoading]);
}
