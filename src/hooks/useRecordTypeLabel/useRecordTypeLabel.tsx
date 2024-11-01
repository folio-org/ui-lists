import { useRecordTypes } from '../useRecordTypes';


export const useRecordTypeLabel = (targetID = '') => {
  const { recordTypes = [] } = useRecordTypes();

  return recordTypes.find(({ id }) => id === targetID)?.label ?? '';
};
