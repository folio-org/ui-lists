import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { waitFor, screen, within } from '@testing-library/dom';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Response, Server } from 'miragejs';
import * as acq from '@folio/stripes-acq-components';
import { startMirage } from '../../../test/mirage';
import { ListInformationPage } from './ListInformationPage';
import { queryClient } from '../../../test/utils';
import * as hooks from '../../hooks';

const historyPushMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
  useHistory: jest.fn(() => ({ push: historyPushMock })),
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

            await waitFor(() => expect(historyPushMock).toBeCalledWith('/lists'));

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

          await waitFor(() => expect(historyPushMock).toBeCalledWith('id/edit'));
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
              name: /ui-lists.pane.dropdown.export/i
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
              name: /ui-lists.pane.dropdown.export/i
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
});

