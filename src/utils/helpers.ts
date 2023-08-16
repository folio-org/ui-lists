import { RECORD_TYPES_PREFIX, STATUS_ACTIVE, STATUS_INACTIVE, VISIBILITY_PRIVATE, VISIBILITY_SHARED } from './constants';

export const getVisibleColumnsKey = (entityTypeId?: string) => `lists-visible-columns-${entityTypeId}`;

export const getFilters = (appliedFilters: Array<any>) => {
  // @ts-ignore:next-line
  return appliedFilters && Object.keys(appliedFilters).filter(filterKey => appliedFilters[filterKey] === true);
};

export const getListsFilterUrlParams = (filters: Array<string>, size?: number, offset?: number) => {
  const params = new URLSearchParams();
  const entityTypeIdsArray = [];

  if (filters.includes(STATUS_ACTIVE) && !filters.includes(STATUS_INACTIVE)) {
    params.append('active', 'true');
  } else if (filters.includes(STATUS_INACTIVE) && !filters.includes(STATUS_ACTIVE)) {
    params.append('active', 'false');
  }

  if (filters.includes(VISIBILITY_PRIVATE) && !filters.includes(VISIBILITY_SHARED)) {
    params.append('private', 'true');
  } else if (filters.includes(VISIBILITY_SHARED) && !filters.includes(VISIBILITY_PRIVATE)) {
    params.append('private', 'false');
  }

  for (const filter of filters) {
    if (filter.startsWith(RECORD_TYPES_PREFIX)) {
      entityTypeIdsArray.push(filter.slice(RECORD_TYPES_PREFIX.length));
    }
  }

  const entityTypeIdsString = entityTypeIdsArray.join(',');
  if (entityTypeIdsString) params.append('entityTypeIds', entityTypeIdsString);

  if (offset) params.append('offset', offset.toString());

  if (size) params.append('size', size.toString());

  return params;
};

export const noop = () => {};
