import { useCallback, useState } from 'react';
import {
  ChangedFieldType,
  FIELD_NAMES,
  FormStateType,
  STATUS_VALUES,
  VISIBILITY_VALUES
} from '../../../interfaces';
import { useCrossTenantCheck } from '../../../hooks';

export const useCreateListFormState = () => {
  const { isCrossTenant } = useCrossTenantCheck();

  const initialState: FormStateType = {
    [FIELD_NAMES.LIST_NAME]: '',
    [FIELD_NAMES.DESCRIPTION]: '',
    [FIELD_NAMES.STATUS]: STATUS_VALUES.ACTIVE,
    [FIELD_NAMES.VISIBILITY]: VISIBILITY_VALUES.SHARED,
    [FIELD_NAMES.RECORD_TYPE]: ''
  };

  const [state, setState] = useState(initialState);

  const getUpdatedVisibility = (
    recordType: string,
    currentVisibility: VISIBILITY_VALUES,
    incomingVisibility?: VISIBILITY_VALUES
  ): VISIBILITY_VALUES => {
    if (isCrossTenant(recordType)) {
      return VISIBILITY_VALUES.PRIVATE;
    }

    if (
      currentVisibility === VISIBILITY_VALUES.PRIVATE &&
        incomingVisibility !== VISIBILITY_VALUES.PRIVATE
    ) {
      return VISIBILITY_VALUES.SHARED;
    }

    return incomingVisibility || currentVisibility;
  };

  const onValueChange = useCallback((rawValue: ChangedFieldType) => {
    setState((prevState) => {
      const updatedState = { ...prevState, ...rawValue };

      const recordType = updatedState[FIELD_NAMES.RECORD_TYPE] as string;
      const currentVisibility = prevState[FIELD_NAMES.VISIBILITY] as VISIBILITY_VALUES;
      const incomingVisibility = rawValue[FIELD_NAMES.VISIBILITY] as VISIBILITY_VALUES | undefined;

      updatedState[FIELD_NAMES.VISIBILITY] = getUpdatedVisibility(recordType, currentVisibility, incomingVisibility);

      return updatedState;
    });
    // // We don't add `getUpdatedVisibility` to dependencies because it's defined within the same closure and does not change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasDirtyFields = Boolean(JSON.stringify(initialState) !== JSON.stringify(state));

  const crossTenantType = isCrossTenant(state[FIELD_NAMES.RECORD_TYPE] || '');


  return {
    state,
    onValueChange,
    hasChanges: hasDirtyFields,
    crossTenantType
  };
};
