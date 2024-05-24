import { useLocalStorage } from '@rehooks/local-storage';
import { usePagination}  from "@folio/stripes-acq-components";
import {CURRENT_PAGE_OFFSET_KEY, PAGINATION_AMOUNT} from "../../utils/constants";


export const NEXT = 'next';

export const useListsPagination = ({limit = PAGINATION_AMOUNT}: {limit?: number}) => {
  const [storedCurrentPageOffset, writeStorage] = useLocalStorage<number>(CURRENT_PAGE_OFFSET_KEY, 0);

  const { changePage: change, pagination } = usePagination({
    limit,
    offset: storedCurrentPageOffset,
  });

  const hasPreviousPage = pagination.offset  > 1;
  const checkHasNextPage = (totalRecords: number) => {
    return pagination.offset <= totalRecords - PAGINATION_AMOUNT;
  }

  const changePage = ({offset}: {offset: number}) => {
    change({ offset });
    writeStorage(offset);
  }

  const goToLastPage = (totalPages: number = 0) => {
    const lastPageOffset = totalPages > 1
      ? PAGINATION_AMOUNT * (totalPages - 1)
      : 0;

    changePage({
      offset: lastPageOffset
    });
  };

  const gotToFirstPage = () => {
    changePage({ offset: 0 });
  }

  const onNeedMoreData = (direction: string) => {
    if (direction === NEXT) {
      changePage({ offset: pagination.offset + PAGINATION_AMOUNT });
    } else {
      changePage({ offset: pagination.offset - PAGINATION_AMOUNT });
    }
  }

  return {
    hasPreviousPage,
    checkHasNextPage,
    onNeedMoreData,
    goToLastPage,
    gotToFirstPage,
    pagination,
  }
}