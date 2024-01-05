import { FilterGroupsState } from '@folio/stripes/components';

export const getFilters = (appliedFilters: FilterGroupsState) => {
  return Object.keys(appliedFilters).filter((filterKey) => appliedFilters[filterKey] === true);
};
