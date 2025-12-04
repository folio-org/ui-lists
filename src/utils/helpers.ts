import { HTTPError } from 'ky';
import { EntityTypeOption, EntityTypeSelectOption, FQMError, ListsRequest } from '../interfaces';
import {
  RECORD_TYPES_PREFIX,
  STATUS_ACTIVE,
  STATUS_INACTIVE,
  VISIBILITY_PRIVATE,
  VISIBILITY_SHARED,
} from './constants';

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

export const createColumnHash = (listColumns: string[]) => {
  const sortedColumns = [...listColumns].sort((a, b) => {
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  });

  return `${sortedColumns.join()}`;
};

export const createStorageHashKey = (listID: string): string => `${listID}-hash`;

export const checkIncludes = (target: string, string: string) => {
  return string.includes(target);
};

export const filterByIncludes = (term: string, options: { label: string; value: string }[]) => {
  return options.filter((option) => {
    return checkIncludes(term.toLowerCase(), option.label.toLowerCase());
  });
};

export const getStatusButtonElem = () => {
  return document.getElementById('mainFiltersWrapper')?.getElementsByTagName('button')[0];
};

export const handleKeyCommand = (
  callback: (event?: KeyboardEvent) => void,
  condition = true,
  onFalseConditions = () => {},
) => {
  return (event: KeyboardEvent) => {
    event.preventDefault();

    if (condition) {
      callback();
    } else {
      onFalseConditions();
    }
  };
};

export const computeRecordTypeOptions = (
  entityTypes: EntityTypeOption[],
  prefix = '',
  selected = '',
): EntityTypeSelectOption[] => {
  return entityTypes
    .map(({ id, label }) => ({
      label,
      value: `${prefix}${id}`,
      selected: id === selected,
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label)) as EntityTypeSelectOption[];
};

export const getFqmError = async (e: unknown): Promise<FQMError> => {
  if (!(e instanceof Error)) {
    return {
      message: JSON.stringify(e),
      code: '_misc_error',
      parameters: [
        {
          key: 'stack',
          value: new Error('stack generator').stack,
        },
      ],
    };
  } else if (e.name !== 'HTTPError') {
    return {
      message: e.message,
      code: '_misc_error',
      parameters: [
        {
          key: 'type',
          value: e.name,
        },
        {
          key: 'stack',
          value: e.stack,
        },
      ],
    };
  }

  const httpError = e as HTTPError;

  try {
    const errorResponse = await httpError.response.json();

    return errorResponse as FQMError;
  } catch {
    return {
      message: httpError.message,
      code: '_misc_error',
      parameters: [
        {
          key: 'status',
          value: httpError.response.status.toString(),
        },
      ],
    };
  }
};

export const throwingFqmError = async <T>(runnable: () => Promise<T>): Promise<T> => {
  try {
    return await runnable();
  } catch (e) {
    throw await getFqmError(e);
  }
};
