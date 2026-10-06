import React, { FC, useEffect, useMemo } from 'react';
import { isEqual, noop } from 'lodash';
import { MultiColumnList } from '@folio/stripes/components';

import { listTableMapping } from './helpers/mappers';
import { listTableResultFormatter } from './helpers/formatters';
import { LISTS_VISIBLE_COLUMNS, NON_INTERACTIVE_COLUMNS } from '../../constants';
import { useLists, useListsIdsToTrack, usePrevious, useListsPagination, useListsSorting } from '../../hooks';
import { columnWidthsConfig } from './configs';
import { ListsRecord } from '../../interfaces';
import { t } from '../../services';

export interface ListsTableProps {
  activeFilters: string[],
  searchTerm?: string,
  setTotalRecords: (totalRecords: number) => void
}

export const ListsTable: FC<ListsTableProps> = ({
  activeFilters,
  searchTerm = '',
  setTotalRecords = noop
}) => {
  const { sortField, sortDirection, changeSorting, sortQuery } = useListsSorting();
  const {
    gotToFirstPage,
    goToLastPage,
    pagination,
    checkHasNextPage,
    hasPreviousPage,
    onNeedMoreData
  } = useListsPagination({});
  const { updatedListsData, setRecordIds } = useListsIdsToTrack(sortQuery);

  const prevActiveFilters: string[] | null = usePrevious(activeFilters);
  const prevSearchTerm = usePrevious(searchTerm);
  const prevSortField = usePrevious(sortField);
  const prevSortDirection = usePrevious(sortDirection);

  // True for exactly the one render where filters, search or sort just changed. The
  // tracked-ids poll (updatedListsData) is a separate query keyed on the *previous*
  // result set's ids, so on this render it can't be trusted to reflect the new query yet.
  const queryJustChanged = (
    (prevActiveFilters !== null && !isEqual(prevActiveFilters, activeFilters)) ||
    (prevSearchTerm !== null && prevSearchTerm !== searchTerm) ||
    (prevSortField !== null && prevSortField !== sortField) ||
    (prevSortDirection !== null && prevSortDirection !== sortDirection)
  );

  useEffect(() => {
    if (queryJustChanged) {
      gotToFirstPage();
      setRecordIds([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, searchTerm, sortField, sortDirection]);

  const { listsData, isFetching, isPreviousData } = useLists({
    filters: activeFilters,
    size: pagination?.limit,
    offset: pagination?.offset,
    search: searchTerm,
    ...sortQuery
  });

  const { totalRecords = 0, totalPages } = listsData ?? {};
  const displayedTotalRecords = totalRecords;
  const hasSearchTerm = !!searchTerm;

  // Row membership/order/count come exclusively from listsData (the filtered, sorted,
  // paged, authoritative result); the tracked-ids poll only ever overlays live fields
  // (e.g. refresh status) onto rows that are already here - it can never add, remove,
  // or reorder a row, and never affects totalRecords/totalPages.
  const displayedContent = useMemo(() => {
    const baseContent = listsData?.content ?? [];
    const trackedById = new Map((updatedListsData?.content ?? []).map((row) => [row.id, row]));

    return baseContent.map((row) => (trackedById.has(row.id) ? { ...row, ...trackedById.get(row.id) } : row));
  }, [listsData, updatedListsData]);

  useEffect(() => {
    setTotalRecords(displayedTotalRecords);
  }, [displayedTotalRecords, setTotalRecords]);

  useEffect(() => {
    // isPreviousData means listsData is still the *previous* query's carried-over
    // snapshot (keepPreviousData) - don't seed the tracked-ids poll or auto-correct the
    // page from data that's about to be replaced by the current query's own result.
    if (isPreviousData) {
      return;
    }

    const content = listsData?.content ?? [];

    if (content.length) {
      setRecordIds(content.map(({ id }) => id));
    } else if (listsData?.totalPages) {
      goToLastPage(listsData.totalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, isPreviousData]);

  const onNeedMoreDataHandler = (askAmount: number, limit: number, index?: number, direction = '') => {
    onNeedMoreData(direction);

    setRecordIds([]);
  };

  return (
    <MultiColumnList
      autosize
      interactive
      loading={isFetching}
      data-testid="ItemsList"
      contentData={displayedContent}
      columnWidths={columnWidthsConfig}
      pagingType="prev-next"
      visibleColumns={LISTS_VISIBLE_COLUMNS}
      formatter={listTableResultFormatter}
      pageAmount={totalPages}
      totalCount={displayedTotalRecords}
      pagingOffset={pagination.offset}
      pagingCanGoPrevious={hasPreviousPage && !isFetching}
      pagingCanGoNext={checkHasNextPage(totalRecords) && !isFetching}
      columnMapping={listTableMapping}
      onNeedMoreData={onNeedMoreDataHandler}
      sortedColumn={sortField as keyof ListsRecord}
      sortDirection={sortDirection}
      onHeaderClick={changeSorting}
      // showSortIndicator exists on MultiColumnList at runtime but is missing from
      // @folio/stripes-types; without it sortable headers get no affordance.
      // @ts-ignore:next-line
      showSortIndicator
      nonInteractiveHeaders={NON_INTERACTIVE_COLUMNS}
      isEmptyMessage={
        hasSearchTerm
          ? t('mainPane.noResults', { searchTerm })
          : t('mainPane.noResultsFilters')
      }
    />
  );
};
