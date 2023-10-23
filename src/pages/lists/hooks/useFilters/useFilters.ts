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

  const saveFilters = (theFilters: SetStateAction<filterConfigType>) => {
    setAppliedFilters(theFilters);
    writeStorage(APPLIED_FILTERS_KEY, theFilters);
  };

  const onChangeFilter = (e: any) => {
    const aTarget = e?.target;
    const aFilters = { ...appliedFilters };
    if (aTarget?.checked) {
      aFilters[aTarget?.name] = true;
    } else {
      delete aFilters[aTarget?.name];
    }
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
