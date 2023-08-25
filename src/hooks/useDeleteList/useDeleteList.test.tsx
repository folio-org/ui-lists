import { renderHook, act } from '@testing-library/react-hooks';
import React, { JSX } from 'react';
import { QueryClientProvider } from 'react-query';
import { Response, Server } from 'miragejs';
import { useDeleteList } from './useDeleteList';
import { queryClient } from '../../../test/utils';
import { startMirage } from '../../../test/mirage';


let server: Server;

beforeEach(() => {
  server = startMirage({});
});
afterEach(() => {
  server.shutdown();
});

const wrapper: React.FC<{children: JSX.Element}> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useDeleteList', () => {
  describe('When deleteList completed successfully', () => {
    it('it is expected to call onSuccess', async () => {
      const onSuccessMock = jest.fn();

      const { result, waitFor } = renderHook(
        () => useDeleteList({ id: '123', onSuccess: onSuccessMock }),
        { wrapper }
      );

      await act(() => {
        result.current.deleteList();
      });

      await waitFor(() => !result.current.isDeleteInProgress);

      expect(onSuccessMock).toBeCalled();
    });
  });

  describe('When deleteList failed successfully', () => {
    it('it is expected to call onError', async () => {
      server.delete('lists/:id', () => new Response(404));

      const onErrorMock = jest.fn();

      const { result, waitFor } = renderHook(
        () => useDeleteList({ id: '123', onError: onErrorMock }),
        { wrapper }
      );

      await act(() => {
        result.current.deleteList();
      });

      await waitFor(() => !result.current.isDeleteInProgress);

      expect(onErrorMock).toBeCalled();
    });
  });
});
