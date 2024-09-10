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
  useMessages: jest.fn(() => ({
    showSuccessMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    showInfoMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showMessage: jest.fn()
  }))
}));

const historyPushMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
  useHistory: jest.fn(() => ({
    push: historyPushMock,
    location: {
      pathname: 'test'
    }
  })),
}));

const mockShowCallout = jest.fn();

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: () => mockShowCallout,
}));

const renderApp = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[HOME_PAGE_URL]}>
        <ListsApp match={{ path: '/new' }} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('Lists app entry point', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('is expected to close shortcuts modal', async () => {
    useRecordTypesMock.mockReturnValue({ recordTypes: [{}], isLoading: false });

    renderApp()

    const shortcutsButton = screen.getByTestId('shortcuts')

    await user.click(shortcutsButton)

    const closeButton = screen.getByRole('button', { name: /close/i })

    await user.click(closeButton)

    expect(closeButton).not.toBeInTheDocument()
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

  it('is expected to clean storage on LOGIN', () => {
    sessionStorage.setItem('@folio/lists/test', '123');
    sessionStorage.setItem('not-lists/test', '123');

    expect(sessionStorage.getItem('@folio/lists/test')).toEqual('123')
    expect(sessionStorage.getItem('not-lists/test')).toEqual('123')

    ListsApp.eventHandler('LOGIN')

    expect(sessionStorage.getItem('@folio/lists/test')).toBeFalsy();
    expect(sessionStorage.getItem('not-lists/test')).toEqual('123')
  })

  it('is expected to call redicrect function', () => {
    const element = document.createElement('DIV');

    jest.spyOn(element, 'focus');

    jest.spyOn(document, 'getElementById').mockReturnValueOnce(null)

    useRecordTypesMock.mockReturnValue({ recordTypes: [], isLoading: true });

    renderApp();

    const home = screen.getByTestId('list-app-home')

    user.click(home)

    expect(historyPushMock).toBeCalledWith('/lists');
  })

  it('is expected to not call push function if element exist', () => {
    useRecordTypesMock.mockReturnValue({ recordTypes: [], isLoading: true });
    const button = document.createElement('BUTTON');
    const element = document.createElement('DIV');

    element.appendChild(button)

    jest.spyOn(button, 'focus');

    jest.spyOn(document, 'getElementById').mockReturnValueOnce(element)

    renderApp();

    const home = screen.getByTestId('list-app-home')

    user.click(home)

    expect(button.focus).toBeCalled();
  })
});
