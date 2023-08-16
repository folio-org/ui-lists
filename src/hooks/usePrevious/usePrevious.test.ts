import { renderHook } from '@testing-library/react-hooks';
import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
  describe('When initial render happened', () => {
    const { result } = renderHook(() => usePrevious(1));

    it('is expected to return undefined', () => {
      expect(result.current).toBeUndefined();
    });
  });

  describe('When value was changed after initial render', () => {
    const { result, rerender } = renderHook(() => usePrevious(1));
    rerender(2);

    it('is expected to return previous value', () => {
      expect(result.current).toEqual(1);
    });
  });
});
