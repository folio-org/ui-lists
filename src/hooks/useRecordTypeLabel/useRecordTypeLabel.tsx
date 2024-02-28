import {useRecordTypes} from '../useRecordTypes';


export const useRecordTypeLabel = (targetID: string = '') => {
  const { recordTypes = [] } = useRecordTypes();

  return recordTypes.find(({id}) => id === targetID)?.label || '';
}