export const RECORD_TYPES_PREFIX = 'record_types.';
export const STATUS_ACTIVE = 'status.Active';
export const STATUS_INACTIVE = 'status.Inactive';
export const VISIBILITY_PRIVATE = 'visibility.Private';
export const VISIBILITY_SHARED = 'visibility.Shared';

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
