import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { screen, waitFor } from '@testing-library/dom';
import user from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { startMirage } from '../../../test/mirage';
import { CopyListPage } from './CopyListPage';
import { queryClient } from '../../../test/utils';

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
  });
});
