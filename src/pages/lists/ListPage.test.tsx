import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
// @ts-ignore
import { runAxeTest } from '@folio/stripes-testing';
import { waitFor, screen, fireEvent, within } from '@testing-library/dom';
import { act, render } from '@testing-library/react';
import { IfPermission, useStripes } from '@folio/stripes/core';
import { Accordion } from '@folio/stripes/components';

import { ListPage } from './ListPage';
import { startMirage } from '../../../test/mirage';
import { HOME_PAGE_URL } from '../../constants';
import { queryClient } from '../../../test/utils';
import { ListsTable } from '../../components/ListsTable';
import { getStatusButtonElem } from '../../utils';
import { SHORTCUTS_NAMES } from '../../keyboard-shortcuts';

const mockHistory = {
  push: jest.fn(),
  location: {
    search: ''
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(() => mockHistory)
}));

jest.mock('../../components/ListsTable', () => ({
  ListsTable: jest.fn(() => (
    <div data-testid="ListTable" />
  ))
}));

jest.mock('../../components/HasCommandWrapper', () => ({
  HasCommandWrapper: ({ children, commands }: {
    children: React.ReactNode,
    commands: { name: string, handler: (event: KeyboardEvent) => void }[]
  }) => React.createElement(
    React.Fragment,
    null,
    commands.map((command) => React.createElement(
      'button',
      {
        key: command.name,
        type: 'button',
        onClick: () => command.handler({ preventDefault: jest.fn() } as unknown as KeyboardEvent),
      },
      command.name
    )),
    children
  )
}));

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getStatusButtonElem: jest.fn(),
}));

// Importing the real `@folio/stripes-acq-components` package currently throws: it pulls
// in a hooks barrel that in turn needs a `countries` export that this install's
// `stripes-components` doesn't have yet (see UILISTS-252). Stubbing
// the whole module here; `SingleSearchForm` gets a lightweight stand-in that preserves the
// accessible roles/labels/disabled-state behavior these tests exercise.
jest.mock('@folio/stripes-acq-components', () => {
  const SingleSearchForm = ({ ariaLabelId, applySearch, changeSearch, searchQuery }: {
    ariaLabelId: string,
    applySearch: () => void,
    changeSearch: (event: { target: { value: string } }) => void,
    searchQuery: string
  }) => React.createElement(
    'form',
    { onSubmit: (e: React.FormEvent) => { e.preventDefault(); applySearch(); } },
    React.createElement('input', {
      type: 'search',
      'aria-label': ariaLabelId,
      value: searchQuery,
      onChange: changeSearch,
    }),
    React.createElement('button', {
      type: 'button',
      'aria-label': 'clear search',
      onClick: () => changeSearch({ target: { value: '' } }),
    }),
    React.createElement('button', { type: 'submit', disabled: !searchQuery }, 'stripes-acq-components.search'),
  );

  return {
    SingleSearchForm,
    useShowCallout: () => jest.fn(),
  };
});


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
    mockHistory.location.search = '';
    (useStripes as jest.Mock).mockImplementation(() => ({ hasPerm: jest.fn().mockReturnValue(true) }));
  });


  it('should render multiColumnList ', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('ListTable')).toBeInTheDocument();
    });
  });

  it('should render Created by and Updated by facets', async () => {
    await waitFor(() => {
      expect(document.getElementById('created-by-filter')).toBeInTheDocument();
      expect(document.getElementById('updated-by-filter')).toBeInTheDocument();
    });
  });

  it('should render Created by and Updated by facets collapsed by default', async () => {
    await waitFor(() => {
      expect(document.getElementById('created-by-filter')).not.toHaveAttribute('open');
      expect(document.getElementById('updated-by-filter')).not.toHaveAttribute('open');
    });
  });

  it('should collapse Created by and Updated by facets when Reset all is clicked', async () => {
    const searchInput = await screen.findByRole('searchbox', { name: 'ui-lists.lists.searchInputLabel' });
    const createdByFilter = document.getElementById('created-by-filter') as HTMLElement;
    const updatedByFilter = document.getElementById('updated-by-filter') as HTMLElement;

    const toggleAccordion = (id: string) => {
      const { calls } = (Accordion as unknown as jest.Mock).mock;
      const [props] = calls.filter(([accordionProps]) => accordionProps?.id === id).pop();

      act(() => props.onToggle());
    };

    toggleAccordion('created-by-filter');
    toggleAccordion('updated-by-filter');

    await waitFor(() => {
      expect(createdByFilter).toHaveAttribute('open');
      expect(updatedByFilter).toHaveAttribute('open');
    });

    // Reset all is enabled once there is something to reset
    fireEvent.change(searchInput, { target: { value: 'missing' } });
    fireEvent.click(screen.getByRole('button', { name: 'stripes-smart-components.resetAll' }));

    await waitFor(() => {
      expect(createdByFilter).not.toHaveAttribute('open');
      expect(updatedByFilter).not.toHaveAttribute('open');
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

  it('should navigate to the new list page when the create shortcut is triggered and user has permission', async () => {
    const pushCallsBefore = mockHistory.push.mock.calls.length;

    fireEvent.click(await screen.findByRole('button', { name: SHORTCUTS_NAMES.NEW }));

    await waitFor(() => {
      expect(mockHistory.push.mock.calls.length).toBe(pushCallsBefore + 1);
    });
    expect(mockHistory.push).toHaveBeenLastCalledWith('/lists/new');
  });

  it('should not navigate when the create shortcut is triggered and user has no permission', async () => {
    (useStripes as jest.Mock).mockReturnValue({ hasPerm: jest.fn().mockReturnValue(false) });

    const { container } = renderLists();
    const pushCallsBefore = mockHistory.push.mock.calls.length;

    fireEvent.click(await within(container).findByRole('button', { name: SHORTCUTS_NAMES.NEW }));

    await waitFor(() => {
      expect(mockHistory.push.mock.calls.length).toBe(pushCallsBefore);
    });
  });

  it('should focus the status button when the go to filter shortcut is triggered', async () => {
    const focus = jest.fn();

    (getStatusButtonElem as jest.Mock).mockReturnValue({ focus });

    fireEvent.click(await screen.findByRole('button', { name: SHORTCUTS_NAMES.GO_TO_FILTER }));

    await waitFor(() => {
      expect(focus).toHaveBeenCalled();
    });
  });

  it('should trim the search term when the search is submitted', async () => {
    const searchInput = await screen.findByRole('searchbox', { name: 'ui-lists.lists.searchInputLabel' });

    fireEvent.change(searchInput, { target: { value: '  missing  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'stripes-acq-components.search' }));

    await waitFor(() => {
      const { calls } = (ListsTable as unknown as jest.Mock).mock;
      const [props] = calls[calls.length - 1];

      expect(props.searchTerm).toBe('missing');
    });
  });

  it('should clear the created-by filter when its Clean button is clicked', async () => {
    mockHistory.location.search = '?filters=created_by.11111111-1111-1111-1111-111111111111';

    const { container } = renderLists();

    const createdByFilter = await waitFor(() => container.querySelector('#created-by-filter') as HTMLElement);
    const cleanButton = await within(createdByFilter).findByRole('button', { name: 'Clean' });

    fireEvent.click(cleanButton);

    await waitFor(() => {
      const [pushedUrl] = mockHistory.push.mock.calls[mockHistory.push.mock.calls.length - 1];

      expect(pushedUrl).toContain('filters=');
      expect(pushedUrl).not.toContain('created_by.');
    });
  });

  it('should clear the updated-by filter when its Clean button is clicked', async () => {
    mockHistory.location.search = '?filters=updated_by.22222222-2222-2222-2222-222222222222';

    const { container } = renderLists();

    const updatedByFilter = await waitFor(() => container.querySelector('#updated-by-filter') as HTMLElement);
    const cleanButton = await within(updatedByFilter).findByRole('button', { name: 'Clean' });

    fireEvent.click(cleanButton);

    await waitFor(() => {
      const [pushedUrl] = mockHistory.push.mock.calls[mockHistory.push.mock.calls.length - 1];

      expect(pushedUrl).toContain('filters=');
      expect(pushedUrl).not.toContain('updated_by.');
    });
  });
});
