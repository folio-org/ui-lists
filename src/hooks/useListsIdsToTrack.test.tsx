import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { jest } from '@jest/globals';
import { useListsIdsToTrack } from './useListsIdsToTrack';

const kyGetMock = jest.fn(() => ({ json: () => Promise.resolve({ content: [] }) }));

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

describe('useListsIdsToTrack', () => {
  it('requests the tracked ids with the provided sort, so polling cannot reorder the page', async () => {
    const { result } = renderHook(
      () => useListsIdsToTrack({ sortBy: 'updatedDate', sortOrder: 'desc' }),
      { wrapper }
    );

    await act(async () => {
      result.current.setRecordIds(['id-1', 'id-2']);
    });

    expect(kyGetMock).toBeCalledWith('lists?ids=id-1%2Cid-2&sortBy=updatedDate&sortOrder=desc');
  });

  it('requests nothing until there are ids to track', () => {
    renderHook(() => useListsIdsToTrack({ sortBy: 'name', sortOrder: 'asc' }), { wrapper });

    expect(kyGetMock).not.toBeCalledWith(expect.stringContaining('ids='));
  });
});
