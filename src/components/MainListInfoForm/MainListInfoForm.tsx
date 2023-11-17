import React, { ChangeEvent, useState, FocusEvent } from 'react';
// @ts-ignore:next-line
import { Layout, RadioButton, RadioButtonGroup, TextArea, TextField, Select, InfoPopover } from '@folio/stripes/components';
import { FIELD_NAMES, STATUS_VALUES, VISIBILITY_VALUES } from './type';
import { EntityTypeSelectOption } from '../../interfaces';
import {
  MAX_SUPPORTED_DESCRIPTION_LENGTH,
  MAX_SUPPORTED_NAME_LENGTH
} from './constants';
import { t } from '../../services';

import css from './MainListInfoForm.module.css';

type MainListInfoFormProps = {
    onValueChange?: (field: {[key: string]: string}) => void;
    listName: string,
    description: string,
    visibility: string,
    status: string,
    isLoading?: boolean,
    showInactiveWarning?: boolean,
    recordTypeOptions?: EntityTypeSelectOption[]
}

export const MainListInfoForm = (
  { showInactiveWarning = false,
    onValueChange = () => {},
    listName,
    description,
    visibility,
    status,
    isLoading,
    recordTypeOptions }: MainListInfoFormProps
) => {
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    onValueChange({ [event.target.name]: event.target.value });
  };
  const onTrimOnBlur = (event: FocusEvent<HTMLInputElement>) => {
    onValueChange({ [event.target.name]: event.target.value.trim() });
  };
  const [isNameWasFocused, setIsNameWasFocused] = useState(false);
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const shouldShowError = isNameWasFocused && !listName && !isLoading;
  const listNameError = shouldShowError ? t('form.field.empty-error') : '';

  const showInactiveRadioWarning = showInactiveWarning && isStatusChanged && status === STATUS_VALUES.INACTIVE;
  const activeRadioWarning = showInactiveRadioWarning ? t('warning.inactive-status') : '';

  const renderSelect = () => {
    if (recordTypeOptions?.length) {
      /**
       * Select component breaks in cases where amount of options changes after selection
       * even if they have selected property, so we duplicate selected value in value
       */

      const value = recordTypeOptions?.find(item => item.selected)?.value;

      return (
        <div
          key={recordTypeOptions.length}
          className={css.recordTypeField}
        >
          {/* @ts-ignore:next-line */}
          <Select
            required
            value={value}
            name={FIELD_NAMES.RECORD_TYPE}
            dataOptions={recordTypeOptions}
            onChange={onChangeHandler}
            label={t('create-list.aside.record-types')}
          />
        </div>);
    }

    return null;
  };

  return (
    <>
      <TextField
        required
        error={listNameError}
        value={listName}
        onChange={onChangeHandler}
        onBlur={(event: FocusEvent<HTMLInputElement>) => {
          onTrimOnBlur(event);
          setIsNameWasFocused(true);
        }}
        name={FIELD_NAMES.LIST_NAME}
        maxLength={MAX_SUPPORTED_NAME_LENGTH}
        label={t('create-list.main.list-name')}
      />
      <TextArea
        value={description}
        onBlur={onTrimOnBlur}
        onChange={onChangeHandler}
        name={FIELD_NAMES.DESCRIPTION}
        maxLength={MAX_SUPPORTED_DESCRIPTION_LENGTH}
        label={t('create-list.main.list-description')}
      />
      {renderSelect()}
      <Layout className="display-flex flex-align-items-start">
        <RadioButtonGroup
          value={visibility}
          onChange={onChangeHandler}
          name={FIELD_NAMES.VISIBILITY}
          className={css.mainFormVisibility}
          label={
            <span className={css.radioLabels}>{t('create-list.main.list-visibility')}
              <InfoPopover
                iconSize="medium"
                contentClass={css.tooltipContent}
                content={t('create-list.main.list-visibility.tooltip')}
              />
            </span>
            }
        >
          <RadioButton
            inline
            value={VISIBILITY_VALUES.SHARED}
            name={FIELD_NAMES.VISIBILITY}
            label={t('create-list.main.list-shared')}
          />
          <RadioButton
            inline
            value={VISIBILITY_VALUES.PRIVATE}
            name={FIELD_NAMES.VISIBILITY}
            label={t('create-list.main.list-private')}
          />
        </RadioButtonGroup>
        <RadioButtonGroup
          value={status}
          warning={activeRadioWarning}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setIsStatusChanged(true);
            onChangeHandler(event);
          }}
          name={FIELD_NAMES.STATUS}
          label={
            <span className={css.radioLabels}>
              {t('create-list.main.list-status')}
              <InfoPopover
                iconSize="medium"
                contentClass={css.tooltipContent}
                content={t('create-list.main.list-status.tooltip')}
              />
            </span>
            }
        >
          <RadioButton
            inline
            value={STATUS_VALUES.ACTIVE}
            name={FIELD_NAMES.STATUS}
            label={t('create-list.main.list-active')}
          />
          <RadioButton
            inline
            value={STATUS_VALUES.INACTIVE}
            name={FIELD_NAMES.STATUS}
            label={t('create-list.main.list-inactive')}
          />
        </RadioButtonGroup>
      </Layout>
    </>
  );
};
