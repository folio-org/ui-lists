import { useRecordTypes } from '../useRecordTypes';

export function useRecordTypeLabel(entityTypeId = '') {
  const recordTypesResult = useRecordTypes();
  const labelMapping = 'labelMapping' in recordTypesResult
    ? recordTypesResult.labelMapping
    : {};

  return labelMapping[entityTypeId] ?? '';
}
