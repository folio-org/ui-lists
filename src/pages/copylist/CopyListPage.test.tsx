import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
// @ts-ignore
import { runAxeTest } from '@folio/stripes-testing';
import { screen, waitFor } from '@testing-library/dom';
import user from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { Response } from 'miragejs';
import { startMirage } from '../../../test/mirage';
import { CopyListPage } from './CopyListPage';
import { queryClient } from '../../../test/utils';
import listDetailsRefreshed from '../../../test/data/listDetails.Initial.json';
import * as hooks from '../../hooks';

const historyPushMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
  useHistory: jest.fn(() => ({ push: historyPushMock })),
}));

const renderCopyListPage = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CopyListPage />
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
  const loader = screen.getByText('Loading');

  expect(loader).toBeInTheDocument();

  await waitFor(() => {
    return expect(loader).not.toBeInTheDocument();
  });
};

describe('CopyList Page', () => {
  describe('Render controls', () => {
    describe('buttons cancel', () => {
      it('is expected to contain cancel button ', async () => {
        await renderCopyListPage();

        await awaitLoading();

        const cancelButton = screen.getByRole('button', {
          name: 'ui-lists.button.cancel'
        });

        expect(cancelButton).toBeInTheDocument();
      });


      it('should render with no axe errors', async () => {
        await renderCopyListPage();

        await awaitLoading();

        await runAxeTest({
          rootNode: document.body,
        });
      });
    });

    describe('buttons save', () => {
      it('is expected to contain cancel button ', async () => {
        await renderCopyListPage();

        await awaitLoading();

        const cancelButton = screen.getByRole('button', {
          name: 'ui-lists.button.save'
        });

        expect(cancelButton).toBeInTheDocument();
      });
    });


    describe('buttons close', () => {
      it('is expected to contain close button ', async () => {
        await renderCopyListPage();

        await awaitLoading();

        const closeButton = screen.getByLabelText('Close button', { selector: 'button' });

        expect(closeButton).toBeInTheDocument();
      });
    });
  });

  describe('interactions', () => {
    describe('Close pane', () => {
      it('is expected to call history push', async () => {
        await renderCopyListPage();

        await awaitLoading();

        const closeButton = screen.getByLabelText('Close button', { selector: 'button' });

        await user.click(closeButton);

        expect(historyPushMock).toBeCalledWith('/lists/list/id');
      });
    });

    it('should render with no axe errors', async () => {
      await renderCopyListPage();

      await awaitLoading();

      await runAxeTest({
        rootNode: document.body,
      });
    });

    describe('Cancel editing', () => {
      it('is expected to call history push', async () => {
        await renderCopyListPage();

        await awaitLoading();

        const cancelButton = screen.getByRole('button', {
          name: 'ui-lists.button.cancel'
        });

        await user.click(cancelButton);

        expect(historyPushMock).toBeCalledWith('/lists/list/id');
      });
    });
    describe('Disable/Enable save button', () => {
      describe('When user delete name', () => {
        it('it is expected to disable save button', async () => {
          await renderCopyListPage();

          await awaitLoading();

          const saveButton = screen.getByRole('button', {
            name: 'ui-lists.button.save'
          });
          const nameField = screen.getByLabelText('ui-lists.create-list.main.list-name', {
            selector: 'input'
          });

          await user.clear(nameField);

          expect(saveButton).toBeDisabled();
        });
      });
    });

    describe('Save list', () => {
      describe('Success save', () => {
        it('is expected to redirect after successful save and call success message', async () => {
          await renderCopyListPage();

          await awaitLoading();

          const showSuccessMessageHookMock = jest.fn();

          server.post('lists', () => new Response(200, {}, listDetailsRefreshed));
          server.post('lists/:listId/refresh', () => new Response(200, {}, { success: 'true', listId: '123' }));

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

          await user.type(nameField, ' name');

          expect(saveButton).toBeEnabled();

          await user.click(saveButton);

          await waitFor(() => expect(saveButton).toBeDisabled());

          await waitFor(() => expect(historyPushMock).toBeCalledWith('/lists/list/123'));

          const successMessage = JSON.stringify(showSuccessMessageHookMock.mock.lastCall);
          expect(successMessage).toContain('ui-lists.callout.list.save.success');
        });
      });
    });
  });
});
