import React, { JSX } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClientProvider } from 'react-query';
import { createServer, Response } from 'miragejs';
import { useCancelRefresh } from './useCancelRefresh';
import { queryClient } from '../../../../test/utils';
import { startMirage } from '../../../../test/mirage';


const wrapper: React.FC<{children: JSX.Element}> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

let server: any;

beforeEach(async () => {
  server = startMirage({});
});

afterEach(() => {
  server.shutdown();
});


describe('useCancelRefresh', () => {
  describe('When refresh was canceled successfully', () => {
    it('is expected to call onSuccess', async () => {
      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() => useCancelRefresh({
        listId: 'someListId',
        onSuccess: () => {
          onSuccessMock();
        },
        onError: () => {
          onErrorMock();
        },
      }), {
        wrapper
      });

      await act(() => {
        result.current.cancelRefresh();
      });

      await waitForNextUpdate();

      expect(onSuccessMock).toBeCalledTimes(1);
      expect(onErrorMock).not.toBeCalled();
    });
  });

  describe('When refresh was not canceled', () => {
    it('is expected to call onError', async () => {
      server = createServer({
        routes() {
          this.delete('/lists/:listId/refresh', () => {
            return new Response(404);
          });
        },
      });

      const onSuccessMock = jest.fn();
      const onErrorMock = jest.fn();
      const { result, waitForNextUpdate } = renderHook(() => useCancelRefresh({
        listId: 'someListId',
        onSuccess: () => {
          onSuccessMock();
        },
        onError: () => {
          onErrorMock();
        },
      }), {
        wrapper
      });

      await act(() => {
        result.current.cancelRefresh();
      });

      await waitForNextUpdate();

      expect(onSuccessMock).not.toBeCalled();
      expect(onErrorMock).toBeCalledTimes(1);
    });
  });
});

