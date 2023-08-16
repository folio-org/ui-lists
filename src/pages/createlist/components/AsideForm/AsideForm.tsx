import React, { FC, useEffect, ChangeEvent } from 'react';
// @ts-ignore:next-line
import { RadioButton, LoadingPane, RadioButtonGroup } from '@folio/stripes/components';
import { t } from '../../../../services';
import { useRecordTypes } from '../../../../hooks';
import { FIELD_NAMES, ChangedFieldType, STATUS_VALUES, VISIBILITY_VALUES } from '../../types';
import { QueryBuilder } from '../QueryBuilder';

type AsideFormProps = {
  onValueChange: (value: ChangedFieldType) => void,
  isQueryButtonDisabled?: boolean,
  selectedType?: string,
  listName?: string,
  status?: STATUS_VALUES,
  visibility?: VISIBILITY_VALUES,
  description?: string,
}

const DEFAULT_SELECTED_VALUE_INDEX = 0;

export const AsideForm:FC<AsideFormProps> = (
  { selectedType = '',
    onValueChange = () => {},
    isQueryButtonDisabled = true,
    listName = '',
    status,
    visibility,
    description = '' }
) => {
  const { isLoading, recordTypes } = useRecordTypes();
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange({
      [event.target.name]: event.target.value
    });
  };

  useEffect(() => {
    if (recordTypes && !selectedType) {
      onValueChange({
        [FIELD_NAMES.RECORD_TYPE]: recordTypes[DEFAULT_SELECTED_VALUE_INDEX].id
      });
    }
  }, [selectedType, onValueChange, recordTypes]);

  if (isLoading) {
    return <LoadingPane />;
  }

  return (
    <>
      <RadioButtonGroup
        label={
          <strong style={{ fontSize: '14px' }}>
            {t('create-list.aside.record-types')}
          </strong>
        }
        name={FIELD_NAMES.RECORD_TYPE}
        value={selectedType}
        onChange={onChangeHandler}
      >
        {recordTypes?.map((item) => (
          <RadioButton
            key={item.id}
            label={item.label}
            name={FIELD_NAMES.RECORD_TYPE}
            value={item.id}
          />))
        }
      </RadioButtonGroup>
      <QueryBuilder
        selectedType={selectedType}
        isQueryButtonDisabled={isQueryButtonDisabled}
        listName={listName}
        status={status}
        visibility={visibility}
        description={description}
      />
    </>
  );
};
