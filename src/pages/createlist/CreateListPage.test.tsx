import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { startMirage } from '../../../test/mirage';
import { CreateListPage } from './CreateListPage';
import { queryClient } from '../../../test/utils';


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'id',
  }),
}));

const renderListInformation = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CreateListPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('CreateList Page', () => {
  let server: any;

  beforeEach(async () => {
    server = startMirage({});

    await renderListInformation();
  });

  afterEach(() => {
    server.shutdown();
  });
  describe('render all parts', () => {
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
      it('is expected to contain cancel button ', () => {
        const cancelButton = screen.getByRole('button', {
          name: 'ui-lists.button.cancel'
        });

        expect(cancelButton).toBeInTheDocument();
      });
    });
  });
});
