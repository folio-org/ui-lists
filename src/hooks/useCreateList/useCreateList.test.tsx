import { renderHook, act } from '@testing-library/react-hooks';
import React, { JSX } from 'react';
import { QueryClientProvider } from 'react-query';
import { Response, Server } from 'miragejs';
import { useCreateList } from './useCreateList';
import { queryClient } from '../../../test/utils';
import { startMirage } from '../../../test/mirage';
import { FormStateType } from '../../interfaces';

let server: Server;

beforeEach(() => {
  server = startMirage({});
  queryClient.clear();
});

afterEach(() => {
  server.shutdown();
});

const wrapper: React.FC<{children: JSX.Element}> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const listObject = { listName: 'New list', status: 'active', visibility: 'shared' } as unknown as FormStateType;

describe('useCreateList', () => {
  it('invalidates the lists collection once the list is created', async () => {
    server.post('lists', () => new Response(200, {}, { id: 'new-list-id' }));
    queryClient.setQueryData(['lists', { filters: ['status.Active'] }], { content: [], totalRecords: 0 });

    const onSuccessMock = jest.fn();

    const { result, waitFor } = renderHook(
      () => useCreateList({ listObject, onSuccess: onSuccessMock, onError: jest.fn() }),
      { wrapper }
    );

    await act(() => {
      result.current.saveList();
    });

    await waitFor(() => onSuccessMock.mock.calls.length > 0);

    const cachedQuery = queryClient.getQueryCache().find(['lists', { filters: ['status.Active'] }]);

    expect(cachedQuery?.isStale()).toBe(true);
  });

  it('still calls the consumer onSuccess with the created list', async () => {
    server.post('lists', () => new Response(200, {}, { id: 'new-list-id' }));

    const onSuccessMock = jest.fn();

    const { result, waitFor } = renderHook(
      () => useCreateList({ listObject, onSuccess: onSuccessMock, onError: jest.fn() }),
      { wrapper }
    );

    await act(() => {
      result.current.saveList();
    });

    await waitFor(() => onSuccessMock.mock.calls.length > 0);

    expect(onSuccessMock).toBeCalled();
  });
});
