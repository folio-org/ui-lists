import { renderHook } from '@testing-library/react-hooks';

import { ChangeEvent } from 'react';
import { jest } from '@jest/globals';
import { useFilters } from './useFilters';

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
  jest.clearAllMocks();
});

describe('useFilters', () => {
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
});
