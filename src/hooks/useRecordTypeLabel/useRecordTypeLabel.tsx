import { useRecordTypes } from '../useRecordTypes';

export function useRecordTypeLabel(targetID = '') {
  const { labelMapping } = useRecordTypes();

  return labelMapping[targetID] ?? '';
}
