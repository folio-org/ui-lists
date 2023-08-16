import React from 'react';

jest.mock('@folio/stripes-acq-components', () => ({
  PrevNextPagination: jest.fn(({ ...rest }) => <div { ...rest } />),
  usePagination: () => ({ pagination: { limit: 100, offset: 0 }, changePage: jest.fn() }),
}));
