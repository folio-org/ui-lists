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

  const onValueChange = useCallback((rawValue : ChangedFieldType) => {
    let value = { ...rawValue };

    if (isCrossTenant(value[FIELD_NAMES.RECORD_TYPE])) {
      value = { ...value, [FIELD_NAMES.VISIBILITY]: VISIBILITY_VALUES.PRIVATE };
    }

    setState((prevState) => {
      return { ...prevState,
        ...value };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const hasDirtyFields = Boolean(JSON.stringify(initialState) !== JSON.stringify(state));

  const crossTenantType = isCrossTenant(state[FIELD_NAMES.RECORD_TYPE] || '');


  return {
    state,
    onValueChange,
    hasChanges: hasDirtyFields,
    crossTenantType
  };
};
