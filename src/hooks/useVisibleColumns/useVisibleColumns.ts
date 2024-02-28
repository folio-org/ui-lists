import { useLocalStorage } from '@rehooks/local-storage';
import { getVisibleColumnsKey } from '../../utils';

const createColumnHash = (listColumns: string[]) => {
  const sortedColumns = [...listColumns].sort();
  return `${sortedColumns.join()}`
}

const createStorageHashKey = (listID: string): string => `${listID}-hash`

export const useVisibleColumns = (listID: string) => {
  const storageColumnsKey = getVisibleColumnsKey(listID);
  const storageHashKey = createStorageHashKey(listID);

  const [columnsHash, setColumnsHash] = useLocalStorage<string>(storageHashKey);
  const [cachedColumns = [], setCachedColumns] = useLocalStorage<string[]>(storageColumnsKey);

  const setDefaultVisibleColumns = (defaultColumns: string[] = []) => {
    const newColumnsHash = createColumnHash(defaultColumns)
    const isDefaultColumnsChanged = columnsHash !== newColumnsHash;

    if(isDefaultColumnsChanged) {
      // We updated hash and reset all cashed columns to default stated
      setColumnsHash(newColumnsHash)
      setCachedColumns(defaultColumns);
    } else {
      // We ignore default columns and work with cashed if they exists
      setCachedColumns(cachedColumns ?? defaultColumns);
    }
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
