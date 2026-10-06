import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useNamespace } from '@folio/stripes/core';

import { useSessionStorage } from '../../../../hooks';
import { DEFAULT_FILTERS } from '../useFilters/configurations';

const FILTERS_KEY = 'filters';
const VIEW_KEYS = [FILTERS_KEY, 'search', 'sorting', 'sortingDirection'];

type ListsView = Record<string, string>;

const pickViewParams = (params: URLSearchParams): ListsView => {
  return VIEW_KEYS.reduce<ListsView>((view, key) => {
    const value = params.get(key);

    return value === null ? view : { ...view, [key]: value };
  }, {});
};

// Keeps filters, search and sorting across every way of entering the app (main navigation
// button, app context dropdown, other apps): they are saved on each URL change and put back
// into the URL whenever it is opened without them.
export const useRestoreListsView = () => {
  const history = useHistory();
  const location = useLocation();
  const [namespace] = useNamespace();
  const { getItem, setItem } = useSessionStorage<ListsView>(`${namespace}/view`);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isBareUrl = VIEW_KEYS.every((key) => !params.has(key));
    const saved = getItem() ?? {};
    const restorable = isBareUrl ? VIEW_KEYS : [FILTERS_KEY];

    let restored = false;

    restorable.forEach((key) => {
      if (params.has(key)) {
        return;
      }

      const value = key === FILTERS_KEY ? saved[key] ?? DEFAULT_FILTERS.join(',') : saved[key];

      if (value !== undefined) {
        params.set(key, value);
        restored = true;
      }
    });

    if (restored) {
      history.replace({ pathname: location.pathname, search: params.toString() });

      return;
    }

    setItem(pickViewParams(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);
};
