import { renderHook } from '@testing-library/react-hooks';
import React, { JSX } from 'react';
import { QueryClientProvider } from 'react-query';
import { Server } from 'miragejs';
import { useRecordsLimit } from './useRecordsLimit';
import { queryClient } from '../../../test/utils';
import { startMirage } from '../../../test/mirage';

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

describe('useRecordsLimit', () => {
  describe('When component mounted', () => {
    it('it is expected to call fetch size limit', async () => {
      const { result, waitForNextUpdate } = renderHook(
        () => useRecordsLimit(),
        { wrapper }
      );

      await waitForNextUpdate();

      expect(result.current).toEqual('100');
    });
  });
});
