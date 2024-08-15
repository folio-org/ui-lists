import { FilterGroupsConfig } from '@folio/stripes/components';
import { useRecordTypes } from '../../../hooks';
import { useIntl } from 'react-intl';
import { tString} from '../../../services';
import { RECORD_TYPES_FILTER_KEY } from '../constants';

export default function useFilterConfig() {
  const { recordTypes = [], isLoading } = useRecordTypes();
  const intl = useIntl();
  const filterConfig: FilterGroupsConfig = [
    {
      label: tString(intl,'filter-label.status'),
      name: 'status',
      cql: 'status',
      values: ['Active', 'Inactive'],
    },
    {
      label: tString(intl, 'filter-label.visibility'),
      name: 'visibility',
      cql: 'visibility',
      values: ['Shared', 'Private'],
    }
  ];

  const recordTypeConfig = {
    label: tString(intl,'filter-label.record-types'),
    name: RECORD_TYPES_FILTER_KEY,
    values: recordTypes?.map((item) => ({
      value: `record_types.${item.id ?? item.label}`,
      label: item.label,
    })),
};

  return {
    filterConfig,
    recordTypeConfig,
    isLoadingConfigData: isLoading,
  };
}
