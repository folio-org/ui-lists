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

// These three column keys are exactly the values GET /lists accepts for its sortBy
// parameter, so the column keys double as the API's sort keys.
export const SORTABLE_COLUMNS: string[] = [
  COLUMNS_NAME.LIST_NAME,
  COLUMNS_NAME.LAST_UPDATED,
  COLUMNS_NAME.RECORDS,
];

// MultiColumnList wants the inverse: the headers that must not respond to clicks.
export const NON_INTERACTIVE_COLUMNS = LISTS_VISIBLE_COLUMNS.filter(
  (column) => !SORTABLE_COLUMNS.includes(column),
);
