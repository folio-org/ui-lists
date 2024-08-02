import { renderHook, act } from '@testing-library/react-hooks';
import {beforeEach, jest} from '@jest/globals';
import { useListsPagination } from './useListsPagination';


const defaultPagination = {limit: 100, offset: 0};

const mockChangePage = jest.fn();

jest.mock('@folio/stripes-acq-components', () => ({
  usePagination: () => ({
    changePage: mockChangePage,
    pagination: defaultPagination
  })
}));


describe('useListsPagination', () => {
  beforeEach(() => {
    localStorage.clear();
    mockChangePage.mockClear();
  });

  describe('initialization', () => {
    it('Should be initialized with default pagination', () => {

      const { result } = renderHook(() => useListsPagination({}));

      expect(result.current.pagination).toEqual(defaultPagination);
    });
  });

  describe('Has next page', () => {
    describe('When offset is <= totalRecords', () => {
      it('is expected to return true', () => {
        const { result } = renderHook(() => useListsPagination({}));

        expect(result.current.checkHasNextPage(150)).toBeTruthy();
      });
    });
  });

  describe('onNeedMoreData', () => {
    describe('When "next" argument provided', () => {
      it('is expected to cal changePage with offset 100', () => {
        const { result } = renderHook(() => useListsPagination({}));

        act(() => {
          result.current.onNeedMoreData('next')
        })

        expect(mockChangePage).toBeCalledWith({
          offset: 100
        });
      });
    });

    describe('When "prev" argument provided', () => {
      it('is expected to cal changePage with offset -100', () => {
        const { result } = renderHook(() => useListsPagination({}));

        act(() => {
          result.current.onNeedMoreData('prev')
        })

        expect(mockChangePage).toBeCalledWith({
          offset: -100
        });
      });
    });
  });

  describe('goToLastPage', () => {
    describe('When total pages 5', () => {
      it('it is expected to call changePage with offset 400', () => {
        const { result } = renderHook(() => useListsPagination({}));

        act(() => {
          result.current.goToLastPage(5)
        })

        expect(mockChangePage).toBeCalledWith({
          offset: 400
        });
      });
    });

    describe('When total pages 1', () => {
      it('it is expected to call changePage with offset 0', () => {
        const { result } = renderHook(() => useListsPagination({}));

        act(() => {
          result.current.goToLastPage(0)
        })

        expect(mockChangePage).toBeCalledWith({
          offset: 0
        });
      });
    });
  });

  describe('goToFirstPage', () => {
    it('it is expected to call changePage with offset 0 if offset more then 0', () => {
      const { result } = renderHook(() => useListsPagination({}));
      act(() => {
        result.current.goToLastPage()
      })

      act(() => {
        result.current.gotToFirstPage()
      })

      expect(mockChangePage).toBeCalledWith({
        offset: 0
      });
    });
  });
});
