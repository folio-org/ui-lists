import React, { FC, useEffect } from 'react';
import { isEqual, noop } from 'lodash';
import { Loading, MultiColumnList, Row } from '@folio/stripes/components';

import { listTableMapping } from './helpers/mappers';
import { listTableResultFormatter } from './helpers/formatters';
import { LISTS_VISIBLE_COLUMNS } from '../../constants';
import { useLists, useListsIdsToTrack, usePrevious, useListsPagination } from '../../hooks';
import { columnWidthsConfig } from './configs';
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
  const {
    gotToFirstPage,
    goToLastPage,
    pagination,
    checkHasNextPage,
    hasPreviousPage,
    onNeedMoreData
  } = useListsPagination({});
  const { updatedListsData, setRecordIds } = useListsIdsToTrack();

  const prevActiveFilters: string[] | null = usePrevious(activeFilters);
  const prevSearchTerm = usePrevious(searchTerm);

  // True for exactly the one render where filters/search just changed. The tracked-ids
  // poll (updatedListsData) is a separate query keyed on the *previous* result set's ids,
  // so on this render it can't be trusted to reflect the new filters/search yet.
  const filtersOrSearchJustChanged = (
    (prevActiveFilters !== null && !isEqual(prevActiveFilters, activeFilters)) ||
    (prevSearchTerm !== null && prevSearchTerm !== searchTerm)
  );

  useEffect(() => {
    if (filtersOrSearchJustChanged) {
      gotToFirstPage();
      setRecordIds([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, searchTerm]);

  const { listsData, isLoading } = useLists({
    filters: activeFilters,
    size: pagination?.limit,
    offset: pagination?.offset,
    search: searchTerm
  });

  const { totalRecords = 0, totalPages } = listsData ?? {};

  let { content } = listsData ?? {};

  if (!filtersOrSearchJustChanged && updatedListsData?.content) {
    content = updatedListsData.content;
  }

  const hasSearchTerm = !!searchTerm;
  const displayedContent = content ?? [];
  const displayedTotalRecords = totalRecords;

  useEffect(() => {
    if (isLoading || filtersOrSearchJustChanged) {
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

  if (isLoading) {
    return (
      <Row center="xs">
        <Loading size="large" />
      </Row>
    );
  }

  return (
    <MultiColumnList
      autosize
      interactive
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
      isEmptyMessage={
        hasSearchTerm
          ? t('mainPane.noResults', { searchTerm })
          : t('mainPane.noResultsFilters')
      }
    />
  );
};
