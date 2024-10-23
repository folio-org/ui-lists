import { renderHook, act } from '@testing-library/react-hooks';
import React, { JSX } from 'react';
import { QueryClientProvider } from 'react-query';
import { useCreateListFormState } from '../useCreateListState';
import { STATUS_VALUES, VISIBILITY_VALUES } from '../../../../interfaces';
import { queryClient } from '../../../../../test/utils';

const wrapper: React.FC<{children: JSX.Element}> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCreateListFormState', () => {
  it('should initialize state with default values', () => {
    const { result } = renderHook(() => useCreateListFormState(), { wrapper });

    expect(result.current.state).toEqual({
      listName: '',
      description: '',
      status: STATUS_VALUES.ACTIVE,
      visibility: VISIBILITY_VALUES.SHARED,
      recordType: '',
    });
  });

  it('should update state when onValueChange is called', () => {
    const { result } = renderHook(() => useCreateListFormState(), { wrapper });

    act(() => {
      result.current.onValueChange({ listName: 'Test List Name' });
    });

    expect(result.current.state.listName).toBe('Test List Name');
  });

  it('should update initialFormState if record type is set', () => {
    const { result } = renderHook(() => useCreateListFormState(), { wrapper });

    act(() => {
      result.current.onValueChange({ recordType: 'first type' });
      result.current.onValueChange({ recordType: 'second type' });
    });

    expect(result.current.state.recordType).toBe('second type');
  });

  it('should detect changes correctly', () => {
    const { result } = renderHook(() => useCreateListFormState(), { wrapper });

    act(() => {
      result.current.onValueChange({ recordType: 'first type' });
      result.current.onValueChange({ listName: 'Updated List Name' });
    });

    expect(result.current.hasChanges).toBe(true);
  });
});
