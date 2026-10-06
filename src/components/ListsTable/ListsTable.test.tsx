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
import { CREATED_BY_PREFIX, STATUS_ACTIVE, STATUS_INACTIVE } from '../../utils/constants';
import listsFixture from '../../../test/data/lists.json';

const filterConfig = [STATUS_ACTIVE];

const historyPushMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
  useHistory: jest.fn(() => ({ push: historyPushMock })),
}));

const MultiColumnListMock = MultiColumnList as unknown as jest.Mock;

const renderListsTablePage = (searchTerm = '', activeFilters = filterConfig) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ListsTable activeFilters={activeFilters} searchTerm={searchTerm} setTotalRecords={noop} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ListsTable', () => {
  let server: Server;

  beforeEach(async () => {
    jest.clearAllMocks();
    server = startMirage({});

    await renderListsTablePage();
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('Loading', () => {
    it('it is expected to hand the loading state to the list instead of replacing it', async () => {
      const lastProps = () => MultiColumnListMock.mock.calls.at(-1)?.[0];

      expect(screen.getByTestId('ItemsList')).toBeInTheDocument();

      await waitFor(() => {
        expect(lastProps().loading).toBe(false);
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
      const lastProps = MultiColumnListMock.mock.calls.at(-1)?.[0];

      expect(lastProps.contentData).toEqual([]);
      expect(lastProps.isEmptyMessage?.props?.id).toBe('ui-lists.mainPane.noResults');
    });
  });

  it('should show no-results message when a Created by filter has no matches', async () => {
    renderListsTablePage('', [`${CREATED_BY_PREFIX}non-matching-user-id`]);

    await waitFor(() => {
      const lastProps = MultiColumnListMock.mock.calls.at(-1)?.[0];

      expect(lastProps.contentData).toEqual([]);
      expect(lastProps.isEmptyMessage?.props?.id).toBe('ui-lists.mainPane.noResultsFilters');
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

describe('ListsTable count/row consistency', () => {
  let server: Server;

  const renderTable = (searchTerm: string, setTotalRecords: (count: number) => void) => render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ListsTable activeFilters={[STATUS_ACTIVE]} searchTerm={searchTerm} setTotalRecords={setTotalRecords} />
      </MemoryRouter>
    </QueryClientProvider>
  );

  beforeEach(() => {
    server = startMirage({});
    queryClient.clear();
  });

  afterEach(() => {
    server.shutdown();
  });

  it('keeps the reported total record count in sync with the rendered rows after clearing a zero-match search', async () => {
    const setTotalRecords = jest.fn();

    const { rerender } = renderTable('no-match-term', setTotalRecords);

    await waitFor(() => {
      expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.contentData).toEqual([]);
    });

    setTotalRecords.mockClear();

    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ListsTable activeFilters={[STATUS_ACTIVE]} searchTerm="" setTotalRecords={setTotalRecords} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.contentData?.length).toBeGreaterThan(0);
    });

    // The count must never be left stuck reporting the stale zero-match value once rows
    // have actually arrived - every call made after rows arrive must report the real total.
    expect(setTotalRecords).toHaveBeenCalledWith(2);
    expect(setTotalRecords).not.toHaveBeenCalledWith(0);
  });
});

describe('ListsTable loading indicator with keepPreviousData', () => {
  let server: Server;

  beforeEach(() => {
    server = startMirage({});
    queryClient.clear();
  });

  afterEach(() => {
    server.shutdown();
  });

  it('shows the loading indicator while refetching, without clearing the previously-rendered rows', async () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ListsTable activeFilters={[STATUS_ACTIVE]} searchTerm="" setTotalRecords={noop} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.contentData?.length).toBeGreaterThan(0);
    });

    MultiColumnListMock.mock.calls.length = 0;

    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ListsTable activeFilters={[STATUS_INACTIVE]} searchTerm="" setTotalRecords={noop} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.contentData).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: 'Inactive Patron Loan' })])
      );
    });

    // At least one render during the transition must show loading=true while still
    // rendering the previous rows (not flashing to an empty table).
    const sawLoadingWithPreviousRows = MultiColumnListMock.mock.calls.some(
      ([props]) => props.loading === true && props.contentData.length > 0
    );

    expect(sawLoadingWithPreviousRows).toBe(true);
  });
});

describe('ListsTable tracked-ids merge', () => {
  let server: Server;

  const activeContent = listsFixture.content.filter((list) => list.isActive);

  beforeEach(() => {
    server = startMirage({});
    queryClient.clear();

    // The tracked-ids poll (useListsIdsToTrack) only ever carries live refresh-status
    // fields for currently-displayed rows; simulate it dropping one tracked id out of its
    // response entirely (e.g. a transient gap) while updating fields on the other.
    server.get('lists', (_schema: unknown, request: any) => {
      const rawIds = request.queryParams.ids;

      if (rawIds) {
        const ids = (Array.isArray(rawIds) ? rawIds[0] : rawIds).split(',');

        return {
          ...listsFixture,
          content: [
            { ...activeContent[0], id: ids[0], isRefreshing: false, recordsCount: 99 },
          ],
          totalRecords: 1,
          numberOfElements: 1,
        };
      }

      return { ...listsFixture, content: activeContent, totalRecords: activeContent.length, numberOfElements: activeContent.length };
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('overlays live fields onto matching rows without adding, removing, or reordering rows', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ListsTable activeFilters={[STATUS_ACTIVE]} searchTerm="" setTotalRecords={noop} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // This chains three sequential async fetches (entity-types, the main list, then the
    // tracked-ids poll once recordIds are seeded). RTL's waitFor polling doesn't reliably
    // give the third, nested fetch's promise chain enough real event-loop turns, so prime
    // it with a real timer tick before polling for the final state.
    await new Promise((resolve) => { setTimeout(resolve, 500); });

    await waitFor(() => {
      const content = MultiColumnListMock.mock.calls.at(-1)?.[0]?.contentData;

      expect(content?.find((row: { id: string }) => row.id === activeContent[0].id)?.recordsCount).toBe(99);
    }, { timeout: 3000 });

    const finalProps = MultiColumnListMock.mock.calls.at(-1)?.[0];

    // Both rows must still be present (the tracked-ids response only carried one of them).
    expect(finalProps.contentData).toHaveLength(2);
    expect(finalProps.contentData.map((row: { id: string }) => row.id)).toEqual(
      activeContent.map((row) => row.id)
    );

    // The row the tracked response didn't mention must keep its own, unmodified fields.
    const untouchedRow = finalProps.contentData.find((row: { id: string }) => row.id === activeContent[1].id);

    expect(untouchedRow.isRefreshing).toBe(activeContent[1].isRefreshing);

    // The row count shown to the user must never be affected by the tracked-ids poll.
    expect(finalProps.totalCount).toBe(activeContent.length);
  });
});
