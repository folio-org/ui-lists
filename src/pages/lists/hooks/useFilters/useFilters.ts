import { SetStateAction, useState } from 'react';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { APPLIED_FILTERS_KEY } from '../../../../utils/constants';
import { getFilters } from '../../../../utils';

type filterConfigType = {
  label: string,
  name: string,
  values: string[] | {name: string, displayName: string}[]
}[] | boolean[]

export const useFilters = (filterConfig: filterConfigType) => {
  const [storedAppliedFilters] = useLocalStorage(APPLIED_FILTERS_KEY, filterConfig);
  const [appliedFilters, setAppliedFilters] = useState(storedAppliedFilters);
  const activeFilters = getFilters(appliedFilters);

  const filterCount = activeFilters?.length;

  const saveFilters = (filters: SetStateAction<filterConfigType>) => {
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
    saveFilters(filterConfig);
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

  return { onChangeFilter, onClearGroup, onResetAll, filterCount, activeFilters, appliedFilters };
};
