import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { jest } from '@jest/globals';
import { useLists } from './useLists';

const kyGetMock = jest.fn(() => ({ json: () => Promise.resolve({ content: [], totalRecords: 0 }) }));

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: () => ({ get: kyGetMock }),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

const wrapper = ({ children }: { children?: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

beforeEach(() => {
  queryClient.clear();
  jest.clearAllMocks();
});

describe('useLists', () => {
  it('still fetches the exact URL built from the request', async () => {
    const { result, waitFor } = renderHook(() => useLists({ filters: ['status.Active'] }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(kyGetMock).toBeCalledWith('lists?active=true');
  });

  it('caches under a structured key that invalidateQueries([\'lists\']) can match', async () => {
    const { result, waitFor } = renderHook(() => useLists({ filters: ['status.Active'] }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    await queryClient.invalidateQueries(['lists']);

    const matchingQueries = queryClient.getQueryCache().findAll(['lists']);

    expect(matchingQueries).toHaveLength(1);
    expect(matchingQueries[0].isStale()).toBe(true);
  });
});
