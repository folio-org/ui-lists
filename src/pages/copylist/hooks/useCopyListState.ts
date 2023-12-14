import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { ChangedFieldType, FIELD_NAMES, STATUS_VALUES, VISIBILITY_VALUES } from '../types';
import { tString } from '../../../services';

export const useCopyListFormState = (initialValues: any, isValueLoading: boolean) => {
  const intl = useIntl();
  const postfix = tString(intl, 'lists.copy.name-postfix');
  const defaultName = `${initialValues?.name} - ${postfix}`;

  const list = {
    [FIELD_NAMES.LIST_NAME]: initialValues?.name,
    [FIELD_NAMES.DESCRIPTION]: initialValues?.description,
    [FIELD_NAMES.STATUS]: initialValues?.isActive ? STATUS_VALUES.ACTIVE : STATUS_VALUES.INACTIVE,
    [FIELD_NAMES.VISIBILITY]: initialValues?.isPrivate ? VISIBILITY_VALUES.PRIVATE : VISIBILITY_VALUES.SHARED,
  };

  const [listOriginalState, setListOriginalState] = useState(list);

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
        ...list,
        [FIELD_NAMES.LIST_NAME]: defaultName,
      };

      setState(() => listObject);
      setListOriginalState(() => listObject);
    }
  }, [initialValues, isValueLoading]);

  const hasDirtyFields = !isValueLoading && JSON.stringify(listOriginalState) !== JSON.stringify(state);

  return {
    state,
    onValueChange,
    hasChanges: hasDirtyFields
  };
};
