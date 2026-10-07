import { renderHook, act } from '@testing-library/react-hooks';
import React, { JSX } from 'react';
import { QueryClientProvider } from 'react-query';
import { Server } from 'miragejs';
import { useEditList } from './useEditList';
import { queryClient } from '../../../../test/utils';
import { startMirage } from '../../../../test/mirage';
import { FormStateType } from '../../../interfaces';

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

const listObject = { listName: 'Edited list', status: 'active', visibility: 'shared' } as unknown as FormStateType;

describe('useEditList', () => {
  it('invalidates the lists collection once the list is saved', async () => {
    queryClient.setQueryData(['lists', { filters: ['status.Active'] }], { content: [], totalRecords: 0 });

    const onSuccessMock = jest.fn();

    const { result, waitFor } = renderHook(
      () => useEditList({
        id: 'list-id',
        version: 1,
        listObject,
        onSuccess: onSuccessMock,
        onError: jest.fn(),
        onChangeVersionError: jest.fn(),
      }),
      { wrapper }
    );

    await act(() => {
      result.current.saveList();
    });

    await waitFor(() => onSuccessMock.mock.calls.length > 0);

    const cachedQuery = queryClient.getQueryCache().find(['lists', { filters: ['status.Active'] }]);

    expect(cachedQuery?.isStale()).toBe(true);
  });

  it('does not invalidate when the version check fails and the save never happens', async () => {
    queryClient.setQueryData(['lists', { filters: ['status.Active'] }], { content: [], totalRecords: 0 });

    const onChangeVersionErrorMock = jest.fn();

    const { result, waitFor } = renderHook(
      () => useEditList({
        id: 'list-id',
        version: 999,
        listObject,
        onSuccess: jest.fn(),
        onError: jest.fn(),
        onChangeVersionError: onChangeVersionErrorMock,
      }),
      { wrapper }
    );

    await act(() => {
      result.current.saveList();
    });

    await waitFor(() => onChangeVersionErrorMock.mock.calls.length > 0);

    const cachedQuery = queryClient.getQueryCache().find(['lists', { filters: ['status.Active'] }]);

    expect(cachedQuery?.isStale()).toBe(false);
  });
});
