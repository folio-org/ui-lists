import { renderHook } from '@testing-library/react-hooks';

import { jest } from '@jest/globals';
import { useSearch } from './useSearch';

const historyPushMock = jest.fn();

let locationSearch = '';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: historyPushMock,
    location: {
      pathname: '/lists',
      search: locationSearch
    }
  })
}));

beforeEach(() => {
  locationSearch = '';
  jest.clearAllMocks();
});

describe('useSearch', () => {
  it('should expose an empty searchTerm when there is no search param in the URL', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.searchTerm).toBe('');
  });

  it('should expose the current searchTerm from the URL', () => {
    locationSearch = '?search=foo';

    const { result } = renderHook(() => useSearch());

    expect(result.current.searchTerm).toBe('foo');
  });

  it('should push the search term to the URL', () => {
    const { result } = renderHook(() => useSearch());

    result.current.setSearchTerm('foo');

    expect(historyPushMock).toBeCalledWith('/lists?search=foo');
  });

  it('should preserve other existing params when setting a search term', () => {
    locationSearch = '?filters=status.Active&sorting=updatedDate&sortingDirection=descending';

    const { result } = renderHook(() => useSearch());

    result.current.setSearchTerm('foo');

    expect(historyPushMock).toBeCalledWith(
      '/lists?filters=status.Active&sorting=updatedDate&sortingDirection=descending&search=foo'
    );
  });

  it('should remove the search param when setSearchTerm is called with an empty string', () => {
    locationSearch = '?search=foo&sorting=updatedDate';

    const { result } = renderHook(() => useSearch());

    result.current.setSearchTerm('');

    expect(historyPushMock).toBeCalledWith('/lists?sorting=updatedDate');
  });
});
