import { renderHook } from '@testing-library/react-hooks';

import { useFilters } from './useFilters/useFilters';
import { useSearch } from './useSearch/useSearch';

// A minimal stand-in for react-router's `history` object that behaves like the real
// thing: `push` synchronously replaces `location` with a brand-new object, the same
// way the real `history` package does. Unlike the plain-object mocks used by
// useFilters.test.ts / useSearch.test.ts (where `location.search` is a test-controlled
// variable that never changes on `push`), this lets us reproduce what happens when two
// hooks that each captured `location` at render time call `history.push` back-to-back,
// as `ListPage.tsx`'s `onResetAllHandler` does (`onResetAll()` then `setSearchTerm('')`).
let fakeHistory: { location: { pathname: string, search: string }, push: jest.Mock };

jest.mock('react-router-dom', () => ({
  useHistory: () => fakeHistory,
}));

const applyPush = (url: string) => {
  const [pathname, search = ''] = url.split('?');

  fakeHistory.location = { pathname, search: search ? `?${search}` : '' };
};

beforeEach(() => {
  sessionStorage.clear();

  fakeHistory = {
    location: { pathname: '/lists', search: '?filters=status.Active,visibility.Shared&search=foo' },
    push: jest.fn(applyPush),
  };
});

describe('Reset all: useFilters + useSearch interaction', () => {
  it('should not revert the filter reset when the search term is cleared right after', () => {
    const { result: filtersResult } = renderHook(() => useFilters());
    const { result: searchResult } = renderHook(() => useSearch());

    filtersResult.current.onResetAll();
    searchResult.current.setSearchTerm('');

    const finalSearch = fakeHistory.location.search;

    expect(finalSearch).not.toContain('visibility.Shared');
    expect(finalSearch).not.toContain('search=foo');
    expect(finalSearch).toContain('filters=status.Active');
  });
});
