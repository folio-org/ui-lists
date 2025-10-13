import React from 'react';

import { Pluggable } from '@folio/stripes/core';
// @ts-ignore
import { runAxeTest } from '@folio/stripes-testing';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { queryClient } from '../../../test/utils';
import { ConfigureQuery, ConfigureQueryProps } from './ConfigureQuery';

const PluggableMock = Pluggable as unknown as jest.Mock;

const kyGetMock = jest.fn(() => ({ json: jest.fn(() => Promise.resolve({})) }));
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

const historyPushMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: historyPushMock,
  }),
}));

const showSuccessMessageMock = jest.fn();
const showErrorMessageMock = jest.fn();

jest.mock('../../hooks', () => ({
  useRecordsLimit: jest.fn(() => 10),
  useRecordTypes: jest.fn(() => ({ labelMapping: {}, isLoading: false })),
  useMessages: () => ({
    showSuccessMessage: showSuccessMessageMock,
    showErrorMessage: showErrorMessageMock,
  }),
}));

function renderComponent(props: Partial<ConfigureQueryProps> = {}) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ConfigureQuery {...props} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ConfigureQuery component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderComponent();

    expect(screen.getByText('Pluggable')).toBeInTheDocument();
  });

  describe('trigger button label', () => {
    it('exists with values present', () => {
      renderComponent({ initialValues: { foo: 'bar' } });
      expect(PluggableMock.mock.lastCall?.[0].triggerButtonLabel).not.toBeUndefined();
    });

    it('should render with no axe errors', async () => {
      renderComponent();

      await runAxeTest({
        rootNode: document.body,
      });
    });

    it('does not exist with no values present', () => {
      renderComponent({});
      expect(PluggableMock.mock.lastCall[0].triggerButtonLabel).toBeUndefined();
    });
  });

  describe('entity type data source', () => {
    it('calls the API when selectedType is present', () => {
      renderComponent({ selectedType: 'foo' });
      PluggableMock.mock.lastCall[0].entityTypeDataSource();

      expect(kyGetMock).toHaveBeenCalledWith('entity-types/foo');
    });

    it.each(['', undefined])(
      'does not call the API when selectedType is not present',
      (selectedType) => {
        renderComponent({ selectedType });
        PluggableMock.mock.lastCall[0].entityTypeDataSource();

        expect(kyGetMock).not.toHaveBeenCalled();
      },
    );
  });

  test('query details data source', () => {
    renderComponent();
    PluggableMock.mock.lastCall[0].queryDetailsDataSource({
      queryId: 'foo',
      includeContent: true,
      offset: 0,
      limit: 10,
    });

    expect(kyGetMock).toHaveBeenCalledWith('query/foo', {
      searchParams: {
        includeResults: true,
        offset: 0,
        limit: 10,
      },
    });
  });

  test('test query data source', () => {
    renderComponent({ selectedType: 'foo' });
    PluggableMock.mock.lastCall[0].testQueryDataSource({ fqlQuery: { foo: 'bar' } });

    expect(kyPostMock).toHaveBeenCalledWith('query', {
      json: {
        entityTypeId: 'foo',
        fqlQuery: JSON.stringify({ foo: 'bar' }),
      },
    });
  });

  describe('run query data source', () => {
    it('properly handles edit queries', () => {
      renderComponent({
        isEditQuery: true,
        listId: 'list-id',
        listName: 'list-name',
        description: 'list-description',
        status: 'active',
        visibility: 'shared',
        version: 3,
      });

      PluggableMock.mock.lastCall[0].runQueryDataSource({
        fqlQuery: { foo: 'bar' },
        queryId: 'query-id',
      });

      expect(kyPutMock).toHaveBeenCalledWith('lists/list-id', {
        json: {
          name: 'list-name',
          description: 'list-description',
          fields: [],
          isActive: true,
          isPrivate: false,
          queryId: 'query-id',
          version: 3,
          fqlQuery: JSON.stringify({ foo: 'bar' }),
        },
      });
    });

    it('properly handles new queries', () => {
      renderComponent({
        listName: 'list-name',
        description: 'list-description',
        status: 'active',
        visibility: 'shared',
        selectedType: 'type-id',
      });

      PluggableMock.mock.lastCall[0].runQueryDataSource({
        fqlQuery: { foo: 'bar' },
        queryId: 'query-id',
      });

      expect(kyPostMock).toHaveBeenCalledWith('lists', {
        json: {
          name: 'list-name',
          description: 'list-description',
          fields: [],
          isActive: true,
          isPrivate: false,
          queryId: 'query-id',
          fqlQuery: JSON.stringify({ foo: 'bar' }),
          entityTypeId: 'type-id',
        },
      });
    });
  });

  test('on query run success', () => {
    renderComponent({ listName: 'list-name' });
    PluggableMock.mock.lastCall[0].onQueryRunSuccess({ id: 'list-id' });

    expect(historyPushMock).toHaveBeenCalledWith('/lists/list/list-id');
    expect(showSuccessMessageMock).toHaveBeenCalled();
  });

  test('on query run fail', async () => {
    renderComponent();
    PluggableMock.mock.lastCall[0].onQueryRunFail({
      response: { json: () => Promise.resolve({ code: 'foo' }) },
    });

    await waitFor(() => expect(showErrorMessageMock).toHaveBeenCalled());
  });

  test('get params', async () => {
    renderComponent();
    PluggableMock.mock.lastCall[0].getParamsSource({
      entityTypeId: 'type-id',
      columnName: 'column-name',
      searchValue: 'search-value',
    });

    await waitFor(() => expect(kyGetMock).toHaveBeenCalledWith('entity-types/type-id/columns/column-name/values', {
      searchParams: {
        search: 'search-value',
      },
    }));
  });

  test('cancel query data source', async () => {
    renderComponent();
    PluggableMock.mock.lastCall[0].cancelQueryDataSource({ queryId: 'query-id' });

    await waitFor(() => expect(kyDeleteMock).toHaveBeenCalledWith('query/query-id'));
  });
});
