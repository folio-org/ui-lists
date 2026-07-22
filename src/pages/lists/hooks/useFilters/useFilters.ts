import { ChangeEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isEqual } from 'lodash';
import { useNamespace } from '@folio/stripes/core';
import { buildFiltersObject } from './helpers';
import { useSessionStorage } from '../../../../hooks';
import { DEFAULT_FILTERS } from './configurations';
import { CREATED_BY_PREFIX, UPDATED_BY_PREFIX } from '../../../../utils/constants';

const FILTERS_URL_KEY = 'filters';

const useURLFilters = () => {
  const history = useHistory();
  const { location } = history;
  const searchParams = new URLSearchParams(location.search);
  const [namespace] = useNamespace();

  const { getItem, setItem } = useSessionStorage(`${namespace}/filters`);

  const sessionFilters = getItem() as string;

  const setValues = (filters: string[]) => {
    searchParams.set(FILTERS_URL_KEY, filters.join(','));

    history.push(`${history.location.pathname}?${searchParams.toString()}`);

    setItem(filters.join(','));
  };

  useEffect(() => {
    const filtersURL = (searchParams.get(FILTERS_URL_KEY)?.split(',') || []).filter((filter) => {
      return !!filter;
    }).join(',');

    if (sessionFilters === filtersURL) {
      return;
    }

    if (!sessionFilters && !filtersURL) {
      setValues(DEFAULT_FILTERS);

      return;
    }

    if (filtersURL) {
      setItem(filtersURL);
    }

    if (!filtersURL && sessionFilters) {
      history.push(`${history.location.pathname}?${FILTERS_URL_KEY}=${sessionFilters}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionFilters]);

  const filters = (searchParams.get(FILTERS_URL_KEY)?.split(',') || []).filter((filter) => {
    return !!filter;
  });

  return {
    filterParams: filters,
    addValue: (filterValue: string) => {
      setValues([...filters, filterValue]);
    },
    removeValue: (filterValue: string) => {
      const newFilters = filters.filter((item: string) => {
        return item !== filterValue;
      });

      setValues(newFilters);
    },
    resetFilters: () => {
      setValues(DEFAULT_FILTERS);
    },
    setValues
  };
};

export function useFilters() {
  const { filterParams, addValue, removeValue, resetFilters, setValues } = useURLFilters();

  const filterCount = filterParams?.length;

  const onChangRecordType = (...a: any) => {
    const fil = filterParams.filter((item: string) => {
      return !item.startsWith('record_types');
    });

    setValues([...fil, ...a]);
  };

  const setUserFilter = (prefix: string, userId: string) => {
    const withoutGroup = filterParams.filter((item: string) => {
      return !item.startsWith(prefix);
    });

    setValues([...withoutGroup, `${prefix}${userId}`]);
  };

  const clearUserFilter = (prefix: string) => {
    setValues(filterParams.filter((item: string) => !item.startsWith(prefix)));
  };

  const getUserFilter = (prefix: string) => {
    const value = filterParams.find((item: string) => item.startsWith(prefix));

    return { userId: value ? value.slice(prefix.length) : '' };
  };

  const onChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target;

    if (checked) {
      addValue(name);
    } else {
      removeValue(name);
    }
  };

  const onResetAll = () => {
    resetFilters();
  };

  const onClearGroup = (groupName: string) => {
    const filters = filterParams.filter((filterName) => {
      return !filterName.startsWith(groupName);
    });

    setValues(filters);
  };

  const selectedRecordTypes = filterParams.filter(value => {
    return value.startsWith('record_types');
  });

  const isDefaultState = isEqual(DEFAULT_FILTERS, filterParams);

  return {
    onChangeFilter,
    onChangRecordType,
    onClearGroup,
    onResetAll,
    setUserFilter,
    clearUserFilter,
    createdByFilter: getUserFilter(CREATED_BY_PREFIX),
    updatedByFilter: getUserFilter(UPDATED_BY_PREFIX),
    filterCount,
    activeFilters: filterParams,
    selectedRecordTypes,
    filtersObject: buildFiltersObject(filterParams),
    isDefaultState
  };
}
