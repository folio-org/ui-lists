import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useInvalidateLists } from './useInvalidateLists';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const wrapper = ({ children }: { children?: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  queryClient.clear();
});

describe('useInvalidateLists', () => {
  it('invalidates every cached lists query, regardless of filters/search/sort/page', async () => {
    queryClient.setQueryData(['lists', { filters: ['status.Active'] }], { content: [], totalRecords: 0 });
    queryClient.setQueryData(['lists', { filters: [], search: 'foo' }], { content: [], totalRecords: 0 });

    const { result } = renderHook(() => useInvalidateLists(), { wrapper });

    await act(async () => {
      await result.current();
    });

    const matchingQueries = queryClient.getQueryCache().findAll(['lists']);

    expect(matchingQueries).toHaveLength(2);
    expect(matchingQueries.every((query) => query.isStale())).toBe(true);
  });

  it('does not invalidate unrelated queries', async () => {
    queryClient.setQueryData(['listDetails', 'id-1'], { id: 'id-1' });

    const { result } = renderHook(() => useInvalidateLists(), { wrapper });

    await act(async () => {
      await result.current();
    });

    const unrelatedQuery = queryClient.getQueryCache().find(['listDetails', 'id-1']);

    expect(unrelatedQuery?.isStale()).toBe(false);
  });
});
