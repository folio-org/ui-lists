import { renderHook, act } from '@testing-library/react-hooks';
import { beforeEach } from '@jest/globals';
import { useVisibleColumns } from './useVisibleColumns';
import { getVisibleColumnsKey } from '../../utils';

describe('useVisibleColumns', () => {
  const listID = '12V123-1DAS';
  const listKey = getVisibleColumnsKey(listID);

  describe('initialization of values', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    describe('When default value exist in storage and setDefaultVisibleColumns called empty', () => {
      it('is expected return default value', () => {
        const cashedVisibleColumns = ['one', 'two'];

        localStorage.setItem(listKey, JSON.stringify(cashedVisibleColumns));

        const { result } = renderHook(() => useVisibleColumns(listID));


        act(() => {
          result.current.setDefaultVisibleColumns();
        });


        expect(result.current.visibleColumns).toStrictEqual(cashedVisibleColumns);
      });
    });

    describe('When default value does not exist in storage and setDefaultVisibleColumns called with columns', () => {
      it('is expected return columns', () => {
        const { result } = renderHook(() => useVisibleColumns(listID));
        const visibleColumns = ['four', 'five'];

        act(() => {
          result.current.setDefaultVisibleColumns(visibleColumns);
        });


        expect(result.current.visibleColumns).toStrictEqual(visibleColumns);
      });
    });

    describe('When default value does exist in storage and setDefaultVisibleColumns called with columns', () => {
      it('is expected return default value', () => {
        const cashedVisibleColumns = ['one', 'two'];

        localStorage.setItem(listKey, JSON.stringify(cashedVisibleColumns));

        const { result } = renderHook(() => useVisibleColumns(listID));
        const visibleColumns = ['four', 'five'];

        act(() => {
          result.current.setDefaultVisibleColumns(visibleColumns);
        });


        expect(result.current.visibleColumns).toStrictEqual(cashedVisibleColumns);
      });
    });
  });

  describe('set columns', () => {
    describe('When columns exists on storage and handleColumnsChange called empty', () => {
      it('is expected to not change columns', () => {
        const cashedVisibleColumns = ['one', 'two'];

        localStorage.setItem(listKey, JSON.stringify(cashedVisibleColumns));

        const { result } = renderHook(() => useVisibleColumns(listID));


        act(() => {
          result.current.handleColumnsChange({ values: [] });
        });


        expect(result.current.visibleColumns).toStrictEqual(cashedVisibleColumns);
      });
    });

    describe('When columns exists on storage and handleColumnsChange called with values', () => {
      it('is expected to change columns', () => {
        const cashedVisibleColumns = ['one', 'two'];

        localStorage.setItem(listKey, JSON.stringify(cashedVisibleColumns));

        const { result } = renderHook(() => useVisibleColumns(listID));
        const newColumns = ['three', 'four'];

        act(() => {
          result.current.handleColumnsChange({ values: newColumns });
        });


        expect(result.current.visibleColumns).toStrictEqual(newColumns);
      });
    });
  });
});
