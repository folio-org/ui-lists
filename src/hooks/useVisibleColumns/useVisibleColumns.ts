import { useLocalStorage } from '@rehooks/local-storage';
import { getVisibleColumnsKey } from '../../utils';


export const useVisibleColumns = (listID: string) => {
  const storageKey = getVisibleColumnsKey(listID);

  const [cachedColumns = [], setCachedColumns] = useLocalStorage<string[]>(storageKey);

  const setDefaultVisibleColumns = (defaultColumns: string[] = []) => {
    setCachedColumns(cachedColumns || defaultColumns);
  };

  const handleColumnsChange = ({ values }: {values: string[]}) => {
    // There is always should be at least one selected column
    if (values.length === 0) {
      return;
    }

    setCachedColumns(values);
  };

  return {
    setDefaultVisibleColumns,
    handleColumnsChange,
    visibleColumns: cachedColumns
  };
};
