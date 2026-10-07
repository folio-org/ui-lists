import { renderHook, act } from '@testing-library/react-hooks';
import { useUserFilterAccordions } from './useUserFilterAccordions';

beforeEach(() => {
  sessionStorage.clear();
});

describe('useUserFilterAccordions', () => {
  it('defaults both accordions to closed', () => {
    const { result } = renderHook(() => useUserFilterAccordions());

    expect(result.current.isCreatedByOpen).toBe(false);
    expect(result.current.isUpdatedByOpen).toBe(false);
  });

  it('keeps an accordion open across a remount (not reset by navigating away and back)', () => {
    const { result, unmount } = renderHook(() => useUserFilterAccordions());

    act(() => {
      result.current.toggleCreatedBy();
    });

    expect(result.current.isCreatedByOpen).toBe(true);

    unmount();

    const { result: freshResult } = renderHook(() => useUserFilterAccordions());

    expect(freshResult.current.isCreatedByOpen).toBe(true);
    expect(freshResult.current.isUpdatedByOpen).toBe(false);
  });

  it('closes both accordions, persistently, only on an explicit reset', () => {
    const { result, unmount } = renderHook(() => useUserFilterAccordions());

    act(() => {
      result.current.toggleCreatedBy();
      result.current.toggleUpdatedBy();
    });

    expect(result.current.isCreatedByOpen).toBe(true);
    expect(result.current.isUpdatedByOpen).toBe(true);

    act(() => {
      result.current.resetToClosed();
    });

    expect(result.current.isCreatedByOpen).toBe(false);
    expect(result.current.isUpdatedByOpen).toBe(false);

    unmount();

    const { result: freshResult } = renderHook(() => useUserFilterAccordions());

    expect(freshResult.current.isCreatedByOpen).toBe(false);
    expect(freshResult.current.isUpdatedByOpen).toBe(false);
  });
});
