import { ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { isEqual } from 'lodash';
import { buildFiltersObject } from './helpers';
import { DEFAULT_FILTERS } from './configurations';

const FILTERS_URL_KEY = 'filters';

const useURLFilters = () => {
  const history = useHistory();
  const { location } = history;
  const searchParams = new URLSearchParams(location.search)
  const filters = searchParams.get(FILTERS_URL_KEY)?.split(',') || [];

  const setValues = (filters: string[]) => {
    searchParams.set(FILTERS_URL_KEY, filters.join(','))

    history.push(`${history.location.pathname}?${searchParams.toString()}`)
  };

  return {
    filterParams: filters,
    addValue: (filterValue: string) => {
      setValues([...filters, filterValue])
    },
    removeValue: (filterValue: string) => {
      const newFilters = filters.filter((item: string) => {
        return item !== filterValue
      })

      setValues([...newFilters])
    },
    resetFilters: () => {
      setValues(DEFAULT_FILTERS)
    },
    setValues
  }
}

export function useFilters() {
  const {filterParams, addValue, removeValue, resetFilters, setValues} = useURLFilters()

  const filterCount = filterParams?.length;

  const onChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target;

    if (checked) {
      addValue(name)
    } else {
      removeValue(name)
    }
  };

  const onResetAll = () => {
    resetFilters()
  };

  const onClearGroup = (groupName: string) => {
    const filters = [ ...filterParams ].filter((filterName) => {
      return !filterName.startsWith(groupName)
    })

    setValues(filters);
  };

  const isDefaultState = isEqual(DEFAULT_FILTERS, filterParams);

  return {
    onChangeFilter,
    onClearGroup,
    onResetAll,
    filterCount,
    activeFilters: filterParams,
    filtersObject: buildFiltersObject(filterParams),
    isDefaultState
  };
}
