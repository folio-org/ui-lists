import { SetStateAction, useState } from 'react';
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

  const saveFilters = (theFilters: SetStateAction<filterConfigType>) => {
    setFilters(theFilters);
    writeStorage(APPLIED_FILTERS_KEY, theFilters);
  };

  const onChangeFilter = (e: any) => {
    const aFilters = { ...appliedFilters };
    aFilters[e.target.name] = e.target.checked;
    saveFilters(aFilters);
  };

  const onResetAll = () => {
    saveFilters(filterConfig);
  };

  const onClearGroup = (groupName: string) => {
    const aFilters = { ...appliedFilters };

    for (const name in aFilters) {
      if (name.startsWith(groupName)) {
        delete aFilters[name];
      }
    }

    saveFilters(aFilters);
  };

  return { onChangeFilter, onClearGroup, onResetAll, filterCount, activeFilters, appliedFilters };
};
