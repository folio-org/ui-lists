import { useLocalStorage } from '@rehooks/local-storage';

export const useLocalStorageToggle = (key: string, defaultValue: boolean) => {
  const [storedBoolean, writeStorage] = useLocalStorage(key, defaultValue);

  const toggleValue = () => {
    writeStorage(!storedBoolean);
  };

  return [storedBoolean, toggleValue] as [boolean, () => void];
};
