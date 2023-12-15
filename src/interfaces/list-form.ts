export type ChangedFieldType = {
  [key: string]: string | STATUS_VALUES | VISIBILITY_VALUES
}

export enum FIELD_NAMES {
  STATUS = 'status',
  LIST_NAME = 'listName',
  DESCRIPTION = 'description',
  VISIBILITY = 'visibility',
  RECORD_TYPE = 'recordType'
}

export enum VISIBILITY_VALUES {
  PRIVATE = 'private',
  SHARED = 'shared'
}

export enum STATUS_VALUES {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
export type FormStateType = {
  [FIELD_NAMES.LIST_NAME]: string,
  [FIELD_NAMES.DESCRIPTION]: string,
  [FIELD_NAMES.VISIBILITY]: VISIBILITY_VALUES,
  [FIELD_NAMES.STATUS]: STATUS_VALUES
}

