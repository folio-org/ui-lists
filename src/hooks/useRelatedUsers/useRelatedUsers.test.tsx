import { renderHook } from '@testing-library/react-hooks';
import React, { JSX } from 'react';
import { QueryClientProvider } from 'react-query';
import { Response, Server } from 'miragejs';
import { useRelatedUsers } from './useRelatedUsers';
import { RELATED_USERS_TYPE } from '../../utils/constants';
import { queryClient } from '../../../test/utils';
import { startMirage } from '../../../test/mirage';

const wrapper: React.FC<{ children: JSX.Element }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

let server: Server;

beforeEach(() => {
  queryClient.clear();
  server = startMirage({});
});

afterEach(() => {
  server.shutdown();
});

describe('useRelatedUsers', () => {
  it('is expected to start with isLoading true and no user options', () => {
    const { result } = renderHook(
      () => useRelatedUsers(RELATED_USERS_TYPE.CreatedBy),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.userOptions).toEqual([]);
  });

  it('is expected to fetch and sort users who created lists', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useRelatedUsers(RELATED_USERS_TYPE.CreatedBy),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.userOptions).toEqual([
      { value: '11111111-1111-1111-1111-111111111111', label: 'Jones, Bob' },
      { value: '33333333-3333-3333-3333-333333333333', label: 'Smith, Anna' },
    ]);
  });

  it('is expected to fetch users who updated lists', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useRelatedUsers(RELATED_USERS_TYPE.UpdatedBy),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.userOptions).toEqual([
      { value: '22222222-2222-2222-2222-222222222222', label: 'Black, Dana' },
      { value: '44444444-4444-4444-4444-444444444444', label: 'White, Carl' },
    ]);
  });

  it('is expected to skip related users that have no id', async () => {
    server.get('lists/related-users', () => new Response(200, {}, {
      totalRecords: 2,
      relatedUsers: [
        { fullName: 'No, Id' },
        { id: 'abc', fullName: 'Has, Id' },
      ],
    }));

    const { result, waitForNextUpdate } = renderHook(
      () => useRelatedUsers(RELATED_USERS_TYPE.CreatedBy),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.userOptions).toEqual([{ value: 'abc', label: 'Has, Id' }]);
  });

  it('is expected to return no user options when the response has no relatedUsers', async () => {
    server.get('lists/related-users', () => new Response(200, {}, { totalRecords: 0 }));

    const { result, waitForNextUpdate } = renderHook(
      () => useRelatedUsers(RELATED_USERS_TYPE.CreatedBy),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.userOptions).toEqual([]);
  });

  it('is expected to skip a nullish entry in the related users list', async () => {
    server.get('lists/related-users', () => new Response(200, {}, {
      totalRecords: 2,
      relatedUsers: [null, { id: 'abc', fullName: 'Has, Id' }],
    }));

    const { result, waitForNextUpdate } = renderHook(
      () => useRelatedUsers(RELATED_USERS_TYPE.CreatedBy),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.userOptions).toEqual([{ value: 'abc', label: 'Has, Id' }]);
  });

  it('is expected to return no user options when the response body is empty', async () => {
    server.get('lists/related-users', () => new Response(200, {}, 'null'));

    const { result, waitForNextUpdate } = renderHook(
      () => useRelatedUsers(RELATED_USERS_TYPE.CreatedBy),
      { wrapper }
    );

    await waitForNextUpdate();

    expect(result.current.userOptions).toEqual([]);
  });
});
