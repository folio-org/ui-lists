import { useOkapiKy } from '@folio/stripes/core';
import { useCallback } from 'react';
import { FqlQuery } from '../../interfaces';

export function useQueryBuilderCommonSources(entityTypeId: string | undefined) {
  const ky = useOkapiKy();

  return {
    entityTypeDataSource: useCallback(
      () => (entityTypeId ? ky.get(`entity-types/${entityTypeId}`).json() : undefined),
      [ky, entityTypeId],
    ),

    testQueryDataSource: useCallback(
      ({ fqlQuery }: { fqlQuery: FqlQuery }) => {
        return ky
          .post('query', {
            json: {
              entityTypeId,
              fqlQuery: JSON.stringify(fqlQuery),
            },
          })
          .json();
      },
      [ky, entityTypeId],
    ),

    queryDetailsDataSource: useCallback(
      ({
        queryId,
        includeContent,
        offset,
        limit,
      }: {
        queryId: string;
        includeContent: boolean;
        offset: number;
        limit: number;
      }) => {
        return ky
          .get(`query/${queryId}`, {
            searchParams: {
              includeResults: includeContent,
              offset,
              limit,
            },
          })
          .json();
      },
      [ky],
    ),

    getParamsSource: useCallback(
      (p: { entityTypeId: string; columnName: string; searchValue: string }) => {
        return ky
          .get(`entity-types/${p.entityTypeId}/columns/${p.columnName}/values`, {
            searchParams: {
              search: p.searchValue,
            },
          })
          .json();
      },
      [ky],
    ),
  };
}

export function useQueryBuilderResultViewerSources(
  entityTypeId: string | undefined,
  listId: string,
  visibleColumns: string[] | null,
) {
  const ky = useOkapiKy();

  return {
    ...useQueryBuilderCommonSources(entityTypeId),
    contentDataSource: useCallback(
      ({ limit, offset }: { limit: number; offset: number }) => {
        return ky
          .get(
            `lists/${listId}/contents?offset=${offset}&size=${limit}&fields=${visibleColumns?.join(',')}`,
          )
          .json();
      },
      [ky, listId, visibleColumns],
    ),
  };
}
