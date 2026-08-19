import { renderHook } from '@testing-library/react-hooks';
import { jest } from '@jest/globals';
import { useQueryBuilderCommonSources } from './useQueryBuilderSources';

const kyGetMock = jest.fn(() => ({ json: () => Promise.resolve({}) }));

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: () => ({ get: kyGetMock }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useQueryBuilderCommonSources', () => {
  it('fetches the entity type with includeHidden so the query builder can see capability placeholders (e.g. MARC)', async () => {
    const { result } = renderHook(() => useQueryBuilderCommonSources('et-1', {}));

    await result.current.entityTypeDataSource();

    expect(kyGetMock).toHaveBeenCalledWith('entity-types/et-1', { searchParams: { includeHidden: true } });
  });

  it('does not fetch when there is no entity type id', () => {
    const { result } = renderHook(() => useQueryBuilderCommonSources(undefined, {}));

    expect(result.current.entityTypeDataSource()).toBeUndefined();
    expect(kyGetMock).not.toHaveBeenCalled();
  });
});
