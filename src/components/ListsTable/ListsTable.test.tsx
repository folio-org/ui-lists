import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
// @ts-ignore
import { runAxeTest } from '@folio/stripes-testing';
import { MultiColumnList } from '@folio/stripes/components';
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

const renderListsTablePage = (searchTerm = '') => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ListsTable activeFilters={filterConfig} searchTerm={searchTerm} setTotalRecords={noop} />
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
      it('it is expected to hide loader', async () => {
        const loader = screen.getByText('Loading');

        await waitFor(() => {
          return expect(loader).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Render controls', () => {
    it('expected to render the ListsTable component', () => {
      const list = screen.getByTestId('ItemsList');

      expect(list).toBeInTheDocument();
    });
  });

  it('should render with no axe errors', async () => {
    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should show no-results message when search has no matches', async () => {
    renderListsTablePage('no-match-term');

    await waitFor(() => {
      const lastProps = (MultiColumnList as unknown as jest.Mock).mock.calls.at(-1)?.[0];

      expect(lastProps.contentData).toEqual([]);
      expect(lastProps.emptyMessage?.props?.id).toBe('ui-lists.mainPane.noResults');
    });
  });

  it('should send both the active filters and the search term in the same request', async () => {
    const requestedUrls: string[] = [];

    server.pretender.handledRequest = (_verb: string, _path: string, request: any) => {
      requestedUrls.push(request.url);
    };

    renderListsTablePage('report');

    await waitFor(() => {
      const listsRequest = requestedUrls.find((url) => url.includes('/lists?') && url.includes('search=report'));

      expect(listsRequest).toBeDefined();
      expect(listsRequest).toEqual(expect.stringContaining('active=true'));
    });
  });
});
