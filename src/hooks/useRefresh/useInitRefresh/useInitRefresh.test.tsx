import { renderHook, act } from '@testing-library/react-hooks';
import React, { JSX } from 'react';
import { QueryClientProvider } from 'react-query';
import { Server, Response } from 'miragejs';
import { useInitRefresh } from './useInitRefresh';
import { startMirage } from '../../../../test/mirage';
import { queryClient } from '../../../../test/utils';

const wrapper: React.FC<{children: JSX.Element}> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

let server: Server;

beforeEach(() => {
  server = startMirage({});
});
afterEach(() => {
  server.shutdown();
});

describe('useInitRefresh', () => {
  describe('When refresh was initialized successfully', () => {
    it('it is expected to call onSuccess', async () => {
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => useInitRefresh({
          onSuccess: onSuccessMock,
          onError: onErrorMock
        }),
        { wrapper }
      );

      await act(() => {
        result.current.initRefresh('123');
      });


      await waitForNextUpdate();

      expect(onSuccessMock).toHaveBeenCalledWith({ 'success': 'true' });
    });
  });

  describe('When refresh initialization failed', () => {
    it('it is expected to call onError', async () => {
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();

      server.post('lists/:listId/refresh', () => new Response(404));

      const { result, waitForNextUpdate } = renderHook(
        () => useInitRefresh({
          onSuccess: onSuccessMock,
          onError: (data) => {
            onErrorMock(data.name);
          }
        }),
        { wrapper }
      );

      await act(() => {
        result.current.initRefresh('123');
      });


      await waitForNextUpdate();

      expect(onErrorMock).toHaveBeenCalledWith('HTTPError');
    });
  });
});
