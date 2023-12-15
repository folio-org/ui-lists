import { useCallback, useEffect, useState } from 'react';
import { ChangedFieldType, FIELD_NAMES, STATUS_VALUES, VISIBILITY_VALUES } from '../../../interfaces';

export const useEditListFormState = (initialValues: any, isValueLoading: boolean) => {
  const [listOriginalState, setListOriginalState] = useState({
    [FIELD_NAMES.LIST_NAME]: initialValues?.name,
    [FIELD_NAMES.DESCRIPTION]: initialValues?.description,
    [FIELD_NAMES.STATUS]: initialValues?.isActive ? STATUS_VALUES.ACTIVE : STATUS_VALUES.INACTIVE,
    [FIELD_NAMES.VISIBILITY]: initialValues?.isPrivate ? VISIBILITY_VALUES.PRIVATE : VISIBILITY_VALUES.SHARED,
  });

  const [state, setState] = useState(listOriginalState);

  const onValueChange = useCallback((value : ChangedFieldType) => {
    setState((prevState) => {
      return { ...prevState,
        ...value };
    });
  }, []);


  useEffect(() => {
    if (!isValueLoading && initialValues) {
      const listObject = {
        [FIELD_NAMES.LIST_NAME]: initialValues.name,
        [FIELD_NAMES.DESCRIPTION]: initialValues.description,
        [FIELD_NAMES.STATUS]: initialValues.isActive ? STATUS_VALUES.ACTIVE : STATUS_VALUES.INACTIVE,
        [FIELD_NAMES.VISIBILITY]: initialValues.isPrivate ? VISIBILITY_VALUES.PRIVATE : VISIBILITY_VALUES.SHARED,
      };

      setState(() => listObject);
      setListOriginalState(() => listObject);
    }
  }, [initialValues, isValueLoading]);

  const hasDirtyFields = !isValueLoading && JSON.stringify(listOriginalState) !== JSON.stringify(state);
  const isListBecameActive =
      listOriginalState[FIELD_NAMES.STATUS] === STATUS_VALUES.INACTIVE
      &&
      state[FIELD_NAMES.STATUS] === STATUS_VALUES.ACTIVE;

  return {
    state,
    onValueChange,
    hasChanges: hasDirtyFields,
    isListBecameActive
  };
};
