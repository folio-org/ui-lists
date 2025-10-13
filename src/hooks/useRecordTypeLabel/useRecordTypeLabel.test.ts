import { renderHook } from '@testing-library/react-hooks';
import { useRecordTypeLabel } from './useRecordTypeLabel';
import { useRecordTypes } from '../useRecordTypes';

jest.mock('../useRecordTypes');

const mockUseRecordTypes = useRecordTypes as jest.MockedFunction<typeof useRecordTypes>;

mockUseRecordTypes.mockReturnValue({
  labelMapping: {
    'id-1': 'Cool Entity',
  },
  recordTypes: [],
  isLoading: false,
  error: null,
});

describe('useRecordTypeLabel', () => {
  test.each([
    ['id-1', 'Cool Entity'],
    ['id-2', ''],
    [undefined, ''],
    ['', ''],
  ])('when entityTypeId is %p, it returns label %p', (entityTypeId, expectedLabel) => {
    const { result } = renderHook(() => useRecordTypeLabel(entityTypeId as string));
    expect(result.current).toBe(expectedLabel);
  });
});
