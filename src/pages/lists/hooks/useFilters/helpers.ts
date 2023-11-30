import { FilterConfigType, AppliedFiltersType } from '../../types';
import { DEFAULT_FILTERS } from './configurations';

export const getFilters = (appliedFilters: AppliedFiltersType) => {
  return Object.keys(appliedFilters).filter(filterKey => appliedFilters[filterKey] === true);
};


export const buildDefaultFilters = (filterConfig: FilterConfigType) => {
  return filterConfig.reduce((acc, option, currentIndex) => {
    acc[`${currentIndex}`] = option;

    return acc;
  }, { ...DEFAULT_FILTERS } as AppliedFiltersType);
};
