import { EntityTypeOption, EntityTypeSelectOption, ListsRequest } from '../interfaces';
import {
  RECORD_TYPES_PREFIX,
  STATUS_ACTIVE,
  STATUS_INACTIVE,
  VISIBILITY_PRIVATE,
  VISIBILITY_SHARED
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

export const filterByIncludes = (term: string, options: {label: string, value: string}[]) => {
  return options.filter(option => {
    return checkIncludes(term.toLowerCase(), option.label.toLowerCase());
  });
};

export const getStatusButtonElem = () => {
  return document.getElementById('mainFiltersWrapper')?.getElementsByTagName('button')[0];
};

export const handleKeyCommand = (
  callback: (event?: KeyboardEvent) => void,
  condition = true,
  onFalseConditions = () => {}
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
  const options = entityTypes
    .map(({ id, label }) => ({
      label,
      value: `${prefix}${id}`,
      selected: id === selected,
    })) as EntityTypeSelectOption[];

  // EntityTypeSelectOption has label as ReactNode, but we just created it above
  // where all these labels are string only, so we can safely coerce to string
  options.sort((a, b) => (a.label as string).localeCompare(b.label as string));

  return options;
};
