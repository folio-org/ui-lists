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

  const [initialFormState, setInitialFormState] = useState<FormStateType>(initialState);

  const [state, setState] = useState(initialState);

  const onValueChange = useCallback((value : ChangedFieldType) => {
    if (value[FIELD_NAMES.RECORD_TYPE] && !state[FIELD_NAMES.RECORD_TYPE]) {
      setInitialFormState((prevState) => {
        return { ...prevState,
          ...value };
      });
    }
    setState((prevState) => {
      return { ...prevState,
        ...value };
    });
  }, [state]);

  const hasDirtyFields = Boolean(state[FIELD_NAMES.RECORD_TYPE] && JSON.stringify(initialFormState) !== JSON.stringify(state));
  return {
    state,
    onValueChange,
    hasChanges: hasDirtyFields
  };
};
