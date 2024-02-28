import { ListsRecord } from '../interfaces';

export const COLUMNS_NAME = {
  LIST_NAME: 'name',
  RECORD_TYPE: 'entityTypeName',
  RECORDS: 'recordsCount',
  STATUS: 'isActive',
  SOURCE: 'createdByUsername',
  LAST_UPDATED: 'updatedDate',
  VISIBILITY: 'isPrivate',
} as const;
export const LISTS_VISIBLE_COLUMNS = Object.values(COLUMNS_NAME) as (keyof ListsRecord)[];
