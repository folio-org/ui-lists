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

  it('should set visibility to PRIVATE when specified', () => {
    const { result } = renderHook(() => useCreateListFormState(), { wrapper });

    act(() => {
      result.current.onValueChange({ visibility: VISIBILITY_VALUES.PRIVATE });
    });

    expect(result.current.state.visibility).toBe(VISIBILITY_VALUES.PRIVATE);
  });

  it('should set visibility to SHARED when specified', () => {
    const { result } = renderHook(() => useCreateListFormState(), { wrapper });

    act(() => {
      result.current.onValueChange({ visibility: VISIBILITY_VALUES.SHARED });
    });

    expect(result.current.state.visibility).toBe(VISIBILITY_VALUES.SHARED);
  });

  it('should update visibility to SHARED if record is non-cross-tenant', () => {
    const mockIsCrossTenant = jest.fn().mockReturnValue(true);
    jest.mock('../../../../hooks', () => ({
      useCrossTenantCheck: () => ({ isCrossTenant: mockIsCrossTenant }),
    }));

    const { result } = renderHook(() => useCreateListFormState(), { wrapper });

    act(() => {
      result.current.onValueChange({ recordType: 'some type' });
    });

    expect(result.current.state.visibility).toBe(VISIBILITY_VALUES.SHARED);
  });

  it('should stay PRIVATE if record type is cross-tenant', () => {
    const mockIsCrossTenant = jest.fn().mockReturnValue(false);
    jest.mock('../../../../hooks', () => ({
      useCrossTenantCheck: () => ({ isCrossTenant: mockIsCrossTenant }),
    }));

    const { result } = renderHook(() => useCreateListFormState(), { wrapper });

    act(() => {
      result.current.onValueChange({ recordType: 'cross-tenant' });
      result.current.onValueChange({ visibility: VISIBILITY_VALUES.PRIVATE });
    });

    expect(result.current.state.visibility).toBe(VISIBILITY_VALUES.PRIVATE);
  });
});
