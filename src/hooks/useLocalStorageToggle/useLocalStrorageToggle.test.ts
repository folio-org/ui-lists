import { renderHook, act } from '@testing-library/react-hooks';
import { beforeEach } from '@jest/globals';
import { useLocalStorageToggle } from './useLocalStorageToggle';

describe('useLocalStorageToggle', () => {
  const key = 'testKey';

  beforeEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with default value when no value is in localStorage', () => {
      const defaultValue = true;

      const { result } = renderHook(() => useLocalStorageToggle(key, defaultValue));

      expect(result.current[0]).toBe(defaultValue);
    });

    it('should initialize with value from localStorage when available', () => {
      const defaultValue = true;
      localStorage.setItem(key, 'false');

      const { result } = renderHook(() => useLocalStorageToggle(key, defaultValue));

      expect(result.current[0]).toBe(false);
    });
  });

  describe('toggleValue', () => {
    it('should toggle the boolean value', () => {
      const defaultValue = true;
      const { result } = renderHook(() => useLocalStorageToggle(key, defaultValue));

      act(() => {
        result.current[1]();
      });

      expect(result.current[0]).toBe(false);
    });

    it('should update localStorage value when toggled', () => {
      const defaultValue = true;
      const { result } = renderHook(() => useLocalStorageToggle(key, defaultValue));

      act(() => {
        result.current[1]();
      });

      expect(localStorage.getItem(key)).toBe('false');
    });
  });
});
