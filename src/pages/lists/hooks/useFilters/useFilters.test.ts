import { renderHook } from '@testing-library/react-hooks';

import { ChangeEvent } from 'react';
import { jest } from '@jest/globals';
import { useFilters } from './useFilters';
import { CREATED_BY_PREFIX, UPDATED_BY_PREFIX } from '../../../../utils/constants';

const historyPushMock = jest.fn();

let locationSearch = '';

jest.mock('react-router-dom', () => ({
  useHistory:  () => ({
    push: historyPushMock,
    location: {
      pathname: '',
      search: locationSearch
    }
  })
}));

beforeEach(() => {
  locationSearch = '';
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
});

describe('useFilters', () => {
  it('should keep the sort params when Reset all is selected', () => {
    locationSearch = '?filters=visibility.Private&sorting=updatedDate&sortingDirection=descending';

    const { result } = renderHook(() => useFilters());

    result.current.onResetAll();

    expect(historyPushMock).toBeCalledWith(
      '?filters=status.Active&sorting=updatedDate&sortingDirection=descending'
    );
  });

  it('should update filter values', () => {
    const event = {
      target: {
        name: 'status.Active',
        checked: true
      }
    } as ChangeEvent<HTMLInputElement>;

    const { result } = renderHook(() => useFilters());

    result.current.onChangeFilter(event);

    expect(historyPushMock).toBeCalledWith('?filters=status.Active');
  });

  it('should clear filter group', () => {
    locationSearch = '?filters=status.Active&visibility.Shared';

    const { result } = renderHook(() => useFilters());

    result.current.onClearGroup('status');

    expect(historyPushMock).toBeCalledWith('?filters=&visibility.Shared=');
  });

  it('should set a Created by filter and expose it via createdByFilter', () => {
    const { result, rerender } = renderHook(() => useFilters());

    result.current.setUserFilter(CREATED_BY_PREFIX, 'user-1');

    expect(historyPushMock).toBeCalledWith('?filters=created_by.user-1');

    locationSearch = '?filters=created_by.user-1';
    rerender();

    expect(result.current.createdByFilter).toEqual({ userId: 'user-1' });
    expect(result.current.updatedByFilter).toEqual({ userId: '' });
  });

  it('should preserve other active filters when setting a Created by filter', () => {
    locationSearch = '?filters=status.Active,record_types.abc';

    const { result } = renderHook(() => useFilters());

    result.current.setUserFilter(CREATED_BY_PREFIX, 'user-1');

    expect(historyPushMock).toBeCalledWith('?filters=status.Active%2Crecord_types.abc%2Ccreated_by.user-1');
  });

  it('should replace a previously selected Created by user when a new one is selected', () => {
    locationSearch = '?filters=created_by.user-1';

    const { result } = renderHook(() => useFilters());

    result.current.setUserFilter(CREATED_BY_PREFIX, 'user-2');

    expect(historyPushMock).toBeCalledWith('?filters=created_by.user-2');
  });

  it('should track Created by and Updated by filters independently', () => {
    const { result, rerender } = renderHook(() => useFilters());

    result.current.setUserFilter(CREATED_BY_PREFIX, 'user-1');
    locationSearch = '?filters=created_by.user-1';
    rerender();

    result.current.setUserFilter(UPDATED_BY_PREFIX, 'user-2');
    expect(historyPushMock).toBeCalledWith('?filters=created_by.user-1%2Cupdated_by.user-2');

    locationSearch = '?filters=created_by.user-1,updated_by.user-2';
    rerender();

    expect(result.current.createdByFilter).toEqual({ userId: 'user-1' });
    expect(result.current.updatedByFilter).toEqual({ userId: 'user-2' });
  });

  it('should clear a Created by filter', () => {
    const { result, rerender } = renderHook(() => useFilters());

    result.current.setUserFilter(CREATED_BY_PREFIX, 'user-1');
    locationSearch = '?filters=created_by.user-1';
    rerender();
    expect(result.current.createdByFilter.userId).toBe('user-1');

    result.current.clearUserFilter(CREATED_BY_PREFIX);

    expect(historyPushMock).toBeCalledWith('?filters=');

    locationSearch = '?filters=';
    rerender();

    expect(result.current.createdByFilter).toEqual({ userId: '' });
  });
});
