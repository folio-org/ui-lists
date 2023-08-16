import React from 'react';
import { MemoryRouter } from 'react-router';
import { QueryClientProvider } from 'react-query';
import { waitFor, screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { startMirage } from '../../../test/mirage';
import { ListInformationPage } from './ListInformationPage';
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
        <ListInformationPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ListInformationPage Page', () => {
  let server: any;

  beforeEach(async () => {
    server = startMirage({});

    await renderListInformation();
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should hide LoadingPane ', async () => {
    await waitFor(() => {
      expect(screen.queryByText('LoadingPane')).not.toBeInTheDocument();
    });
  });
});
