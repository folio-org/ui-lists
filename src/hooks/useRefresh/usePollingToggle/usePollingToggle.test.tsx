import { renderHook, act } from '@testing-library/react-hooks';
import { usePollingToggle } from './usePollingToggle';

describe('usePollingToggle', () => {
  describe('When shouldStartPulling false', () => {
    it('is expected to return isPollingEnabled false by default', () => {
      const { result } = renderHook(() => usePollingToggle(false));

      expect(result.current.isPollingEnabled).toBe(false);
    });
  });

  describe('When shouldStartPulling true', () => {
    it('is expected to return isPollingEnabled true by default', () => {
      const { result } = renderHook(() => usePollingToggle(true));

      expect(result.current.isPollingEnabled).toBe(true);
    });
  });

  describe('When shouldStartPulling true and called setPollingOff', () => {
    it('is expected to return isPollingEnabled false', () => {
      const { result } = renderHook(() => usePollingToggle(true));

      act(() => {
        result.current.setPollingOff();
      });

      expect(result.current.isPollingEnabled).toBe(false);
    });
  });

  describe('When shouldStartPulling false and called setPollingOn', () => {
    it('is expected to return isPollingEnabled true', () => {
      const { result } = renderHook(() => usePollingToggle(true));

      act(() => {
        result.current.setPollingOn();
      });

      expect(result.current.isPollingEnabled).toBe(true);
    });
  });

  describe('When shouldStartPulling changed to true after delay', () => {
    it('is expected to return true', async () => {
      const { result, rerender } = renderHook(
        (props) => usePollingToggle(props),
        { initialProps: false }
      );

      expect(result.current.isPollingEnabled).toBe(false);

      act(() => {
        rerender(true);
      });

      expect(result.current.isPollingEnabled).toBe(true);
    });
  });
});
