import { ChangeEvent, useState } from 'react';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { isEqual } from 'lodash';
import { APPLIED_FILTERS_KEY } from '../../../../utils/constants';
import { getFilters } from './helpers';
import { DEFAULT_FILTERS } from './configurations';
import { FilterGroupsConfig, FilterGroupsState } from '@folio/stripes/components';

export function useFilters(filterConfig: FilterGroupsConfig) {
  const defaultFilterConfig = DEFAULT_FILTERS;
  const [storedAppliedFilters] = useLocalStorage<FilterGroupsState>(APPLIED_FILTERS_KEY, defaultFilterConfig);
  const [appliedFilters, setAppliedFilters] = useState<FilterGroupsState>(storedAppliedFilters);
  const activeFilters = getFilters(appliedFilters);

  const filterCount = activeFilters?.length;

  const saveFilters = (filters: FilterGroupsState) => {
    setAppliedFilters(filters);
    writeStorage(APPLIED_FILTERS_KEY, filters);
  };

  const onChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target;

    const filters = { ...appliedFilters };

    if (checked) {
      filters[name] = true;
    } else {
      delete filters[name];
    }

    saveFilters(filters);
  };

  const onResetAll = () => {
    saveFilters(defaultFilterConfig);
  };

  const onClearGroup = (groupName: string) => {
    const filters = { ...appliedFilters };

    for (const name in filters) {
      if (name.startsWith(groupName)) {
        delete filters[name];
      }
    }

    saveFilters(filters);
  };

  const isDefaultState = isEqual(defaultFilterConfig, appliedFilters);

  return {
    onChangeFilter,
    onClearGroup,
    onResetAll,
    filterCount,
    activeFilters,
    appliedFilters,
    isDefaultState
  };
}
