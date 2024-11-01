export const useSessionStorage = <T>(key: string) => {
  const getItem = (): (T | null) => {
    try {
      return JSON.parse(sessionStorage.getItem(key) ?? '');
    } catch (e) {
      return null;
    }
  };

  const setItem = (value: T) => {
    try {
      return sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      return null;
    }
  };

  const removeItem = () => {
    try {
      return sessionStorage.removeItem(key);
    } catch (e) {
      return null;
    }
  };

  return {
    getItem,
    setItem,
    removeItem
  };
};
