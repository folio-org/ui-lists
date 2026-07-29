import React, { FC, useEffect } from 'react';
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

  const { listsData, isLoading } = useLists({
    filters: activeFilters,
    size: pagination?.limit,
    offset: pagination?.offset,
    search: searchTerm,
    ...sortQuery
  });

  const { totalRecords = 0, totalPages } = listsData ?? {};

  let { content } = listsData ?? {};

  if (!queryJustChanged && updatedListsData?.content) {
    content = updatedListsData.content;
  }

  const hasSearchTerm = !!searchTerm;
  const displayedContent = content ?? [];
  const displayedTotalRecords = totalRecords;

  useEffect(() => {
    if (isLoading || queryJustChanged) {
      return;
    }

    if (displayedContent.length) {
      setRecordIds(displayedContent.map(({ id }) => id));
    } else if (listsData?.totalPages) {
      goToLastPage(listsData?.totalPages);
    }

    setTotalRecords(displayedTotalRecords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData, searchTerm, updatedListsData]);

  const onNeedMoreDataHandler = (askAmount: number, limit: number, index?: number, direction = '') => {
    onNeedMoreData(direction);

    setRecordIds([]);
  };

  return (
    <MultiColumnList
      autosize
      interactive
      loading={isLoading}
      data-testid="ItemsList"
      contentData={displayedContent}
      columnWidths={columnWidthsConfig}
      pagingType="prev-next"
      visibleColumns={LISTS_VISIBLE_COLUMNS}
      formatter={listTableResultFormatter}
      pageAmount={totalPages}
      totalCount={displayedTotalRecords}
      pagingOffset={pagination.offset}
      pagingCanGoPrevious={hasPreviousPage && !isLoading}
      pagingCanGoNext={checkHasNextPage(totalRecords) && !isLoading}
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
