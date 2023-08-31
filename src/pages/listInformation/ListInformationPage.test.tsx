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

beforeEach(async () => {
  server = startMirage({});

  await renderListInformation();
});

afterEach(() => {
  jest.clearAllMocks();
  server.shutdown();
});

describe('ListInformationPage Page', () => {
  describe('Loading', () => {
    describe('When component mounted it is expected to show loading pane', () => {
      it('should show LoadingPane ', async () => {
        await waitFor(() => {
          expect(screen.queryByText('LoadingPane')).toBeInTheDocument();
        });
      });
    });

    describe('When loading finished', () => {
      it('should hide LoadingPane ', async () => {
        await waitFor(() => {
          expect(screen.queryByText('LoadingPane')).toBeInTheDocument();
        });

        await waitFor(() => {
          expect(screen.queryByText('LoadingPane')).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Render controls', () => {
    describe('buttons close', () => {
      it('is expected to contain close button ', () => {
        const closeButton = screen.getByLabelText('Close button', { selector: 'button' });

        expect(closeButton).toBeInTheDocument();
      });
    });
  });

  describe('interactions', () => {
    describe('Close pane', () => {
      it('is expected to call history push', async () => {
        const closeButton = screen.getByLabelText('Close button', { selector: 'button' });

        screen.logTestingPlaygroundURL();

        await user.click(closeButton);

        expect(historyPushMock).toBeCalled();
      });
    });

    describe('Delete list', () => {
      describe('When user try to delete list button in dropdown', () => {
        describe('And user clicks on confirm button in modal', () => {
          it('is expected to delete list and redirects to home page', async () => {
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
          });
        });

        describe('And user clicks on cancel button in modal', () => {
          it('is expected to close modal and do nothing', async () => {
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
          const editList = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.edit/i
          });

          await user.click(editList);

          await waitFor(() => expect(historyPushMock).toBeCalledWith('id/edit'));
        });
      });
    });

    describe('Export list', () => {
      describe('When user starts export', () => {
        it('it is expected to replace export button with cancel export', async () => {
          const exportButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.export/i
          });

          expect(exportButton).toBeEnabled();

          await user.click(exportButton);

          await waitFor(() => expect(exportButton).not.toBeInTheDocument());

          const cancelExportButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.cancel-export/i
          });

          expect(cancelExportButton).toBeInTheDocument();
        });
      });

      describe('Cancel export', () => {
        describe('When user cancel export', () => {
          it('is expected to show success cancel message', async () => {
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
    });
  });
});

