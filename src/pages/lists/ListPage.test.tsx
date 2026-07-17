import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
// @ts-ignore
import { runAxeTest } from '@folio/stripes-testing';
import { waitFor, screen, fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { IfPermission } from '@folio/stripes/core';

import { ListPage } from './ListPage';
import { startMirage } from '../../../test/mirage';
import { HOME_PAGE_URL } from '../../constants';
import { queryClient } from '../../../test/utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory:  jest.fn().mockReturnValue({
    push: jest.fn(),
    location: {
      search: ''
    }
  })
}));

jest.mock('../../components/ListsTable', () => ({
  ListsTable: jest.fn(() => (
    <div data-testid="ListTable" />
  ))
}));


const renderLists = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[HOME_PAGE_URL]}>
        <ListPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ListPage Page', () => {
  let server: any;

  beforeEach(async () => {
    server = startMirage({});

    await renderLists();
  });

  afterEach(() => {
    server.shutdown();
  });


  it('should render multiColumnList ', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('ListTable')).toBeInTheDocument();
    });
  });

  it('should render New button when user has permission', async () => {
    // @ts-ignore:next-line
    IfPermission.mockImplementation(({ children }) => children);

    await waitFor(() => {
      expect(screen.queryByText('ui-lists.paneHeader.button.new')).toBeInTheDocument();
    });
  });

  it('should not render New button when user doesn\'t have permission', async () => {
    // @ts-ignore:next-line
    IfPermission.mockImplementation(() => null);

    await waitFor(() => {
      expect(screen.queryByText('ui-lists.paneHeader.button.new')).toBeNull();
    });
  });

  it('should render with no axe errors', async () => {
    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('should keep Search button disabled when search input is empty', async () => {
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'stripes-acq-components.search' })).toBeDisabled();
    });
  });

  it('should enable Search button after entering search text', async () => {
    const searchInput = await screen.findByRole('searchbox', { name: 'ui-lists.lists.searchInputLabel' });

    fireEvent.change(searchInput, { target: { value: 'missing' } });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'stripes-acq-components.search' })).toBeEnabled();
    });
  });

  it('should clear search input and disable Search button when Reset all is clicked', async () => {
    const searchInput = await screen.findByRole('searchbox', { name: 'ui-lists.lists.searchInputLabel' }) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'missing' } });
    fireEvent.click(screen.getByRole('button', { name: 'stripes-smart-components.resetAll' }));

    await waitFor(() => {
      expect(searchInput.value).toBe('');
      expect(screen.getByRole('button', { name: 'stripes-acq-components.search' })).toBeDisabled();
    });
  });

  it('should clear search input when the clear icon inside the search field is clicked', async () => {
    const searchInput = await screen.findByRole('searchbox', { name: 'ui-lists.lists.searchInputLabel' }) as HTMLInputElement;

    fireEvent.change(searchInput, { target: { value: 'missing' } });

    const clearButton = await screen.findByRole('button', { name: 'clear search' });

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(searchInput.value).toBe('');
      expect(screen.getByRole('button', { name: 'stripes-acq-components.search' })).toBeDisabled();
    });
  });
});
