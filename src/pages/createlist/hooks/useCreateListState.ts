import { useCallback, useState } from 'react';
import {
  FIELD_NAMES,
  STATUS_VALUES,
  VISIBILITY_VALUES,
  FormStateType,
  ChangedFieldType
} from '../types';

export const useCreateListFormState = () => {
  const initialState: FormStateType = {
    [FIELD_NAMES.LIST_NAME]: '',
    [FIELD_NAMES.DESCRIPTION]: '',
    [FIELD_NAMES.STATUS]: STATUS_VALUES.ACTIVE,
    [FIELD_NAMES.VISIBILITY]: VISIBILITY_VALUES.SHARED,
    [FIELD_NAMES.RECORD_TYPE]: ''
  };

  const [state, setState] = useState(initialState);

  const onValueChange = useCallback((value : ChangedFieldType) => {
    setState((prevState) => {
      return { ...prevState,
        ...value };
    });
  }, [state]);

  const hasDirtyFields = Boolean(JSON.stringify(initialState) !== JSON.stringify(state));

  return {
    state,
    onValueChange,
    hasChanges: hasDirtyFields
  };
};
