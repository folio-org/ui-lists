import { useLocalStorage } from '@rehooks/local-storage';
import {getDefaultColumnsKey, getVisibleColumnsKey} from '../../utils';
import { isEqual } from 'lodash';


export const useVisibleColumns = (listID: string) => {
  const storageKey = getVisibleColumnsKey(listID);
  const defaultColumnsKey = getDefaultColumnsKey(listID);



  const [cachedColumns = [], setCachedColumns] = useLocalStorage<string[]>(storageKey);
  const [cachedDefaultColumns = [], setCachedDefaultColumns] = useLocalStorage<string[]>(defaultColumnsKey);

  const setDefaultVisibleColumns = (defaultColumns: string[] = []) => {
    if(!isEqual(defaultColumns, cachedDefaultColumns)) {
      setCachedDefaultColumns(defaultColumns);
      setCachedColumns(defaultColumns);
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
