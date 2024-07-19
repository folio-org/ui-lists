import { screen, waitFor } from '@testing-library/dom';
import user from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';

import { ListsApp } from '.';
import { queryClient } from '../test/utils';
import { HOME_PAGE_URL } from './constants';

const useRecordTypesMock = jest.fn();

jest.mock('./hooks', () => ({
  useRecordTypes: jest.fn(() => useRecordTypesMock()),
}));

const renderApp = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[HOME_PAGE_URL]}>
        <ListsApp match={{ path: '' }} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('Lists app entry point', () => {
  it('is expected to render shortcuts modal', async () => {
    renderApp()

    const shortcutsButton = screen.getByTestId('shortcuts')

    await user.click(shortcutsButton)


    const modal = screen.getByText('KeyboardShortcutsModal')

    expect(modal).toBeTruthy();
  })

  it('should render no entity type permissions message if no entity types are available', async () => {
    useRecordTypesMock.mockReturnValue({ recordTypes: [], isLoading: false });
    renderApp();
    await waitFor(() => {
      expect(
        screen.getByText('ui-lists.missing-all-entity-type-permissions.heading'),
      ).toBeInTheDocument();
    });
  });

  it('should render regular lists app if entity types are available', async () => {
    useRecordTypesMock.mockReturnValue({ recordTypes: [{}], isLoading: false });
    renderApp();
    await waitFor(() => {
      expect(
        screen.queryByText('ui-lists.missing-all-entity-type-permissions.heading'),
      ).not.toBeInTheDocument();
    });
  });

  // this prevents the user from seeing a flash of the missing permissions page before the app renders
  it('should render regular lists app if entity types have not loaded yet', async () => {
    useRecordTypesMock.mockReturnValue({ recordTypes: [], isLoading: true });
    renderApp();
    await waitFor(() => {
      expect(
        screen.queryByText('ui-lists.missing-all-entity-type-permissions.heading'),
      ).not.toBeInTheDocument();
    });
  });
});
