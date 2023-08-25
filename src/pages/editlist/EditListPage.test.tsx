import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { screen, waitFor, within } from '@testing-library/dom';
import user from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { startMirage } from '../../../test/mirage';
import { EditListPage } from './EditListPage';
import { queryClient } from '../../../test/utils';

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

let server: any;

beforeEach(async () => {
  jest.clearAllMocks();
  server = startMirage({});

  await renderEditListPage();
});

afterEach(() => {
  server.shutdown();
});


describe('CreateList Page', () => {
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

            screen.logTestingPlaygroundURL();

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

              screen.logTestingPlaygroundURL();

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

      describe('Disable/Enable save button', () => {
        describe('When user dont made any changes', () => {
          it('it is expected to keep save button disabled', () => {
            const saveButton = screen.getByRole('button', {
              name: 'ui-lists.button.save'
            });


            expect(saveButton).toBeDisabled();
          });
        });

        describe('When user made changes', () => {
          it('it is expected to enable save button', async () => {
            const saveButton = screen.getByRole('button', {
              name: 'ui-lists.button.save'
            });
            const nameField = screen.getByLabelText('ui-lists.create-list.main.list-name', {
              selector: 'input'
            });

            await user.type(nameField, ' some text');

            expect(saveButton).toBeEnabled();
          });
        });
      });
    });
  });
});
