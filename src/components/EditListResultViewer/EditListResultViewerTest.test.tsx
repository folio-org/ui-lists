import { Pluggable } from '@folio/stripes/core';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { useVisibleColumns } from '../../hooks';
import { EditListResultViewer, EditListResultViewerProps } from './EditListResultViewer';

const PluggableMock = Pluggable as jest.Mock;
const useVisibleColumnsMock = useVisibleColumns as jest.Mock;

const kyGetMock = jest.fn(() => ({ json: jest.fn() }));
const kyPostMock = jest.fn(() => ({ json: jest.fn() }));
const kyPutMock = jest.fn(() => ({ json: jest.fn() }));
const kyDeleteMock = jest.fn(() => ({ json: jest.fn() }));

jest.mock('@folio/stripes/core', () => ({
  Pluggable: jest.fn(() => <div>Pluggable</div>),
  useOkapiKy: jest.fn(() => ({
    get: kyGetMock,
    post: kyPostMock,
    put: kyPutMock,
    delete: kyDeleteMock,
  })),
}));

jest.mock('../../hooks', () => ({
  useVisibleColumns: jest.fn(() => ({})),
}));

function renderComponent(props: Partial<EditListResultViewerProps>) {
  return render(<EditListResultViewer {...(props as EditListResultViewerProps)} />);
}

describe('EditListResultViewer component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderComponent({} as any);

    expect(screen.getByText('Pluggable')).toBeInTheDocument();
  });

  describe('content data callbacks', () => {
    it('properly queries content with visibleColumns=null', () => {
      useVisibleColumnsMock.mockReturnValueOnce({ visibleColumns: null });
      renderComponent({ id: 'id' });

      PluggableMock.mock.lastCall[0].contentDataSource({ limit: 10, offset: 0 });

      // we don't care what fields= here, since we have no list of visible columns
      expect(kyGetMock).toHaveBeenCalledWith('lists/id/contents?offset=0&size=10&fields=undefined');
    });

    it('properly queries content with visibleColumns', () => {
      useVisibleColumnsMock.mockReturnValueOnce({ visibleColumns: ['a', 'b', 'c'] });
      renderComponent({ id: 'id' });

      PluggableMock.mock.lastCall[0].contentDataSource({ limit: 10, offset: 0 });

      expect(kyGetMock).toHaveBeenCalledWith('lists/id/contents?offset=0&size=10&fields=a,b,c');
    });
  });

  describe('entity type callback', () => {
    it('hits correct endpoint', () => {
      renderComponent({ entityTypeId: 'entity-type-here' });

      PluggableMock.mock.lastCall[0].entityTypeDataSource();

      expect(kyGetMock).toHaveBeenCalledWith('entity-types/entity-type-here');
    });
  });
});
