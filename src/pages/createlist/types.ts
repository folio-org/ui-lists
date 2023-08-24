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

export type VISIBILITY= 'private' | 'shared';

export type STATUS = 'active' | 'inactive';

export type FormStateType = {
  [FIELD_NAMES.LIST_NAME]: string,
  [FIELD_NAMES.DESCRIPTION]: string,
  [FIELD_NAMES.RECORD_TYPE]?: string,
  [FIELD_NAMES.VISIBILITY]: VISIBILITY,
  [FIELD_NAMES.STATUS]: STATUS
}

export type ChangedFieldType = {
  [key: string]: string | STATUS_VALUES | VISIBILITY_VALUES
}

export type CreateListFormatType = {
  name: string,
  description: string,
  entityTypeId?: string,
  fqlQuery?: string,
  isActive: boolean,
  isPrivate: boolean
}
