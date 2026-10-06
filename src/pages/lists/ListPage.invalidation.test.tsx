import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { MultiColumnList } from '@folio/stripes/components';
import { Server } from 'miragejs';
import { ListPage } from './ListPage';
import { startMirage } from '../../../test/mirage';
import { queryClient } from '../../../test/utils';

// Restore the real react-router-dom (the global setup mock stubs useLocation/useHistory
// to no-ops) so filters round-trip through the URL the same way they do in production.
jest.mock('react-router-dom', () => jest.requireActual('react-router-dom'));

const MultiColumnListMock = MultiColumnList as unknown as jest.Mock;

const renderListPage = (initialUrl = '/lists?filters=status.Active') => render(
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={[initialUrl]}>
      <ListPage />
    </MemoryRouter>
  </QueryClientProvider>
);

const pageableDefaults = { sort: { empty: true, sorted: false, unsorted: true }, offset: 0, pageNumber: 0, pageSize: 100, paged: true, unpaged: false };

const buildFixture = (content: Array<Record<string, unknown>>) => ({
  content,
  pageable: pageableDefaults,
  totalRecords: content.length,
  totalPages: content.length ? 1 : 0,
  last: true,
  size: 100,
  number: 0,
  sort: { empty: true, sorted: false, unsorted: true },
  numberOfElements: content.length,
  first: true,
  empty: content.length === 0,
});

const newListFixture = buildFixture([
  { id: 'new-list-id', name: 'Brand New List', entityTypeId: 'x', isActive: true, isPrivate: false },
]);

describe('ListPage lists-collection invalidation', () => {
  let server: Server;

  beforeEach(() => {
    sessionStorage.clear();
    queryClient.clear();
    server = startMirage({});
  });

  afterEach(() => {
    server.shutdown();
  });

  it('shows rows and the count consistently after a mutation invalidates the lists collection and the page remounts', async () => {
    const { unmount } = renderListPage();

    await waitFor(() => {
      expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.totalCount).toBe(2);
    });

    expect(document.body.textContent).toContain('ui-lists.mainPane.subTitle-{"count":2}');

    // Simulate a create/duplicate happening elsewhere while this page was unmounted: the
    // mutation's invalidation marks the cache stale, and the backend now has a new Active list.
    server.get('lists', () => newListFixture);
    await queryClient.invalidateQueries(['lists']);

    unmount();
    renderListPage();

    await waitFor(() => {
      expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.totalCount).toBe(1);
    });

    expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.contentData).toEqual([
      expect.objectContaining({ id: 'new-list-id' }),
    ]);
    expect(document.body.textContent).toContain('ui-lists.mainPane.subTitle-{"count":1}');
  });

  it('drops a list that was switched from Shared to Private after the Shared filter view is invalidated and remounted', async () => {
    const { unmount } = renderListPage('/lists?filters=visibility.Shared');

    await waitFor(() => {
      expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.totalCount).toBe(1);
    });

    expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.contentData).toEqual([
      expect.objectContaining({ name: 'Shared Inactive List' }),
    ]);

    // Simulate editing that list's visibility from Shared to Private elsewhere while this
    // page was unmounted: the edit's invalidation marks the cache stale, and the backend
    // no longer has any Shared list to return for this filter.
    server.get('lists', () => buildFixture([]));
    await queryClient.invalidateQueries(['lists']);

    unmount();
    renderListPage('/lists?filters=visibility.Shared');

    await waitFor(() => {
      expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.totalCount).toBe(0);
    });

    expect(MultiColumnListMock.mock.calls.at(-1)?.[0]?.contentData).toEqual([]);
  });
});
