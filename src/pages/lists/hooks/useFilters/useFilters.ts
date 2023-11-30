import { useState } from 'react';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { isEqual } from 'lodash';
import { APPLIED_FILTERS_KEY } from '../../../../utils/constants';
import { getFilters, buildDefaultFilters } from './helpers';
import { FilterConfigType, AppliedFiltersType } from '../../types';

export const useFilters = (filterConfig: FilterConfigType) => {
  const defaultFilterConfig = buildDefaultFilters(filterConfig);
  const [storedAppliedFilters] = useLocalStorage<AppliedFiltersType>(APPLIED_FILTERS_KEY, defaultFilterConfig);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFiltersType>(storedAppliedFilters);
  const activeFilters = getFilters(appliedFilters);

  const filterCount = activeFilters?.length;

  const saveFilters = (filters: AppliedFiltersType) => {
    setAppliedFilters(filters);
    writeStorage(APPLIED_FILTERS_KEY, filters);
  };

  const onChangeFilter = (e: any) => {
    const target = e?.target;
    const filters = { ...appliedFilters };

    if (target?.checked) {
      filters[target?.name] = true;
    } else {
      delete filters[target?.name];
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
};
