import { useOkapiKy } from '@folio/stripes/core';
import { useCallback } from 'react';
import { EntityType, FqlQuery } from '../../interfaces';

export function useQueryBuilderCommonSources(
  entityTypeId: string | undefined,
  labelMapping: Record<string, string>,
) {
  const ky = useOkapiKy();

  return {
    entityTypeDataSource: useCallback(() => {
      if (!entityTypeId) {
        return undefined;
      }

      return ky
        .get(`entity-types/${entityTypeId}`)
        .json<EntityType>()
        .then((et) => ({ ...et, labelAlias: labelMapping[entityTypeId] ?? 'aaaa' }));
    }, [ky, entityTypeId, labelMapping]),

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
      (p: { entityTypeId: string; columnName: string; searchValue: string }) => ky
        .get(`entity-types/${p.entityTypeId}/columns/${p.columnName}/values`, {
          searchParams: {
            search: p.searchValue,
          },
        })
        .json(),
      [ky],
    ),

    getOrganizations: useCallback(
      (ids: string[], property: 'code' | 'name') => ky
        .get('organizations/organizations', {
          searchParams: {
            query: ids.map((id) => `id=="${id}"`).join(' or '),
            limit: ids.length,
          },
        })
        .json<{ organizations: { id: string; code: string; name: string }[] }>()
        .then((response) => response.organizations.map((org) => ({ value: org.id, label: org[property] }))),
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
    ...useQueryBuilderCommonSources(entityTypeId, {}), // we don't need the correct ET label for result viewing
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
