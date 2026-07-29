import { useHistory, useLocation } from 'react-router-dom';
import { COLUMNS_NAME, SORTABLE_COLUMNS } from '../../constants';
import { ListsSortQuery } from '../../interfaces';

// These param names and direction values intentionally match the ones
// stripes-acq-components uses, so a sorted Lists URL reads the same as it does
// elsewhere in FOLIO. That module itself cannot be imported here — the repo's jest
// mocks make its transitive constants barrel unloadable.
export const SORTING_PARAMETER = 'sorting';
export const SORTING_DIRECTION_PARAMETER = 'sortingDirection';
export const ASC_DIRECTION = 'ascending';
export const DESC_DIRECTION = 'descending';

export const DEFAULT_SORT_FIELD: string = COLUMNS_NAME.LIST_NAME;

export type ListsSortDirection = typeof ASC_DIRECTION | typeof DESC_DIRECTION;

export interface UseListsSortingResult {
  sortField: string,
  sortDirection: ListsSortDirection,
  changeSorting: (event: unknown, meta: { name: string }) => void,
  sortQuery: ListsSortQuery,
}

export const useListsSorting = (): UseListsSortingResult => {
  const history = useHistory();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const fieldFromUrl = searchParams.get(SORTING_PARAMETER) ?? '';
  const directionFromUrl = searchParams.get(SORTING_DIRECTION_PARAMETER) ?? '';

  // A hand-edited or stale URL can name a column the API refuses to sort by, and it
  // answers those with a 400, so anything unexpected falls back to the default.
  const sortField = SORTABLE_COLUMNS.includes(fieldFromUrl) ? fieldFromUrl : DEFAULT_SORT_FIELD;
  const sortDirection: ListsSortDirection = directionFromUrl === DESC_DIRECTION
    ? DESC_DIRECTION
    : ASC_DIRECTION;

  const changeSorting = (event: unknown, meta: { name: string }) => {
    const nextField = meta?.name;

    if (!SORTABLE_COLUMNS.includes(nextField)) {
      return;
    }

    // A first click on a column sorts it ascending; clicking the active column flips it.
    const nextDirection = nextField === sortField && sortDirection === ASC_DIRECTION
      ? DESC_DIRECTION
      : ASC_DIRECTION;

    const nextParams = new URLSearchParams(location.search);

    nextParams.set(SORTING_PARAMETER, nextField);
    nextParams.set(SORTING_DIRECTION_PARAMETER, nextDirection);

    history.push(`${location.pathname}?${nextParams.toString()}`);
  };

  return {
    sortField,
    sortDirection,
    changeSorting,
    sortQuery: {
      sortBy: sortField,
      sortOrder: sortDirection === DESC_DIRECTION ? 'desc' : 'asc',
    },
  };
};
