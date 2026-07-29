import React from 'react';
import { QueryClientProvider } from 'react-query';
import { MultiColumnList } from '@folio/stripes/components';
import { Server } from 'miragejs';
import { render, act } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { noop } from 'lodash';

import { startMirage } from '../../../test/mirage';
import { queryClient } from '../../../test/utils';
import { ListsTable } from './ListsTable';
import { STATUS_ACTIVE } from '../../utils/constants';

const historyPushMock = jest.fn();
const changePageMock = jest.fn();

let locationSearch = '';

// Start on page 2 so that a reset to the first page is an observable call. The global
// mock's changePage is an unreachable inline jest.fn() with offset 0, which would make
// gotToFirstPage() a no-op.
jest.mock('@folio/stripes-acq-components', () => ({
  usePagination: () => ({
    pagination: { limit: 100, offset: 100 },
    changePage: changePageMock,
  }),
}));

// The sort lives in the URL, so the location has to be steerable from the test.
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/lists', search: locationSearch }),
  useHistory: () => ({ push: historyPushMock }),
  useParams: () => ({ id: 'id' }),
}));

const getLastMclProps = () => (MultiColumnList as unknown as jest.Mock).mock.calls.at(-1)?.[0];

const renderListsTable = () => render(
  <QueryClientProvider client={queryClient}>
    <ListsTable activeFilters={[STATUS_ACTIVE]} searchTerm="" setTotalRecords={noop} />
  </QueryClientProvider>
);

let server: Server;
let requestedUrls: string[] = [];

beforeEach(() => {
  jest.clearAllMocks();
  queryClient.clear();
  locationSearch = '';
  requestedUrls = [];
  server = startMirage({});
  server.pretender.handledRequest = (_verb: string, _path: string, request: any) => {
    requestedUrls.push(request.url);
  };
});

afterEach(() => {
  server.shutdown();
});

describe('ListsTable sorting', () => {
  it('marks only the three sortable columns as interactive', async () => {
    renderListsTable();

    await waitFor(() => {
      expect(getLastMclProps().showSortIndicator).toBe(true);
      expect(getLastMclProps().nonInteractiveHeaders).toEqual([
        'entityTypeName',
        'isActive',
        'createdByUsername',
        'isPrivate',
      ]);
      expect(typeof getLastMclProps().onHeaderClick).toBe('function');
    });
  });

  it('shows the default name/ascending sort and requests it from the api', async () => {
    renderListsTable();

    await waitFor(() => {
      expect(getLastMclProps().sortedColumn).toBe('name');
      expect(getLastMclProps().sortDirection).toBe('ascending');
    });

    await waitFor(() => {
      expect(requestedUrls.some((url) => url.includes('/lists?'))).toBe(true);
    });

    const listsRequest = requestedUrls.find((url) => url.includes('/lists?'));

    expect(listsRequest).toEqual(expect.stringContaining('sortBy=name'));
    expect(listsRequest).toEqual(expect.stringContaining('sortOrder=asc'));
  });

  it('pushes the clicked column to the url instead of sorting locally', async () => {
    renderListsTable();

    await waitFor(() => expect(getLastMclProps()).toBeDefined());

    act(() => {
      getLastMclProps().onHeaderClick({}, { name: 'updatedDate' });
    });

    expect(historyPushMock).toBeCalledWith('/lists?sorting=updatedDate&sortingDirection=ascending');
  });

  it('requests the sort named in the url', async () => {
    locationSearch = '?sorting=recordsCount&sortingDirection=descending';

    renderListsTable();

    await waitFor(() => {
      expect(getLastMclProps().sortedColumn).toBe('recordsCount');
      expect(getLastMclProps().sortDirection).toBe('descending');
    });

    await waitFor(() => {
      expect(requestedUrls.some((url) => url.includes('sortBy=recordsCount'))).toBe(true);
    });

    const listsRequest = requestedUrls.find((url) => url.includes('sortBy=recordsCount'));

    expect(listsRequest).toEqual(expect.stringContaining('sortOrder=desc'));
  });

  it('returns to the first page when the sort changes', async () => {
    const { rerender } = renderListsTable();

    await waitFor(() => expect(getLastMclProps().sortedColumn).toBe('name'));

    expect(changePageMock).not.toBeCalledWith({ offset: 0 });

    locationSearch = '?sorting=updatedDate&sortingDirection=descending';

    rerender(
      <QueryClientProvider client={queryClient}>
        <ListsTable activeFilters={[STATUS_ACTIVE]} searchTerm="" setTotalRecords={noop} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(changePageMock).toBeCalledWith({ offset: 0 });
    });
  });

  it('keeps the sort visible while rows load, instead of unmounting the headers', async () => {
    renderListsTable();

    expect(getLastMclProps().loading).toBe(true);
    expect(getLastMclProps().sortedColumn).toBe('name');

    await waitFor(() => {
      expect(getLastMclProps().loading).toBe(false);
    });
  });
});
