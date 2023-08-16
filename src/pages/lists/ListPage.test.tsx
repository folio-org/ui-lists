import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { waitFor, screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { ListPage } from './ListPage';
import { startMirage } from '../../../test/mirage';
import { HOME_PAGE_URL } from '../../constants';
import { queryClient } from '../../../test/utils';

jest.mock('../../components/listsTable', () => ({
  ListsTable: jest.fn(() => (
    <div data-testid="ListTable" />
  ))
}));


const renderLists = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[HOME_PAGE_URL]}>
        <ListPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ListPage Page', () => {
  let server: any;

  beforeEach(async () => {
    server = startMirage({});

    await renderLists();
  });

  afterEach(() => {
    server.shutdown();
  });


  it('should render multiColumnList ', async () => {
    await waitFor(() => {
      expect(screen.getByTestId('ListTable')).toBeInTheDocument();
    });
  });
});
