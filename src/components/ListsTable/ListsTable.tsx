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
  const [storedCurrentPageOffset] = useLocalStorage(CURRENT_PAGE_OFFSET_KEY, 0);
  const [recordIds, setRecordIds] = useState([] as string[]);

  const { changePage, pagination } = usePagination({
    limit: PAGINATION_AMOUNT,
    offset: storedCurrentPageOffset,
  });

  const onNeedMoreData = (thePagination: any) => {
    writeStorage(CURRENT_PAGE_OFFSET_KEY, thePagination.offset);
    // @ts-ignore:next-line
    changePage(thePagination);
    setRecordIds([]);
  };

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

  if (!recordIds?.length && content?.length) {
    setRecordIds(content.map(({ id }) => id));
  }

  return (
    <>
      <MultiColumnList
        interactive
        data-testid="ItemsList"
        contentData={content}
        visibleColumns={LISTS_VISIBLE_COLUMNS}
        formatter={listTableResultFormatter}
        pagingType={null}
        pageAmount={totalPages}
        totalCount={totalRecords}
        onNeedMoreData={onNeedMoreData}
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
