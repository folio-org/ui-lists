import { useCallback, useState } from 'react';
import {
  FIELD_NAMES,
  STATUS_VALUES,
  VISIBILITY_VALUES,
  FormStateType,
  ChangedFieldType
} from '../../../interfaces';

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const hasDirtyFields = Boolean(JSON.stringify(initialState) !== JSON.stringify(state));

  return {
    state,
    onValueChange,
    hasChanges: hasDirtyFields
  };
};
