import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { Server } from 'miragejs';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import { noop } from 'lodash';

import { startMirage } from '../../../test/mirage';
import { queryClient } from '../../../test/utils';

import { ListsTable } from './ListsTable';
import { STATUS_ACTIVE } from '../../utils/constants';

const filterConfig = [STATUS_ACTIVE];

const historyPushMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
  useHistory: jest.fn(() => ({ push: historyPushMock })),
}));

const renderListsTablePage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ListsTable activeFilters={filterConfig} setTotalRecords={noop} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

let server: Server;

beforeEach(async () => {
  jest.clearAllMocks();
  server = startMirage({});

  await renderListsTablePage();
});

afterEach(() => {
  server.shutdown();
});

describe('ListsTable', () => {
  describe('Loading', () => {
    describe('When components mounted', () => {
      it('it is expected to show loader', () => {
        const loader = screen.getByText('Loading');

        expect(loader).toBeInTheDocument();
      });
    });

    describe('When loading finished mounted', () => {
      it.skip('it is expected to hide loader', async () => {
        const loader = screen.getByText('Loading');

        await waitFor(() => {
          return expect(loader).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Render controls', () => {
    it.skip('expected to render the ListsTable component', () => {
      const list = screen.getByTestId('ItemsList');

      expect(list).toBeInTheDocument();
    });
  });
});
