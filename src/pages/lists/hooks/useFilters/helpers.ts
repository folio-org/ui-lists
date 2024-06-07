import { FilterGroupsState } from '@folio/stripes/components';

export const getFilters = (appliedFilters: FilterGroupsState) => {
  return Object.keys(appliedFilters).filter((filterKey) => appliedFilters[filterKey] === true);
};

export const buildFiltersObject = (filters: string[]) => {
  return filters.reduce((res, filter) => {
    res[filter] = true

    return res
  }, {} as {[key: string]: boolean})
};