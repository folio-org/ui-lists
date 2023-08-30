import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { screen, waitFor, within } from '@testing-library/dom';
import user from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { Response, Server } from 'miragejs';
import { startMirage } from '../../../test/mirage';
import { EditListPage } from './EditListPage';
import { queryClient } from '../../../test/utils';
import * as hooks from '../../hooks';
import listDetailsRefreshed from '../../../test/data/listDetails.refreshed.json';

const historyPushMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
  useHistory: jest.fn(() => ({ push: historyPushMock })),
}));

const renderEditListPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <EditListPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

let server: Server;

beforeEach(async () => {
  jest.clearAllMocks();
  server = startMirage({});

  await renderEditListPage();
});

afterEach(() => {
  server.shutdown();
});

describe('EditList Page', () => {
  describe('Loading', () => {
    describe('When components mounted', () => {
      it('it is expected to show loader', () => {
        const loader = screen.getByText('Loading');

        expect(loader).toBeInTheDocument();
      });
    });

    describe('When loading finished mounted', () => {
      it('it is expected to hide loader', async () => {
        const loader = screen.getByText('Loading');

        await waitFor(() => {
          return expect(loader).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('Render controls', () => {
    describe('buttons cancel', () => {
      it('is expected to contain cancel button ', () => {
        const cancelButton = screen.getByRole('button', {
          name: 'ui-lists.button.cancel'
        });

        expect(cancelButton).toBeInTheDocument();
      });
    });

    describe('buttons save', () => {
      it('is expected to contain cancel button ', () => {
        const cancelButton = screen.getByRole('button', {
          name: 'ui-lists.button.save'
        });

        expect(cancelButton).toBeInTheDocument();
      });
    });

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

        await user.click(closeButton);

        expect(historyPushMock).toBeCalledWith('/lists/list/id');
      });
    });

    describe('Cancel editing', () => {
      describe('Cancel edit without changes', () => {
        it('is expected to call history push', async () => {
          const cancelButton = screen.getByRole('button', {
            name: 'ui-lists.button.cancel'
          });

          await user.click(cancelButton);

          expect(historyPushMock).toBeCalledWith('/lists/list/id');
        });
      });

      describe('Cancel edit with changes', () => {
        describe('Confirm cancel', () => {
          it('is expected to call history push', async () => {
            const cancelButton = screen.getByRole('button', {
              name: 'ui-lists.button.cancel'
            });

            const nameField = screen.getByLabelText('ui-lists.create-list.main.list-name', {
              selector: 'input'
            });

            await user.type(nameField, ' some text');

            await user.click(cancelButton);

            const conformationModal = screen.getByTestId('ConfirmationModal');

            // We show conformation modal
            expect(conformationModal).toBeInTheDocument();

            const conformationCancelButton = within(conformationModal).getByRole('button', {
              name: /ui-lists.list.modal.cancel-edit/i
            });

            // We want to proceed with cancel
            await user.click(conformationCancelButton);

            expect(conformationModal).not.toBeInTheDocument();

            expect(historyPushMock).toBeCalled();
          });

          describe('Cancel cancel', () => {
            it('is expected to not history push', async () => {
              const cancelButton = screen.getByRole('button', {
                name: 'ui-lists.button.cancel'
              });

              const nameField = screen.getByLabelText('ui-lists.create-list.main.list-name', {
                selector: 'input'
              });

              await user.type(nameField, ' some text');

              await user.click(cancelButton);

              const conformationModal = screen.getByTestId('ConfirmationModal');

              // We show conformation modal
              expect(conformationModal).toBeInTheDocument();

              const conformationCancelButton = within(conformationModal).getByRole('button', {
                name: /ui-lists.list.modal.keep-edit/i
              });

              // We want to proceed with cancel
              await user.click(conformationCancelButton);

              expect(conformationModal).not.toBeInTheDocument();

              expect(historyPushMock).not.toBeCalled();
            });
          });
        });
      });
    });

    describe('Delete list', () => {
      describe('Success delete', () => {
        it('is expected to redirect after successful deletion and call success message', async () => {
          const showSuccessMessageHookMock = jest.fn();

          jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
            showSuccessMessage: showSuccessMessageHookMock,
            showErrorMessage: jest.fn(),
            showInfoMessage: jest.fn(),
            showWarningMessage: jest.fn(),
            showMessage: jest.fn()
          }));

          const deleteButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.delete/i
          });

          await user.click(deleteButton);

          const conformationModal = screen.getByTestId('ConfirmationModal');

          const confirmButton = within(conformationModal).getByRole('button', {
            name: /ui-lists.list.modal.delete/i
          });

          await user.click(confirmButton);

          await waitFor(() => expect(deleteButton).toBeDisabled());

          expect(conformationModal).not.toBeInTheDocument();

          await waitFor(() => expect(historyPushMock).toBeCalledWith('/lists'));
          expect(showSuccessMessageHookMock).toBeCalled();
        });
      });
      describe('Failure delete', () => {
        it('is expected to show error message', async () => {
          server.delete('lists/:id', () => new Response(404));

          const showErrorMessageMock = jest.fn();

          jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
            showSuccessMessage: jest.fn(),
            showErrorMessage: showErrorMessageMock,
            showInfoMessage: jest.fn(),
            showWarningMessage: jest.fn(),
            showMessage: jest.fn()
          }));

          const deleteButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.delete/i
          });

          await user.click(deleteButton);

          const conformationModal = screen.getByTestId('ConfirmationModal');

          const confirmButton = within(conformationModal).getByRole('button', {
            name: /ui-lists.list.modal.delete/i
          });

          await user.click(confirmButton);

          await waitFor(() => expect(deleteButton).toBeDisabled());

          expect(conformationModal).not.toBeInTheDocument();

          await waitFor(() => expect(showErrorMessageMock).toBeCalled());
        });
      });
      describe('Cancel delete', () => {
        it('is expected to show error message', async () => {
          const deleteButton = screen.getByRole('menuitem', {
            name: /ui-lists.pane.dropdown.delete/i
          });

          await user.click(deleteButton);

          const conformationModal = screen.getByTestId('ConfirmationModal');

          const confirmButton = within(conformationModal).getByRole('button', {
            name: /cancel/i
          });

          await user.click(confirmButton);

          expect(conformationModal).not.toBeInTheDocument();
        });
      });
    });

    describe('Edit and save', () => {
      describe('Success save', () => {
        it('is expected to redirect after successful deletion and call success message', async () => {
          const showSuccessMessageHookMock = jest.fn();
          const updatedListObject = { ...listDetailsRefreshed, version: listDetailsRefreshed.version + 1 };

          server.put('lists/:id', () => new Response(200, {}, updatedListObject));
          jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
            showSuccessMessage: showSuccessMessageHookMock,
            showErrorMessage: jest.fn(),
            showInfoMessage: jest.fn(),
            showWarningMessage: jest.fn(),
            showMessage: jest.fn()
          }));

          const saveButton = screen.getByRole('button', {
            name: 'ui-lists.button.save'
          });

          const nameField = screen.getByLabelText('ui-lists.create-list.main.list-name', {
            selector: 'input'
          });

          expect(saveButton).toBeDisabled();

          await user.type(nameField, ' name');

          expect(saveButton).toBeEnabled();

          await user.click(saveButton);

          await waitFor(() => expect(saveButton).toBeDisabled());

          await waitFor(() => expect(historyPushMock).toBeCalledWith('/lists/list/id'));

          const successMessage = JSON.stringify(showSuccessMessageHookMock.mock.lastCall);
          expect(successMessage).toContain('ui-lists.callout.list.save.success');
        });
      });

      describe('Success save and become inactive', () => {
        it('is expected to redirect after successful deletion and call success message', async () => {
          const showSuccessMessageHookMock = jest.fn();
          const updatedListObject = { ...listDetailsRefreshed, version: listDetailsRefreshed.version + 1 };

          server.put('lists/:id', () => new Response(200, {}, updatedListObject));
          jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
            showSuccessMessage: showSuccessMessageHookMock,
            showErrorMessage: jest.fn(),
            showInfoMessage: jest.fn(),
            showWarningMessage: jest.fn(),
            showMessage: jest.fn()
          }));

          const saveButton = screen.getByRole('button', {
            name: 'ui-lists.button.save'
          });

          const activeStatusRadioButton = screen.getByLabelText('active');

          await user.click(activeStatusRadioButton);

          expect(saveButton).toBeEnabled();

          await user.click(saveButton);

          await waitFor(() => expect(saveButton).toBeDisabled());

          await waitFor(() => expect(historyPushMock).toBeCalledWith('/lists/list/id'));

          const successMessage = JSON.stringify(showSuccessMessageHookMock.mock.lastCall);
          expect(successMessage).toContain('ui-lists.callout.list.active');
        });
      });

      describe('Fail save', () => {
        it('is expected to redirect after successful deletion and call success message', async () => {
          const showErrorMessageMock = jest.fn();

          server.put('lists/:id', () => new Response(404, {}, { code: 'error_code' }));

          jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
            showSuccessMessage: jest.fn(),
            showErrorMessage: showErrorMessageMock,
            showInfoMessage: jest.fn(),
            showWarningMessage: jest.fn(),
            showMessage: jest.fn()
          }));

          const saveButton = screen.getByRole('button', {
            name: 'ui-lists.button.save'
          });

          const nameField = screen.getByLabelText('ui-lists.create-list.main.list-name', {
            selector: 'input'
          });

          expect(saveButton).toBeDisabled();

          await user.type(nameField, ' name');

          expect(saveButton).toBeEnabled();

          await user.click(saveButton);

          await waitFor(() => expect(saveButton).toBeDisabled());

          await waitFor(() => expect(historyPushMock).not.toBeCalled());

          await waitFor(() => expect(showErrorMessageMock).toBeCalled());
          const errorMessage = JSON.stringify(showErrorMessageMock.mock.lastCall);

          expect(errorMessage).toContain('ui-lists.error_code');
        });
      });

      describe('Fail due changed version', () => {
        it('is expected to show optimistic lock error', async () => {
          const showErrorMessageHookMock = jest.fn();
          const updatedListObject = { ...listDetailsRefreshed, version: listDetailsRefreshed.version + 1 };
          server.get('lists/:id', () => new Response(200, {}, updatedListObject));

          jest.spyOn(hooks, 'useMessages').mockImplementation(() => ({
            showSuccessMessage: jest.fn(),
            showErrorMessage: showErrorMessageHookMock,
            showInfoMessage: jest.fn(),
            showWarningMessage: jest.fn(),
            showMessage: jest.fn()
          }));

          const saveButton = screen.getByRole('button', {
            name: 'ui-lists.button.save'
          });

          const nameField = screen.getByLabelText('ui-lists.create-list.main.list-name', {
            selector: 'input'
          });

          expect(saveButton).toBeDisabled();

          await user.type(nameField, ' name');

          expect(saveButton).toBeEnabled();

          await user.click(saveButton);

          await waitFor(() => expect(saveButton).toBeDisabled());

          await waitFor(() => expect(historyPushMock).not.toBeCalled());

          await waitFor(() => expect(showErrorMessageHookMock).toBeCalled());

          const errorMessage = JSON.stringify(showErrorMessageHookMock.mock.lastCall);
          expect(errorMessage).toContain('ui-lists.update-optimistic.lock.exception');
        });
      });
    });
  });
});
