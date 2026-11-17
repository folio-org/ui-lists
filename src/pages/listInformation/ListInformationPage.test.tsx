import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { waitFor, screen, within } from '@testing-library/dom';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Response, Server } from 'miragejs';
import * as acq from '@folio/stripes-acq-components';
import { Pane } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import { startMirage } from '../../../test/mirage';
import { ListInformationPage } from './ListInformationPage';
import { queryClient } from '../../../test/utils';
import * as hooks from '../../hooks';
import { CompilingLoader } from '../../components';
import listDetailsInRefresh from '../../../test/data/listDetails.in-refresh.json';

const historyPushMock = jest.fn();
const historyGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
  useHistory: jest.fn(() => ({ push: historyPushMock, goBack: historyGoBack })),
}));

const renderListInformation = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
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

        it('it is expected to announce the refresh progress to screen readers', async () => {
          await renderListInformation();

          await awaitLoading();

          // The live region must already be in the DOM before its content changes, otherwise screen readers ignore it
          const statusRegion = screen.getByTestId('refresh-status-announcement');

          // <output> carries an implicit role="status", so it's reachable by role with no explicit attribute
          expect(screen.getByRole('status')).toBe(statusRegion);
          expect(statusRegion.tagName).toBe('OUTPUT');
          expect(statusRegion).toBeEmptyDOMElement();

          await user.click(screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.refresh/i
          }));

          await waitFor(() => expect(statusRegion).toHaveTextContent('ui-lists.refresh.status.in-progress'));
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

    describe('Opened while a refresh is in progress', () => {
      it('is expected to show loading states in every render, never the previous record count', async () => {
        server.get('lists/:id', () => new Response(200, {}, listDetailsInRefresh));

        await renderListInformation();

        await awaitLoading();

        const paneRenders = (Pane as unknown as jest.Mock).mock.calls;
        const pluggableRenders = (Pluggable as unknown as jest.Mock).mock.calls;

        expect(paneRenders.length).toBeGreaterThan(0);
        expect(pluggableRenders.length).toBeGreaterThan(0);

        paneRenders.forEach(([{ paneSub }]) => {
          expect(paneSub.type).toBe(CompilingLoader);
        });
        pluggableRenders.forEach(([{ refreshInProgress }]) => {
          expect(refreshInProgress).toBe(true);
        });
      });
    });
  });
});

