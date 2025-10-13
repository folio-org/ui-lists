import { useRecordTypes } from '../useRecordTypes';

export function useRecordTypeLabel(entityTypeId = '') {
  const { labelMapping } = useRecordTypes();

  return labelMapping[entityTypeId] ?? '';
}
