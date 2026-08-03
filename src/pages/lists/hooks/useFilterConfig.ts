import { FilterGroupsConfig } from '@folio/stripes/components';
import { IntlShape, useIntl } from 'react-intl';
import { useMemo } from 'react';
import { useRecordTypes } from '../../../hooks';
import { tString } from '../../../services';
import { RECORD_TYPES_FILTER_KEY } from '../constants';
import { computeRecordTypeOptions } from '../../../utils';

type FilterGroupSpec = {
  name: string;
  values: [string, string][];
};

const FILTER_GROUP_SPECS: FilterGroupSpec[] = [
  { name: 'status', values: [['Active', 'active'], ['Inactive', 'inactive']] },
  { name: 'visibility', values: [['Shared', 'shared'], ['Private', 'private']] },
  { name: 'source', values: [['System', 'system'], ['User', 'user-generated']] },
];

const buildFilterGroup = (intl: IntlShape, { name, values }: FilterGroupSpec) => ({
  label: tString(intl, `filter-label.${name}`),
  name,
  cql: name,
  values: values.map(([value, translationKey]) => ({
    name: value,
    cql: value,
    displayName: tString(intl, `lists.item.${translationKey}`),
  })),
});

export default function useFilterConfig() {
  const { recordTypes = [], isLoading } = useRecordTypes();
  const intl = useIntl();

  return useMemo(() => {
    const filterConfig: FilterGroupsConfig = FILTER_GROUP_SPECS.map((spec) => buildFilterGroup(intl, spec));

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
