import React, { FC, useEffect, useState } from 'react';
import { isEqual, noop } from 'lodash';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { Loading, MultiColumnList, Row } from '@folio/stripes/components';
// @ts-ignore:next-line
import { PrevNextPagination, usePagination } from '@folio/stripes-acq-components';

import { listTableMapping } from './helpers/mappers';
import { listTableResultFormatter } from './helpers/formatters';
import { LISTS_VISIBLE_COLUMNS } from '../../constants';
import { useLists, useListsIdsToTrack, usePrevious } from '../../hooks';
import { CURRENT_PAGE_OFFSET_KEY, PAGINATION_AMOUNT } from '../../utils/constants';

export interface ListsTableProps {
  activeFilters: string[],
  setTotalRecords: (totalRecords: number) => void
}

export const ListsTable: FC<ListsTableProps> = ({
  activeFilters,
  setTotalRecords = noop
}) => {
  const [storedCurrentPageOffset] = useLocalStorage<number>(CURRENT_PAGE_OFFSET_KEY, 0);
  const [recordIds, setRecordIds] = useState<string[]>([]);

  const { changePage, pagination } = usePagination({
    limit: PAGINATION_AMOUNT,
    offset: storedCurrentPageOffset,
  });

  const onNeedMoreData = (thePagination: any) => {
    setRecordIds([]);
    changePage(thePagination);
    writeStorage(CURRENT_PAGE_OFFSET_KEY, thePagination.offset);
  };

  const goToLastPage = (totalPages: number = 0) => {
    const lastPageOffset = totalPages > 1
      ? PAGINATION_AMOUNT * (totalPages - 1)
      : 0;

    onNeedMoreData({
      offset: lastPageOffset
    })
  }

  const prevActiveFilters = usePrevious(activeFilters);

  useEffect(() => {
    if (prevActiveFilters && !isEqual(prevActiveFilters, activeFilters)) {
      writeStorage(CURRENT_PAGE_OFFSET_KEY, 0);
      // @ts-ignore:next-line
      changePage({ offset: 0, limit: PAGINATION_AMOUNT });
      setRecordIds([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  const { listsData, isLoading } = useLists({ filters: activeFilters, size: pagination?.limit, offset: pagination?.offset });

  useEffect(() => {
    if(isLoading) {
      return
    }

    if (listsData?.content?.length) {
      setRecordIds(listsData?.content.map(({ id }) => id));
    } else if (listsData?.totalPages){
      goToLastPage(listsData?.totalPages)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsData]);

  const { updatedListsData } = useListsIdsToTrack({ idsToTrack: recordIds });

  if (isLoading) {
    return (
      <Row center="xs">
        <Loading size="large" />
      </Row>
    );
  }

  const { totalRecords = 0, totalPages } = listsData ?? {};
  let { content } = listsData ?? {};

  if (updatedListsData?.content) {
    content = updatedListsData.content;
  }

  setTotalRecords(totalRecords);

  return (
    <>
      <MultiColumnList
        interactive
        data-testid="ItemsList"
        contentData={content ?? []}
        visibleColumns={LISTS_VISIBLE_COLUMNS}
        formatter={listTableResultFormatter}
        pageAmount={totalPages}
        totalCount={totalRecords}
        columnMapping={listTableMapping}
      />
      <PrevNextPagination
        {...pagination}
        totalCount={totalRecords}
        onChange={onNeedMoreData}
      />
    </>
  );
};
