import { renderHook } from '@testing-library/react-hooks';

import { useFilters } from './useFilters';

const filterConfig = [
  {
    label: 'Status',
    name: 'status',
    cql: 'status',
    values: ['Active', 'Inactive']
  }, {
    label: 'Visibility',
    name: 'visibility',
    cql: 'visibility',
    values: ['Shared', 'Private']
  }
];

beforeEach(() => {
  localStorage.clear();
});

describe('useFilters', () => {
  it('should initialize state with default values', () => {
    const { result } = renderHook(() => useFilters(filterConfig));

    expect(result.current.filterCount).toBe(0);
    expect(result.current.activeFilters).toStrictEqual([]);
  });

  it('should update filter values', () => {
    const event = {
      target: {
        name: 'status.Active',
        checked: true
      }
    };

    const { result } = renderHook(() => useFilters(filterConfig));

    result.current.onChangeFilter(event);

    expect(result.current.filterCount).toBe(1);
    expect(result.current.activeFilters).toStrictEqual(['status.Active']);
  });

  it('should clear filter group', () => {
    const event = {
      target: {
        name: 'status.Active',
        checked: true
      }
    };

    const { result } = renderHook(() => useFilters(filterConfig));

    result.current.onChangeFilter(event);
    event.target.name = 'visibility.Shared';
    result.current.onChangeFilter(event);

    expect(result.current.filterCount).toBe(2);
    expect(result.current.activeFilters).toStrictEqual(['status.Active', 'visibility.Shared']);

    result.current.onClearGroup('status');

    expect(result.current.filterCount).toBe(1);
    expect(result.current.activeFilters).toStrictEqual(['visibility.Shared']);
  });

  it('should clear all filters', () => {
    const event = {
      target: {
        name: 'status.Active',
        checked: true
      }
    };

    const { result } = renderHook(() => useFilters(filterConfig));

    result.current.onChangeFilter(event);
    event.target.name = 'visibility.Shared';
    result.current.onChangeFilter(event);

    expect(result.current.filterCount).toBe(2);
    expect(result.current.activeFilters).toStrictEqual(['status.Active', 'visibility.Shared']);

    result.current.onResetAll();

    expect(result.current.filterCount).toBe(0);
    expect(result.current.activeFilters).toStrictEqual([]);
  });
});
