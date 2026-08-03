import { renderHook } from '@testing-library/react-hooks';
import { jest } from '@jest/globals';
import { useListsSorting } from './useListsSorting';

const historyPushMock = jest.fn();

let locationSearch = '';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/lists', search: locationSearch }),
  useHistory: () => ({ push: historyPushMock }),
}));

beforeEach(() => {
  locationSearch = '';
  jest.clearAllMocks();
});

describe('useListsSorting', () => {
  it('defaults to list name ascending', () => {
    const { result } = renderHook(() => useListsSorting());

    expect(result.current.sortField).toBe('name');
    expect(result.current.sortDirection).toBe('ascending');
    expect(result.current.sortQuery).toEqual({ sortBy: 'name', sortOrder: 'asc' });
  });

  it('reads the sort field and direction from the url', () => {
    locationSearch = '?sorting=updatedDate&sortingDirection=descending';

    const { result } = renderHook(() => useListsSorting());

    expect(result.current.sortField).toBe('updatedDate');
    expect(result.current.sortDirection).toBe('descending');
    expect(result.current.sortQuery).toEqual({ sortBy: 'updatedDate', sortOrder: 'desc' });
  });

  it('falls back to the default when the url names a column the api cannot sort by', () => {
    locationSearch = '?sorting=isPrivate&sortingDirection=descending';

    const { result } = renderHook(() => useListsSorting());

    expect(result.current.sortField).toBe('name');
    expect(result.current.sortQuery).toEqual({ sortBy: 'name', sortOrder: 'desc' });
  });

  it('sorts a newly clicked column ascending and keeps the other params', () => {
    locationSearch = '?filters=status.Active&sorting=name&sortingDirection=ascending';

    const { result } = renderHook(() => useListsSorting());

    result.current.changeSorting({}, { name: 'recordsCount' });

    expect(historyPushMock).toBeCalledWith(
      '/lists?filters=status.Active&sorting=recordsCount&sortingDirection=ascending'
    );
  });

  it('flips to descending when the active column is clicked again', () => {
    locationSearch = '?sorting=updatedDate&sortingDirection=ascending';

    const { result } = renderHook(() => useListsSorting());

    result.current.changeSorting({}, { name: 'updatedDate' });

    expect(historyPushMock).toBeCalledWith('/lists?sorting=updatedDate&sortingDirection=descending');
  });

  it('returns to ascending on a third click', () => {
    locationSearch = '?sorting=updatedDate&sortingDirection=descending';

    const { result } = renderHook(() => useListsSorting());

    result.current.changeSorting({}, { name: 'updatedDate' });

    expect(historyPushMock).toBeCalledWith('/lists?sorting=updatedDate&sortingDirection=ascending');
  });

  it('ignores clicks on columns that are not sortable', () => {
    const { result } = renderHook(() => useListsSorting());

    result.current.changeSorting({}, { name: 'isPrivate' });

    expect(historyPushMock).not.toBeCalled();
  });
});
