import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { QueryClientProvider } from 'react-query';
import { Response, Server } from 'miragejs';
import { useRefreshStatusPolling } from './useRefreshStatusPolling';
import { queryClient } from '../../../../test/utils';
import { startMirage } from '../../../../test/mirage';
import refreshed from '../../../../test/data/listDetails.refreshed.json';
import inRefresh from '../../../../test/data/listDetails.in-refresh.json';
import { InProgressRefresh } from '../../../interfaces';

const wrapper = ({ children }: { children?: React.ReactNode }) => (
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

describe('useRefreshStatusPolling', () => {
  describe('when the list details report a refresh in progress only after the hook was mounted', () => {
    it('reports success, not a cancellation, if that refresh has already finished by the first poll', async () => {
      const inProgressRefresh = inRefresh.inProgressRefresh as unknown as InProgressRefresh;

      server.get('lists/:id', () => new Response(200, {}, {
        ...refreshed,
        successRefresh: { ...refreshed.successRefresh, id: inProgressRefresh.id },
      }));

      const onSuccessPolling = jest.fn();
      const onCancelRefresh = jest.fn();
      let detailsInProgressRefresh: InProgressRefresh | undefined;

      const { rerender, waitFor } = renderHook(
        () => useRefreshStatusPolling({
          listId: 'id',
          inProgressRefresh: detailsInProgressRefresh,
          onErrorPolling: jest.fn(),
          onSuccessPolling,
          onError: jest.fn(),
          onCancelRefresh,
        }),
        { wrapper }
      );

      detailsInProgressRefresh = inProgressRefresh;
      rerender();

      await waitFor(() => onSuccessPolling.mock.calls.length + onCancelRefresh.mock.calls.length > 0);

      expect(onSuccessPolling).toHaveBeenCalledTimes(1);
      expect(onCancelRefresh).not.toHaveBeenCalled();
    });
  });
});
