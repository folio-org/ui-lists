import { EntityType } from './entity';

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pagination {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface EntityTypesResponse {
  entityTypes: EntityType[],
  _version: string
}

export interface InitRefreshResponse {
  id: string,
  listId: string,
  refreshStartDate: string,
  refreshedBy: string,
  refreshedByUsername: string,
  status: string
}

export interface ListsResponse<T> {
  content: T;
  pageable: Pagination;
  totalPages: number;
  totalRecords: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
