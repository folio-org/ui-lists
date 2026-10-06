import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { act, renderHook } from '@testing-library/react-hooks';

import { useRestoreListsView } from './useRestoreListsView';

jest.mock('react-router-dom', () => jest.requireActual('react-router-dom'));

const FULL_VIEW = '/lists?filters=status.Active,visibility.Shared&search=foo&sorting=updatedDate&sortingDirection=descending';

const mountAt = (url: string) => {
  const history = createMemoryHistory({ initialEntries: [url] });
  const wrapper = ({ children }: { children?: React.ReactNode }) => <Router history={history}>{children}</Router>;
  const utils = renderHook(() => useRestoreListsView(), { wrapper });

  return { history, ...utils };
};

const paramsOf = (history: MemoryHistory) => new URLSearchParams(history.location.search);

beforeEach(() => {
  sessionStorage.clear();
});

describe('useRestoreListsView', () => {
  it('should apply the default filters on the first visit when nothing was saved', () => {
    const { history } = mountAt('/lists');

    expect(paramsOf(history).get('filters')).toBe('status.Active');
    expect(history.action).toBe('REPLACE');
  });

  it('should restore filters, search and sorting when the URL is reset to the bare app URL', () => {
    const { history } = mountAt(FULL_VIEW);

    act(() => history.push('/lists'));

    const params = paramsOf(history);

    expect(history.location.pathname).toBe('/lists');
    expect(params.get('filters')).toBe('status.Active,visibility.Shared');
    expect(params.get('search')).toBe('foo');
    expect(params.get('sorting')).toBe('updatedDate');
    expect(params.get('sortingDirection')).toBe('descending');
  });

  it('should restore the saved view when the page is mounted on the bare app URL', () => {
    const { unmount } = mountAt(FULL_VIEW);

    unmount();

    const { history } = mountAt('/lists');
    const params = paramsOf(history);

    expect(params.get('filters')).toBe('status.Active,visibility.Shared');
    expect(params.get('search')).toBe('foo');
    expect(params.get('sorting')).toBe('updatedDate');
    expect(params.get('sortingDirection')).toBe('descending');
  });

  it('should keep pagination params when restoring the saved view', () => {
    const { history } = mountAt(FULL_VIEW);

    act(() => history.push('/lists?limit=100&offset=0'));

    const params = paramsOf(history);

    expect(params.get('limit')).toBe('100');
    expect(params.get('offset')).toBe('0');
    expect(params.get('filters')).toBe('status.Active,visibility.Shared');
    expect(params.get('search')).toBe('foo');
  });

  it('should not override params that are already in the URL', () => {
    const { history } = mountAt('/lists?filters=status.Active');

    act(() => history.push('/lists?filters=visibility.Private&sorting=listName&sortingDirection=ascending'));

    const params = paramsOf(history);

    expect(params.get('filters')).toBe('visibility.Private');
    expect(params.get('sorting')).toBe('listName');
    expect(params.has('search')).toBe(false);
  });

  it('should not bring back a search that was cleared before leaving the page', () => {
    const { history } = mountAt(FULL_VIEW);

    act(() => history.push('/lists?filters=status.Active,visibility.Shared&sorting=updatedDate&sortingDirection=descending'));
    act(() => history.push('/lists'));

    expect(paramsOf(history).has('search')).toBe(false);
    expect(paramsOf(history).get('sorting')).toBe('updatedDate');
  });

  it('should keep the filters empty when they were cleared before leaving the page', () => {
    const { history } = mountAt('/lists?filters=status.Active');

    act(() => history.push('/lists?filters='));
    act(() => history.push('/lists'));

    expect(paramsOf(history).has('filters')).toBe(true);
    expect(paramsOf(history).get('filters')).toBe('');
  });

  it('should add the saved filters to a URL that only has a search term', () => {
    const { history } = mountAt(FULL_VIEW);

    act(() => history.push('/lists?search=bar'));

    const params = paramsOf(history);

    expect(params.get('filters')).toBe('status.Active,visibility.Shared');
    expect(params.get('search')).toBe('bar');
    expect(params.has('sorting')).toBe(false);
  });
});
