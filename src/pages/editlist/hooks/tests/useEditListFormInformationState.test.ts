import { renderHook, act } from '@testing-library/react-hooks';
import { useEditListFormState } from '../useEditListState';
import { STATUS_VALUES, VISIBILITY_VALUES } from '../../types';

describe('useEditListFormState', () => {
  const initialValues = {
    name: 'Test List',
    description: 'Description',
    isActive: true,
    isPrivate: false,
  };

  it('should initialize state based on initial values', () => {
    const isValueLoading = false;

    const { result } = renderHook(() => useEditListFormState(initialValues, isValueLoading));

    expect(result.current.state).toEqual({
      listName: initialValues.name,
      description: initialValues.description,
      status: STATUS_VALUES.ACTIVE,
      visibility: VISIBILITY_VALUES.SHARED,
    });
  });

  it('should update state when onValueChange is called', () => {
    const isValueLoading = false;
    const { result } = renderHook(() => useEditListFormState(initialValues, isValueLoading));

    act(() => {
      result.current.onValueChange({ listName: 'Updated List Name' });
    });

    expect(result.current.state.listName).toBe('Updated List Name');
  });

  it('should detect changes correctly', () => {
    const isValueLoading = false;
    const { result } = renderHook(() => useEditListFormState(initialValues, isValueLoading));

    act(() => {
      result.current.onValueChange({ listName: 'Updated List Name' });
    });

    expect(result.current.hasChanges).toBe(true);
  });

  it('should detect when the list becomes active', () => {
    const isValueLoading = false;
    const inactiveList = {
      ...initialValues,
      isActive: false
    };
    const { result } = renderHook(() => useEditListFormState(
      inactiveList, isValueLoading
    ));

    act(() => {
      result.current.onValueChange({ status: STATUS_VALUES.ACTIVE });
    });

    expect(result.current.isListBecameActive).toBe(true);
  });

  it('should not detect when the list becomes active if it was already active', () => {
    const isValueLoading = false;
    const { result } = renderHook(() => useEditListFormState(initialValues, isValueLoading));

    act(() => {
      result.current.onValueChange({ status: STATUS_VALUES.INACTIVE });
      result.current.onValueChange({ status: STATUS_VALUES.ACTIVE });
    });

    expect(result.current.isListBecameActive).toBe(false);
  });
});
