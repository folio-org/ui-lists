import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
// @ts-ignore
import { runAxeTest } from "@folio/stripes-testing";
import { screen, waitFor, within } from '@testing-library/dom';
import user from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { startMirage } from '../../../test/mirage';
import { CreateListPage } from './CreateListPage';
import { queryClient } from '../../../test/utils';

const historyPushMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
  useHistory: jest.fn(() => ({ push: historyPushMock })),
}));

const renderCreateListPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CreateListPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

let server: any;

beforeEach(async () => {
  jest.clearAllMocks();
  server = startMirage({});
});

afterEach(() => {
  queryClient.clear();
  server.shutdown();
});

const awaitLoading = async () => {
  const loader = screen.getByText('LoadingPane');

  expect(loader).toBeInTheDocument();

  await waitFor(() => {
    return expect(loader).not.toBeInTheDocument();
  });
};

describe('CreateList Page', () => {
  describe('Render controls', () => {
    describe('buttons cancel', () => {
      it('is expected to contain cancel button ', async () => {
        await renderCreateListPage();

        await awaitLoading();

        const cancelButton = screen.getByRole('button', {
          name: 'ui-lists.button.cancel'
        });

        expect(cancelButton).toBeInTheDocument();
      });
    });

    it('should render with no axe errors', async () => {
      await renderCreateListPage();

      await awaitLoading();

      await runAxeTest({
        rootNode: document.body,
      });
    });

    describe('buttons save', () => {
      it('is expected to contain cancel button ', async () => {
        await renderCreateListPage();

        await awaitLoading();

        const cancelButton = screen.getByRole('button', {
          name: 'ui-lists.button.save'
        });

        expect(cancelButton).toBeInTheDocument();
      });
    });

    describe('buttons close', () => {
      it('is expected to contain close button ', async () => {
        await renderCreateListPage();

        await awaitLoading();

        const closeButton = screen.getByLabelText('Close button', { selector: 'button' });

        expect(closeButton).toBeInTheDocument();
      });
    });
  });

  describe('interactions', () => {
    describe('Close pane', () => {
      it('is expected to call history push', async () => {
        await renderCreateListPage();

        await awaitLoading();

        const closeButton = screen.getByLabelText('Close button', { selector: 'button' });

        await user.click(closeButton);

        expect(historyPushMock).toBeCalledWith('/lists');
      });
    });

    describe('Cancel editing', () => {
      describe('Cancel edit without changes', () => {
        it('is expected to call history push', async () => {
          await renderCreateListPage();

          await awaitLoading();

          const cancelButton = screen.getByRole('button', {
            name: 'ui-lists.button.cancel'
          });

          await user.click(cancelButton);

          expect(historyPushMock).toBeCalledWith('/lists');
        });
      });

      describe('Cancel edit with changes', () => {
        describe('Confirm cancel', () => {
          it('is expected to call history push', async () => {
            await renderCreateListPage();

            await awaitLoading();

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
              await renderCreateListPage();

              await awaitLoading();

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

      describe('Disable/Enable save button', () => {
        describe('When user dont made any changes', () => {
          it('it is expected to keep save button disabled', async () => {
            await renderCreateListPage();

            await awaitLoading();

            const saveButton = screen.getByRole('button', {
              name: 'ui-lists.button.save'
            });


            expect(saveButton).toBeDisabled();
          });
        });

        describe('When user made changes', () => {
          it('it is expected to enable save button', async () => {
            await renderCreateListPage();

            await awaitLoading();

            const saveButton = screen.getByRole('button', {
              name: 'ui-lists.button.save'
            });
            const nameField = screen.getByLabelText('ui-lists.create-list.main.list-name', {
              selector: 'input'
            });
            const select = screen.getByRole('combobox');

            await user.selectOptions(select, 'Users');
            await user.type(nameField, ' some text');

            expect(saveButton).toBeEnabled();
          });
        });
      });
    });
  });
});
