import React, { FC, useEffect } from 'react';
import { isEqual, noop } from 'lodash';
import { Loading, MultiColumnList, Row } from '@folio/stripes/components';

import { listTableMapping } from './helpers/mappers';
import { listTableResultFormatter } from './helpers/formatters';
import { LISTS_VISIBLE_COLUMNS } from '../../constants';
import { useLists, useListsIdsToTrack, usePrevious, useListsPagination } from '../../hooks';
import { columnWidthsConfig } from './configs';

import css from './ListsTable.module.css';

export interface ListsTableProps {
  activeFilters: string[],
  setTotalRecords: (totalRecords: number) => void
}

export const ListsTable: FC<ListsTableProps> = ({
  activeFilters,
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

  const prevActiveFilters = usePrevious(activeFilters);

  useEffect(() => {
    if (prevActiveFilters && !isEqual(prevActiveFilters, activeFilters)) {
      gotToFirstPage();
      setRecordIds([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  const { listsData, isLoading } = useLists({
    filters: activeFilters,
    size: pagination?.limit,
    offset: pagination?.offset
  });

  const { totalRecords = 0, totalPages } = listsData ?? {};

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (listsData?.content?.length) {
      setRecordIds(listsData?.content.map(({ id }) => id));
    } else if (listsData?.totalPages) {
      goToLastPage(listsData?.totalPages);
    }
    setTotalRecords(totalRecords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData]);

  const onNeedMoreDataHandler = (askAmount: number, limit: number, index?: number, direction: string = '') => {
    onNeedMoreData(direction)

    setRecordIds([]);
  }

  if (isLoading) {
    return (
      <Row center="xs">
        <Loading size="large" />
      </Row>
    );
  }

  let { content } = listsData ?? {};

  if (updatedListsData?.content) {
    content = updatedListsData.content;
  }


  return (
      <MultiColumnList
        autosize
        interactive
        data-testid="ItemsList"
        contentData={content ?? []}
        headerRowClass={css.listTableHeaderSticky}
        // @ts-ignore:next-line
        columnWidths={columnWidthsConfig}
        pagingType='prev-next'
        visibleColumns={LISTS_VISIBLE_COLUMNS}
        formatter={listTableResultFormatter}
        pageAmount={totalPages}
        totalCount={totalRecords}
        // @ts-ignore:next-line
        pagingOffset={pagination.offset}
        pagingCanGoPrevious={hasPreviousPage && !isLoading}
        pagingCanGoNext={checkHasNextPage(totalRecords) && !isLoading}
        columnMapping={listTableMapping}
        onNeedMoreData={onNeedMoreDataHandler}
      />
  );
};
