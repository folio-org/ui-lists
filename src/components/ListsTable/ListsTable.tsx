import React, { FC, useEffect, useState } from 'react';
import { isEqual, noop } from 'lodash';
import moment from 'moment';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { Loading, MultiColumnList, Row } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
// @ts-ignore:next-line
import { PrevNextPagination, usePagination } from '@folio/stripes-acq-components';

import { listTableMapping } from './helpers/mappers';
import { listTableResultFormatter } from './helpers/formatters';
import { LISTS_VISIBLE_COLUMNS } from '../../constants';
import { useLists, usePrevious } from '../../hooks';
import { CURRENT_PAGE_OFFSET_KEY, PAGINATION_AMOUNT } from '../../utils/constants';
import { ShowMessageHandlerType } from '../../hooks/useMessages/useMessages';
import { t } from '../../services';

export interface ListsTableProps {
  activeFilters: any,
  setTotalRecords: (totalRecords: number) => void,
  showSuccessMessage: (value: ShowMessageHandlerType) => void
}

let updatedAsOf = moment.utc().format();

export const ListsTable: FC<ListsTableProps> = ({
  activeFilters,
  setTotalRecords = noop,
  showSuccessMessage = noop
}) => {
  const ky = useOkapiKy();
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

  const { listsData, isLoading } = useLists(activeFilters, recordIds, pagination.limit, pagination.offset);

  const updatedListsData = useLists([], [], undefined, undefined, updatedAsOf);

  if (updatedListsData?.listsData?.content) {
    updatedAsOf = moment.utc().format();
    showSuccessMessage({ message: t('callout.list.save.success')});
  }

  if (isLoading) {
    return (
      <Row center="xs">
        <Loading size="large" />
      </Row>
    );
  }

  const { content, totalRecords = 0, totalPages } = listsData ?? {};

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
