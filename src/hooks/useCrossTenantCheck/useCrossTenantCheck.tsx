import { useRecordTypes } from '../useRecordTypes';


export const useCrossTenantCheck = () => {
  const { recordTypes } = useRecordTypes();

  const isCrossTenant = (id: string | undefined) => {
    const recordType = recordTypes.find(({ id: savedId }) => id === savedId);

    return Boolean(recordType?.crossTenantQueriesEnabled);
  };

  return {
    isCrossTenant
  };
};
