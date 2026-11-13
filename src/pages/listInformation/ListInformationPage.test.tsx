import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { waitFor, screen, within } from '@testing-library/dom';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Response, Server } from 'miragejs';
import * as acq from '@folio/stripes-acq-components';
import { Pane } from '@folio/stripes/components';
import { startMirage } from '../../../test/mirage';
import { ListInformationPage } from './ListInformationPage';
import { queryClient } from '../../../test/utils';
import * as hooks from '../../hooks';
import { CompilingLoader } from '../../components';
import { QUERY_SAVED_LOCATION_STATE } from '../../constants';
import refreshed from '../../../test/data/listDetails.refreshed.json';
import inRefresh from '../../../test/data/listDetails.in-refresh.json';

const historyPushMock = jest.fn();
const historyGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
  useHistory: jest.fn(() => ({ push: historyPushMock, goBack: historyGoBack })),
}));

// The real 10s interval would make any scenario with more than one status check needlessly slow.
jest.mock('../../hooks/useRefresh/constants', () => ({ PULLING_STATUS_DELAY: 50 }));

const renderListInformation = (locationState?: Record<string, unknown>) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[{ pathname: '/', state: locationState }]}>
        <ListInformationPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

let server: Server;

beforeEach(() => {
  queryClient.clear();

  server = startMirage({});
});

afterEach(() => {
  jest.clearAllMocks();
  server.shutdown();
});

const awaitLoading = async () => {
  const loader = screen.queryByText('LoadingPane');
  expect(loader).toBeInTheDocument();

  await waitFor(() => expect(loader).not.toBeInTheDocument());
};

describe('ListInformationPage Page', () => {
  describe('interactions', () => {
    describe('Close pane', () => {
      it('is expected to call history push', async () => {
        await renderListInformation();

        await awaitLoading();

        const closeButton = screen.getByLabelText('Close button', { selector: 'button' });

        await user.click(closeButton);

        expect(historyPushMock).toBeCalled();
      });
    });

    describe('error', () => {
      describe('when we receive error for loading details', () => {
        it('is expected to render error component', async () => {
          server.get('lists/:listId', () => new Response(404, {}, {
            code: 'error.code'
          }));
          await renderListInformation();

          await awaitLoading();

          const errorComponent = screen.getByText('ui-lists.error-component.error.code');

          expect(errorComponent).toBeInTheDocument();
        });
      });
    });

    describe('Delete list', () => {
      describe('When user try to delete list button in dropdown', () => {
        describe('And user clicks on confirm button in modal', () => {
          it('is expected to delete list and redirects to home page if delete was successful', async () => {
            const showSuccessMessageMock = jest.fn();

            jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
              showSuccessMessage: showSuccessMessageMock,
              showErrorMessage: jest.fn(),
              showInfoMessage: jest.fn(),
              showWarningMessage: jest.fn(),
              showMessage: jest.fn()
            }));


            await renderListInformation();

            await awaitLoading();

            const deleteList = screen.getByRole('menuitem', {
              name: /ui-lists.pane.dropdown.delete/i
            });

            await user.click(deleteList);

            const conformationModal = screen.getByTestId('ConfirmationModal');

            const conformationDeleteButton = within(conformationModal).getByRole('button', {
              name: /ui-lists.list.modal.delete/i
            });

            await user.click(conformationDeleteButton);

            await waitFor(() => expect(historyPushMock).toBeCalledWith({ pathname: '/lists', search: '' }));

            const successMessage = JSON.stringify(showSuccessMessageMock.mock.lastCall);
            expect(successMessage).toContain('ui-lists.callout.list.delete.success');
          });

          it('is expected to show error message when delete was failed', async () => {
            server.delete('lists/:id', () => new Response(404, {}, {
              code: 'failed.delete.code'
            }));

            const showErrorMessageMock = jest.fn();

            jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
              showSuccessMessage: jest.fn(),
              showErrorMessage: showErrorMessageMock,
              showInfoMessage: jest.fn(),
              showWarningMessage: jest.fn(),
              showMessage: jest.fn()
            }));

            await renderListInformation();

            await awaitLoading();

            const deleteList = screen.getByRole('menuitem', {
              name: /ui-lists.pane.dropdown.delete/i
            });

            await user.click(deleteList);

            const conformationModal = screen.getByTestId('ConfirmationModal');

            const conformationDeleteButton = within(conformationModal).getByRole('button', {
              name: /ui-lists.list.modal.delete/i
            });

            await user.click(conformationDeleteButton);

            await waitFor(() => expect(historyPushMock).not.toBeCalled());
            await waitFor(() => expect(showErrorMessageMock).toBeCalled());

            const errorMessage = JSON.stringify(showErrorMessageMock.mock.lastCall);

            expect(errorMessage).toContain('ui-lists.failed.delete.code');
          });
        });

        describe('And user clicks on cancel button in modal', () => {
          it('is expected to close modal and do nothing', async () => {
            await renderListInformation();

            await awaitLoading();

            const deleteList = screen.getByRole('menuitem', {
              name: /ui-lists.pane.dropdown.delete/i
            });

            await user.click(deleteList);

            const conformationModal = screen.getByTestId('ConfirmationModal');

            const cancelDeleteButton = within(conformationModal).getByRole('button', {
              name: /cancel/i
            });

            await user.click(cancelDeleteButton);

            expect(conformationModal).not.toBeInTheDocument();

            await waitFor(() => expect(historyPushMock).not.toBeCalled());
          });
        });
      });
    });

    describe('Edit list', () => {
      describe('When user click on edit list button in dropdown', () => {
        it('is expected to redirect to edit page', async () => {
          await renderListInformation();

          await awaitLoading();

          const editList = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.edit/i
          });

          await user.click(editList);

          await waitFor(() => expect(historyPushMock).toBeCalledWith({ pathname: 'id/edit', search: '' }));
        });
      });
    });

    describe('Export list', () => {
      describe('Cancel export', () => {
        describe('When user cancel export', () => {
          it('is expected to show success cancel message', async () => {
            server.shutdown();
            server = startMirage({});
            await renderListInformation();

            await awaitLoading();

            const showMessageMock = jest.fn();

            jest.spyOn(acq, 'useShowCallout').mockImplementation(() => showMessageMock);

            const exportButton = screen.getByRole('menuitem', {
              name: /ui-lists.pane.dropdown.export-visible/i
            });

            expect(exportButton).toBeEnabled();

            await user.click(exportButton);

            await waitFor(() => expect(exportButton).not.toBeInTheDocument());

            const cancelExportButton = screen.getByRole('menuitem', {
              name: /ui-lists.pane.dropdown.cancel-export/i
            });

            await user.click(cancelExportButton);

            await waitFor(() => expect(showMessageMock).toBeCalled());


            const successMessage = JSON.stringify(showMessageMock.mock.lastCall);
            expect(successMessage).toContain('ui-lists.callout.list.csv-export.cancel');
          });

          it('is expected to show error cancel message', async () => {
            await renderListInformation();

            await awaitLoading();

            const showMessageMock = jest.fn();

            server.post('lists/:listId/exports/:exportId/cancel', () => new Response(404, {}, {
              code: 'some.error'
            }));

            jest.spyOn(acq, 'useShowCallout').mockImplementation(() => showMessageMock);

            const exportButton = screen.getByRole('menuitem', {
              name: /ui-lists.pane.dropdown.export-visible/i
            });

            expect(exportButton).toBeEnabled();

            await user.click(exportButton);

            await waitFor(() => expect(exportButton).not.toBeInTheDocument());

            const cancelExportButton = screen.getByRole('menuitem', {
              name: /ui-lists.pane.dropdown.cancel-export/i
            });

            await user.click(cancelExportButton);

            await waitFor(() => expect(showMessageMock).toBeCalled());


            const errorMessage = JSON.stringify(showMessageMock.mock.lastCall);
            expect(errorMessage).toContain('ui-lists.some.error');
          });
        });
      });
    });

    describe('Refresh list', () => {
      describe('When user starts refresh', () => {
        it('it is expected to replace refresh button with cancel refresh', async () => {
          await renderListInformation();

          await awaitLoading();

          const refreshButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.refresh/i
          });

          expect(refreshButton).toBeEnabled();

          await user.click(refreshButton);

          await waitFor(() => expect(refreshButton).not.toBeInTheDocument());

          const cancelRefreshButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.cancel-refresh/i
          });

          expect(cancelRefreshButton).toBeInTheDocument();
        });
      });

      describe('When refresh cancel success', () => {
        it('it is expected to show success cancel message', async () => {
          const showSuccessMessageMock = jest.fn();

          jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
            showSuccessMessage: showSuccessMessageMock,
            showErrorMessage: jest.fn(),
            showInfoMessage: jest.fn(),
            showWarningMessage: jest.fn(),
            showMessage: jest.fn()
          }));

          await renderListInformation();

          await awaitLoading();

          const showMessageMock = jest.fn();
          jest.spyOn(acq, 'useShowCallout').mockImplementation(() => showMessageMock);

          const refreshButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.refresh/i
          });

          expect(refreshButton).toBeEnabled();

          await user.click(refreshButton);

          await waitFor(() => expect(refreshButton).not.toBeInTheDocument());

          const cancelRefreshButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.cancel-refresh/i
          });

          await user.click(cancelRefreshButton);

          await waitFor(() => expect(showSuccessMessageMock).toBeCalled());

          const successMessage = JSON.stringify(showSuccessMessageMock.mock.lastCall);
          expect(successMessage).toContain('ui-lists.cancel-refresh.success');
        });
      });

      describe('When refresh cancel failed', () => {
        it('it is expected to show error cancel message', async () => {
          await renderListInformation();

          await awaitLoading();

          const showErrorMessageMock = jest.fn();

          jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
            showSuccessMessage: jest.fn(),
            showErrorMessage: showErrorMessageMock,
            showInfoMessage: jest.fn(),
            showWarningMessage: jest.fn(),
            showMessage: jest.fn()
          }));

          server.delete('lists/:listId/refresh', () => new Response(404, {}, {
            code: 'cancel.error.code'
          }));

          const refreshButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.refresh/i
          });

          expect(refreshButton).toBeEnabled();

          await user.click(refreshButton);

          await waitFor(() => expect(refreshButton).not.toBeInTheDocument());

          const cancelRefreshButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.cancel-refresh/i
          });

          await user.click(cancelRefreshButton);

          await waitFor(() => expect(showErrorMessageMock).toBeCalled());

          const errorMessage = JSON.stringify(showErrorMessageMock.mock.lastCall);
          expect(errorMessage).toContain('ui-lists.cancel.error.code');
        });
      });
    });
  });

  describe('when a list refresh is running while the page is open', () => {
    const OLD_COUNT = 150;
    const NEW_COUNT = 200;
    const newRefresh = inRefresh.inProgressRefresh;

    // The backend keeps reporting the previous snapshot until the running refresh completes.
    const refreshRunningDetails = {
      ...refreshed,
      successRefresh: { ...refreshed.successRefresh, id: 'old-refresh', recordsCount: OLD_COUNT },
      inProgressRefresh: newRefresh,
    };
    const refreshFinishedDetails = {
      ...refreshed,
      successRefresh: { ...refreshed.successRefresh, id: newRefresh.id, recordsCount: NEW_COUNT },
    };

    // Every distinct pane subtitle the user was shown, in order: 'loader' or the record count.
    const shownSubtitles = () => (Pane as jest.Mock).mock.calls
      .map(([props]) => props?.paneSub)
      .filter(Boolean)
      .map((paneSub) => (paneSub.type === CompilingLoader ? 'loader' : paneSub.props.values.count))
      .filter((subtitle, index, all) => index === 0 || subtitle !== all[index - 1]);

    // The Pane mock does not render `subheader`, so read what the page hands to it: the refresh banner is on
    // exactly when the sub header has banners to display (there is no cross tenant warning in these scenarios).
    const isRefreshBannerOffered = () => Boolean(
      (Pane as jest.Mock).mock.lastCall?.[0].subheader?.props.hasBannersToDisplay
    );

    // Serves the given details one per request, repeating the last one.
    const respondWithDetails = (...states: Record<string, unknown>[]) => {
      let requestsServed = 0;

      server.get('lists/:id', () => {
        const state = states[Math.min(requestsServed, states.length - 1)];

        requestsServed += 1;

        return new Response(200, {}, state);
      });
    };

    beforeEach(() => {
      (Pane as jest.Mock).mockClear();
    });

    describe('and the page was opened right after the list query was saved', () => {
      // ConfigureQuery sets this when it navigates to the list after saving the query.
      const openedAfterQuerySave = QUERY_SAVED_LOCATION_STATE;

      describe('and the new query finishes by the time of the first status check', () => {
        it('is expected to show "Query in progress" and then the new count, never the old one', async () => {
          respondWithDetails(refreshRunningDetails, refreshFinishedDetails);

          await renderListInformation(openedAfterQuerySave);

          await waitFor(() => expect(shownSubtitles()).toContain(NEW_COUNT), { timeout: 2000 });

          expect(shownSubtitles()).toEqual(['loader', NEW_COUNT]);
        });

        it('is expected not to ask the user to click "View updated list"', async () => {
          respondWithDetails(refreshRunningDetails, refreshFinishedDetails);

          await renderListInformation(openedAfterQuerySave);

          await waitFor(() => expect(shownSubtitles()).toContain(NEW_COUNT), { timeout: 2000 });

          expect(isRefreshBannerOffered()).toBe(false);
        });
      });

      describe('and the new query is still running at the first status check', () => {
        it('is expected to keep showing "Query in progress" until it finishes, then the new count', async () => {
          respondWithDetails(refreshRunningDetails, refreshRunningDetails, refreshRunningDetails, refreshFinishedDetails);

          await renderListInformation(openedAfterQuerySave);

          await waitFor(() => expect(shownSubtitles()).toContain(NEW_COUNT), { timeout: 2000 });

          expect(shownSubtitles()).toEqual(['loader', NEW_COUNT]);
        });
      });

      describe('and the user starts a refresh afterwards', () => {
        it('is expected to offer "View updated list" for it as usual', async () => {
          const manualRefreshId = 'manual-refresh';
          const manualRefreshFinishedDetails = {
            ...refreshed,
            successRefresh: { ...refreshed.successRefresh, id: manualRefreshId, recordsCount: NEW_COUNT + 1 },
          };

          server.post('lists/:listId/refresh', () => new Response(200, {}, { id: manualRefreshId }));
          respondWithDetails(refreshRunningDetails, refreshFinishedDetails, manualRefreshFinishedDetails);

          await renderListInformation(openedAfterQuerySave);
          await waitFor(() => expect(shownSubtitles()).toContain(NEW_COUNT), { timeout: 2000 });

          await user.click(screen.getByRole('menuitem', { name: /ui-lists.pane.dropdown.refresh/i }));

          await waitFor(() => expect(isRefreshBannerOffered()).toBe(true), { timeout: 2000 });
        });
      });
    });

    describe('and the page was not opened from a query save', () => {
      it('is expected to keep the previous snapshot and offer "View updated list" once it finishes', async () => {
        respondWithDetails(refreshRunningDetails, refreshFinishedDetails);

        await renderListInformation();

        await waitFor(() => expect(isRefreshBannerOffered()).toBe(true), { timeout: 2000 });

        expect(shownSubtitles()).toEqual(['loader', OLD_COUNT]);
      });
    });
  });
});

