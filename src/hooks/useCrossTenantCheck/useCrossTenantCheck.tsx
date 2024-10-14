import { useRecordTypes } from '../useRecordTypes';


export const useCrossTenantCheck = () => {
  const { recordTypes } = useRecordTypes();

  const isCrossTenant = (id: string) => {
    const recordType = recordTypes.find(({ id: savedId }) => id === savedId);

    return Boolean(true);
  };

  return {
    isCrossTenant
  };
};
