export const RECORD_TYPES_PREFIX = 'record_types.';
export const CREATED_BY_PREFIX = 'created_by.';
export const UPDATED_BY_PREFIX = 'updated_by.';
export const STATUS_ACTIVE = 'status.Active';
export const STATUS_INACTIVE = 'status.Inactive';
export const VISIBILITY_PRIVATE = 'visibility.Private';
export const VISIBILITY_SHARED = 'visibility.Shared';
export const SOURCE_SYSTEM = 'source.System';
export const SOURCE_USER = 'source.User';

export const PAGINATION_AMOUNT = 100;

export const FILTER_PANE_VISIBILITY_KEY = '@folio/lists/listsFilterPaneVisibility';
export const CURRENT_PAGE_OFFSET_KEY = '@folio/lists/currentPageOffset';

export const enum USER_PERMS {
  ReadList = 'lists.item.get',
  RefreshList = 'lists.item.post',
  CreateList = 'lists.collection.post',
  UpdateList = 'lists.item.update',
  DeleteList = 'lists.item.delete',
  ExportList = 'lists.item.export.get'
}

export const RELATED_USERS_URL = 'lists/related-users';
export const RELATED_USERS_LIMIT = 1000;

export const enum RELATED_USERS_TYPE {
  CreatedBy = 'create',
  UpdatedBy = 'update'
}
