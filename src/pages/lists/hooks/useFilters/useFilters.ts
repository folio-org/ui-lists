import { useState } from 'react';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { APPLIED_FILTERS_KEY } from '../../../../utils/constants';
import { getFilters } from '../../../../utils';

type filterConfigType = {
  label: string,
  name: string,
  values: string[] | {name: string, displayName: string}[]
}[]

export const useFilters = (filterConfig: filterConfigType) => {
  const [storedAppliedFilters] = useLocalStorage(APPLIED_FILTERS_KEY, filterConfig);
  const [appliedFilters, setFilters] = useState(storedAppliedFilters);
  const activeFilters = getFilters(appliedFilters);

  const filterCount = activeFilters?.length;

  const onChangeFilter = (e: any) => {
    const aFilters = { ...appliedFilters };
    aFilters[e.target.name] = e.target.checked;
    setFilters(aFilters);
    writeStorage(APPLIED_FILTERS_KEY, aFilters);
  };

  const resetAll = () => {
    setFilters(filterConfig);
    writeStorage(APPLIED_FILTERS_KEY, filterConfig);
  };

  return { onChangeFilter, resetAll, filterCount, activeFilters, appliedFilters };
};
