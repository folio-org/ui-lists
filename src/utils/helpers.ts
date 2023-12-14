import { ListsRequest } from '../interfaces';
import { RECORD_TYPES_PREFIX, STATUS_ACTIVE, STATUS_INACTIVE, VISIBILITY_PRIVATE, VISIBILITY_SHARED } from './constants';

export const getVisibleColumnsKey = (entityTypeId?: string) => `lists-visible-columns-${entityTypeId}`;

export const buildListsUrl = (url: string, request?: ListsRequest) => {
  const { filters, offset, size, idsToTrack, listsLastFetchedTimestamp } = request || {};
  const params = new URLSearchParams();
  const entityTypeIdsArray = [];

  if (filters?.length) {
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
  }

  const entityTypeIdsString = entityTypeIdsArray.join(',');

  if (entityTypeIdsString) params.append('entityTypeIds', entityTypeIdsString);

  // If tracking IDs, don't use offset
  if (offset && !idsToTrack?.length) params.append('offset', offset.toString());

  if (size) params.append('size', size.toString());

  if (idsToTrack?.length) {
    params.append('ids', idsToTrack.join(','));
  }

  if (listsLastFetchedTimestamp) params.append('updatedAsOf', listsLastFetchedTimestamp);

  const paramString = params.toString();

  if (paramString) {
    return url + `?${paramString}`;
  }

  return url;
};

export const removeSpaces = (object: {[key: string]: boolean | string}) => {
  const result = {} as {[key: string]: boolean | string};

  for (const key in object) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(key)) {
      const value = object[key];
      if (typeof value === 'string') {
        result[key] = value.trim();
      } else {
        result[key] = value;
      }
    }
  }

  return result;
};
